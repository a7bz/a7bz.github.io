import { defineConfig } from 'vitepress'
import { main, siteData, themeConfig, viteConfig, headConfig, markdownConfig } from './theme/config/index'
import { initData } from './theme/scripts/handleMd'

import path from 'node:path'
const cacheDir = path.join(process.cwd(), 'casual')

await initData()

export default defineConfig({
  ...main,
  ignoreDeadLinks: true,
  title: siteData.title,
  description: siteData.description,
  lang: 'zh-CN',
  cleanUrls: true,
  head: headConfig,
  themeConfig: themeConfig,
  vite: viteConfig,
  // markdown
  markdown: {
    math: true,
    lineNumbers: true,
    toc: { level: [1, 2, 3] },
    image: {
      lazyLoading: true,
    },
    config: markdownConfig,
  },
  transformHead: async (context) => {
    const heads = []
    const { frontmatter, relativePath } = context.pageData
    const keywords = [
      ...(typeof frontmatter.keywords === 'string'
        ? frontmatter.keywords.split(',')
        : frontmatter.keywords || []),
      ...(frontmatter.category || []),
      ...(frontmatter.tag || [])
    ]
    if (keywords.length)
      heads.push(['meta', { name: 'keywords', content: [...new Set(keywords)].join(',') }])
    else {
      if (frontmatter.title)
        heads.push(['meta', { name: 'keywords', content: [context.pageData?.params?.name || frontmatter?.title].join(',') }])
    }
    const key = '/' + relativePath.replace(/\.md$/, '')
    const fs = await import('fs')
    let mdCache = {}
    try {
      if (fs.existsSync(cacheDir)) {
        const mdData = await import(`file://${cacheDir}/md.js`)
        mdCache = mdData.mdData
      }
    } catch (err) {
      console.log(err)
    }
    let description = frontmatter.description || ''
    if (!description) {
      const content = mdCache[key]?.post?.content || ''
      description = content
        .replace(/```[\s\S]*?```/g, '')               // 移除多行代码块
        .replace(/!\[.*?\]\(.*?\)/g, '')              // 移除图片语法
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')     // 移除链接，仅保留链接文本
        .replace(/`([^`]+)`/g, '$1')                  // 移除行内代码
        .replace(/<[^>]+>/g, '')                      // 移除 HTML 标签
        .replace(/\|.*\|/g, '')                       // 移除表格
        .replace(/[#*>\[\]_\-]/g, '')                 // 移除常见 Markdown 标记
        .replace(/\s+/g, ' ')                         // 处理多余空格
        .trim()
        .slice(0, 160)
    }
    if (!description) {
      description = `${context.pageData?.params?.name || frontmatter?.title || ''} ${context.siteData.description}`
    }
    if (description)
      heads.push(['meta', { name: 'description', content: description }])
    return heads
  },
  transformPageData: async (pageData) => {
    const canonicalUrl = `${siteData.site}/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }])
  },
  sitemap: {
    hostname: siteData.site,
  },
  rewrites: {
    'posts/:year/(.*)/(.*)-:id': 'posts/:year/:id',
    'posts/:year/(.*)/:filename': 'posts/:year/:filename'
  },
})

