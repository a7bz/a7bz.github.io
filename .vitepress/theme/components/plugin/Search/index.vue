<template>
    <div class="main-search">
        <VPNavBarSearch ref="searchRef" class="search" />
    </div>
</template>

<script setup>
import VPNavBarSearch from 'vitepress/dist/client/theme-default/components/VPNavBarSearch.vue'
</script>

<style lang="scss">
.back-button {
    border: 0;
    background-color: transparent;
}

@media (max-width: 767px) {
    .shell {
        margin-top: 50px !important;
    }
}

.titles mark,
.excerpt mark {
    background-color: var(--vp-local-search-highlight-bg);
    color: var(--vp-local-search-highlight-text);
    border-radius: 2px;
    padding: 0 2px;
}

.results {
    list-style: none;
    padding: 0;
    margin: 0;

    // 文章内容样式

    // 标题
    div> {
        h1 {
            font-size: 2rem;
            text-align: center;
            border-bottom: 1px dashed var(--main-color-bg);
            padding-bottom: 1rem;

            .header-anchor {
                &::before {
                    display: none;
                }
            }
        }

        h2 {
            font-size: 1.6rem;
            line-height: 1.6;
            border-bottom: 1px dashed var(--main-color-bg);
            padding-bottom: 0.5rem;
        }

        h3 {
            width: fit-content;
            font-size: 1.2rem;
            z-index: 0;

            &::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 8px;
                border-radius: 3px;
                background-color: var(--main-card-border);
                z-index: -1;
            }
        }

        h1,
        h2,
        h3,
        h4 {
            position: relative;
            cursor: pointer;
        }
    }

    .header-anchor {
        position: absolute;
        left: 0;
        opacity: 0;
        transition: opacity 0.3s;

        &::before {
            content: "#";
            position: absolute;
            left: -1.3rem;
            color: var(--main-color);
            font-weight: bold;
        }
    }

    // 文本
    p {
        font-size: 1.1rem;
    }

    p,
    ul,
    li,
    td {
        text-align: left;
        letter-spacing: 0.6px;
        line-height: 2;

        // 行内代码
        code {
            display: inline-flex;
            font-size: 0.8rem;
            padding: 0 6px;
            border-radius: 6px;
            background-color: var(--main-card-border);
            font-family: "Fira Code", var(--main-font-family), monospace;
            font-optical-sizing: auto;
            white-space: nowrap;
            transform: translateY(-2px);
            overflow-x: auto;
            max-width: 100%;
            transition:
                color 0.3s,
                background-color 0.3s;
            cursor: pointer;
        }

        // 超链接
        a {
            position: relative;
            display: inline-flex;
            color: var(--main-color);
            word-break: break-all;
        }

        // 重点
        strong {
            color: var(--main-color);
        }
    }

    // 图片
    img {
        width: 100%;
        border-radius: 12px;
    }

    .img-fancybox {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: var(--main-font-color);

        .post-img {
            width: auto;
            max-height: 450px;
            max-width: 100%;
            margin: 0 auto;
            border-radius: 12px;
            cursor: zoom-in;
            transition:
                opacity 0.3s,
                filter 0.3s;
        }

        .post-img-tip {
            display: inline-flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            margin: 0.8rem 0;
            font-size: 14px;
            opacity: 0.6;
        }

        &::before {
            display: none;
        }

    }

    // 代码块
    div {
        &[class*="language-"] {
            position: relative;
            display: flex;
            flex-direction: row-reverse;
            border-radius: 12px;
            background-color: var(--main-card-background);
            border: 1px solid var(--main-card-border);
            padding-top: 36px;
            margin: 1rem 0;
            overflow: hidden;

            .copy,
            .lang {
                position: absolute;
            }

            .lang {
                width: 100%;
                height: 36px;
                top: 0;
                left: 0;
                display: flex;
                flex-direction: row;
                align-items: center;
                background-color: var(--main-card-second-background);
                border-bottom: 1px solid var(--main-card-border);
                padding-left: 16px;
                font-weight: bold;
                font-size: 18px;
            }

            .copy {
                top: 0;
                right: 0;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                border: none;
                font-family: "iconfont";
                font-size: 20px;
                font-style: normal;
                z-index: 1;
                color: var(--main-font-color);
                cursor: pointer;

                &::after {
                    content: "\e83d";
                    transition: color 0.3s;
                }

                &::before {
                    content: "复制成功";
                    position: absolute;
                    left: -60px;
                    font-size: 14px;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateX(5px);
                    transition:
                        color 0.3s,
                        opacity 0.3s,
                        transform 0.3s;
                }

                &.copied {
                    &::before {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            }

            .line-numbers-wrapper {
                padding: 6px 10px;
                opacity: 0.6;
                text-align: center;
                user-select: none;
                color: var(--main-font-second-color);
                background-color: var(--main-card-second-background);

                .line-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 22px;
                    font-size: 14px;
                }

                br {
                    display: none;
                }
            }

            pre {
                margin: 0;
                padding: 6px 10px;
                width: 100%;
                overflow-y: auto;
                user-select: text;
                border-left: 1px solid var(--main-card-border);

                code {
                    font-family: "Fira Code", var(--main-font-family), monospace;
                    font-optical-sizing: auto;

                    .line {
                        display: inline-block;
                        height: 22px;

                        span {
                            color: var(--shiki-light);
                            transition: color 0.3s;
                        }

                        &.highlighted {
                            width: 100%;
                            background-color: var(--main-card-border);
                            border-radius: 6px;
                        }

                        &:empty {
                            height: 17px;
                        }
                    }
                }
            }
        }
    }

    pre {
        width: 100%;
        overflow-y: auto;
        user-select: text;
    }

    // blockquote
    blockquote {
        padding: 2px 16px;
        margin: 1rem 0;
        color: var(--main-font-color);
        text-align: left;
        border: 1px solid var(--main-card-border);
        border-left: 8px solid var(--main-card-border);
        background-color: var(--main-card-second-background);
        border-radius: 4px 8px 8px 4px;

        p {
            margin: 0.5rem 0;
        }
    }

    // 标点
    ul {
        list-style-type: none;
        padding-left: 1rem;

        li {
            position: relative;
            padding-left: 1.2rem;
            margin: 0.6rem 0;
            overflow: auto;

            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0.3rem;
                width: 0.6rem;
                height: 0.6rem;
                background-color: var(--main-color);
                border-radius: 50%;
            }

            p {
                &:first-child {
                    margin-top: 0;
                }

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    ol {
        padding-left: 2rem;

        li {
            &::marker {
                color: var(--main-color);
                font-weight: bold;
            }
        }
    }

    // 表格
    .table-container {
        width: 100%;
        margin: 1rem 0;
        border: 1px solid var(--main-card-border);
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: auto;

        table {
            width: 100%;
            min-width: 512px;
            max-width: 1200px;
            margin: 0 auto;
            border-collapse: collapse;
            border-spacing: 0;

            td,
            th {
                margin: 0;
                padding: 0.6rem 1rem;
                line-height: normal;
                letter-spacing: normal;
                vertical-align: middle;
                border: 1px solid var(--main-card-border);
            }

            thead {
                background-color: var(--main-card-second-background);
            }

            tbody {
                tr {
                    transition: background-color 0.3s;
                    cursor: pointer;
                }
            }
        }
    }

    // 分割线
    hr {
        margin: 1rem 0;
        height: 2px;
        border: none;
        background-color: var(--main-card-border);
    }

    // 其他
    label {
        cursor: pointer;
    }

    // mathjax
    mjx-container {
        overflow: auto;
        padding-bottom: 8px;
        font-family: auto;
    }

    // custom-block
    .custom-block {
        margin: 1rem 0;
        padding: 16px;
        padding-left: 12px;
        border-radius: 8px;
        background-color: var(--main-card-border);
        border-left: 6px solid var(--main-color-gray);
        user-select: none;

        p {
            margin: 0;
            line-height: normal;
            font-size: 0.95rem;

            &.custom-block-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 6px;
            }
        }

        &.tip {
            background-color: var(--main-info-color-gray);
            border-left-color: var(--main-info-color);

            p {
                color: var(--main-info-color);
            }
        }

        &.warning {
            background-color: var(--main-warning-color-gray);
            border-left-color: var(--main-warning-color);

            p {
                color: var(--main-warning-color);
            }
        }

        &.danger {
            background-color: var(--main-error-color-gray);
            border-left-color: var(--main-error-color);

            p {
                color: var(--main-error-color);
            }
        }

        // details
        &.details {
            border: none;
            padding: 0;
            background-color: transparent;
            transition: max-height 0.4s ease-in-out;
            overflow: hidden;

            summary {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 16px;
                border-radius: 12px;
                font-weight: bold;
                border: 1px solid var(--main-card-border);
                background-color: var(--main-card-second-background);
                transition:
                    color 0.3s,
                    border-color 0.3s,
                    background-color 0.3s;
                cursor: pointer;

                &::before {
                    content: "\e057";
                    font-family: "iconfont";
                    margin-right: 6px;
                    font-size: 18px;
                    transition: transform 0.3s;
                }

                &::after {
                    content: "+";
                    margin-left: auto;
                }
            }

            > :last-child {
                padding: 16px;
                font-size: 1rem;
                border-radius: 0 0 12px 12px;
                border: 1px solid var(--main-card-border);
                background-color: var(--main-card-background);
                border-top: none;
            }

            &[open] {
                summary {
                    border-radius: 12px 12px 0 0;
                    border-color: var(--main-color);
                    color: var(--main-card-background);
                    background-color: var(--main-color);

                    &::before {
                        transform: rotate(90deg);
                    }

                    &::after {
                        content: "-";
                    }
                }

                > :last-child {
                    border-color: var(--main-color);
                }
            }

        }
    }

    // plugin-tabs
    .plugin-tabs {
        margin: 1rem 0;
        border-radius: 12px;
        background-color: var(--main-card-background);
        border: 1px solid var(--main-card-border);
        overflow: hidden;

        .plugin-tabs--tab-list {
            padding: 0 12px;
            background-color: var(--main-card-second-background);
            border-bottom: 1px solid var(--main-card-border);

            .plugin-tabs--tab {
                padding: 12px 16px;
                margin-right: 12px;
                outline: none;
                border: none;
                line-height: normal;
                font-size: 16px;
                font-weight: bold;
                font-family: var(--main-font-family);
                background-color: transparent;
                border-bottom: 2px solid transparent;
                transition: all 0.3s;
                cursor: pointer;

                &[aria-selected="true"] {
                    color: var(--main-color);
                    border-bottom-color: var(--main-color);
                }
            }
        }

        .plugin-tabs--content {
            padding: 1rem;
            max-height: 500px;
            overflow: auto;
            animation: show 0.5s forwards;
        }
    }

    // timeline
    .timeline {
        position: relative;
        padding: 0 0 1rem 26px;
        cursor: pointer;

        .timeline-title {
            display: inline-block;
            font-size: 14px;
            opacity: 0.6;
            transform: translateY(-2px);
            transition:
                color 0.3s,
                opacity 0.3s;
        }

        .timeline-content {
            margin-top: 12px;
            border-radius: 2px 12px 12px 12px;
            padding: 1rem;
            max-width: 80%;
            width: max-content;
            border: 1px solid var(--main-card-border);
            background-color: var(--main-card-second-background);

            > :first-child {
                margin-top: 0;
            }

            > :last-child {
                margin-bottom: 0;
            }
        }

        &::after {
            content: "";
            position: absolute;
            top: 7px;
            left: 7px;
            width: 4px;
            height: 100%;
            border-radius: 4px;
            background-color: var(--main-card-border);
            z-index: 0;
        }

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid var(--main-color);
            background-color: var(--main-card-background);
            transition: transform 0.3s;
            z-index: 1;
        }

    }

    // radio
    .radio {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 1rem 0;

        .radio-point {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1rem;
            height: 1rem;
            margin: 0;
            margin-right: 12px;
            outline: 2px solid var(--main-color);
            border-radius: 50%;

            &::after {
                content: "";
                opacity: 0;
                position: absolute;
                width: 65%;
                height: 65%;
                background-color: var(--main-color);
                border-radius: 50%;
            }

            &.checked {
                &::after {
                    opacity: 1;
                }
            }
        }

        p {
            margin: 0;
        }
    }

    // card
    .card {
        padding: 1rem 1.2rem;
        border-radius: 8px;
        border: 1px solid var(--main-card-border);
        background-color: var(--main-card-second-background);
        box-shadow: 0 8px 16px -4px var(--main-border-shadow);

        p {
            &:first-child {
                margin-top: 0;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    // button
    .button {
        outline: none;
        border-radius: 8px;
        padding: 6px 16px;
        border: 1px solid var(--main-card-border);
        background-color: var(--main-card-second-background);
        transition: background-color 0.3s;
        cursor: pointer;

        p,
        a {
            padding: 0;
            margin: 0;
            font-size: 1rem;
            color: var(--main-font-color);

            &::before {
                display: none;
            }
        }

        &.primary {
            color: var(--main-card-background);
            background-color: var(--main-color);
        }
    }
}


.clear-button,
.toggle-layout-button {
    background-color: transparent;
    border: 0;
}

.search-input {
    border: none;
    outline: none;
}

:root {
    --vp-local-search-result-border: #e2e2e3;
    --vp-local-search-result-selected-border: #3451b2;
    --vp-local-search-result-selected-bg: #ffffff;
    --vp-c-bg-alt: #f6f6f7;
    --vp-c-brand-1: #3451b2;
    --docsearch-primary-color: #3451b2;
    --vp-c-text-1: rgba(60, 60, 67);
    --vp-c-text-2: rgba(60, 60, 67, .78);
    --vp-c-bg-soft: #f6f6f7;
    --vp-c-bg: #ffffff;
    --vp-c-divider: #e2e2e3;
    --vp-local-search-bg: #ffffff;
    --vp-local-search-highlight-bg: #3451b2;
    --vp-local-search-highlight-text: #ffffff;
    --vp-backdrop-bg-color: rgba(0, 0, 0, .6);
}


[class^='vpi-'],
[class*=' vpi-'],
.vp-icon {
    width: 1em;
    height: 1em;
}

[class^='vpi-'].bg,
[class*=' vpi-'].bg,
.vp-icon.bg {
    background-size: 100% 100%;
    background-color: transparent;
}

[class^='vpi-']:not(.bg),
[class*=' vpi-']:not(.bg),
.vp-icon:not(.bg) {
    -webkit-mask: var(--icon) no-repeat;
    mask: var(--icon) no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    background-color: currentColor;
    color: inherit;
}

.vp-icon {
    width: 1em;
    height: 1em;
}

.vpi-corner-down-left {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m9 10-5 5 5 5'/%3E%3Cpath d='M20 4v7a4 4 0 0 1-4 4H4'/%3E%3C/svg%3E");
}

.vpi-search {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
}

.vpi-layout-list {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Crect width='7' height='7' x='3' y='3' rx='1'/%3E%3Crect width='7' height='7' x='3' y='14' rx='1'/%3E%3Cpath d='M14 4h7M14 9h7M14 15h7M14 20h7'/%3E%3C/svg%3E");
}

.vpi-delete {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM18 9l-6 6M12 9l6 6'/%3E%3C/svg%3E");
}

.vpi-arrow-right,
.vpi-arrow-down,
.vpi-arrow-left,
.vpi-arrow-up {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M5 12h14M12 5l7 7-7 7'/%3E%3C/svg%3E");
}

.vpi-chevron-right,
.vpi-chevron-down,
.vpi-chevron-left,
.vpi-chevron-up {
    --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E");
}

.vpi-chevron-down,
.vpi-arrow-down {
    transform: rotate(90deg);
}

.vpi-chevron-left,
.vpi-arrow-left {
    transform: rotate(180deg);
}

.vpi-chevron-up,
.vpi-arrow-up {
    transform: rotate(-90deg);
}
</style>
