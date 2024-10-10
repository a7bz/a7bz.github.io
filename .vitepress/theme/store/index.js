import { defineStore } from 'pinia'

export const mainStore = defineStore('main', {
    state: () => {
        return {
            backgroundUrl: "https://ftp.bmp.ovh/imgs/2020/01/1a5a007bffc828e0.png",
            backgroundType: "patterns",
            themeValue: "light",
            scrollData: {
                // 滚动高度
                height: 0,
                // 滚动百分比
                percentage: 0,
                // 滚动方向
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