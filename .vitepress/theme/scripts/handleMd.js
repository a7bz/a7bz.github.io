import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

import { themeConfig } from '../config/index'
import { generateId } from './tool'

const postDir = path.join(process.cwd(), 'posts')
const cacheDir = path.join(process.cwd(), 'casual') // 缓存目录
const cacheMd = path.join(cacheDir, 'mdCache.js')
const cacheCategory = path.join(cacheDir, 'category.js')
const cacheTags = path.join(cacheDir, 'tags.js')
const cachePosts = path.join(cacheDir, 'posts.js')
const cacheStar = path.join(cacheDir, 'star.js')

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
    await fs.promises.writeFile(cacheDir + '/index.js', `export * from './category' 
export * from './mdCache'
export * from './posts'
export * from './star'
export * from './tags'`, 'utf-8')
}

// 缓存结构：包括文章、分类和标签
const mdCache = {}
const categoryCache = {}
const tagsCache = {}
const postsCache = []
const starCache = []

// 获取所有 Markdown 文件
const getAllMdFiles = async (dirPath) => {
    let arrayOfFiles = []
    const files = await fs.promises.readdir(dirPath)
    for (const file of files) {
        const fullPath = path.join(dirPath, file)
        const stats = await fs.promises.stat(fullPath)
        if (stats.isDirectory()) {
            const subDirFiles = await getAllMdFiles(fullPath)
            arrayOfFiles = arrayOfFiles.concat(subDirFiles)
        } else if (fullPath.endsWith('.md')) {
            arrayOfFiles.push(fullPath)
        }
    }
    return arrayOfFiles
}

// 添加/修改/删除 Markdown 文件的核心处理
const updateMdCache = async (filePath, operation) => {
    try {
        const href = `posts${filePath.replace(postDir, '').replace('.md', '').replace(/\\/g, '/').replace('index', '')}`
        const cachedPost = mdCache[href]
        if (operation === 'del') {
            if (cachedPost) {
                removeCategoryAndTag(cachedPost.post)
                delete mdCache[href]
                // 删除 postsCache 中的条目
                const postIndex = postsCache.findIndex(post => post.href === href)
                if (postIndex !== -1) {
                    postsCache.splice(postIndex, 1)
                }
                // 删除 starCache 中的条目
                const starIndex = starCache.findIndex(star => star.href === href)
                if (starIndex !== -1) {
                    starCache.splice(starIndex, 1)
                }
            }
        } else {
            const post = await getMdData(filePath)
            if (!post) return
            updateCategoryAndTag(post)
            updatePosts(post)
            updateStarCache(post)
            mdCache[href] = { timestamp: post.update, post }
        }
        await saveCache()
    } catch (error) {
        console.error(`Error ${operation} Markdown file:`, error)
    }
}

export const addMd = async (e) => {
    updateMdCache(e, 'add')
}

export const delMd = async (e) => {
    updateMdCache(e, 'del')
}

export const changeMd = async (e) => {
    updateMdCache(e, 'change')
}

// 保存缓存到文件
const saveCache = async () => {
    try {
        await fs.promises.writeFile(cacheMd, `export const mdData = ${JSON.stringify(mdCache, null, 2)}`, 'utf-8')
        await fs.promises.writeFile(cacheCategory, `export const categoryData = ${JSON.stringify(categoryCache, null, 2)}`, 'utf-8')
        await fs.promises.writeFile(cacheTags, `export const tagsData = ${JSON.stringify(tagsCache, null, 2)}`, 'utf-8')
        await fs.promises.writeFile(cachePosts, `export const postsData = ${JSON.stringify(postsCache, null, 2)}`, 'utf-8')
        await fs.promises.writeFile(cacheStar, `export const starData = ${JSON.stringify(starCache, null, 2)}`, 'utf-8')
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

// 解析 Markdown 文件内容
const getMdData = async (filePath) => {
    const href = `posts${filePath.replace(postDir, '').replace('.md', '').replace(/\\/g, '/').replace('index', '')}`
    const { mtimeMs: timestamp, birthtimeMs: createTime } = await fs.promises.stat(filePath)
    const cached = mdCache[href]
    if (cached && timestamp === cached.timestamp) {
        return cached.post
    }
    try {
        const src = await fs.promises.readFile(filePath, 'utf-8')
        const matterData = matter(src, { excerpt: getExcerpt })
        const post = {
            id: generateId(href),
            ...matterData.data,
            content: matterData.content,
            excerpt: matterData.excerpt,
            href,
            create: +(new Date(matterData.data.date || createTime)),
            update: timestamp
        }
        if (!post.title) {
            const titleMatch = matterData.content.match(/^#\s(.+)$/m)
            post.title = titleMatch ? titleMatch[1] : '无标题'
        }
        return post
    } catch (error) {
        console.error(`Error reading Markdown file at ${filePath}:`, error)
        return null
    }
}


// 更新分类和标签缓存
const updateCategoryAndTag = (post) => {
    if (!post) return
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

const updatePosts = (post) => {
    const existingIndex = postsCache.findIndex(item => item.href === post.href);
    // 如果已经存在，则移除旧的
    if (existingIndex !== -1) {
        postsCache.splice(existingIndex, 1)
    }
    // 添加新的文章信息到 postsCache 中
    postsCache.push({
        href: post.href,
        top: post.top || 0, // top 默认值为 0
        create: post.create || 0 // create 默认为 0
    })
    // 排序规则：先按 top 排序，top 越大越靠前；相同 top 值按 create 排序，越新越靠前
    postsCache.sort((a, b) => {
        if (b.top !== a.top) {
            return b.top - a.top; // top 值降序
        }
        return b.create - a.create; // create 值降序
    })
}

// 更新星标文章缓存
const updateStarCache = (post) => {
    if (post.star) {
        const existingIndex = starCache.findIndex(item => item.href === post.href);
        // 如果已经存在，则移除旧的
        if (existingIndex !== -1) {
            starCache.splice(existingIndex, 1);
        }
        // 添加新的文章信息到 starCache 中
        starCache.push({
            href: post.href,
            star: post.star || 0, // star 默认值为 0
            create: post.create || 0 // create 默认为 0
        })
        // 排序规则：先按 star 排序，star 越大越靠前；相同 star 值按 create 排序，越新越靠前
        starCache.sort((a, b) => {
            if (b.star !== a.star) {
                return b.star - a.star; // star 值降序
            }
            return b.create - a.create; // create 值降序
        })
    }
}

// 初始化缓存
export const initData = async () => {
    try {
        await loadCache()
        const allMdFiles = await getAllMdFiles(postDir)
        const existingCacheKeys = Object.keys(mdCache)

        await Promise.all(allMdFiles.map(async file => {
            const post = await getMdData(file)
            if (post) {
                const href = post.href
                mdCache[href] = { timestamp: post.update, post }
                updateCategoryAndTag(post)
                updatePosts(post)
                updateStarCache(post)
                const index = existingCacheKeys.indexOf(href)
                if (index !== -1) {
                    existingCacheKeys.splice(index, 1)
                }
            }
        }))

        existingCacheKeys.forEach(key => {
            const cachedPost = mdCache[key].post
            removeCategoryAndTag(cachedPost)
            delete mdCache[key]
        })

        await saveCache()
        console.log('mdCache initialized and cleaned')
    } catch (error) {
        console.error('Failed to initialize mdCache:', error)
    }
}

// 加载缓存文件
const loadCache = async () => {
    console.log(cacheMd)
    if (fs.existsSync(cacheMd)) {
        const { mdData } = await import(`file://${cacheMd}`);
        Object.assign(mdCache, mdData)
    }
}
