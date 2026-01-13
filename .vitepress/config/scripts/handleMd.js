import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

import { blog } from '../locales/common'
import { generateId } from './transform'

const postDir = path.join(process.cwd(), 'posts')
const cacheDir = path.join(process.cwd(), 'casual') // 缓存目录

// 缓存文件路径
const cacheFiles = {
    md: path.join(cacheDir, 'md.js'),
    category: path.join(cacheDir, 'category.js'),
    tags: path.join(cacheDir, 'tags.js'),
    posts: path.join(cacheDir, 'posts.js'),
    star: path.join(cacheDir, 'star.js'),
    timeline: path.join(cacheDir, 'timeline.js')
}

// 缓存结构
const cache = {
    md: {},
    category: {},
    tags: {},
    posts: [],
    star: [],
    timeline: {}
}

// 上次保存的
let lastSavedCache = { ...cache }

// 创建缓存目录及导出文件
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
    await fs.promises.writeFile(path.join(cacheDir, 'index.js'),
        Object.keys(cacheFiles).map(key => `export * from './${key}'`).join('\n'), 'utf-8')
}

// 初始化缓存
export const initData = async () => {
    await loadCache()
    const allMdFiles = await getAllMdFiles(postDir)
    const existingCacheKeys = Object.keys(cache.md)

    await Promise.all(allMdFiles.map(async (file) => {
        const post = await getMdData(file)
        if (post) {
            const href = post.href
            cache.md[href] = { timestamp: post.update, post }
            updateCategoryAndTag(post)
            updateSortedCache(cache.posts, post, 'top')
            updateSortedCache(cache.star, post, 'star')
            updateTimelineCache(href, post.year)
            existingCacheKeys.splice(existingCacheKeys.indexOf(href), 1)
        }
    }))

    existingCacheKeys.forEach((key) => {
        const cachedPost = cache.md[key].post
        if (cachedPost) {
            removeCategoryAndTag(cachedPost)
            removeFromCache(cache.posts, key)
            removeFromCache(cache.star, key)
            Object.keys(cache.timeline).forEach(year => {
                removeTimeline(cache.timeline[year], key)
            })
            delete cache.md[key]
        }
    })

    await saveCache()
    console.log('mdCache initialized and cleaned')
}

// 加载缓存文件
const loadCache = async () => {
    if (fs.existsSync(cacheFiles.md)) {
        const { mdData } = await import(`file://${cacheFiles.md}`)
        Object.assign(cache.md, mdData)
    }
}

// 获取所有 Markdown 文件
const getAllMdFiles = async (dir) => {
    const files = await fs.promises.readdir(dir, { withFileTypes: true })
    const mdFiles = await Promise.all(files.map(async (file) => {
        const fullPath = path.join(dir, file.name)
        return file.isDirectory() ? await getAllMdFiles(fullPath) : (fullPath.endsWith('.md') ? fullPath : null)
    }))
    return mdFiles.flat().filter(Boolean)
}

