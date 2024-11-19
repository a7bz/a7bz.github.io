<template>
    <Teleport to="body">
        <Transition name="fade" mode="out-in">
            <div v-if="loadingStatus" class="loading" @click="loadingStatus = false">
                <img :src="theme.logo" class="logo" alt="loading-logo" />
                <span :class="['tip', { show: showTip }]"> 一直显示？点击任意区域即可关闭 </span>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useData } from 'vitepress'
import { useMainStore } from '@/store'

const { theme } = useData()
const mainStore = useMainStore()
const { loadingStatus } = storeToRefs(mainStore)

const showTip = ref(false)
const showTimeOut = ref(null)

watch(() => loadingStatus.value, (val) => {
    if (val) {
        showTimeOut.value = setTimeout(() => {
            showTip.value = true
        }, 2500)
    } else {
        showTip.value = false
        clearTimeout(showTimeOut.value)
    }
})

onBeforeUnmount(() => {
    clearTimeout(showTimeOut.value)
})
</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: var(--main-card-background);
    z-index: 9999;

    .logo {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        animation: loading 2s infinite;
    }

    .tip {
        position: absolute;
        bottom: 2rem;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s;

        &.show {
            opacity: 0.6;
        }
    }
}
</style>
