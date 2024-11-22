---
icon: windows-utils
date: 2024-11-22
category:
  - 代码
tag:
  - electron
---

# Electron 窗口管理工具封装

在开发 Electron 应用时，管理窗口和与渲染进程通信是核心功能。为了让代码更模块化和易维护，我们可以封装一个工具对象来处理常用功能。

## 功能概述

我们的工具对象包含以下两项核心功能：

1. **发送消息给渲染进程**：通过指定的通道名称向聚焦的窗口发送消息。
2. **创建新窗口**：动态创建带有特定配置的新窗口，并加载指定的页面。

## 代码实现详解

### 1. 环境区分与路径配置

为了适配开发和生产环境，我们动态生成窗口加载的 URL。在开发环境中，使用开发服务器的地址；而在生产环境中，则加载本地文件。

```javascript
const winURL =
  process.env.NODE_ENV === "development"
    ? process.env["ELECTRON_RENDERER_URL"]
    : `file://${baseDir}renderer/index.html`;
```

### 2. 默认窗口配置

`defaultOption` 定义了窗口的默认行为，例如隐藏菜单栏、启用预加载脚本等。

```javascript
const defaultOption = {
  autoHideMenuBar: true,
  webPreferences: {
    preload: join(__dirname, "../preload/index.js"),
    nodeIntegration: true,
    contextIsolation: false,
  },
};
```

### 3. 发送消息功能

`sendRenderer` 方法获取当前应用的第一个窗口，并通过 `webContents.send` 方法发送消息到渲染进程。注意，确保至少有一个窗口打开。

```javascript
sendRenderer: (channel, ...args) => {
  const focusedWin = BrowserWindow.getAllWindows()[0];
  if (focusedWin) {
    focusedWin.webContents.send(channel, ...args);
  }
};
```

### 4. 创建窗口功能

`createWindow` 方法接收自定义配置参数并与默认配置合并，随后创建窗口实例。每个窗口会加载特定页面，方便实现多路由多窗口的功能。

```javascript
createWindow: (args) => {
  const allOption = { ...defaultOption, ...args };
  const newWin = new BrowserWindow(allOption);
  newWin.loadURL(winURL + "#" + args.url);
};
```

### 5. 完整代码

```javascript
import { BrowserWindow } from "electron";
const { join } = require("path");

let baseDir = join(__dirname, "../");

// 根据开发或生产环境设置窗口加载的 URL
const winURL =
  process.env.NODE_ENV === "development"
    ? process.env["ELECTRON_RENDERER_URL"]
    : `file://${baseDir}renderer/index.html`;

// 默认的窗口选项
const defaultOption = {
  autoHideMenuBar: true, // 自动隐藏菜单栏
  webPreferences: {
    preload: join(__dirname, "../preload/index.js"), // 指定预加载脚本
    nodeIntegration: true, // 允许使用 Node.js 的 API
    contextIsolation: false, // 是否隔离上下文（为兼容旧项目关闭）
  },
};

// 工具对象封装窗口管理功能
export const tool = {
  /**
   * 向当前聚焦的渲染进程发送消息
   * @param {String} channel - 通信的通道名称
   * @param  {...any} args - 附带的消息参数
   */
  sendRenderer: (channel, ...args) => {
    const focusedWin = BrowserWindow.getAllWindows()[0]; // 获取当前所有窗口，取第一个窗口作为目标
    if (focusedWin) {
      focusedWin.webContents.send(channel, ...args); // 通过通道向渲染进程发送消息
    }
  },

  /**
   * 创建一个新窗口
   * @param {Object} args - 窗口自定义选项
   * @property {String} url - 渲染页面对应的路由 URL 片段
   */
  createWindow: (args) => {
    const allOption = { ...defaultOption, ...args }; // 合并默认选项和自定义选项
    const newWin = new BrowserWindow(allOption); // 创建窗口实例
    newWin.loadURL(winURL + "#" + args.url); // 加载指定的页面
  },
};
```

## 使用示例

假设我们需要从主进程向渲染进程发送一个通知消息，并创建一个新的设置窗口：

```javascript
import { tool } from "./tool";

// 发送通知消息
tool.sendRenderer("notify", "Hello, Renderer!");

// 创建设置窗口
tool.createWindow({
  width: 800,
  height: 600,
  url: "settings",
});
```

通过封装一个工具对象，我们可以简化对窗口和消息的管理，使代码更加清晰易读，适合小型或中型项目的开发。如果你的应用有更复杂的窗口需求，可以在此基础上进一步扩展功能，例如窗口生命周期管理或窗口间通信。
