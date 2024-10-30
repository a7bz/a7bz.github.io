import { siteData, social, nav, plugin } from './index'

const footer = {
  btn: [
    social.email,
    social.github,
    social.qq,
    {
      icon: 'home',
      link: '/'
    }
  ],
  sitemap: [
    {
      text: '博客',
      items: [
        { text: '文章列表', link: '/pages/article' },
        { text: "全部分类", link: "/pages/category" },
        { text: "全部标签", link: "/pages/tag" },
        // { text: "星标文章", link: "/pages/star" },
      ]
    },
    {
      text: "页面",
      items: [
        // { text: "畅所欲言", link: "/pages/message" },
        // { text: "关于本站", link: "/pages/about" },
        // { text: "隐私政策", link: "/pages/privacy" },
        // { text: "版权协议", link: "/pages/cc" },
      ],
    },
    {
      text: "其他",
    }
  ]
}

export const themeConfig = {
  ...siteData,
  blog: {
    excerptLength: 200,
    feedback: social.qq.link,
    pageComment: false
  },
  nav,
  social,
  footer,
  plugin,
}