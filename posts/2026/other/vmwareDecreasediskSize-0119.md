# VMware 减小硬盘大小教程

## 准备工作

1. 下载 GParted 的 ISO 文件，官方下载地址：[GParted 官网](https://gparted.org/download.php)

## 操作步骤

2. 关闭虚拟机，设置虚拟机从 CD 启动：
   - 编辑虚拟机设置，在 "硬件" 选项卡中选择 "CD/DVD (SATA)"
   - 选择 "使用 ISO 映像文件"，浏览并选择下载好的 GParted ISO 文件
   - 勾选 "启动时连接" 选项

   ![设置虚拟机从 CD 启动](/assets/image/2026/other/vmwareDecreasediskSize/01-vmware-cd-boot-setting.png)

3. 启动虚拟机，同时连续按下 F2 键进入 BIOS 设置（鼠标需保持在虚拟机窗口内，避免自动切出）

4. 在 BIOS 设置中调整启动顺序：
   - 使用方向键选中 "CD-ROM Drive" 选项
   - 按 + 号键将其移动到启动顺序的顶部
   - 切换到 "Exit" 选项卡，选择 "Exit saving changes" 保存并退出

   ![调整 BIOS 启动顺序](/assets/image/2026/other/vmwareDecreasediskSize/02-bios-boot-order.png)

5. 重新启动虚拟机，进入 GParted 启动界面：

   ![GParted 启动界面](/assets/image/2026/other/vmwareDecreasediskSize/03-gparted-boot-screen.png)

6. 一路按回车键，进入 GParted 系统。如果虚拟机安装时选择的是自动分区，通常只会看到一个分区：

   ![GParted 分区视图](/assets/image/2026/other/vmwareDecreasediskSize/04-gparted-partition-view.png)

7. 调整分区大小：
   - 右键点击分区，选择 "Resize/Move" 选项
   - 在弹出的窗口中，拖动分区右侧的滑块，空出想要释放的空间
   - 确保 "Free space following"（尾部空闲空间）有足够的大小
   - 点击 "Resize/Move" 按钮确认

   ![调整分区大小](/assets/image/2026/other/vmwareDecreasediskSize/05-resize-partition.png)

8. 应用更改：
   - 点击界面上方的绿色勾号按钮，应用所有待处理的操作
   - 等待操作完成后，关闭虚拟机

9. 恢复从硬盘启动：
   - 编辑虚拟机设置，在 "CD/DVD (SATA)" 设置中，取消选择 ISO 映像文件或移除它
   - 这样虚拟机就会从硬盘正常启动

10. 验证系统：
    - 正常启动虚拟机，检查系统是否能正常运行
    - 确认所有数据和应用程序都能正常访问
    - 验证无误后，关闭虚拟机

11. 处理 VMDK 文件：
    - 找到虚拟机所在目录中的 VMDK 文件
    - **重要：备份该 VMDK 文件**，以防操作失误导致数据丢失
    - 使用 VS Code 或其他文本编辑器打开该文件

    ![VMDK 文件位置](/assets/image/2026/other/vmwareDecreasediskSize/06-vmdk-file-location.png)

12. 编辑 VMDK 文件：
    - 在文件中找到类似于 `RW 4194304 SPARSE "虚拟机名称-s001.vmdk"` 的行
    - 从后往前删除一行（删除最后一个这样的条目）
    - 保存文件后，启动虚拟机

    ![VMDK 文件内容](/assets/image/2026/other/vmwareDecreasediskSize/07-vmdk-file-content.png)

13. 验证硬盘大小：
    - 如果虚拟机能够正常启动，说明删除的 VMDK 文件可以安全移除
    - 关闭虚拟机后，可以看到左侧显示的硬盘大小已经变小

    ![最终硬盘大小](/assets/image/2026/other/vmwareDecreasediskSize/08-final-disk-size.png)

14. 重复操作（如需进一步减小）：
    - 如果需要进一步减小硬盘大小，重复步骤 11-13
    - 每次删除一个 VMDK 文件条目，直到达到目标大小

15. 清理文件：
    - 在 Windows 文件资源管理器中，删除对应的 VMDK 子文件（如 `虚拟机名称-s00x.vmdk`）
    - 每个文件通常占用数 GB 空间，删除后即可释放磁盘空间

## 注意事项

- **操作前请务必备份重要数据**，以防分区调整过程中出现意外
- 确保在 GParted 中调整分区大小时，空闲空间位于分区尾部
- 每次编辑 VMDK 文件后，务必测试虚拟机是否能正常启动
- 只删除 VMDK 文件中最后一个条目对应的物理文件，不要删除主 VMDK 文件