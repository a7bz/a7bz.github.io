---
icon: u-disk
date: 2024-11-18
keywords: Ventoy,系统盘,u盘启动盘制作,u盘启动盘
category:
  - 教程
---

# Ventoy 制作 U 盘启动系统盘

[Ventoy](https://www.ventoy.net/cn/index.html) 是一个非常流行的开源工具，用于制作多合一启动 U 盘，与传统启动盘制作工具相比，它具有以下显著优势：

## Ventoy 的主要优势

### **U 盘利用率高**

- Ventoy 将 U 盘分为两个分区，一个用于启动文件，另一个用于正常存储。这意味着 U 盘既能作为启动盘使用，又能用于存储其他数据。

### **支持多种系统**

- Ventoy 支持多种操作系统类型，包括但不限于：
  - Windows（如 WinPE、Windows 安装盘）
  - Linux（各种发行版，如 Ubuntu、CentOS、Kali 等）
  - BSD 系统
  - 各类工具盘（如系统修复工具、硬件诊断工具等）
- 它甚至支持某些特殊的 ISO 格式（如带有特殊引导配置的 ISO 文件）。

### **多 ISO 支持，无需重复写盘**

- Ventoy 允许直接将多个 ISO 文件（操作系统镜像、工具盘等）复制到 U 盘中，无需提取内容或重复格式化 U 盘。
- 在启动时会提供一个菜单，列出所有 ISO 文件，用户可以自由选择启动。

### **免格式化更新**

- 更新 ISO 文件时，只需删除旧的 ISO 并复制新的 ISO 文件，省去了反复格式化 U 盘的麻烦。
- 这使得维护和更新启动盘变得极为简单。

### **兼容性强**

- Ventoy 支持 Legacy BIOS 和 UEFI 双模式启动。
- 支持大于 4GB 的 ISO 文件（无需分卷处理），并能够在 FAT32、exFAT、NTFS、ext4 等文件系统中工作。

### **开放源码和持续更新**

- Ventoy 是完全开源的，用户可以放心使用。
- 开发者活跃，功能更新频繁，新版本不断修复兼容性问题和添加更多功能。

### **支持插件和定制功能**

- 提供插件系统，可以实现高级功能：
  - 自动安装（使用无人值守脚本）
  - 密码保护 ISO
  - 定制启动界面（更改背景、布局等）

### **多语言支持**

- Ventoy 支持多种语言，包括中文，方便全球用户使用。

## Ventoy 下载使用教程

### 下载 Ventoy

打开 [下载页](https://www.ventoy.net/cn/download.html) ，这里建议使用蓝奏云下载

![ventoy下载](/assets/image/2024/other/ventoyInstall-1118/image.png)

### 解压运行

下载后，解压，双击运行

![软件文件夹](/assets/image/2024/other/ventoyInstall-1118/e1e89b29-7bae-4c8f-8b00-0e328f57b4be.png)

![安装](/assets/image/2024/other/ventoyInstall-1118/image1.png)

确认框内是需要安装 Ventoy 的 u 盘

::: warning 提示

注意 `安装` 的时候会将 U 盘格式化

如果需要升级，下载最新版本的 Ventoy，点击 `升级` 即可，`升级` 不会格式化

:::

不需要在配置选项里面修改跟 GPT (选择 MBR 格式能支持 Legacy BIOS 模式，只能选择 MBR 分区格式)

- U 盘安装成功后，Ventoy 会将 U 盘分成两个分区`Ventoy`和`VTOYEFI`
  其中`VTOYEFI`是 EFI 系统分区默认是隐藏的,`Ventoy`就是用于存放 ISO 镜像文件 或者 你其他文件的，这样 U 盘还可以当作工作 U 盘使用。

下载系统镜像文件

然后将下载的镜像文件放入 `Ventoy` 分区，建议新建一个 ISO 文件夹存放镜像文件，与其他文件区分开来

::: details 下载 微 PE 工具箱 (非必要)

![选择iso](/assets/image/2024/other/ventoyInstall-1118/image2.png)

![生成iso](/assets/image/2024/other/ventoyInstall-1118/image3.png)

![生成后](/assets/image/2024/other/ventoyInstall-1118/image4.png)

:::
制作完毕

电脑进 Bios ，设置 u 盘为启动设备，保存重启，即可进入选择镜像的界面
![选择镜像启动](/assets/image/2024/other/ventoyInstall-1118/image8.png)
