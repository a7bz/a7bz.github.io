import { siteData, social, nav, plugin, main } from './index'

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
        { text: "动态", link: "/pages/talk", icon: "planet-fill" },
        { text: "留言板", link: "/pages/message" },
        // { text: "关于本站", link: "/pages/about" },
        // { text: "隐私政策", link: "/pages/privacy" },
        // { text: "版权协议", link: "/pages/cc" },
      ],
    },
    {
      text: "其他",
      items: [
        { text: "反馈与投诉", link: "/pages/contact" },
        { text: "友情链接", link: "/pages/link", icon: "people" },
        { text: "siteMap", link: "/sitemap.xml", icon: "map" }
      ]
    }
  ]
}

export const blog = {
  feedback: '/pages/contact',
  friendsLink: 'https://qexo.a7bz.cn/pub/friends/',
  qexo: 'https://qexo.a7bz.cn/',
  pageComment: false,
  post: {
    excerptLength: 200,
  },
  pageSize: 10,
  //展示列表样式：excerpt | cover
  listModel: 'cover',
  twoColumns: false,
  cover: {
    // 是否开启封面显示
    showCover: {
      // 封面布局方式: left | right | both
      coverLayout: 'both',
      // 默认封面(随机展示)
      defaultCover: [
        '/assets/image/cover/1.png',
        '/assets/image/cover/2.png',
        '/assets/image/cover/3.png',
        '/assets/image/cover/4.png',
        '/assets/image/cover/5.png',
        '/assets/image/cover/6.png',
        '/assets/image/cover/7.png',
        '/assets/image/cover/8.png',
        '/assets/image/cover/9.png',
        '/assets/image/cover/10.png'
      ]
    }
  },
}

export const themeConfig = {
  ...main,
  search: {
    provider: 'local',
  },
  blog,
  ...siteData,
  nav,
  social,
  footer,
  plugin,
}