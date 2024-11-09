---
aside: true
keywords: 荒芜,荒芜博客,笔记分享,荒芜blog
---

<script setup>
import { useData } from "vitepress"
import Home from '@/components/pages/Home.vue'

const { params } = useData()
</script>

<Home :page="Number(params.num)" />
