<template>
    <Teleport to="body">
        <div v-show="store.mobileMenuShow" class="mobile-menu">
            <div class="menu-mask" @click="store.changeShowStatus('mobileMenuShow')" />
            <Transition name="fade" mode="out-in">
                <div v-show="store.mobileMenuShow" class="menu-content s-card">
                    <Intro />
                    <hr />
                    <div class="nav-list">
                        <div v-for="(nav, navIndex) in theme?.nav" :key="navIndex" class="nav-item">
                            <div @click="navClick(nav, navIndex)" class="nav-title">
                                <div>
                                    <i :class="`iconfont icon-${nav?.icon}`" />
                                    {{ nav?.text }}
                                </div>
                                <i v-if="nav?.items" class="iconfont icon-back"
                                    :class="curInedx == navIndex ? 'selectd' : ''" />
                            </div>
                            <div v-if="curInedx == navIndex" @click.stop>
                                <div class="nav-child" v-for="(item, index) in nav?.items" :key="index"
                                    @click="childClick(item)">
                                    <i :class="`iconfont icon-${item?.icon}`" />
                                    {{ item.text }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="tags-list menu-item">
                        <span class="link-title"> 标签</span>
                        <div class="link-child">
                            <div v-for="(item, tag, index) in tagsData" :key="index" class="link-child-btn"
                                @click="pageJump(`/pages/tag/${tag}`)">
                                <i class="iconfont icon-tag"></i>
                                <span class="name">{{ tag }}</span>
                                <sup class="num">{{ item.length }}</sup>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useData, useRouter } from 'vitepress'
import { useMainStore, useDataStore } from '@/store'
import Intro from '../layout/Aside/Intro.vue'

const store = useMainStore()
const dataStore = useDataStore()
const { tagsData } = storeToRefs(dataStore)
const { theme } = useData()
const curInedx = ref(0)

const navClick = (nav, navIndex) => {
    if (curInedx.value !== navIndex)
        curInedx.value = navIndex
    else
        curInedx.value = -1
    if (nav?.link)
        pageJump(nav.link)
}

const childClick = (item) => {
    if (item?.link)
        pageJump(item.link)
}

const router = useRouter()
const pageJump = (path) => {
    if (!path) return
    store.changeShowStatus("mobileMenuShow")
    router.go(path)
}
</script>


<style lang="scss" scoped>
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 3000;

    .menu-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--main-mask-background);
    }

    .menu-content {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
        max-width: 300px;
        padding: 20px;
        overflow: auto;
        border-radius: 12px 0 0 12px;
        background: var(--main-background);
    }

    .nav-list {
        .nav-item {
            margin-bottom: .7rem;

            .iconfont {
                font-size: 1.2rem;
                margin-right: 8px;
                color: var(--main-color);
                transition: transform 0.3s ease;
            }

            .nav-title {
                display: flex;
                align-items: center;
                padding: 8px;
                justify-content: space-between;

                .selectd {
                    transform: rotate(-90deg);
                }

                &:hover {
                    border-radius: 10px;
                    background-color: var(--main-color);
                    color: var(--main-card-background);

                    .iconfont {
                        margin-left: 10px;
                        color: var(--main-card-background);
                    }
                }
            }

            .nav-child {
                margin-top: .5rem;
                margin-left: 15%;
                color: var(--main-font-color);

                &:hover {
                    padding: 10px;
                    border-radius: 10px;
                    background-color: var(--main-color);
                    color: var(--main-card-background);

                    .iconfont {
                        color: var(--main-card-background);
                    }
                }
            }
        }
    }

    .menu-item {
        margin-bottom: 12px;

        .link-title {
            font-size: 14px;
            margin-bottom: 12px;
            display: inline-block;
            color: var(--main-font-second-color);
        }

        .link-child {
            display: grid;
            gap: 12px;
            grid-template-columns: 1fr 1fr;

            .link-child-btn {
                display: flex;
                flex-direction: row;
                align-items: center;
                border-radius: 8px;
                padding: 10px 12px;
                background-color: var(--main-card-background);
                border: 1px solid var(--main-card-border);
                box-shadow: 0 8px 16px -4px var(--main-border-shadow);
                font-size: 15px;

                .iconfont {
                    margin-right: 6px;
                    opacity: 0.6;
                }

                .name {
                    max-width: 80px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .num {
                    opacity: 0.4;
                    font-size: 12px;
                    margin-left: 4px;
                }

                &:hover {
                    color: var(--main-card-background);
                    background-color: var(--main-color);

                    .iconfont {
                        color: var(--main-card-background);
                    }
                }
            }
        }
    }

    hr {
        margin: 1rem 0;
        opacity: 0.4;
        border: 1px dashed var(--main-font-second-color);
    }
}
</style>
