import { reactive } from "vue"

const state = reactive({
    backgroundUrl: "https://ftp.bmp.ovh/imgs/2020/01/1a5a007bffc828e0.png",
    backgroundType: "patterns",
    themeValue: "light"
})

export function useStore() {
    return state
}