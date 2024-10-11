import { tagsData } from '.vitepress/cache/casual/index'
export default {
    paths() {
        const tmp = Object.keys(tagsData).map(tag => {
            return {
                params: {
                    name: tag
                }
            }
        })
        console.log(tmp)
        return tmp
    }
}