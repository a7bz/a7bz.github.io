import { defineConfig } from 'vitepress'
import { shared, zh } from './export'

export default defineConfig({
    ...shared,
    locales: {
        root: { label: '简体中文', ...zh }
    }
})