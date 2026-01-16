---
aside: true
keywords: 阿柒,阿柒博客,笔记分享,阿柒blog
---

<script setup>
import { useData } from "vitepress"
import Home from '@/components/pages/Home.vue'

const { params } = useData()
</script>

<Home :page="Number(params.num)" />
