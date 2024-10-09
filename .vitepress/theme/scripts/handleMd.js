import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

import { themeConfig } from '../config/index'

const postDir = path.join(process.cwd(), 'posts')
const cacheDir = path.join(process.cwd(), '.vitepress/cache/casual') // 缓存目录
const cacheMd = path.join(cacheDir, 'mdCache.json')
const cacheCategory = path.join(cacheDir, 'category.json')
const cacheTags = path.join(cacheDir, 'tags.json')


// 缓存结构：包括文章、分类和标签
const mdCache = {}
const categoryCache = {}
const tagsCache = {}

// 添加 Markdown 文件到缓存
export const addMd = async (e) => {
    try {
        const post = getMdData(e) // 获取文件的解析数据
        updateCategoryAndTag(post) // 更新分类和标签
        saveCache() // 保存缓存到文件
        return post
    } catch (error) {
        console.error('Failed to add Markdown file:', error)
    }
}

// 修改 Markdown 文件时更新缓存
export const changeMd = async (e) => {
    try {
        const post = getMdData(e) // 重新解析文件并更新缓存
        updateCategoryAndTag(post) // 更新分类和标签
        saveCache() // 保存缓存到文件
        return post
    } catch (error) {
        console.error('Failed to change Markdown file:', error)
    }
}

// 删除 Markdown 文件并更新缓存
export const delMd = async (e) => {
    try {
        const href = `posts${e.replace(postDir, '').replace('.md', '').replace(/\\/g, '/')}`
        const cachedPost = mdCache[href]
        // 从分类和标签中移除文章引用
        if (cachedPost) {
            removeCategoryAndTag(cachedPost)
            delete mdCache[href] // 从缓存中移除文章
        }
        saveCache() // 保存缓存到文件
    } catch (error) {
        console.error('Failed to delete Markdown file:', error)
    }
}

// 保存缓存到文件
const saveCache = () => {
    try {
        // 保存文章缓存
        fs.writeFileSync(cacheMd, JSON.stringify(mdCache, null, 2), 'utf-8')
        // 保存分类缓存
        fs.writeFileSync(cacheCategory, JSON.stringify(categoryCache, null, 2), 'utf-8')
        // 保存标签缓存
        fs.writeFileSync(cacheTags, JSON.stringify(tagsCache, null, 2), 'utf-8')
    } catch (error) {
        console.error('Failed to save cache:', error)
    }
}


// 获取 Markdown 文件的元数据和内容
const getExcerpt = (file) => {
    let excerpt = file.content.slice(0, themeConfig.blog.excerptLength)
    if (excerpt.length > themeConfig.blog.excerptLength) {
        const lastSpace = excerpt.lastIndexOf(" ")
        if (lastSpace !== -1) {
            excerpt = excerpt.slice(0, lastSpace)
        }
        excerpt += "..."
    }
    file.excerpt = excerpt
}

