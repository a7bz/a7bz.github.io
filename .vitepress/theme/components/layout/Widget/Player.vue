<template>
    <div v-if="playerShow" :class="['player', { playing: playState }, { 'is-fold': isFold && playState }]"
        @click="playClick">
        <div ref="playerDom" class="player-content" />
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useData } from 'vitepress'
import { useMainStore } from '@/store'
import { getMusicList } from '@/scripts/api'
import "aplayer/dist/APlayer.min.css"

const mainStore = useMainStore()
const { playerShow, playerVolume, playState, playerData } = storeToRefs(mainStore)
const { theme } = useData()
const { enable, url, id, server, type } = theme.value.plugin?.music || {}

const player = ref(null)
const playerDom = ref(null)

const playClick = () => {
    if (!playState.value) {
        player.value.play()
    }
    player.value?.list.toggle()
}

const getMusicListData = async () => {
    try {
        const musicList = await getMusicList(url, id, server, type)
        initAPlayer(musicList?.length ? musicList : [])
    } catch (e) {
        console.error("获取播放列表失败，请重试")
        initAPlayer([])
    }
}

const initAPlayer = async (list) => {
    try {
        const playlist = [...list]
        if (!playlist?.length) return false
        const module = await import("aplayer")
        const APlayer = module.default
        player.value = new APlayer({
            container: playerDom.value,
            volume: playerVolume.value,
            lrcType: 3,
            listFolded: false,
            order: "random",
            audio: playlist,
        })
        player.value?.on("canplay", () => { getMusicData() })
        player.value?.on("play", () => { playState.value = true })
        player.value?.on("pause", () => { playState.value = false })
        player.value?.on("ended", () => {
            addFold()
        })
        getMusicData()
        window.$player = player.value
        addFold()
    } catch (error) {
        console.error("初始化播放器出错：", error)
    }
}

const isFold = ref(false)

const addFold = () => {
    const playerEle = document.querySelector('.player')
    console.log(playerEle)
    if (playerEle) {
        const aplayerInfo = playerEle.querySelector('.aplayer-body')
        console.log(aplayerInfo)
        if (aplayerInfo.querySelector('.fold-toggle')) return
        const foldToggle = document.createElement('div')
        foldToggle.className = 'fold-toggle'
        const icon = document.createElement('i')
        icon.className = 'iconfont icon-back'
        foldToggle.appendChild(icon)
        foldToggle.style.cursor = 'pointer'
        icon.addEventListener('click', (event) => {
            event.stopPropagation()
            isFold.value = !isFold.value
        })
        aplayerInfo.appendChild(foldToggle)
    }

}

const getMusicData = () => {
    try {
        if (!playerDom.value) return false
        const songInfo = playerDom.value.querySelector(".aplayer-info")
        const songName = songInfo.querySelector(".aplayer-title").innerText
        const songArtist = songInfo.querySelector(".aplayer-author").innerText.replace(" - ", "")
        playerData.value = { name: songName || "未知曲目", artist: songArtist || "未知艺术家", }
        initMediaSession(playerData.value?.name, playerData.value?.artist)
    } catch (error) {
        console.error("获取播放信息出错：", error)
    }
}

// 初始化媒体会话控制
const initMediaSession = (title, artist) => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title, artist })
        navigator.mediaSession.setActionHandler("play", () => { player.value?.play() })
        navigator.mediaSession.setActionHandler("pause", () => { player.value?.pause() })
        navigator.mediaSession.setActionHandler("previoustrack", () => { player.value?.skipBack() })
        navigator.mediaSession.setActionHandler("nexttrack", () => { player.value?.skipForward() })
    }
}

watch(() => playerVolume.value, (val) => { player.value?.volume(val, true) })

onMounted(() => { if (playerShow.value && enable) getMusicListData() })
onBeforeUnmount(() => { player.value?.destroy() })
</script>

<style lang="scss" scoped>
.is-fold {
    .player-content {
        :deep(.aplayer-body) {
            width: 65px;

            .aplayer-info {
                display: none !important;
            }

            .fold-toggle {
                transform: rotate(180deg) !important;
                transform-origin: center center;
                display: none;
                width: 30px;
            }

            .aplayer-lrc {
                display: none;
            }
        }
    }
}

