import path from 'node:path'
const cacheDir = path.join(process.cwd(), 'casual')
/**
 * 从文件名生成数字 ID
 * @param {string} fileName - 文件名
 * @returns {number} - 生成的数字ID
 */
export const generateId = (fileName) => {
    // 将文件名转换为哈希值
    let hash = 0
    for (let i = 0; i < fileName.length; i++) {
        hash = (hash << 5) - hash + fileName.charCodeAt(i)
    }
    // 将哈希值转换为正整数
    const numericId = Math.abs(hash % 10000000000)
    return numericId
}

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
    let description = pageData.frontmatter.description || mdCache[key]?.post?.desc || ''
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