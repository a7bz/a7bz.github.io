# 个人博客

一个基于 VitePress 构建的现代化个人博客，支持响应式设计、深色模式、文章搜索等功能。

## 示例

你可以访问 [https://blog.a7bz.cn/](https://blog.a7bz.cn/) 查看我的个人博客示例。

## 友链申请

[点击这里](https://blog.a7bz.cn/pages/link) 按提示申请友链


## 技术栈

- **框架**: VitePress
- **前端**: Vue 3
- **状态管理**: Pinia
- **样式**: SCSS
- **评论系统**: Waline
- **播放器**: APlayer
- **构建工具**: Vite

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run docs:dev
```

访问 `http://localhost:2512` 查看博客。

### 构建生产版本

```bash
npm run docs:build
```

### 预览生产版本

```bash
npm run docs:preview
```

## 项目结构

```
.
├── .github/           # GitHub Actions 工作流配置
├── .vitepress/        # VitePress 配置和主题
│   ├── config/        # 配置文件
│   ├── theme/         # 主题自定义
│   └── ...
├── page/              # 分页页面
├── pages/             # 博客页面
├── posts/             # 博客文章
├── public/            # 静态资源
├── index.md           # 首页
└── package.json       # 项目配置
```

## 博客文章

博客文章位于 `posts/` 目录下，按年份和分类组织：

```
posts/
├── 2024/
│   ├── code/
│   └── other/
├── 2025/
└── 2026/
```

### 文章格式

文章使用 Markdown 格式，支持 Front Matter：

```markdown
---
title: 文章标题
date: 2024-01-01
description: 文章描述
tags: [标签1, 标签2]
category: 分类
---

文章内容...
```

## 部署

博客使用 GitHub Actions 自动部署，配置文件位于 `.github/workflows/deploy-docs.yml`。

当推送到主分支时，会自动构建并部署到 GitHub Pages。

## 自定义配置

### 主题配置

主题配置位于 `.vitepress/config/` 目录下，包括：

- 站点信息
- 导航菜单
- 侧边栏
- 插件配置

### 样式自定义

样式文件位于 `.vitepress/theme/styles/` 目录下，可以修改 `main.scss` 来自定义全局样式。

## 功能特性

- ✅ 响应式设计
- ✅ 深色/浅色模式切换
- ✅ 文章搜索
- ✅ 评论系统
- ✅ 文章分类和标签
- ✅ 代码高亮
- ✅ 数学公式支持
- ✅ PWA 支持
- ✅ 音乐播放器
- ✅ 开发模式下的热更新

## 许可证

MIT License
