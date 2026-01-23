---
icon: tool
date: 2026-01-23
category:
  - 教程
tag:
  - VMware
---

# VMware Tools 安装教程

## 前言

VMware Tools 是 VMware 虚拟机提供的一套实用工具，安装后可以显著提升虚拟机的使用体验。本文将详细介绍在 Ubuntu 系统上安装 VMware Tools 的完整步骤，包括常见问题的解决方法。

## 一、VMware Tools 的作用

- **增强交互体验**：主机与虚拟机之间可自由复制粘贴文本
- **文件共享**：支持主机与虚拟机之间的文件拖拽功能
- **鼠标无缝切换**：鼠标可在虚拟机与主机之间自由移动（无需按 Ctrl+Alt）
- **显示优化**：虚拟机屏幕可实现全屏化，分辨率自动调整

## 二、安装步骤

### 步骤 1：挂载 VMware Tools 安装包

1. 在 VMware 虚拟机菜单栏中点击：**虚拟机** → **重新安装 VMware Tools**

   ![点击重新安装 VMware Tools](/assets/image/2026/other/vmwaretoolsInstall/vmware_fa0D3KIX1J.png)

2. 系统会自动挂载 VMware Tools 安装包，出现如下窗口：

   ![VMware Tools 压缩包位置](/assets/image/2026/other/vmwaretoolsInstall/vmware_wMA0zjAGJW.png)

### 步骤 2：复制并解压安装包

1. 找到压缩包 `VMwareTools-xxxxx.tar.gz`，右键点击复制：

   ![复制 VMware Tools 压缩包](/assets/image/2026/other/vmwaretoolsInstall/vmware_2mxtmBQc7b.png)

2. 在主文件夹或桌面新建一个文件夹，将压缩包粘贴到新建的文件夹中

3. **推荐**：双击压缩包直接解压
   
   或使用终端命令解压（需替换实际文件名）：

   ```bash
   tar -zxvf VMwareTools-xxxxx.tar.gz
   ```

   ![解压 VMware Tools](/assets/image/2026/other/vmwaretoolsInstall/vmware_w1U2ZeNYFg.png)

### 步骤 3：执行安装脚本

1. 打开解压后的文件夹，在文件夹内右键选择**打开终端**：

   ![在解压文件夹中打开终端](/assets/image/2026/other/vmwaretoolsInstall/vmware_3PysbDqZLY.png)

2. 执行 `ls` 命令，确认 `vmware-install.pl` 文件存在：

   ```bash
   ls
   ```

3. 执行安装命令：

   ```bash
   sudo ./vmware-install.pl
   ```

4. 安装过程中会出现多个配置选项，**一路回车**使用默认值即可

   ![执行安装命令](/assets/image/2026/other/vmwaretoolsInstall/vmware_P540giZgDw.png)

## 三、常见问题及解决方案

### 问题：无法找到 ifconfig 命令

#### 错误信息：
```
Setup is unable to find the "ifconfig" program on your machine. Please make sure it is installed. Do you want to specify the location of this program by hand? [yes]

What is the location of the "ifconfig" program on your machine?
```

![ifconfig 命令错误](/assets/image/2026/other/vmwaretoolsInstall/vmware_dbTwsOTDRr.png)

#### 原因：
`ifconfig` 是一个用于查看和配置网络设备的命令行工具，在 Ubuntu 18.04 及之后的版本中，默认不再预装 `ifconfig`，因为它已被 `iproute2` 套件中的 `ip` 命令所取代。

#### 解决方案：
安装包含 `ifconfig` 的 `net-tools` 包：

```bash
sudo apt-get update
sudo apt-get install net-tools
```

![安装 net-tools 包](/assets/image/2026/other/vmwaretoolsInstall/vmware_RsYSxpyPlA.png)

#### 重新安装：
安装完成后，再次执行 VMware Tools 安装命令：

```bash
sudo ./vmware-install.pl
```

一路回车，直到安装完成：

![VMware Tools 安装成功](/assets/image/2026/other/vmwaretoolsInstall/vmware_oOCpcebwEZ.png)

## 四、安装完成

安装成功后，**重启虚拟机**即可享受 VMware Tools 带来的增强功能。

## 五、验证安装

重启后，可以通过以下方式验证 VMware Tools 是否正常工作：

1. 尝试在主机和虚拟机之间复制粘贴文本
2. 尝试拖拽文件到虚拟机中
3. 点击虚拟机窗口最大化按钮，检查是否能全屏显示