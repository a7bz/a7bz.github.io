<template>
    <Teleport to="body">
        <Transition name="fade" mode="out-in">
            <div v-if="rightMenuShow" class="right-menu" @click="rightMenuShow = false"
                @contextmenu.stop="closeRightMenu">
                <div :style="{ left: rightMenuX + 'px', top: rightMenuY + 'px', }" ref="rightMenuRef"
                    class="menu-content s-card hover" @contextmenu.stop="closeRightMenu">
                    <div class="tools">
                        <div v-for="(btn, btnIdx) in btnList?.btn" :key="btnIdx">
                            <div class="btn" :title="btn.title" @click="rightMenuFunc(btn.handle)">
                                <i class="iconfont" :class="'icon-' + btn.icon" />
                            </div>
                        </div>
                    </div>
                    <div class="all-menu">
                        <div v-for="(item, typeIdx) in typeList" :key="typeIdx">
                            <div v-if="judge(item)" :class="typeIdx == typeList.length - 1 ? 'last' : 'item'">
                                <div v-for="(btn, itemIdx) in btnList[item]" :key="itemIdx" class="btn"
                                    @click="rightMenuFunc(btn.handle, btn.url)">
                                    <i class="iconfont" :class="'icon-' + btn.icon" />
                                    <span class="name">{{ btn.title }}</span>
                                </div>
                                <div class="btn" @click.stop="mainStore.changeThemeType" v-if="item == 'general'">
                                    <i :class="`iconfont icon-${themeType === 'auto' ? 'dark' : themeType === 'dark'
                                        ? 'light' : 'auto'}`" />
                                    <span class="name"> {{ themeType === "auto" ? "深色模式" : themeType === "dark" ? "浅色模式"
                                        : "跟随系统" }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useData, useRouter } from 'vitepress'
import { useDataStore, useMainStore } from '@/store'
import { shufflePost, smoothScrolling, copyText, copyImage, downloadImage } from '@/scripts/helper'

const router = useRouter()

const dataStore = useDataStore()
const { postsData } = storeToRefs(dataStore)
const mainStore = useMainStore()
const { useRightMenu, themeType } = storeToRefs(mainStore)
const { theme } = useData()

const btnList = ref({})

const judge = (type) => {
    if (type == 'inputOrStr') return clickedType.value == 'input' && typeof clickedTypeData.value == 'string'
    else if (type == 'textAndLink') return (clickedType.value == 'text' || clickedType.value == 'link') && isLink(clickedTypeData.value)
    else if (type == 'textOrInput') return clickedType.value == 'text' || clickedType.value == 'input'
    // else if (type == 'textAndComment') return clickedType.value == 'text' && theme.value.plugin.comment
    else if (type == 'general') return true
    else return clickedType.value == type
}

const typeList = reactive(['normal', 'link', 'image', 'inputOrStr', 'textAndLink', 'textOrInput', 'textAndComment', 'general'])

const isLink = (data) => {
    if (!data) return false
    const basicDomainPattern = /^[\u4e00-\u9fa5a-zA-Z0-9.-]+\.[\u4e00-\u9fa5a-zA-Z]{2,}$/
    if (!basicDomainPattern.test(data)) return false
    const hasProtocol = /^(http|https):\/\//i.test(data)
    const urlData = hasProtocol ? data : `http://${data}`
    try {
        new URL(urlData)
        return urlData
    } catch (error) {
        return false
    }
}

onMounted(() => {
    btnList.value = {
        btn: [{ icon: 'left', title: '后退', handle: 'back' }, { icon: 'right', title: '前进', handle: 'forward' },
        { icon: 'refresh', title: '刷新', handle: 'reload' }, { icon: 'rocket', title: '返回顶部', handle: 'backToTop' }],
        normal: [{ icon: 'shuffle', title: '随便逛逛', handle: 'shuffle-post' },
        { icon: 'folder', title: '全部分类', handle: 'go', url: '/pages/category' },
        { icon: 'hashtag', title: '全部标签', handle: 'go', url: '/pages/tag' },],
        link: [{ icon: 'windows-utils', title: '新标签页打开', handle: 'open-link' },
        { icon: 'links', title: '复制链接地址', handle: 'copyLink' }],
        image: [{ icon: 'copy-image', title: '复制此图片', handle: 'copyImage' },
        { icon: 'download-image', title: '下载此图片', handle: 'downloadImage' }],
        inputOrStr: [{ icon: 'paste', title: '粘贴文本', handle: 'input-paste' }],
        textAndLink: [{ icon: 'windows-utils', title: '新标签页打开', handle: 'target-link' },],
        textOrInput: [{ icon: 'baidu', title: '使用百度搜索', handle: 'baidu' },
        { icon: 'bing', title: '使用必应搜索', handle: 'bing' },
        { icon: 'copy-text', title: '复制选中文本', handle: 'copyText' }],
        textAndComment: [{ icon: 'chat', title: '评论选中内容', handle: 'commentText' }],
        general: [{ icon: 'copy', title: '复制本页地址', handle: 'copy-link' },],
    }
})

