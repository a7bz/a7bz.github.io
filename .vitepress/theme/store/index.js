import { defineStore } from 'pinia'

export const mainStore = defineStore('main', {
    state: () => {
        return {
            backgroundUrl: "https://ftp.bmp.ovh/imgs/2020/01/1a5a007bffc828e0.png",
            backgroundType: "patterns",
            themeValue: "light"
        }
    },
    actions: {

    },
    persist: [
        {
            key: 'casualData',
            paths: ['backgroundUrl', 'backgroundType']
        }
    ]
})