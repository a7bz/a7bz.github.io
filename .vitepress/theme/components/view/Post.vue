<template>
    <div class="post">
        <div class="post-meta">
            <div class="meta">
                <div class="categories">
                    <a v-for="(item, index) in postData.category" :key="index" :href="`/pages/category/${item}`"
                        class="cat-item">
                        <i class="iconfont icon-folder" />
                        <span class="name">{{ item }}</span>
                    </a>
                </div>
                <div class="tags">
                    <a v-for="(item, index) in postData.tag" :key="index" :href="`/pages/tags/${item}`"
                        class="tag-item">
                        <i class="iconfont icon-hashtag" />
                        <span class="name">{{ item }}</span>
                    </a>
                </div>
            </div>
            <h1 class="title">
                {{ postData.title || "未命名文章" }}
            </h1>
            <div class="other-meta">
                <span class="meta date">
                    <i class="iconfont icon-date" />
                    {{ formatTimestamp(postData.date) }}
                </span>
                <span class="update meta">
                    <i class="iconfont icon-time" />
                    {{ formatTimestamp(postData.update) }}
                </span>
            </div>
        </div>
        <div class="post-content">
            <article class="post-article s-card">
                <Content id="page-content" class="markdown-main-style" />
            </article>
        </div>

    </div>
</template>

<script setup>
import { formatTimestamp } from "@/scripts/helper"
import { computed, ref } from 'vue'
import { mdData } from '@casual/mdCache'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const curData = ref(mdData)

const postData = computed(() => {
    const href = page.value.filePath.replace('.md', '').replace('index', '')
    return curData.value[href].post
})

if (import.meta.env.DEV && import.meta.hot) {
    __VUE_HMR_RUNTIME__.mdDataUpdate = (data) => {
        Object.assign(curData.value, data)
    }
}

</script>

<style scoped>
@import "@/styles/post.scss";

.post {
    width: 100%;
    display: flex;
    flex-direction: column;
    animation: fade-up 0.6s 0.1s backwards;

    .post-meta {
        padding: 2rem 0 3rem 18px;
        width: 100%;

        .meta {
            display: flex;
            flex-direction: row;
            align-items: center;

            .categories {
                margin-right: 12px;

                .cat-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 6px 12px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 8px;
                    background-color: var(--main-mask-Inverse-background);
                    opacity: 0.8;

                    .iconfont {
                        margin-right: 6px;
                    }

                    &:hover {
                        color: var(--main-color);
                        background-color: var(--main-color-bg);

                        .iconfont {
                            color: var(--main-color);
                        }
                    }
                }
            }

            .tags {
                display: flex;
                flex-direction: row;
                align-items: center;

                .tag-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 6px 12px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 8px;
                    opacity: 0.8;

                    .iconfont {
                        margin-right: 4px;
                        opacity: 0.6;
                        font-weight: normal;
                    }

                    &:hover {
                        color: var(--main-color);
                        background-color: var(--main-color-bg);

                        .iconfont {
                            color: var(--main-color);
                        }
                    }
                }
            }
        }

        .title {
            font-size: 2.2rem;
            line-height: 1.2;
            color: var(--main-font-color);
            margin: 1.4rem 0;
        }

        .other-meta {
            display: flex;
            flex-direction: row;
            align-items: center;

            .meta {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 6px 12px;
                font-size: 14px;
                border-radius: 8px;
                opacity: 0.8;

                .iconfont {
                    margin-right: 6px;
                    transition: color 0.3s;
                }

                &.date {
                    padding-left: 0;
                }

                &.hot {
                    .iconfont {
                        font-size: 18px;
                    }
                }

                &.hover {
                    transition:
                        color 0.3s,
                        background-color 0.3s;
                    cursor: pointer;

                    &:hover {
                        color: var(--main-color);
                        background-color: var(--main-color-bg);

                        .iconfont {
                            color: var(--main-color);
                        }
                    }
                }
            }
        }
    }

    .post-content {
        width: 100%;
        display: flex;
        flex-direction: row;
        animation: fade-up 0.6s 0.3s backwards;

        .post-article {
            width: calc(100% - 300px);
            padding: 1rem 2.2rem 2.2rem 2.2rem;
            user-select: text;
            cursor: auto;

            &:hover {
                border-color: var(--main-card-border);
            }

            .expired {
                margin: 1.2rem 0 2rem 0;
                padding: 0.8rem 1.2rem;
                border-left: 6px solid var(--main-warning-color);
                border-radius: 6px 16px 16px 6px;
                user-select: none;

                strong {
                    color: var(--main-warning-color);
                }
            }

            .other-meta {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin: 2rem 0;
                opacity: 0.8;

                .all-tags {
                    display: flex;
                    flex-direction: row;
                    align-items: center;

                    .tag-item {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 6px 12px;
                        font-size: 14px;
                        font-weight: bold;
                        border-radius: 8px;
                        background-color: var(--main-card-border);
                        margin-right: 12px;

                        .iconfont {
                            margin-right: 4px;
                            opacity: 0.6;
                            font-weight: normal;
                        }

                        &:hover {
                            color: var(--main-color);
                            background-color: var(--main-color-bg);

                            .iconfont {
                                color: var(--main-color);
                            }
                        }
                    }
                }

                .report {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 6px 12px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 8px;
                    background-color: var(--main-card-border);

                    .iconfont {
                        margin-right: 6px;
                    }

                    &:hover {
                        color: #efefef;
                        background-color: var(--main-error-color);

                        .iconfont {
                            color: #efefef;
                        }
                    }
                }
            }
        }

        .main-aside {
            width: 300px;
            padding-left: 1rem;
        }

        @media (max-width: 1200px) {
            .post-article {
                width: 100%;
            }

            .main-aside {
                display: none;
            }
        }
    }

    @media (max-width: 768px) {
        .post-meta {
            padding: 4rem 1.5rem;

            .meta {
                justify-content: center;

                .categories {
                    margin-right: 0;
                }

                .tags {
                    display: none;
                }
            }

            .title {
                font-size: 1.6rem;
                text-align: center;
                line-height: 40px;
            }

            .other-meta {
                justify-content: center;
            }
        }

        .post-content {
            .post-article {
                border: none;
                padding: 20px 30px;

                .other-meta {
                    margin: 1rem 0 2rem 0;
                    flex-direction: column;

                    .all-tags {
                        flex-wrap: wrap;

                        .tag-item {
                            margin-top: 12px;
                        }
                    }

                    .report {
                        margin-top: 20px;
                    }
                }
            }
        }
    }
}
</style>