// 右键菜单点击事件
const rightMenuFunc = async (type, url) => {
    try {
        if (!type) return false
        switch (type) {
            case "back": window.history.back(); break
            case "forward": window.history.forward(); break
            case "reload": window.location.reload(); break
            case "backToTop": smoothScrolling(); break
            case "open-link": window.open(clickedTypeData.value?.href); break
            case "copy-link":
                const pageLink = theme.value.site + router.route.path
                if (pageLink) copyText(pageLink); break
            case "input-paste":
                const text = await navigator.clipboard.readText()
                if (clickedTypeData.value && typeof clickedTypeData.value === "object") {
                    const inputElement = clickedTypeData.value
                    const start = inputElement.selectionStart
                    const end = inputElement.selectionEnd
                    const value = inputElement.value
                    // 在光标位置插入文本
                    const newValue = value.substring(0, start) + text + value.substring(end)
                    inputElement.value = newValue
                    // 更新光标位置
                    const newCursorPosition = start + text.length
                    inputElement.setSelectionRange(newCursorPosition, newCursorPosition)
                }
                break
            case "go": if (url) router.go(url); break
            case "copyLink":
                console.log(clickedTypeData.value?.getAttribute('original-href') || clickedTypeData.value?.href)
                copyText(clickedTypeData.value?.getAttribute('original-href') || clickedTypeData.value?.href)
                break
            case "copyImage": copyImage(clickedTypeData.value?.src); break
            case "downloadImage": downloadImage(clickedTypeData.value?.src); break
            case "shuffle-post": router.go(shufflePost(postsData.value)); break
            case "target-link": window.open(isLink(clickedTypeData.value), "_blank"); break
            case "baidu": window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(clickedTypeData.value)}`, "_blank"); break
            case "bing": window.open(`https://cn.bing.com/search?q=${encodeURIComponent(clickedTypeData.value)}`, "_blank"); break
            case "copyText": copyText(clickedTypeData.value); break
            default: return false
        }
    } catch (error) {
        $message.error("右键菜单发生错误，请重试")
        console.error("右键菜单出错：", error)
    }
}

const rightMenuX = ref(0)
const rightMenuY = ref(0)
const rightMenuShow = ref(false)
const rightMenuRef = ref(null)
const clickedType = ref("normal")
const clickedTypeData = ref(null)


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
            if (correctX < marginWidth) correctX = marginWidth
            if (correctY < marginWidth) correctY = marginWidth
            rightMenuX.value = correctX
            rightMenuY.value = correctY
        }
        // 显示菜单
        rightMenuShow.value = true
        // DOM 更新
        nextTick().then(() => calculateMenuPosition())
    })
}

const commentCopyData = ref(null)
const closeRightMenu = (e) => {
    e?.preventDefault()
    rightMenuShow.value = false
    rightMenuX.value = 0
    rightMenuY.value = 0
    clickedType.value = "normal"
    clickedTypeData.value = null
    commentCopyData.value = false
}

const checkClickType = (target) => {
    if (!target?.tagName) return false
    // 写入内容
    clickedTypeData.value =
        window.getSelection().toString().length > 0 ? window.getSelection().toString() : target
    switch (target.tagName) {
        case "A": clickedType.value = "link"; break
        case "IMG": clickedType.value = "image"; break
        case "INPUT": clickedType.value = "input"; break
        case "TEXTAREA": clickedType.value = "input"; break
        default:
            if (window.getSelection().toString().length > 0) clickedType.value = "text"
            else clickedType.value = "normal"
            break
    }
}

defineExpose({ openRightMenu })
</script>

<style lang="scss" scoped>
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

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            padding: 8px;
            transition:
                color 0.3s,
                background-color 0.3s;

            .iconfont {
                font-size: 20px;
                transition: color 0.3s;
            }

            .name {
                margin-left: 12px;
            }

            &:hover {
                color: var(--main-card-background);
                background-color: var(--main-color);

                .iconfont {
                    color: var(--main-card-background);
                }
            }
        }

        .tools {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--main-card-border);

            .btn {
                width: 34px;
                height: 34px;
                min-width: 34px;
                font-weight: 800;
            }
        }

        .all-menu {

            .item {
                padding: 10px 0;
                border-bottom: 1px solid var(--main-card-border);
            }

            .last {
                padding-top: 10px;
            }

            .btn {
                justify-content: flex-start;
                margin-bottom: 6px;

                .iconfont {
                    font-size: 20px;
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }

            &.general {
                padding-top: 12px;
                border-top: 1px solid var(--main-card-border);
            }
        }
    }
}
</style>
