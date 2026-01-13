import { defineConfig } from 'vitepress'
import { headConfig } from './head'
import { viteConfig } from './vite'
import { markdownConfig } from './markdown'
import { transformHead } from '../scripts/transform'
import { createRssFile } from '../scripts/generateRSS.mjs'
import '../scripts/handleMd'
import { zhSearch, siteData } from '../locales/zh/main'

export const shared = defineConfig({
    ignoreDeadLinks: true,
    cleanUrls: true,
    head: headConfig,
    vite: viteConfig,
    sitemap: {
        hostname: siteData.site,
    },
    markdown: {
        math: true,
        lineNumbers: true,
        toc: { level: [1, 2, 3] },
        image: {
            lazyLoading: true,
        },
        config: markdownConfig,
    },
    themeConfig: {
        since: '2024-05-12',
        search: {
            provider: 'local',
            options: {
                locales: {
                    ...zhSearch
                }
            }
        }
    },
    transformHead: (context) => {
        return transformHead(context)
    },
    rewrites: {
        'posts/:year/(.*)/(.*)-:id': 'posts/:year/:id',
        'posts/:year/(.*)/:filename': 'posts/:year/:filename'
    },
    buildEnd: async (config) => {
        await createRssFile(config, siteData);
    },
})