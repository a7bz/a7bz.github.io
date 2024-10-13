export const headConfig = [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // 预载 CDN
    [
        "link",
        {
            crossorigin: "",
            rel: "preconnect",
            href: "https://s1.hdslb.com",
        },
    ],
    [
        "link",
        {
            crossorigin: "",
            rel: "preconnect",
            href: "https://cdn.staticfile.net",
        },
    ],
    // iconfont
    [
        "link",
        {
            crossorigin: "anonymous",
            rel: "stylesheet",
            href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css",
        },
    ],
    // HarmonyOS font
    [
        "link",
        {
            crossorigin: "anonymous",
            rel: "stylesheet",
            href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css",
        },
    ],
    [
        "link",
        {
            crossorigin: "anonymous",
            rel: "stylesheet",
            href: "https://cdn.staticfile.net/lxgw-wenkai-screen-webfont/1.7.0/style.css",
        },
    ],
]