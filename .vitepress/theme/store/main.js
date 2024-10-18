import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            backgroundUrl: "https://ftp.bmp.ovh/imgs/2020/01/1a5a007bffc828e0.png",
            backgroundType: "patterns",
            themeValue: "light",
            scrollData: {
                height: 0,
                percentage: 0,
                direction: "down",
            },
            fontFamily: "hmos",
            fontSize: 16
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