---
icon: router
date: 2025-06-21
category:
  - 项目记录
tag:
  - js
  - vitepress
---

# 如何在 VitePress 博客中实现 Markdown 热更新

在开发博客过程中，我发现对 Markdown 内容的修改不会自动热更新，必须重启开发环境，这极大影响了开发效率。之前我使用过 [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/) 主题，它内置了完善的热更新功能。通过分析它的实现方式，我尝试在 VitePress 中复现类似功能。

## 背景与需求

VitePress 默认对 `.md` 文件的改动并不会触发页面热更新，开发时修改内容必须重启，体验不佳。参考 vuepress-theme-hope 的做法，发现它在 `.temp` 目录下存储了文章分类、路径和内容等信息，并利用 Vite 的 HMR 机制实现数据的热更新。

## 设计思路

1. 启动开发环境时，扫描所有 Markdown 文件，解析提取文章信息、分类、标签等数据，缓存至内存。
2. 使用自定义 Vite 插件，结合 [chokidar](https://github.com/paulmillr/chokidar) 监听 `posts` 文件夹内 Markdown 文件的新增、修改和删除。
3. 当检测到文件变化时，更新缓存数据，并通过 Vite 的 HMR 机制通知前端更新对应的数据。
4. 前端将数据存入 Pinia 统一管理，组件从 Pinia 读取最新数据实现自动刷新。

---

## 初始化所有 Markdown 文件数据

启动时通过递归读取所有 `.md` 文件，解析后存入缓存。

```js
import fs from "fs";
import path from "path";

export const initData = async () => {
  await loadCache();

  // 递归获取 posts 目录下所有 Markdown 文件
  const allMdFiles = await getAllMdFiles(postDir);

  // 现有缓存中所有文章的 href，用于后续清理失效数据
  const existingCacheKeys = Object.keys(cache.md);

  await Promise.all(
    allMdFiles.map(async (file) => {
      const post = await getMdData(file);
      if (post) {
        const href = post.href; // 文章访问路径
        cache.md[href] = { timestamp: post.update, post };
        updateCategoryAndTag(post); // 更新分类和标签缓存
        updateSortedCache(cache.posts, post, "top"); // 更新排序缓存
        updateSortedCache(cache.star, post, "star");
        existingCacheKeys.splice(existingCacheKeys.indexOf(href), 1);
      }
    })
  );

  // 删除缓存中已不存在的文章数据
  existingCacheKeys.forEach((key) => {
    const cachedPost = cache.md[key].post;
    removeCategoryAndTag(cachedPost);
    delete cache.md[key];
  });

  await saveCache();
};

// 递归读取目录内所有 Markdown 文件
const getAllMdFiles = async (dir) => {
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  const mdFiles = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        return await getAllMdFiles(fullPath);
      }
      return fullPath.endsWith(".md") ? fullPath : null;
    })
  );
  return mdFiles.flat().filter(Boolean);
};
```

## 自定义 Vite 插件监听 Markdown 文件变化

使用 chokidar 监听 `posts` 文件夹，分别处理新增、修改、删除事件。

```js
import chokidar from "chokidar";
import path from "path";

export default {
  name: "md-file-watcher",
  configureServer(server) {
    const watcher = chokidar.watch(path.join(process.cwd(), "posts"));

    watcher
      .on("add", (file) => {
        addMd(file);
        // 新增文件时全量刷新页面，确保路由等正确更新
        server.ws.send({ type: "full-reload" });
      })
      .on("change", (file) => {
        changeMd(file);
      })
      .on("unlink", (file) => {
        delMd(file);
      });
  },
};
```

处理函数一调用 `updateMdCache` 更新缓存：

```js
export const addMd = async (filePath) => updateMdCache(filePath, "add");
export const delMd = async (filePath) => updateMdCache(filePath, "del");
export const changeMd = async (filePath) => updateMdCache(filePath, "change");

const updateMdCache = async (filePath, operation) => {
  const href = createHref(filePath); // 根据文件路径生成访问路径
  const cachedPost = cache.md[href];

  if (operation === "del" && cachedPost) {
    // 删除操作，清理分类、标签及缓存
    removeCategoryAndTag(cachedPost.post);
    delete cache.md[href];
    removeFromCache(cache.posts, href);
    removeFromCache(cache.star, href);
  } else {
    // 修改或新增，先清理旧缓存分类数据（如果有）
    if (operation === "change" && cachedPost) {
      removeCategoryAndTag(cachedPost.post);
    }

    const post = await getMdData(filePath);
    if (!post) return;

    updateCategoryAndTag(post);
    updateSortedCache(cache.posts, post, "top");
    updateSortedCache(cache.star, post, "star");
    cache.md[href] = { timestamp: post.update, post };
  }

  await saveCache();
};
```

---

## 在 Markdown 文件底部添加 HMR 代码

通过 Vite 的 HMR API，实现模块热替换时数据更新。

```js
if (import.meta.hot) {
  import.meta.hot.accept(({ mdData }) => {
    if (__VUE_HMR_RUNTIME__.mdDataUpdate) {
      __VUE_HMR_RUNTIME__.mdDataUpdate(mdData);
    }
  });
}
```

这里的 **VUE_HMR_RUNTIME** 是 VitePress 内置的全局对象，用于管理 HMR 更新逻辑。

---

## 前端：使用 Pinia 管理并响应热更新数据

统一状态管理，方便组件读取并响应数据变化。

```js
import { defineStore } from "pinia";
import {
  categoryData,
  mdData,
  postsData,
  starData,
  tagsData,
} from "@casual/index";

export const useDataStore = defineStore("data", {
  state: () => ({
    categoryData,
    mdData,
    postsData,
    starData,
    tagsData,
  }),
});
```

---

## 在布局组件中接收并处理 HMR 事件

```js
import { useDataStore } from "@/store/index";
import { storeToRefs } from "pinia";

const dataStore = useDataStore();
const { categoryData, mdData, postsData, starData, tagsData } =
  storeToRefs(dataStore);

if (import.meta.env.DEV && import.meta.hot) {
  __VUE_HMR_RUNTIME__.categoryDataUpdate = (data) => {
    categoryData.value = {};
    Object.assign(categoryData.value, data);
  };
  __VUE_HMR_RUNTIME__.mdDataUpdate = (data) => {
    mdData.value = {};
    Object.assign(mdData.value, data);
  };
  __VUE_HMR_RUNTIME__.postsDataUpdate = (data) => {
    postsData.value = [];
    Object.assign(postsData.value, data);
  };
  __VUE_HMR_RUNTIME__.starDataUpdate = (data) => {
    starData.value = [];
    Object.assign(starData.value, data);
  };
  __VUE_HMR_RUNTIME__.tagsDataUpdate = (data) => {
    tagsData.value = {};
    Object.assign(tagsData.value, data);
  };
}
```

这样，当 Markdown 文件被修改，前端就会接收到对应的更新，自动刷新数据，无需手动刷新页面。
