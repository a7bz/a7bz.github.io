---
icon: pinia
date: 2026-01-09
category:
  - 代码
tag:
  - vue
  - pinia
---

# Vue 3 Pinia 状态管理

## 背景

在 Vue 3 开发中，状态管理是一个重要的话题。Pinia 作为 Vue 官方推荐的状态管理库，取代了 Vuex，提供了更简洁的 API、更好的 TypeScript 支持和更灵活的架构。

Pinia 的主要优势包括：

1. **简洁的 API**：摒弃了 Vuex 中的 mutations 和 modules 概念
2. **TypeScript 支持**：天生支持类型推断，无需额外配置
3. **组合式 API**：与 Vue 3 Composition API 完美契合
4. **自动代码分割**：根据使用情况自动拆分状态
5. **DevTools 支持**：提供了良好的开发工具集成

## Pinia 基本概念

### 安装和配置

```bash
# 安装 Pinia
npm install pinia
```

```javascript
// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
```

### 创建 Store

```javascript
// stores/counter.js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    name: "Pinia Counter",
  }),

  getters: {
    doubleCount: (state) => state.count * 2,

    // 带参数的 getter
    customCount: (state) => (multiplier) => state.count * multiplier,
  },

  actions: {
    increment() {
      this.count++;
    },

    async fetchData() {
      // 异步操作
      const response = await fetch("/api/data");
      const data = await response.json();
      this.name = data.name;
    },
  },
});
```

### 在组件中使用

```vue
<template>
  <div>
    <h1>{{ counterStore.name }}</h1>
    <p>Count: {{ counterStore.count }}</p>
    <p>Double Count: {{ counterStore.doubleCount }}</p>
    <p>Custom Count (3x): {{ counterStore.customCount(3) }}</p>
    <button @click="counterStore.increment">Increment</button>
    <button @click="counterStore.fetchData">Fetch Data</button>
  </div>
</template>

<script setup>
import { useCounterStore } from "@/stores/counter";

const counterStore = useCounterStore();
</script>
```

## Pinia 高级特性

### 使用 Composition API 定义 Store

```javascript
// stores/useUserStore.js
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  // 状态
  const user = ref(null);
  const isLoggedIn = ref(false);
  const loading = ref(false);

  // Getters
  const username = computed(() => user.value?.name || "");
  const userInitial = computed(() => username.value.charAt(0).toUpperCase());

  // Actions
  async function login(credentials) {
    loading.value = true;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      user.value = data.user;
      isLoggedIn.value = true;
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    isLoggedIn.value = false;
  }

  // Watchers
  watch(isLoggedIn, (newVal) => {
    console.log("Login status changed:", newVal);
  });

  return {
    user,
    isLoggedIn,
    loading,
    username,
    userInitial,
    login,
    logout,
  };
});
```

### 状态持久化

```javascript
// stores/useThemeStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref(localStorage.getItem("theme") || "light");

  const isDark = computed(() => theme.value === "dark");

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    saveTheme();
  }

  function setTheme(newTheme) {
    theme.value = newTheme;
    saveTheme();
  }

  function saveTheme() {
    localStorage.setItem("theme", theme.value);
    document.documentElement.setAttribute("data-theme", theme.value);
  }

  // 初始化主题
  saveTheme();

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
});
```

### 模块化 Store

```javascript
// stores/index.js
// 导出所有 store
export * from "./counter";
export * from "./user";
export * from "./theme";
export * from "./cart";
```

```vue
<!-- 在组件中统一导入 -->
<script setup>
import { useCounterStore, useUserStore, useThemeStore } from "@/stores";

const counterStore = useCounterStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
</script>
```

## 实践

### 1. 组织 Store 结构

```
stores/
├── index.js            # 导出所有 store
├── counter.js          # 计数器示例
├── user.js             # 用户相关状态
├── theme.js            # 主题设置
├── cart.js             # 购物车状态
└── products.js         # 产品数据
```

### 2. 使用类型安全

```typescript
// stores/user.ts
import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = ref(false);

  async function login(credentials: LoginCredentials): Promise<User> {
    // 类型安全的登录逻辑
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = (await response.json()) as { user: User };
    user.value = data.user;
    isLoggedIn.value = true;
    return data.user;
  }

  return {
    user,
    isLoggedIn,
    login,
  };
});
```

