<template>
    <div class="welcome-box" ref="welcomeBoxRef" @mousemove="parallax" @mouseleave="reset"
        :style="{ transform: `rotateY(${calcY}deg) rotateX(${calcX}deg)` }">
        <transition name="fade-up" appear>
            <span v-if="visible" class="welcome-text">{{ welcomeText }}</span>
        </transition>
        <transition name="fade-up" appear>
            <div v-if="visible" class="info-box" :style="{
                background: `linear-gradient(${angle}deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.5))`,
            }">
                <img @dragstart.prevent src="/logo.png" alt="" class="avatar" />
                <span class="name">{{ name }}</span>
                <div class="motto">{{ mottoText }}</div>
                <div class="author">{{ author }}</div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'

const themeConfig = useData().theme.value
const name = themeConfig.title
const welcomeText = '欢迎'
const multiple = 30
const welcomeBoxRef = ref(null)
const calcY = ref(0), calcX = ref(0), angle = ref(0)
const visible = ref(false)
const mottoText = ref(''), author = ref('')

const parallax = (e) => {
    const box = welcomeBoxRef.value?.getBoundingClientRect()
    if (box) {
        const [x, y] = [e.clientX - box.x - box.width / 2, e.clientY - box.y - box.height / 2]
        calcY.value = x / multiple
        calcX.value = -y / multiple
        angle.value = Math.atan2(x, y) * (180 / Math.PI) + (x < 0 ? 360 : 0)
    }
}

const reset = () => calcX.value = calcY.value = angle.value = 0

fetch("https://v1.hitokoto.cn")
    .then(res => res.json())
    .then(({ from, hitokoto }) => addNextCharacter(hitokoto, from))

const addNextCharacter = (motto, from) => {
    let index = 0
    const typeMotto = () => {
        if (index < motto.length) {
            mottoText.value += motto[index++]
            setTimeout(typeMotto, Math.random() * 150 + 50)
        } else author.value = '-' + from
    }
    typeMotto()
}

onMounted(() => setTimeout(() => visible.value = true, 50))
</script>

<style scoped lang="scss">
:root {
    --blur-val: blur(10px);
    --font-color-grey: #4c5866;
}

.welcome-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 50px 8px;
    z-index: 100;
    transform-style: preserve-3d;
    transition: all 0.2s;
    perspective: 1000px;
}

.fade-up-enter-active {
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.fade-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.welcome-text {
    font-size: 80px;
    font-weight: bold;
    color: white;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    text-align: center;
    margin-bottom: 100px;
    transition: transform 0.5s ease;
    user-select: none;

    &:hover {
        transform: scale(1.05);
    }
}

.info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 60px 40px 35px;
    width: 720px;
    border-radius: 50px;
    border: solid 2px white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: var(--blur-val) saturate(120%);

    .avatar {
        position: absolute;
        top: -25%;
        left: 50%;
        transform: translateX(-50%);
        width: 128px;
        height: 128px;
        border-radius: 50%;
        border: solid 3px white;
        margin-bottom: 20px;
        transition: transform 0.6s ease, box-shadow 0.4s ease;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
        cursor: pointer;

        &:hover {
            transform: translateX(-50%) rotate(1turn) scale(1.1);
            box-shadow: 0 0 7px rgba(0, 0, 0, 0.6);
        }
    }

    .name {
        font-size: 25px;
        margin-bottom: 28px;
        margin-top: 24px;
        font-weight: 900;
    }

    .motto {
        font-size: 19px;
        font-weight: bold;
        animation: color-change 0.8s linear infinite;
        padding-right: 4px;
        margin-bottom: 1px;
        text-align: center;

        @keyframes color-change {
            0%, 40% { --pointerColor: var(--font-color-grey); }
            60%, 100% { --pointerColor: transparent; }
        }
    }

    .author{
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
        width: 200px;
        padding: 0;
    }
}

@media (max-width: 768px) {
    .welcome-text {
        font-size: 45px;
        margin-top: -20px;
    }

    .info-box {
        width: 78vw;
    }

    .name {
        font-size: 22px;
    }

    .motto {
        font-size: 17px;
    }

    ul {
        width: 180px;
    }
}
</style>
