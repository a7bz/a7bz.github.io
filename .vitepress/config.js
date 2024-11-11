import { defineConfig } from 'vitepress'
import { main, siteData, themeConfig, viteConfig, headConfig, markdownConfig } from './theme/config/index'
import { initData } from './theme/scripts/handleMd'
import { transformHead } from './theme/scripts/transform'


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
  transformHead: (context) => {
    return transformHead(context)
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

