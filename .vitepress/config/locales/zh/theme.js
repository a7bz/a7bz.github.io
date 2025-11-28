import { blog, social, plugin } from "../common"
import { siteData } from "./main"

export const themeConfig = {
    ...siteData,
    navMore: [{
        name: "博客",
        list: [
            {
                icon: "/logo.png",
                name: "主站",
                url: "/"
            },
            {
                icon: "/logo.png",
                name: "github线路",
                url: "https://a7bz.github.io/"
            },
        ]
    }],
    nav: [
        { icon: "home", text: "主页", link: "/", },
        {
            icon: "article-fill",
            text: "文库",
            items: [
                { text: "文章列表", link: "/pages/article", icon: "doc-fill" },
                { text: "时间线", link: "/pages/timeline", icon: "time" },
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
                { text: "动态", link: "/pages/talk", icon: "planet-fill" },
                { text: "关于本站", link: "/pages/about", icon: "contacts" },
            ],
        },
        {
            icon: "other",
            text: "其他",
            items: [
                { text: "留言板", link: "/pages/message", icon: "chat" },
                { text: "反馈与投诉", link: "/pages/contact", icon: "question" },
            ],
        },
    ],
    aside: {
        hello: {
            text: "记录分享一些<strong>笔记</strong>"
        }
    },
    social,
    footer: {
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
    },
    plugin,
    blog,
}