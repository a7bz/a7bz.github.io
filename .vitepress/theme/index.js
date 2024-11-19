import Layout from './Layout.vue'
import { createPinia } from 'pinia'
import persistedstate from 'pinia-plugin-persistedstate'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import '@/styles/main.scss'

import Empty from '@/components/common/Empty.vue'
import LazyLoader from '@/components/common/LazyLoader.vue'
import { routeChange } from './scripts/init'

const pinia = createPinia()
if (typeof window !== 'undefined')
  pinia.use(persistedstate)

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // ...
    enhanceAppWithTabs(app)
    app.use(pinia)
    app.component('Empty', Empty)
    app.component('LazyLoader', LazyLoader)
    router.onBeforeRouteChange = (to) => {
      routeChange(1, to)
    }
    router.onAfterRouteChanged = (to) => {
      routeChange(2, to)
    }
  }
}

