---
title: 友情链接
aside: false
comment: true
---

<script setup>
import Link from '@/components/pages/Link.vue'
import ApplyLink from '@/components/plugin/Qexo/ApplyLink.vue'
</script>

<Link />

# 友情链接申请

欢迎交换友链，本站友链目前提交表单审核后添加，如果你想加入友链，请填写下方表单或按指定格式留言。

::: details 友链申请
<ApplyLink />
:::

### 留言格式

```json
{
  "title": "网站或个人昵称",
  "url": "完整的主页地址",
  "avatar": "头像链接",
  "desc": "网站或个人简介"
}
```

### 我的友链信息

::: code-group

```json
{
  "title": "阿柒",
  "url": "https://blog.a7bz.cn/",
  "avatar": "https://blog.a7bz.cn/logo.png",
  "desc": "记录分享一些笔记"
}
```

```yml
title: 阿柒
url: https://blog.a7bz.cn/
avatar: https://blog.a7bz.cn/logo.png
desc: 记录分享一些笔记
```

:::