.player {
    height: auto;
    margin-top: 12px;
    transition: transform 0.3s;
    cursor: pointer;

    .player-content {
        font-family: var(--main-font-family);
        background-color: transparent;
        box-shadow: 0 8px 16px -4px var(--main-color-bg);

        :deep(.aplayer-body) {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 6px;
            padding-right: 12px;
            background-color: var(--main-card-background);
            border-radius: 50px;
            border: 1px solid var(--main-card-border);
            transition: all 0.3s;
            overflow: hidden;
            margin: 0;

            .fold-toggle {
                z-index: 6;
                display: none;
            }

            // &::after {
            //     content: "播放音乐";
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     display: flex;
            //     align-items: center;
            //     justify-content: center;
            //     width: 100%;
            //     height: 100%;
            //     font-size: 14px;
            //     opacity: 0;
            //     color: var(--main-card-background);
            //     background-color: var(--main-color);
            //     pointer-events: none;
            //     transition: opacity 0.3s;
            //     z-index: 3;
            // }

            .aplayer-pic {
                width: 30px;
                height: 30px;
                min-width: 30px;
                border-radius: 50%;
                margin-right: 8px;
                border: 1px solid var(--main-card-border);
                animation: rotate 20s linear infinite;
                animation-play-state: paused;
                z-index: 2;

                .aplayer-button {
                    opacity: 0;
                }
            }

            .aplayer-info {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: auto;
                margin: 0;
                padding: 0;
                border: none;

                .aplayer-music {
                    margin: 0;
                    padding: 0;
                    height: auto;
                    display: flex;
                    line-height: normal;
                    z-index: 2;

                    @media (max-width: 768px) {
                        .aplayer-title {
                            max-width: 60px !important;
                        }
                    }

                    .aplayer-title {
                        font-size: 12px;
                        line-height: normal;
                        display: inline-block;
                        white-space: nowrap;
                        max-width: 120px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .aplayer-author {
                        display: none;
                    }
                }

                .aplayer-lrc {
                    margin: 0;
                    opacity: 0;
                    margin-left: 6px;
                    width: 0;
                    z-index: 2;
                    transition:
                        width 0.3s,
                        opacity 0.3s;

                    &::before,
                    &::after {
                        display: none;
                    }

                    .aplayer-lrc-contents {
                        p {
                            text-align: center;
                            color: var(--main-card-background);
                            filter: blur(0.8px);
                            transition:
                                filter 0.3s,
                                opacity 0.3s;

                            &.aplayer-lrc-current {
                                filter: blur(0);
                            }
                        }
                    }
                }

                .aplayer-controller {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;

                    .aplayer-time {
                        display: none;
                    }

                    .aplayer-bar-wrap {
                        margin: 0;
                        padding: 0;
                        opacity: 0;
                        transition: opacity 0.3s;

                        .aplayer-bar {
                            height: 100%;
                            background: transparent;

                            .aplayer-loaded {
                                display: none;
                            }

                            .aplayer-played {
                                height: 100%;
                                background: var(--main-color-white) !important;
                                transition: width 0.3s;
                            }
                        }
                    }
                }
            }

            .aplayer-notice,
            .aplayer-miniswitcher {
                display: none;
            }
        }

        :deep(.aplayer-list) {
            display: none;
        }

        &:hover {
            :deep(.aplayer-body) {
                color: var(--main-card-background);
                background-color: var(--main-color);
                border-color: var(--main-color);
                box-shadow: 0 8px 16px -4px var(--main-color-bg);

                &::after {
                    opacity: 1;
                }
            }
        }
    }

    &.playing {
        .player-content {
            width: auto;

            :deep(.aplayer-body) {
                color: var(--main-card-background);
                background-color: var(--main-color);
                border: 1px solid var(--main-color);

                .aplayer-pic {
                    animation-play-state: running;
                    position: relative;

                    .aplayer-button {
                        opacity: 0;
                    }
                }

                .fold-toggle {
                    display: block;

                    .iconfont {
                        color: var(--main-card-background);
                    }
                }

                .aplayer-info {
                    .aplayer-lrc {
                        opacity: 1;
                        width: 200px;
                    }

                    @media (max-width: 768px) {
                        .aplayer-lrc {
                            opacity: 1;
                            width: 150px;
                        }
                    }

                    .aplayer-controller {
                        .aplayer-bar-wrap {
                            opacity: 1;
                        }
                    }
                }
            }

            :deep(.aplayer-list) {
                background-color: transparent;
                display: flex;
                justify-content: center;

                ol {
                    width: 92%;
                    background-color: var(--main-card-background);
                }

                .aplayer-list-light {
                    .aplayer-list-title {
                        color: var(--custom-active-color);
                    }
                }
            }

            &::after {
                opacity: 0;
            }
        }
    }

    &:active {
        transform: scale(0.98);
    }
}
</style>
