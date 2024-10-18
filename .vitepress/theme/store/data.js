import { defineStore } from 'pinia'
import { categoryData, mdData, postsData, starData, tagsData } from '@casual/index'

export const useDataStore = defineStore('data', {
    state: () => {
        return {
            categoryData,
            mdData,
            postsData,
            starData,
            tagsData
        }
    },
    actions: {

    }
})
