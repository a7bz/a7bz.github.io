<template>
    <div class="comment-list-container s-card">
        <div class="title">
            <i class="iconfont icon-comments"></i>
            <span class="title-name">最近评论</span>
        </div>
        <ul class="comment-list">
            <li v-for="comment in commentTree" :key="comment.objectId" class="comment-item">
                <div class="comment-header">
                    <a :href="comment.link" :title="comment.nick" target="_blank" rel="noopener noreferrer"
                        v-if="comment.link">
                        <img :src="comment.avatar" :alt="comment.nick" class="comment-avatar">
                    </a>
                    <div v-else class="comment-avatar-container">
                        <img :src="comment.avatar" :alt="comment.nick" class="comment-avatar">
                    </div>
                    <div class="comment-meta">
                        <a :href="comment.link" :title="comment.nick" target="_blank" rel="noopener noreferrer"
                            class="comment-author" v-if="comment.link">
                            {{ comment.nick }}
                        </a>
                        <span class="comment-author" v-else>{{ comment.nick }}</span>
                        <span class="comment-time">{{ formatTime(comment.time) }}</span>
                    </div>
                </div>
                <div class="comment-content" v-html="comment.comment"></div>
                <a :href="comment.url" class="comment-link" target="_blank" rel="noopener noreferrer">
                    查看原文
                </a>
                <!-- 显示回复 -->
                <ul v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
                    <li v-for="reply in comment.replies" :key="reply.objectId" class="comment-reply-item">
                        <div class="comment-header">
                            <a :href="reply.link" :title="reply.nick" target="_blank" rel="noopener noreferrer"
                                v-if="reply.link">
                                <img :src="reply.avatar" :alt="reply.nick" class="comment-avatar">
                            </a>
                            <div v-else class="comment-avatar-container">
                                <img :src="reply.avatar" :alt="reply.nick" class="comment-avatar">
                            </div>
                            <div class="comment-meta">
                                <a :href="reply.link" :title="reply.nick" target="_blank" rel="noopener noreferrer"
                                    class="comment-author" v-if="reply.link">
                                    {{ reply.nick }}
                                </a>
                                <span class="comment-author" v-else>{{ reply.nick }}</span>
                                <span class="comment-time">{{ formatTime(reply.time) }}</span>
                            </div>
                        </div>
                        <div class="comment-content" v-html="reply.comment"></div>
                        <a :href="reply.url" class="comment-link" target="_blank" rel="noopener noreferrer">
                            查看原文
                        </a>
                    </li>
                </ul>
            </li>
            <li v-if="commentTree.length === 0" class="comment-empty">
                暂无评论
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { ref, onMounted, computed } from 'vue'

const { theme } = useData()
const rawComments = ref([])

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
        return `${minutes}分钟前`
    } else if (hours < 24) {
        return `${hours}小时前`
    } else if (days < 30) {
        return `${days}天前`
    } else {
        return date.toLocaleDateString()
    }
}

// 将评论组织成树形结构
const commentTree = computed(() => {
    // 创建评论映射表，方便查找
    const commentMap = new Map()
    const roots = []

    // 第一次遍历：创建映射表和初始化回复数组
    rawComments.value.forEach(comment => {
        commentMap.set(comment.objectId, {
            ...comment,
            replies: []
        })
    })

    // 第二次遍历：构建树形结构
    rawComments.value.forEach(comment => {
        const currentComment = commentMap.get(comment.objectId)
        if (comment.pid && commentMap.has(comment.pid)) {
            // 这是一条回复，添加到父评论的replies数组中
            const parentComment = commentMap.get(comment.pid)
            parentComment.replies.push(currentComment)
        } else {
            // 这是一条顶级评论，直接添加到根数组
            roots.push(currentComment)
        }
    })

    return roots
})

// 加载最近评论
onMounted(async () => {
    try {
        const { RecentComments } = await import('@waline/client')
        const result = await RecentComments({
            serverURL: theme.value.plugin.comment.serverURL,
            count: 10 // 加载更多评论，确保能获取到回复关系
        })
        rawComments.value = result.comments.data || []
    } catch (error) {
        console.error('加载最近评论失败:', error)
        rawComments.value = []
    }
})
</script>

<style lang="scss" scoped>
.comment-list-container {
    .comment-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--main-color-bg) transparent;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--main-color-bg);
            border-radius: 3px;

            &:hover {
                background: var(--main-color);
            }
        }
    }

    .comment-item {
        padding: 12px 0;
        border-bottom: 1px solid var(--main-card-border);
        transition: all 0.3s ease;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: var(--main-color-bg);
        }
    }

    // 回复评论样式
    .comment-replies {
        list-style: none;
        padding: 0 0 0 24px;
        margin: 8px 0 0 0;
        border-left: 2px solid var(--main-card-border);
    }

    .comment-reply-item {
        padding: 10px 0;
        transition: all 0.3s ease;

        &:hover {
            background-color: var(--main-color-bg);
        }

        &:not(:last-child) {
            border-bottom: 1px dashed var(--main-card-border);
        }

        .comment-avatar {
            width: 28px;
            height: 28px;
        }

        .comment-content {
            font-size: 12px;
            -webkit-line-clamp: 1;
        }
    }

    .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 6px;

        .comment-avatar-container {
            display: flex;
            align-items: center;
        }

        .comment-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
            transition: transform 0.3s ease;

            &:hover {
                transform: scale(1.1);
            }
        }

        .comment-meta {
            display: flex;
            flex-direction: column;
            flex: 1;

            .comment-author {
                font-size: 13px;
                font-weight: 500;
                color: var(--main-font-color);
                text-decoration: none;
                margin-bottom: 2px;
                transition: color 0.3s ease;

                &:hover {
                    color: var(--main-color);
                    text-decoration: none;
                }
            }

            .comment-time {
                font-size: 11px;
                color: var(--main-text-color-light);
            }
        }
    }

    .comment-content {
        font-size: 13px;
        color: var(--main-text-color);
        line-height: 1.5;
        margin-bottom: 6px;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        p {
            margin: 0;
        }
    }

    .comment-link {
        font-size: 11px;
        color: var(--main-color);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: var(--main-color-hover);
            text-decoration: underline;
        }
    }

    .comment-empty {
        text-align: center;
        padding: 30px 0;
        color: var(--main-text-color-light);
        font-size: 13px;
    }
}
</style>
