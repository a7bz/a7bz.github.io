import { tagsData } from '../../casual/index'
export default {
    paths() {
        return Object.keys(tagsData).map(tag => {
            return {
                params: {
                    name: tag
                }
            }
        })
    }
}