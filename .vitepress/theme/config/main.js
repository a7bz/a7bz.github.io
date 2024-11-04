export const navMore = [
    {
        name: "博客",
        list: [
            {
                icon: "/logo.png",
                name: "主站",
                url: "/"
            },
        ]
    },
]

export const main = {
    navMore
}

export const siteData = {
    title: "荒芜",
    description: "记录分享一些笔记",
    logo: "/logo.png",
}

export const social = {
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

export const nav = [
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
        icon: "clipboard",
        text: "专栏",
        items: [
            // { text: "技术分享", link: "/pages/category/技术分享", icon: "technical" },
            { text: "我的项目", link: "/pages/project", icon: "code" },
            { text: "效率工具", link: "/pages/tools", icon: "tools" },
        ],
    },
    {
        icon: "links",
        text: "友链",
        items: [
            { text: "友链鱼塘", link: "/pages/friends", icon: "fish" },
            { text: "友情链接", link: "/pages/link", icon: "people" },
        ],
    },
    {
        icon: "cross",
        text: "我的",
        items: [
            { text: "畅所欲言", link: "/pages/message", icon: "chat" },
            { text: "致谢名单", link: "/pages/thanks", icon: "reward" },
            { text: "关于本站", link: "/pages/about", icon: "contacts" },
        ],
    },
]