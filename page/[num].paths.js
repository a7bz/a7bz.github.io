import { postsData } from '../casual/index'
import { blog } from '../.vitepress/config/locales/common/blog'

const totalPages = Math.ceil(postsData.length / blog.pageSize)

export default {
    paths() {
        const pages = []
        for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
            pages.push({ params: { num: pageNum.toString() } })
        }
        return pages
    }
}