### 3. 合理使用插件

```javascript
// main.js
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),

  // 自动持久化到 localStorage
  persist: true,
});
```

### 4. 状态更新策略

```javascript
// 推荐：使用 actions 更新状态
const cartStore = useCartStore();
cartStore.addItem(product);

// 不推荐：直接修改状态（虽然 Pinia 允许）
cartStore.items.push(product);

// 但是可以使用 $patch 批量更新
cartStore.$patch({
  items: [...cartStore.items, product],
  total: cartStore.total + product.price,
});

// 或者使用函数式 $patch
cartStore.$patch((state) => {
  state.items.push(product);
  state.total += product.price;
});
```

### 5. 处理异步操作

```javascript
// stores/products.js
import { defineStore } from "pinia";

export const useProductsStore = defineStore("products", () => {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchProducts(categoryId = null) {
    loading.value = true;
    error.value = null;

    try {
      let url = "/api/products";
      if (categoryId) {
        url += `?category=${categoryId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      products.value = await response.json();
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching products:", err);
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
});
```

## 实际应用场景

### 1. 购物车管理

```javascript
// stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    discountCode: null,
  }),

  getters: {
    totalItems: (state) => state.items.length,

    subtotal: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    discount: (state) => {
      if (!state.discountCode) return 0;
      // 假设折扣是固定 10%
      return 0.1;
    },

    total: (state) => {
      const subtotal = this.subtotal;
      const discountAmount = subtotal * this.discount;
      return subtotal - discountAmount;
    },

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addItem(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          ...product,
          quantity,
        });
      }
    },

    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          this.removeItem(productId);
        }
      }
    },

    clearCart() {
      this.items = [];
      this.discountCode = null;
    },

    applyDiscount(code) {
      // 验证折扣码
      if (code === "DISCOUNT10") {
        this.discountCode = code;
        return true;
      }
      return false;
    },
  },

  persist: {
    key: "shopping-cart",
    storage: localStorage,
  },
});
```

### 2. 多语言支持

```javascript
// stores/i18n.js
import { defineStore } from "pinia";

export const useI18nStore = defineStore("i18n", {
  state: () => ({
    locale: "en",
    messages: {
      en: {
        welcome: "Welcome",
        goodbye: "Goodbye",
        cart: "Cart",
        checkout: "Checkout",
      },
      zh: {
        welcome: "欢迎",
        goodbye: "再见",
        cart: "购物车",
        checkout: "结账",
      },
      es: {
        welcome: "Bienvenido",
        goodbye: "Adiós",
        cart: "Carrito",
        checkout: "Pagar",
      },
    },
  }),

  getters: {
    t: (state) => (key) => {
      return state.messages[state.locale][key] || key;
    },
  },

  actions: {
    setLocale(locale) {
      this.locale = locale;
      localStorage.setItem("locale", locale);
    },

    loadLocaleMessages(locale, messages) {
      this.messages[locale] = { ...this.messages[locale], ...messages };
    },
  },

  persist: {
    paths: ["locale"],
  },
});
```

```vue
<template>
  <div>
    <h1>{{ i18n.t("welcome") }}</h1>
    <button @click="i18n.setLocale('en')">English</button>
    <button @click="i18n.setLocale('zh')">中文</button>
    <button @click="i18n.setLocale('es')">Español</button>
  </div>
</template>

<script setup>
import { useI18nStore } from "@/stores/i18n";

const i18n = useI18nStore();
</script>
```

## 注意事项

### 1. 避免过度使用 Store

```javascript
// 不推荐：将所有状态都放入 Store
const useAppStore = defineStore("app", {
  state: () => ({
    // 应用级状态 - 推荐
    user: null,
    theme: "light",

    // 组件级状态 - 不推荐，应该放在组件内部
    currentPage: 1,
    showModal: false,
    inputValue: "",
  }),
});
```

### 2. 避免循环依赖

```javascript
// 危险：可能导致循环依赖
// stores/user.js
export const useUserStore = defineStore("user", () => {
  const productStore = useProductStore();
  // ...
});