// 解析 Markdown 文件数据
const getMdData = (e) => {
    const href = `posts${e.replace(postDir, '').replace('.md', '').replace(/\\/g, '/').replace('index','')}`
    const timestamp = fs.statSync(e).mtimeMs
    const cached = mdCache[href]

    if (cached && timestamp === cached.timestamp) {
        return cached.post
    }
    const src = fs.readFileSync(e, 'utf-8')
    let matterData
    if (src.includes('<!-- more -->\r\n')) {
        matterData = matter(src, { excerpt: true, excerpt_separator: '<!-- more -->' })
    } else {
        matterData = matter(src, { excerpt: getExcerpt, excerpt_separator: '<!-- more -->' })
    }
    const post = {
        ...matterData.data,
        content: matterData.content,
        excerpt: matterData.excerpt,
        href,
        create: +(new Date(matterData.data.date || timestamp)),
        update: timestamp
    }
    if (!post.title) {
        const titleMatch = matterData.content.match(/^#\s(.+)$/m)
        post.title = titleMatch ? titleMatch[1] : '无标题'
    }
    mdCache[href] = { timestamp, post } // 存储到对象
    return post
}

// 更新分类和标签缓存
const updateCategoryAndTag = (post) => {
    // 更新分类
    if (post.category) {
        if (!categoryCache[post.category]) {
            categoryCache[post.category] = []
        }
        if (!categoryCache[post.category].includes(post.href)) {
            categoryCache[post.category].push(post.href)
        }
    }

    // 更新标签
    if (post.tag && Array.isArray(post.tag)) {
        post.tag.forEach(tag => {
            if (!tagsCache[tag]) {
                tagsCache[tag] = []
            }
            if (!tagsCache[tag].includes(post.href)) {
                tagsCache[tag].push(post.href)
            }
        })
    }
}

// 从分类和标签缓存中移除文章引用
const removeCategoryAndTag = (post) => {
    // 移除分类
    if (post.category && categoryCache[post.category]) {
        const index = categoryCache[post.category].indexOf(post.href)
        if (index !== -1) {
            categoryCache[post.category].splice(index, 1)
        }
        // 如果分类不再有文章引用，则删除该分类
        if (categoryCache[post.category].length === 0) {
            delete categoryCache[post.category]
        }
    }
    // 移除标签
    if (post.tag && Array.isArray(post.tag)) {
        post.tag.forEach(tag => {
            if (tagsCache[tag]) {
                const index = tagsCache[tag].indexOf(post.href)
                if (index !== -1) {
                    tagsCache[tag].splice(index, 1)
                }
                // 如果标签不再有文章引用，则删除该标签
                if (tagsCache[tag].length === 0) {
                    delete tagsCache[tag]
                }
            }
        })
    }
}

// 初始化时从缓存文件读取
export const initData = async () => {
    try {
        // 检查缓存目录是否存在
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true }) // 递归创建目录
        }
        // 如果文章缓存文件存在，读取数据并恢复到 mdCache
        if (fs.existsSync(cacheMd)) {
            const cacheData = fs.readFileSync(cacheMd, 'utf-8')
            Object.assign(mdCache, JSON.parse(cacheData)) // 合并读取到的缓存到 mdCache 对象
        }
        // 如果分类缓存文件存在，读取数据并恢复到 categoryCache
        if (fs.existsSync(cacheCategory)) {
            const categoryData = fs.readFileSync(cacheCategory, 'utf-8')
            Object.assign(categoryCache, JSON.parse(categoryData)) // 合并读取到的分类缓存到 categoryCache 对象
        }
        // 如果标签缓存文件存在，读取数据并恢复到 tagsCache
        if (fs.existsSync(cacheTags)) {
            const tagsData = fs.readFileSync(cacheTags, 'utf-8')
            Object.assign(tagsCache, JSON.parse(tagsData)) // 合并读取到的标签缓存到 tagsCache 对象
        }
        // 获取现有的所有缓存键
        const existingCacheKeys = Object.keys(mdCache)
        // 重新扫描文件夹并更新 mdCache
        const actualFiles = fs.readdirSync(postDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(postDir, file)
                const timestamp = fs.statSync(filePath).mtimeMs
                const post = getMdData(filePath)
                return { href: `posts/${file.replace(/\.md$/, '').replace('index','')}`, post, timestamp }
            })
        actualFiles.sort((a, b) => b.post.create - a.post.create)
        for (const { href, post, timestamp } of actualFiles) {
            mdCache[href] = { timestamp, post }
            updateCategoryAndTag(post)
            // 从缓存键中移除实际存在的文件
            const index = existingCacheKeys.indexOf(href)
            if (index !== -1) {
                existingCacheKeys.splice(index, 1)
            }
        }
        // 删除缓存中存在但实际文件不存在的项
        existingCacheKeys.forEach(key => {
            const cachedPost = mdCache[key].post
            removeCategoryAndTag(cachedPost) // 删除分类和标签中的引用
            delete mdCache[key] // 删除文章缓存
        })
        saveCache()
        console.log('mdCache initialized and cleaned')
    } catch (error) {
        console.error('Failed to initialize mdCache:', error)
    }
}


initData()
