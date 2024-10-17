<template>
    <div class="toc s-card">
        <div class="toc-title">
            <i class="iconfont icon-toc" />
            <span class="name">目录</span>
        </div>
        <div class="toc-list">
            <span>

            </span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { throttle } from '@/scripts/helper'
const postDom = ref(null)
const getAllTitle = () => {
    try {
        postDom.value = document.getElementById('page-content')
        if (!postDom.value) return false
        const headers = postDom.value.querySelectorAll('h2,h3').filter(
            (header) => header.parentElement.tagName.toLowerCase() == 'div'
        )
        return headers
    } catch (e) {
        console.error("获取所有目录数据出错：", e)
    }
}

const generateDirData = () => {
    const headers = getAllTitle()
    if (!headers) return false
    const nestedData = []
    headers.forEach((header) => {
        const headerObj = {
            id: header.id,
            type: header.tagName,
            text: header.textContent?.replace(/\u200B/g, "").trim(),
        }
        nestedData.push(headerObj)
    })
    tocData.value = nestedData
}
</script>

<style scoped>
.toc {
  position: relative;
  padding: 0 !important;
  overflow: hidden;
  .toc-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 18px;
    height: 58px;
    .iconfont {
      margin-right: 8px;
      font-weight: bold;
      opacity: 0.6;
    }
    .name {
      font-weight: bold;
    }
  }
  .toc-list {
    position: relative;
    padding: 20px;
    padding-top: 0;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    max-height: calc(70vh - 58px);
    overflow: auto;
    .toc-item {
      margin: 4px 0;
      padding: 6px 12px;
      border-radius: 8px;
      opacity: 0.6;
      transition:
        color 0.3s,
        opacity 0.3s,
        font-size 0.3s,
        background-color 0.3s;
      cursor: pointer;
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &.H2 {
        font-weight: bold;
      }
      &.H3 {
        font-size: 14px;
        margin-left: 20px;
      }
      &.active {
        opacity: 1;
        color: var(--main-color);
        background-color: var(--main-color-bg);
        &.H2 {
          font-size: 18px;
        }
        &.H3 {
          font-size: 16px;
        }
      }
      &:hover {
        opacity: 1;
        color: var(--main-color);
        background-color: var(--main-color-bg);
      }
    }
    &::after {
      content: "";
      position: absolute;
      left: 12px;
      top: var(--height);
      width: 4px;
      height: 20px;
      margin: 8px 0;
      background-color: var(--main-color);
      border-radius: 8px;
      transition: top 0.3s;
    }
  }
  &::before {
    content: "";
    position: absolute;
    left: 12px;
    bottom: 20px;
    width: 4px;
    height: calc(100% - 78px);
    background-color: var(--main-card-border);
    border-radius: 8px;
  }
}
</style>
