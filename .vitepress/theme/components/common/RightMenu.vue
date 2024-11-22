<template>
    <Teleport to="body">
        <Transition name="fade" mode="out-in">
            <div v-if="rightMenuShow" class="right-menu">
                <div :style="{ left: rightMenuX + 'px', top: rightMenuY + 'px', }" ref="rightMenuRef"
                    class="menu-content s-card hover">
                    <div class="tools">
                        <div class="btn" title="后退">
                            <i class="iconfont icon-left"></i>
                        </div>
                        <div class="btn" title="前进">
                            <i class="iconfont icon-right"></i>
                        </div>
                        <div class="btn" title="刷新">
                            <i class="iconfont icon-refresh"></i>
                        </div>
                        <div class="btn" title="返回顶部">
                            <i class="iconfont icon-rocket"></i>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { nextTick, ref } from 'vue'
import { useMainStore } from '@/store'

const rightMenuX = ref(0)
const rightMenuY = ref(0)
const rightMenuShow = ref(false)
const rightMenuRef = ref(null)
const clickedType = ref("normal")
const clickedTypeData = ref(null)

const mainStore = useMainStore()
const { useRightMenu } = storeToRefs(mainStore)
const openRightMenu = (e) => {
    if (e.ctrlKey || !useRightMenu.value) return true
    if (window.innerWidth < 768) return true
    e.preventDefault()
    rightMenuShow.value = false
    checkClickType(e?.target)
    nextTick().then(() => {
        // 处理菜单位置
        const calculateMenuPosition = () => {
            // 获取菜单的宽度和高度
            const menuWidth = rightMenuRef.value?.offsetWidth
            const menuHeight = rightMenuRef.value?.offsetHeight
            // 获取屏幕的宽度和高度
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight
            // 计算正确的坐标值
            let correctX = e.clientX
            let correctY = e.clientY
            // 保留边距
            const marginWidth = 20;
            if (correctX + menuWidth > screenWidth - marginWidth) {
                correctX = screenWidth - menuWidth - marginWidth
            }
            if (correctY + menuHeight > screenHeight - marginWidth) {
                correctY = screenHeight - menuHeight - marginWidth
            }
            if (correctX < marginWidth) {
                correctX = marginWidth
            }
            if (correctY < marginWidth) {
                correctY = marginWidth
            }
            rightMenuX.value = correctX
            rightMenuY.value = correctY
        }
        // 显示菜单
        rightMenuShow.value = true
        // DOM 更新
        nextTick().then(() => calculateMenuPosition())
    })
}

const checkClickType = (target) => {
    if (!target?.tagName) return false
    // 写入内容
    clickedTypeData.value =
        window.getSelection().toString().length > 0 ? window.getSelection().toString() : target
    switch (target.tagName) {
        case "A":
            // 链接类型
            clickedType.value = "link"
            break
        case "IMG":
            // 图片类型
            clickedType.value = "image"
            break
        case "INPUT":
        case "TEXTAREA":
            // 输入框类型
            clickedType.value = "input"
            break
        default:
            if (window.getSelection().toString().length > 0) {
                // 已选中的文本
                clickedType.value = "text"
            } else {
                // 普通模式
                clickedType.value = "normal"
            }
            break
    }
}

defineExpose({ openRightMenu })
</script>

<style lang="scss">
.right-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    transition: opacity 0.2s;

    .menu-content {
        position: absolute;
        width: 180px;
        background-color: var(--main-card-background);
        animation: fade-up 0.2s forwards;
        transition:
            opacity 0.3s,
            border-color 0.3s,
            box-shadow 0.3s,
            background-color 0.3s;

        .tools {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--main-card-border);

            .btn {
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                padding: 8px;
                transition:
                    color 0.3s,
                    background-color 0.3s;
                font-weight: 800;

                .iconfont {
                    font-size: 20px;
                    transition: color 0.3s;
                }
            }
        }
    }
}
</style>
