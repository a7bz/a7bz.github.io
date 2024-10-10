import Layout from './Layout.vue'
import { createPinia } from 'pinia'
import persistedstate from 'pinia-plugin-persistedstate'

import '@/styles/main.scss'

const pinia = createPinia()
pinia.use(persistedstate)

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(pinia)
  }
}