// stores/product.js
export const useProductStore = defineStore("product", () => {
  const userStore = useUserStore();
  // ...
});

// 推荐：在组件中使用多个 store
// component.vue
const userStore = useUserStore();
const productStore = useProductStore();
```

### 3. 合理使用持久化

```javascript
// 推荐：只持久化必要的数据
persist: {
  paths: ["user", "theme", "cart.items"];
}

// 不推荐：持久化所有数据
persist: true;
```

### 4. 测试 Store

```javascript
// tests/stores/counter.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCounterStore } from "@/stores/counter";

describe("Counter Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with correct values", () => {
    const counterStore = useCounterStore();
    expect(counterStore.count).toBe(0);
    expect(counterStore.name).toBe("Pinia Counter");
  });

  it("should increment count", () => {
    const counterStore = useCounterStore();
    counterStore.increment();
    expect(counterStore.count).toBe(1);
  });

  it("should calculate doubleCount correctly", () => {
    const counterStore = useCounterStore();
    counterStore.count = 5;
    expect(counterStore.doubleCount).toBe(10);
  });
});
```

## 性能优化

### 1. 使用 `storeToRefs` 避免不必要的重渲染

```vue
<script setup>
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

// 推荐：使用 storeToRefs 获取响应式引用
const { user, isLoggedIn } = storeToRefs(userStore);

// 不推荐：直接解构会失去响应式
// const { user, isLoggedIn } = userStore
</script>
```

### 2. 合理使用计算属性缓存

```javascript
export const useProductStore = defineStore("product", {
  getters: {
    // 计算属性会自动缓存
    expensiveComputation: (state) => {
      console.log("Computing expensive value...");
      return state.items.reduce((total, item) => {
        // 模拟昂贵计算
        for (let i = 0; i < 10000; i++) {
          Math.sqrt(i);
        }
        return total + item.price;
      }, 0);
    },
  },
});
```

### 3. 使用 `$subscribe` 监听状态变化

```javascript
const cartStore = useCartStore();

// 监听状态变化
cartStore.$subscribe((mutation, state) => {
  console.log("Cart state changed:", mutation.type, state);

  // 可以在这里发送分析事件
  // analytics.track('cart_updated', {
  //   items: state.items.length
  // })
});
```

## 与其他状态管理方案的对比

| 特性            | Pinia             | Vuex 4                       | Redux           |
| --------------- | ----------------- | ---------------------------- | --------------- |
| TypeScript 支持 | ✅ 天生支持       | ⚠️ 需要额外配置              | ⚠️ 需要类型定义 |
| API 简洁度      | ✅ 简洁直观       | ⚠️ 复杂（mutations/actions） | ⚠️ 非常复杂     |
| 组合式 API 支持 | ✅ 完美支持       | ⚠️ 有限支持                  | ❌ 不支持       |
| 自动代码分割    | ✅ 支持           | ❌ 不支持                    | ❌ 不支持       |
| DevTools 支持   | ✅ 支持           | ✅ 支持                      | ✅ 支持         |
| 插件系统        | ✅ 灵活的插件系统 | ⚠️ 有限的插件系统            | ✅ 支持中间件   |
| 学习曲线        | ✅ 平缓           | ⚠️ 中等                      | ⚠️ 陡峭         |

## 总结

Pinia 是 Vue 3 中状态管理的最佳选择，它提供了简洁的 API、良好的 TypeScript 支持和灵活的架构。通过遵循本文介绍的实践，你可以：

1. 组织清晰的 Store 结构
2. 编写类型安全的状态管理代码
3. 合理使用插件和持久化
4. 优化性能，避免不必要的重渲染
5. 编写可测试的状态管理逻辑

Pinia 的设计理念与 Vue 3 保持一致，拥抱 Composition API，让状态管理变得更加简单和直观。无论是小型应用还是大型项目，Pinia 都能提供可靠的状态管理解决方案。

## 参考资料

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 与 Vuex 对比](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)

Pinia 正在成为 Vue 生态系统中状态管理的标准，掌握它将有助于你构建更高效、更可维护的 Vue 应用。
