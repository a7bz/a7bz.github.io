const comment = {
    provider: "Waline",
    serverURL: "https://comment.zwymw.top",
    reaction: [
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_agree.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_sunglasses.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_sleep.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_annoyed.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_lovely.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_laugh.png',
        'https://unpkg.com/@waline/emojis@1.2.0/tieba/tieba_smirk.png'
    ],
    emoji: [
        '//unpkg.com/@waline/emojis@1.2.0/weibo',
        '//unpkg.com/@waline/emojis@1.2.0/bmoji',
        '//unpkg.com/@waline/emojis@1.2.0/bilibili'
    ],
    comment:'.post-comment',
    pageview:'.post-pageview'
}

export const plugin = {
    comment,
}