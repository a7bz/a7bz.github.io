import { defineConfig } from 'vitepress'
import { main, siteData, themeConfig, viteConfig, headConfig, markdownConfig } from './theme/config/index'
import { initData } from './theme/scripts/handleMd'

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
    const { frontmatter } = context.pageData
    const keywords = [
      ...(typeof frontmatter.keywords === 'string'
        ? frontmatter.keywords.split(',')
        : frontmatter.keywords || []),
      ...(frontmatter.category || []),
      ...(frontmatter.tag || [])
    ]
    return keywords.length > 0 ? [['meta', { name: 'keywords', content: [...new Set(keywords)].join(',') }]] : []
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

