---
icon: notepad
date: 2024-11-08
category:
  - 笔记
tag:
  - linux
---

# 命令备忘录

## ros

### 1. .bag.active 包修复命令

```bash
rosbag reindex xxx.bag.active
rosbag fix xxx.bag.active output.bag
```

## ubuntu

### 1.ubuntu 网络图标消失,无法上网

```bash
sudo service network-manager stop
sudo rm /var/lib/NetworkManager/NetworkManager.state
sudo service network-manager start
```
