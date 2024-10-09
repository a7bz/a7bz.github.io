import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { siteData, themeConfig, viteConfig } from './theme/config/index'
import { initData } from './theme/scripts/handleMd'

await initData()

export default withPwa(
  defineConfig({
    title: siteData.title,
    description: siteData.description,
    lang: 'zh-CN',
    cleanUrls: true,
    themeConfig: themeConfig,
    vite: viteConfig,
  })
)
