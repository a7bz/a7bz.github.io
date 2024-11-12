import path from 'node:path'
const cacheDir = path.join(process.cwd(), 'casual')
export const getKeywords = async (context) => {
    const heads = []
    const { frontmatter } = context.pageData
    const keywords = [
        ...(typeof frontmatter.keywords === 'string'
            ? frontmatter.keywords.split(',')
            : frontmatter.keywords || []),
        ...(frontmatter.category || []),
        ...(frontmatter.tag || [])
    ]
    if (keywords.length)
        heads.push(['meta', { name: 'keywords', content: [...new Set(keywords)].join(',') }])
    else {
        if (frontmatter.title)
            heads.push(['meta', { name: 'keywords', content: [context.pageData?.params?.name || frontmatter?.title].join(',') }])
    }
    return heads
}

export const addDescription = async (pageData, desc) => {
    const key = '/' + pageData.relativePath.replace(/\.md$/, '')
    const fs = await import('fs')
    let mdCache = {}
    try {
        if (fs.existsSync(cacheDir)) {
            const mdData = await import(`file://${cacheDir}/md.js`)
            mdCache = mdData.mdData
        }
    } catch (err) {
        console.log(err)
    }
    let description = pageData.frontmatter.description || ''
    if (!description) {
        const content = mdCache[key]?.post?.content || ''
        description = content
            .replace(/```[\s\S]*?```/g, '')               // 移除多行代码块
            .replace(/!\[.*?\]\(.*?\)/g, '')              // 移除图片语法
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')     // 移除链接，仅保留链接文本
            .replace(/`([^`]+)`/g, '$1')                  // 移除行内代码
            .replace(/<[^>]+>/g, '')                      // 移除 HTML 标签
            .replace(/\|.*\|/g, '')                       // 移除表格
            .replace(/[#*>\[\]_\-]/g, '')                 // 移除常见 Markdown 标记
            .replace(/\s+/g, ' ')                         // 处理多余空格
            .trim()
            .slice(0, 160)
    }
    if (!description) {
        description = `${pageData?.params?.name || desc || pageData.frontmatter?.title || ''}`
    }
    return description
}

export const transformHead = async (context) => {
    const heads = []
    const description = await addDescription(context.pageData, context.description)
    context.pageData.frontmatter.description = description
    context.pageData.description = description
    heads.push(['meta', { name: 'description', content: description }])
    heads.push(['meta', { property: 'og:description', content: description }])
    heads.push(...await getKeywords(context))
    return heads
}