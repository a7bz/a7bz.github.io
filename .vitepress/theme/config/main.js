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
    site: "https://blog.a7bz.cn",
    begin: "2024",
    author: {
        name: "荒芜",
        cover: "/logo.png",
        email: "2484068670@qq.com",
        link: "https://blog.a7bz.cn",
    },
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
        link: 'https://admin.qidian.qq.com/static_proxy/b2b-qq/wpa-link/index.html#/person?uin=841105248'
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
            { text: "留言板", link: "/pages/message", icon: "chat" },
            { text: "关于本站", link: "/pages/about", icon: "contacts" },
            { text: "反馈与投诉", link: "/pages/contact", icon: "question" },
        ],
    },
]