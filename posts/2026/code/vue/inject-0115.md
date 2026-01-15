---
icon: vue
date: 2026-01-15
category:
  - 代码
tags:
  - Vue
---

# Vue 依赖注入 inject/provide

在 Vue 应用开发中，组件间通信是一个核心问题。除了常见的 props 传递和事件总线，Vue 还提供了一种强大的依赖注入机制：`inject/provide`。

## 一、基本概念

`inject/provide` 是 Vue 提供的一种组件间通信方式，用于在组件树中传递数据，而无需通过 props 逐层传递。

- **provide**：在父组件中定义要共享的数据
- **inject**：在子组件中接收父组件提供的数据

这种机制类似于 React 的 Context API，但在 Vue 中有其独特的实现和用法。

## 二、基本使用方法

### 1. 选项式 API 中的使用

```vue
<!-- 父组件 -->
<template>
  <div>
    <h1>父组件</h1>
    <ChildComponent />
  </div>
</template>

<script>
export default {
  provide() {
    return {
      message: 'Hello from parent',
      user: {
        name: 'John',
        age: 30
      }
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>子组件</h2>
    <p>{{ message }}</p>
    <p>{{ user.name }}</p>
  </div>
</template>

<script>
export default {
  inject: ['message', 'user']
}
</script>
```

### 2. Composition API 中的使用

```vue
<!-- 父组件 -->
<template>
  <div>
    <h1>父组件</h1>
    <ChildComponent />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 提供静态数据
provide('message', 'Hello from parent')

// 提供响应式数据
const count = ref(0)
provide('count', count)
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>子组件</h2>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <GrandChildComponent />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import GrandChildComponent from './GrandChildComponent.vue'

const message = inject('message')
const count = inject('count')
</script>
```

## 三、高级用法

### 1. 注入默认值

当注入的依赖不存在时，可以提供一个默认值：

```vue
<script setup>
import { inject } from 'vue'

// 基本类型默认值
const message = inject('message', 'Default message')

// 对象类型默认值，使用工厂函数避免重复创建
const config = inject('config', () => ({
  theme: 'light',
  language: 'zh-CN'
}))
</script>
```

### 2. 响应式注入

`provide` 可以传递响应式数据，`inject` 接收后可以直接使用，当数据变化时，注入组件会自动更新：

```vue
<!-- 父组件 -->
<script setup>
import { ref, provide } from 'vue'

const count = ref(0)
provide('count', count)

// 改变 count 的值
setInterval(() => {
  count.value++
}, 1000)
</script>

<!-- 子组件 -->
<template>
  <p>Count: {{ count }}</p> <!-- 会自动更新 -->
</template>

<script setup>
import { inject } from 'vue'

const count = inject('count')
</script>
```

### 3. 注入带有 Symbol 键的依赖

为了避免命名冲突，可以使用 Symbol 作为注入的键：

```javascript
// keys.js
export const messageKey = Symbol('message')
export const countKey = Symbol('count')

// 父组件
import { provide } from 'vue'
import { messageKey, countKey } from './keys.js'

provide(messageKey, 'Hello')
provide(countKey, ref(0))

// 子组件
import { inject } from 'vue'
import { messageKey, countKey } from './keys.js'

const message = inject(messageKey)
const count = inject(countKey)
```

### 4. 注入函数

除了数据，还可以注入函数，实现子组件与父组件的通信：

```vue
<!-- 父组件 -->
<script setup>
import { provide } from 'vue'

const notifyParent = () => {
  console.log('Called from child')
}

provide('notifyParent', notifyParent)
</script>

<!-- 子组件 -->
<script setup>
import { inject } from 'vue'

const notifyParent = inject('notifyParent')

// 调用父组件提供的函数
notifyParent()
</script>
```

## 四、适用场景

1. **深层组件树通信**：当需要在多层嵌套组件间传递数据时，使用 `inject/provide` 可以避免 props 逐层传递的麻烦
2. **插件或库开发**：向组件提供插件功能或配置
3. **主题或配置管理**：在应用中共享主题、语言等全局配置
4. **组件库开发**：在组件库内部传递上下文信息

## 五、实践

1. **明确作用域**：只在必要的组件层级中使用 `provide`，避免全局污染
2. **使用类型系统**：在 TypeScript 中为注入的值添加类型定义
3. **优先使用响应式数据**：确保注入的数据变化时，所有使用该数据的组件都能更新
4. **命名规范**：为注入的键使用清晰、唯一的命名，避免冲突
5. **文档化**：明确记录哪些组件提供了哪些依赖，便于维护

## 六、注意事项

1. **依赖注入不是响应式的**：如果 `provide` 传递的是普通值，修改后不会触发组件更新。需要使用响应式数据（ref、reactive）
2. **注入的顺序问题**：子组件在 `setup` 阶段就会注入依赖，所以父组件必须在子组件渲染前提供依赖
3. **类型安全**：在 JavaScript 中，注入的依赖没有类型检查，需要开发者自己确保类型正确
4. **过度使用的风险**：依赖注入可能导致组件间耦合度增加，降低组件的可复用性

## 七、与其他通信方式的比较

| 通信方式 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| Props/Events | 父子组件通信 | 简单、直观 | 深层嵌套组件间传递复杂 |
| inject/provide | 深层组件树通信 | 避免 props 逐层传递 | 类型安全差，耦合度高 |
| Pinia/Vuex | 全局状态管理 | 集中管理，类型安全 | 增加项目复杂度 |
| Event Bus | 任意组件通信 | 灵活 | 难以追踪，容易导致内存泄漏 |

## 八、总结

`inject/provide` 是 Vue 中一种强大的组件间通信机制，特别适合深层组件树中的数据传递。通过合理使用，可以简化组件间的通信逻辑，提高代码的可维护性。

在实际开发中，我们应该根据具体场景选择合适的通信方式，避免过度使用依赖注入，保持组件的独立性和可复用性。

## 九、扩展阅读

- [Vue 官方文档：依赖注入](https://vuejs.org/guide/components/provide-inject.html)
- [Composition API 中的依赖注入](https://vuejs.org/api/composition-api-dependency-injection.html)
- [TypeScript 与依赖注入](https://vuejs.org/guide/typescript/composition-api.html#dependency-injection)
