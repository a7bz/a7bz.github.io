<template>
    <div>
        <div class="post-content">
            <article class="post-article s-card">
                <Content id="page-content" class="markdown-main-style" />
            </article>
        </div>

    </div>
</template>

<script setup>
import { mdData } from '@casual/mdCache'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
const href = page.value.filePath.replace('.md', '').replace('index', '')
const post = mdData[href].post


</script>

<style scoped></style>
