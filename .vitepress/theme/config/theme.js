export const themeConfig = {
    blog:{
        excerptLength:300
    },
    nav: [
        {
          icon: "article",
          text: "文库",
          items: [
            { text: "文章列表", link: "/pages/archives", icon: "article" },
            { text: "全部分类", link: "/pages/categories", icon: "folder" },
            { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
          ],
        },
        {
          text: "专栏",
          items: [
            { text: "技术分享", link: "/pages/categories/技术分享", icon: "technical" },
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
}