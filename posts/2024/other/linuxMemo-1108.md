---
icon: notepad
date: 2024-11-08
category:
  - 笔记
tag:
  - linux
top: 1
---

# 命令备忘录

## ros

### ros 包录制意外中断.bag.active 包修复命令

```bash
rosbag reindex xxx.bag.active
rosbag fix xxx.bag.active output.bag
```

## ubuntu

### ubuntu 网络图标消失,无法上网

```bash
sudo service network-manager stop
sudo rm /var/lib/NetworkManager/NetworkManager.state
sudo service network-manager start
```

## nodejs

### yarn 安装新版本

```bash
corepack enable
corepack use yarn@stable
```
