import { siteData } from './index'
const social = {
  email: {
    icon: 'email',
    link: 'mailto:2484068670@qq.com'
  },
  github: {
    icon: 'github',
    link: 'https://github.com/a7bz'
  },
  qq: {
    icon: 'qq',
    link: 'https://admin.qidian.qq.com/static_proxy/b2b-qq/wpa-link/index.html#/person?uin=2484068670'
  },
}

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
}

export const themeConfig = {
  ...siteData,
  blog: {
    excerptLength: 200
  },
  nav: [
    { icon: "home", text: "主页", link: "/", },
    {
      icon: "article",
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/article", icon: "article" },
        { text: "全部分类", link: "/pages/category", icon: "folder" },
        { text: "全部标签", link: "/pages/tag", icon: "hashtag" },
      ],
    },
    {
      text: "专栏",
      items: [
        { text: "技术分享", link: "/pages/category/技术分享", icon: "technical" },
        { text: "我的项目", link: "/pages/project", icon: "code" },
        { text: "效率工具", link: "/pages/tools", icon: "tools" },
      ],
    },
    {
      text: "友链",
      items: [
        { text: "友链鱼塘", link: "/pages/friends", icon: "fish" },
        { text: "友情链接", link: "/pages/link", icon: "people" },
      ],
    },
    {
      text: "我的",
      items: [
        { text: "畅所欲言", link: "/pages/message", icon: "chat" },
        { text: "致谢名单", link: "/pages/thanks", icon: "reward" },
        { text: "关于本站", link: "/pages/about", icon: "contacts" },
      ],
    },
  ],
  social,
  footer,
}