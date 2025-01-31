import { defineConfig } from 'vitepress'
import { siteData } from './main'
import { addDescription } from '../../scripts/transform'
import { themeConfig } from './theme'

export const zh = defineConfig({
    title: siteData.title,
    description: siteData.description,
    lang: 'zh-CN',
    themeConfig: themeConfig,
    transformPageData: async (pageData) => {
        const canonicalUrl = `${siteData.site}/${pageData.relativePath}`
            .replace(/index\.md$/, "")
            .replace(/\.md$/, "");
        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }])
        const description = await addDescription(pageData, siteData.description)
        pageData.frontmatter.description = description
        pageData.description = description
    },
})