// Markdown 解析及缓存更新
const getMdData = async (filePath) => {
    const [href, year, mothDate] = createHref(filePath)
    const { mtimeMs: timestamp, birthtimeMs: createTime } = await fs.promises.stat(filePath)
    const cached = cache.md[href]
    if (cached && timestamp === cached.timestamp) return cached.post

    try {
        const src = await fs.promises.readFile(filePath, 'utf-8')
        const matterData = matter(src, { excerpt: getExcerpt })
        const post = {
            id: generateId(href),
            ...matterData.data,
            content: matterData.content,
            excerpt: matterData.excerpt,
            desc: matterData.desc || matterData.description || getDesc(matterData.content),
            href,
            year: new Date(matterData.data.date || createTime).getFullYear() || year,
            mothDate,
            create: +(new Date(matterData.data.date || createTime)),
            update: timestamp,
            title: matterData.data.title || matterData.content.match(/^#\s(.+)$/m)?.[1] || '未命名'
        }
        return post
    } catch (error) {
        console.error(`Error reading Markdown file at ${filePath}:`, error)
        return null
    }
}


const updateCategoryAndTag = (post) => {
    ['category', 'tag'].forEach((key) => {
        if (Array.isArray(post[key])) {
            post[key].forEach((item) => {
                const cacheItem = key === 'category' ? cache.category : cache.tags
                if (!cacheItem[item]) cacheItem[item] = []
                if (!cacheItem[item].includes(post.href)) cacheItem[item].push(post.href)
            })
        }
    })
}

const updateSortedCache = (array, post, sortKey) => {
    if (sortKey === 'star' && !post[sortKey]) return
    removeFromCache(array, post.href)
    array.push({ href: post.href, [sortKey]: post[sortKey] || 0, create: post.create || 0 })
    array.sort((a, b) => b[sortKey] !== a[sortKey] ? b[sortKey] - a[sortKey] : b.create - a.create)
}

const updateTimelineCache = (href, year) => {
    if (!cache.timeline[year]) cache.timeline[year] = []
    if (!cache.timeline[year].includes(href)) cache.timeline[year].push(href)
}

const removeFromCache = (array, href) => {
    const index = array.findIndex(item => item.href === href)
    if (index !== -1) array.splice(index, 1)
}

const removeTimeline = (array, href) => {
    const index = array.findIndex(item => item === href)
    if (index !== -1) array.splice(index, 1)
}

const removeCategoryAndTag = (post) => {
    ['category', 'tag'].forEach((key) => {
        if (Array.isArray(post[key])) {
            post[key].forEach((item) => {
                const cacheItem = key === 'category' ? cache.category : cache.tags
                if (cacheItem[item]) {
                    const index = cacheItem[item].indexOf(post.href)
                    if (index !== -1) cacheItem[item].splice(index, 1)
                    if (cacheItem[item].length === 0) delete cacheItem[item]
                }
            })
        }
    })
}

export const addMd = async (e) => updateMdCache(e, 'add')
export const delMd = async (e) => updateMdCache(e, 'del')
export const changeMd = async (e) => updateMdCache(e, 'change')

// 处理缓存更新和保存
const updateMdCache = async (filePath, operation) => {
    const [href, year] = createHref(filePath)
    const cachedPost = cache.md[href]

    if (operation === 'del' && cachedPost) {
        removeCategoryAndTag(cachedPost.post)
        delete cache.md[href]
        removeFromCache(cache.posts, href)
        removeFromCache(cache.star, href)
        removeTimeline(cache.timeline[year], href)
    } else {
        if (operation === 'change' && cachedPost) removeCategoryAndTag(cachedPost.post)
        const post = await getMdData(filePath)
        if (!post) return

        updateCategoryAndTag(post)
        updateSortedCache(cache.posts, post, 'top')
        updateSortedCache(cache.star, post, 'star')
        updateTimelineCache(href, post.year)
        cache.md[href] = { timestamp: post.update, post }
    }

    await saveCache()
}

const saveCache = async () => {
    await Promise.all(Object.entries(cache).map(async ([key, data]) => {
        const cachePath = cacheFiles[key]
        const dataKey = `${key}Data`
        const dataString = JSON.stringify(data, null, 2)
        const needsUpdate = JSON.stringify(lastSavedCache[key]) !== dataString || !fs.existsSync(cachePath)

        if (needsUpdate) {
            await fs.promises.writeFile(cachePath, `export const ${dataKey} = ${dataString}${hotCode(dataKey)}`, 'utf-8')
            lastSavedCache[key] = shallowClone(data)
        }
    }))
}

const createHref = (filePath) => {
    const newPath = filePath.replace(postDir, '').replace(/\\/g, '/')
    const match = newPath.match(/\/([^/]+)\/(.*)\/(.*?)(?:-(\d+))?\.md/)
    const date = new Date()
    const year = date.getFullYear()
    const monthDay = String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0')
    //posts/2024/code/autojs/orientationListener-0712.md
    if (match) {
        return [`/posts/${match[1]}/${match[4] || match[3]}`, match[1] || year, match[4] || monthDay]
    } else {
        return [`/posts${newPath.replace('.md', '').replace('index', '')}`, year, monthDay]
    }
}

const getExcerpt = (file) => {
    const content = file.content.replace(/^\s*# .*\r?\n+/, '')
    let excerpt = content.slice(0, blog.post.excerptLength)
    const lastNewline = excerpt.lastIndexOf("\n")
    if (lastNewline !== -1 && lastNewline < excerpt.length - 2) {
        const nextNewline = content.indexOf("\n", blog.post.excerptLength)
        if (nextNewline !== -1) excerpt = content.slice(0, nextNewline)
    }
    file.excerpt = excerpt
}

const getDesc = (content) => {
    return content
        .replace(/```[\s\S]*?```/g, '')               // 移除多行代码块
        .replace(/!\[.*?\]\(.*?\)/g, '')              // 移除图片语法
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')     // 移除链接，仅保留链接文本
        .replace(/`([^`]+)`/g, '$1')                  // 移除行内代码
        .replace(/<[^>]+>/g, '')                      // 移除 HTML 标签
        .replace(/\|.*\|/g, '')                       // 移除表格
        .replace(/[#*>\[\]_\-]/g, '')                 // 移除常见 Markdown 标记
        .replace(/\s+/g, ' ')                         // 处理多余空格
        .trim()
        .slice(0, 160) + '...'
}

const hotCode = (data) => `
if (import.meta.hot)
  import.meta.hot.accept(({ ${data} }) => {
    if (__VUE_HMR_RUNTIME__.${data}Update)
      __VUE_HMR_RUNTIME__.${data}Update(${data})
  })`

const shallowClone = (obj) => {
    // 简单值或 null/undefined
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // 使用浏览器内置的结构化克隆
    if (typeof structuredClone === 'function') {
        return structuredClone(obj)
    }

    // 兼容性回退方案
    // 处理数组
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item))
    }

    // 处理普通对象
    const cloned = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key])
        }
    }

    return cloned
}

await initData()