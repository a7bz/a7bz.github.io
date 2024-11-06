import Layout from './Layout.vue'
import { createPinia } from 'pinia'
import persistedstate from 'pinia-plugin-persistedstate'
// import DefaultTheme from 'vitepress/theme'
import '@/styles/main.scss'

import Empty from '@/components/view/Empty.vue'
import LazyLoader from '@/components/common/LazyLoader.vue'

const pinia = createPinia()
if (typeof window !== 'undefined')
  pinia.use(persistedstate)

export default {
  // extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(pinia)
    app.component('Empty', Empty)
    app.component('LazyLoader', LazyLoader)
  }
}

