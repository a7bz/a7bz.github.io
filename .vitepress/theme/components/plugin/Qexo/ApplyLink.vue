<template>
    <div class="form-container s-card">
        <form @submit.prevent="handleSubmit">
            <div class="form-item">
                <label for="name">名称:</label>
                <input id="name" v-model="form.name" required placeholder="请输入名称" />
                <span v-if="errors.name">{{ errors.name }}</span>
            </div>
            <div class="form-item">
                <label for="url">链接:</label>
                <input id="url" v-model="form.url" type="url" required placeholder="请输入有效的URL" />
                <span v-if="errors.url">{{ errors.url }}</span>
            </div>
            <div class="form-item">
                <label for="image">图片URL:</label>
                <input id="image" v-model="form.image" type="url" required placeholder="请输入图片URL" />
                <span v-if="errors.image">{{ errors.image }}</span>
            </div>
            <div class="form-item">
                <label for="description">描述:</label>
                <textarea id="description" v-model="form.description" required placeholder="请输入描述"></textarea>
                <span v-if="errors.description">{{ errors.description }}</span>
            </div>
            <div style="display: flex;justify-content: center">
                <button type="submit" class="submit-btn">提交</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()

const form = reactive({
    name: '',
    url: '',
    image: '',
    description: ''
})

const errors = reactive({
    name: '',
    url: '',
    image: '',
    description: ''
})

function validate() {
    let isValid = true
    errors.name = form.name ? '' : '名称不能为空'
    errors.url = form.url ? '' : '请输入有效的URL'
    errors.image = form.image ? '' : '请输入有效的图片URL'
    errors.description = form.description ? '' : '描述不能为空'
    for (const key in errors) {
        if (errors[key]) isValid = false
    }
    return isValid
}

async function handleSubmit() {
    if (validate()) {
        const formdata = new FormData()
        formdata.append("name", form.name)
        formdata.append("url", form.url)
        formdata.append("image", form.image)
        formdata.append("description", form.description)
        const res = await fetch(theme.value?.blog?.qexo + "/pub/ask_friend", {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        })
        if (res.ok) {
            console.log(res)
            const result = await res.json()
            console.log(result)
            alert(result.msg)
            form.name = ''
            form.url = ''
            form.image = ''
            form.description = ''
        } else {
            alert('提交失败，请重试。')
        }
    }
}
</script>

<style lang="scss" scoped>
.form-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 16px;
    background-color: var(--main-card-background);
    border: 1px solid var(--main-card-border);
    box-shadow: 0 8px 16px -4px var(--main-border-shadow);
    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.form-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

label {
    width: 5rem;
    display: block;
    margin-right: 15px;
    font-weight: bold;
    color: var(--main-font-color);
}

input,
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--main-card-border);
    border-radius: 8px;
    background-color: var(--main-site-background);
    color: var(--main-font-color);
    box-shadow: inset 0 1px 3px var(--main-border-shadow);
    transition: border-color 0.3s ease, background-color 0.3s ease;
    outline: none;
}

input:focus,
textarea:focus {
    border-color: var(--main-color);
    background-color: var(--main-color-bg);
}

span {
    color: var(--main-error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.submit-btn {
    width: 35%;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    background-color: var(--main-color);
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: --main-color;
}
</style>
