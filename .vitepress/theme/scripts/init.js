import { useMainStore } from "@/store"

export const routeChange = (type, to) => {

    const store = useMainStore()
    if (typeof window === 'undefined') return false
    if (type == 1) {
        store.loadingStatus = true
    } else {
        store.loadingStatus = false
    }
}