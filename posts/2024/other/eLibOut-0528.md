---
icon: error-fill
date: 2024-05-28
category:
  - 问题解决
---

# 易语言支持库配置无法打开闪退问题

在安装[**易 IDE 视觉库**](https://bbs.125.la/forum.php?mod=viewthread&tid=14672340&highlight=%E7%BE%8E%E5%8C%96)时，需要打开易语言的支持库配置，启用该支持库

发现点击支持库配置后，易语言直接闪退了

![易语言主界面](/assets/image/2024/other/eLibOut-0528/e_s9T2hJOgNJ.png)

解决方案

给 e.exe 添加保护

右键-此电脑-属性

![此电脑-属性](/assets/image/2024/other/eLibOut-0528/explorer_DR95nMkJoQ.png)

点击系统保护

![系统保护](/assets/image/2024/other/eLibOut-0528/ApplicationFrameHost.png)

选择 高级-性能-设置

![高级-性能-设置](/assets/image/2024/other/eLibOut-0528/SystemPropertiesProtection.png)

数据执行保护-添加

![数据执行保护-添加](/assets/image/2024/other/eLibOut-0528/SystemPropertiesProtection.png)

找到易语言安装目录的 e.exe 添加好

点击应用

再次尝试打开 易语言支持库配置 ，即可正常打开

需要启用易视觉库的话勾选后 点击确定 重启易语言即可

![易视觉库效果](/assets/image/2024/other/eLibOut-0528/e_CzgfxKlDHU.png)
