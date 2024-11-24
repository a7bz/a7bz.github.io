import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            backgroundUrl: "https://ftp.bmp.ovh/imgs/2020/01/1a5a007bffc828e0.png",
            backgroundType: "patterns",
            themeType: "auto",
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
        },
        changeThemeType() {
            // 禁止壁纸模式切换
            if (this.backgroundType === "image") {
                $message.warning("无法在壁纸模式下切换明暗模式", {
                    duration: 1500,
                })
                return false
            }
            this.themeType === "auto" ? (this.themeType = "dark") : this.themeType === "dark"
                ? (this.themeType = "light") : (this.themeType = "auto")
            // 弹窗提示
            if (typeof $message !== "undefined") {
                const text = this.themeType === "light" ? "浅色模式"
                    : this.themeType === "dark" ? "深色模式" : "跟随系统"
                $message.info("当前主题为" + text, { duration: 1500, })
            }
        },
    },
    persist: [
        {
            key: 'casualData',
            paths: ['themeType', 'backgroundUrl', 'backgroundType']
        }
    ]
})