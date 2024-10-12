import { tagsData } from '../../casual/index'
export default {
    paths() {
        return Object.keys(tagsData).map(data => {
            return {
                params: {
                    name: data
                }
            }
        })
    }
}