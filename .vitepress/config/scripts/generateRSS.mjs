import { createContentLoader } from "vitepress";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import path from "path";

/**
 * 生成 RSS
 * @param {*} config VitePress buildEnd 配置
 * @param {*} siteMeta 站点配置
 */
export const createRssFile = async (config, siteMeta) => {
  // 配置信息
  const hostLink = siteMeta.site;
  // Feed 实例
  const feed = new Feed({
    title: siteMeta.title,
    description: siteMeta.description,
    id: hostLink,
    link: hostLink,
    language: "zh",
    generator: siteMeta.author.name,
    favicon: siteMeta.author.cover,
    copyright: `Copyright © ${siteMeta.begin}-present ${siteMeta.author.name}`,
    updated: new Date(),
  });
  // 加载文章，添加 excerpt 选项
  let posts = await createContentLoader("posts/**/*.md", {
    includeSrc: true,
    render: true,
    excerpt: true,
  }).load();
  // 日期降序排序
  posts = posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB - dateA;
  });
  for (const { url, frontmatter, src } of posts) {
    // 仅保留最近 10 篇文章
    if (feed.items.length >= 10) break;
    // 文章信息
    let { date } = frontmatter;

    // 从 src 中提取标题（第一个 h1 标题）
    let title = src?.match(/#\s+([^\n]+)/)?.[1] || 'Untitled';

    // 提取描述（使用内容的前 200 个字符，去除 markdown 标记）
    let content = src?.replace(/---[\s\S]*?---/, '') // 去除 frontmatter
      .replace(/#+\s+([^\n]+)/g, '') // 去除标题
      .replace(/\*\*([^\*]+)\*\*/g, '$1') // 去除粗体
      .replace(/\*([^\*]+)\*/g, '$1') // 去除斜体
      .replace(/`([^`]+)`/g, '$1') // 去除行内代码
      .replace(/\n+/g, ' ') // 合并换行
      .trim();
    let description = content?.slice(0, 200) + '...' || 'No description';

    // 处理日期
    if (typeof date === "string") date = new Date(date);

    // 根据项目重写规则处理 URL
    let postUrl = url;
    // 应用重写规则：posts/:year/(.*)/(.*)-:id -> posts/:year/:id
    const rewriteMatch1 = postUrl.match(/\/posts\/(\d+)\/(.*)\/(.*)-(\d+)$/);
    if (rewriteMatch1) {
      postUrl = `/posts/${rewriteMatch1[1]}/${rewriteMatch1[4]}`;
    } else {
      // 应用重写规则：posts/:year/(.*)/:filename -> posts/:year/:filename
      const rewriteMatch2 = postUrl.match(/\/posts\/(\d+)\/(.*)\/(.*)$/);
      if (rewriteMatch2) {
        postUrl = `/posts/${rewriteMatch2[1]}/${rewriteMatch2[3]}`;
      }
    }

    // 添加文章
    feed.addItem({
      title,
      id: `${hostLink}${postUrl}`,
      link: `${hostLink}${postUrl}`,
      description,
      date,
      author: [
        {
          name: siteMeta.author.name,
          email: siteMeta.author.email,
          link: siteMeta.author.link,
        },
      ],
    });
  }
  // 写入文件
  writeFileSync(path.join(config.outDir, "rss.xml"), feed.rss2(), "utf-8");
};