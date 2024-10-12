import { categoryData } from '../../casual/index'
export default {
    paths() {
        return Object.keys(categoryData).map(data => {
            return {
                params: {
                    name: data
                }
            }
        })
    }
}