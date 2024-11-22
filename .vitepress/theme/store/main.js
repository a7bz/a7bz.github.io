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
            fontSize: 16,
            infoPosition: "fixed",
            footerIsShow: false,
            mobileMenuShow: false,
            loadingStatus: true,
            useRightMenu: true
        }
    },
    actions: {
        changeShowStatus(value, blur = true) {
            this[value] = !this[value]
            document.body.style.overflowY = this[value] ? "hidden" : ""
            const globalApp = document.getElementById("app")
            this[value] && this.backgroundBlur && blur
                ? globalApp.classList.add("blur")
                : globalApp.classList.remove("blur")
        }
    },
    persist: [
        {
            key: 'casualData',
            paths: ['backgroundUrl', 'backgroundType']
        }
    ]
})