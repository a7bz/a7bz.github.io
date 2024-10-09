import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import { siteData,themeConfig,viteConfig } from './theme/config/index'

import path from "path"

const postDir = path.join(process.cwd(), 'posts')
console.log(postDir)

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
