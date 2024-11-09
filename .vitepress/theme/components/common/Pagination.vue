<template>
  <div v-if="total > 0" class="pagination">
    <div v-if="currentPage > 1" class="page-item prev" @click="
      jumpPage(
        currentPage === 2 ? `${routePath}` : `${routePath}/page/${currentPage - 1}`,
        currentPage === 2 ? 1 : currentPage - 1,
      )">
      <i class="iconfont icon-back" />
      <span class="page-text">上页</span>
    </div>
    <div class="page-number">
      <div v-for="(item, index) in pageNumber" :key="index"
        :class="[item === '...' ? 'point' : 'page-item', { choose: item === currentPage }]"
        @click="jumpPage(item === 1 ? `${routePath}` : `${routePath}/page/${item}`, item)">
        <span class="page-num">{{ item }}</span>
      </div>
      <div :class="['fast-jump', { focus: inputFocus }]" title="快速跳转">
        <input v-model.number="jumpInput" :min="1" :max="totalPage" @focus="inputFocus = true" @blur="fastJump"
          @input="validateInput" @keydown.enter="fastJump" />
        <i :class="['iconfont icon-arrow-right', { click: jumpInput }]" @click.stop="fastJump" />
      </div>
    </div>
    <div v-if="currentPage * limit < total" class="page-item next"
      @click="jumpPage(`${routePath}/page/${currentPage + 1}`, currentPage + 1)">
      <span class="page-text">下页</span>
      <i class="iconfont icon-back" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 5,
  },
  routePath: {
    type: String,
    default: "",
  },
  useParams: {
    type: Boolean,
    default: false,
  },
  wingSize: {
    type: Number,
    default: 1,
  },
})

const jumpInput = ref(null)
const inputFocus = ref(false)

const router = useRouter()
const currentPage = ref(props.page)
const totalPage = computed(() => Math.ceil(props.total / props.limit))

const pageNumber = computed(() => {
  let pages = []
  let startPage = Math.max(currentPage.value - props.wingSize, 2)
  let endPage = Math.min(currentPage.value + props.wingSize, totalPage.value - 1)
  pages.push(1)
  if (startPage > 2)
    pages.push("...")
  else
    startPage = 2
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  if (endPage < totalPage.value - 1)
    pages.push("...")
  else
    if (endPage === totalPage.value - 1) endPage = totalPage.value - 1
  if (totalPage.value > 1) pages.push(totalPage.value)
  return pages
})

const validateInput = () => {
  const numericValue = Number(jumpInput.value)
  if (!Number.isInteger(numericValue) || numericValue < 1) {
    jumpInput.value = null
  } else if (numericValue > totalPage.value) {
    jumpInput.value = totalPage.value
  } else {
    jumpInput.value = numericValue
  }
}

const jumpPage = (url, page) => {
  if (props.useParams) {
    if (page === 1)
      router.go(`${props.routePath}`)
    else
      router.go(`${props.routePath}?page=${page}`)
  } else
    router.go(url)
}

const fastJump = () => {
  inputFocus.value = false
  if (!jumpInput.value) return false
  jumpPage(
    jumpInput.value === 1 ? `${props.routePath}` : `${props.routePath}/page/${jumpInput.value}`,
    jumpInput.value,
  )
}

const checkPage = () => {
  const search = new URLSearchParams(window.location.search)
  const page = search.get("page")
  if (page && props.useParams)
    currentPage.value = Number(page)
}

onMounted(() => {
  checkPage()
})

</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  height: 40px;
  animation: fade-up 0.6s 0.4s backwards;

  .page-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--main-card-background);
    border: 1px solid var(--main-card-border);
    box-shadow: 0 8px 16px -4px var(--main-border-shadow);
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
    cursor: pointer;

    &.prev,
    &.next {
      position: absolute;
      width: 80px;
      left: 0;

      .iconfont {
        transition:
          color 0.3s,
          transform 0.3s;
      }

      .page-text {
        opacity: 0;
        margin-left: 4px;
        margin-right: -36px;
        transition:
          opacity 0.3s,
          margin 0.3s;
      }
    }

    &.next {
      left: auto;
      right: 0;

      .iconfont {
        transform: rotate(180deg);
      }

      .page-text {
        margin-right: 4px;
        margin-left: -36px;
      }
    }

    &:hover {
      border-color: var(--main-color);
      box-shadow: 0 8px 16px -4px var(--main-color-bg);

      .iconfont {
        color: var(--main-color);
      }

      &.prev,
      &.next {
        color: var(--main-color);

        .page-text {
          opacity: 1;
          margin-right: 0;
        }
      }

      &.next {
        .page-text {
          margin-right: 4px;
          margin-left: 0;
        }
      }
    }
  }

  .page-number {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .page-item {
      margin: 0 6px;

      &.choose {
        color: var(--main-card-background);
        border-color: var(--main-color);
        background-color: var(--main-color);
        box-shadow: 0 8px 16px -4px var(--main-color-bg);
      }
    }

    .point {
      margin: 0 4px;
      transform: translateY(-8px);
      font-size: 22px;
    }

    .fast-jump {
      position: relative;
      margin: 0 6px;

      input {
        border: none;
        outline: none;
        background: none;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        padding: 0 8px;
        font-size: 16px;
        color: var(--main-font-color);
        background-color: var(--main-card-background);
        border: 1px solid var(--main-card-border);
        box-shadow: 0 8px 16px -4px var(--main-border-shadow);
        transition: all 0.3s;
      }

      .iconfont {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 5px;
        right: 5px;
        width: 30px;
        height: 30px;
        border-radius: 4px;
        background-color: var(--main-card-background);
        transition:
          color 0.3s,
          opacity 0.3s,
          background-color 0.3s;
        cursor: pointer;

        &:hover {
          color: var(--main-card-background);
          background-color: var(--main-color);
        }
      }

      &.focus,
      &:hover {
        input {
          width: 100px;
          border-color: var(--main-color);
          box-shadow: 0 8px 16px -4px var(--main-color-bg);
        }

        .iconfont {
          opacity: 0.2;
          pointer-events: none;

          &.click {
            opacity: 1;
            pointer-events: all;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .page-number {
      display: none;
    }

    .page-item {
      &:first-child {
        margin-right: 10px;
      }

      &:last-child {
        margin-left: 10px;
      }
    }
  }
}
</style>
