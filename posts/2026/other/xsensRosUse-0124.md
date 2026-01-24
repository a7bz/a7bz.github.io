---
icon: imu
date: 2026-01-24
category:
  - 教程
tag:
  - ros
---

# Ubuntu 20.04 下 Xsens IMU 的 ROS 包下载与使用

## 前言

Xsens IMU（惯性测量单元）是一种高精度的传感器设备，广泛应用于机器人、自动驾驶、无人机等领域。本文将详细介绍在 Ubuntu 20.04 系统上下载、安装和使用 Xsens IMU 的 ROS 驱动包的完整步骤，帮助用户快速搭建 Xsens IMU 与 ROS 系统的连接。

## 一、下载 MT 软件套件

### 1.1 访问官方下载页面

Xsens IMU 的 ROS 驱动包包含在 MT 软件套件中，需要从官方网站下载：

下载链接：[`https://www.movella.com/support/software-documentation`](https://www.movella.com/support/software-documentation)

### 1.2 选择 Linux 版本

1. 在官方网站上，找到 MTi 产品系列下的 Linux 版本 MT 软件套件
2. 点击下载按钮，系统会提示填写注册信息
3. 填写完整信息后，根据系统架构选择合适的版本，本文选择 x64 版本

   ![MT 软件套件下载](/assets/image/2026/other/xsensRosUse/msedge_O8cva0k1Wc.png)

   ![选择 x64 版本下载](/assets/image/2026/other/xsensRosUse/msedge_xo9YDGPxE8.png)

## 二、安装 MT 软件套件

### 2.1 解压压缩包

1. 找到下载完成的压缩包
2. 右键点击压缩包，选择 "提取到此处" 或使用命令行解压

   ![解压压缩包](/assets/image/2026/other/xsensRosUse/vmware_Say46MKaFm.png)

   ![打开解压后的文件夹](/assets/image/2026/other/xsensRosUse/vmware_8Xom1v498p.png)

### 2.2 执行安装脚本

1. 进入解压后的文件夹，在文件夹内右键选择 "打开终端"
2. 执行安装脚本（版本号可能不同，可使用 Tab 键自动补全）：

```bash
sudo ./mtsdk_*.run
```

3. 如果出现类似 "sharutils" 缺失的报错，先安装依赖包：

```bash
sudo apt-get update
sudo apt-get install sharutils
```

4. 再次执行安装脚本，安装过程中按下回车确认默认路径即可

   ![执行脚本报错](/assets/image/2026/other/xsensRosUse/vmware_Lt68Jl5yy9.png)

   ![执行安装脚本成功](/assets/image/2026/other/xsensRosUse/vmware_OPJjt0IFmX.png)

## 三、配置 ROS 工作空间

### 3.1 复制 ROS 驱动包

1. 安装成功后，Xsens ROS 驱动包位于 `/usr/local/xsens` 目录下

   ![查看 ROS 驱动包](/assets/image/2026/other/xsensRosUse/vmware_3PN6JIpXo8.png)

2. 创建 ROS 工作空间并将驱动包复制到 src 目录：

```bash
mkdir -p ~/app/ws/imu_ws/src/
cp -r /usr/local/xsens/xsens_ros_mti_driver/ ~/app/ws/imu_ws/src/
```

![ROS 工作空间 src 目录](/assets/image/2026/other/xsensRosUse/vmware_eNEgNsYmNh.png)

### 3.2 编译工作空间

1. 进入工作空间目录
2. 先编译 xspublic 库（Xsens 公共库），再编译整个工作空间：

```bash
cd ~/app/ws/imu_ws
# 编译 xspublic 库
pushd src/xsens_ros_mti_driver/lib/xspublic && make && popd
# 编译整个工作空间
catkin_make
```

> 注意：必须先编译 xspublic 库，否则直接编译工作空间会失败

## 四、配置串口设备

### 4.1 单个 USB 设备配置

如果只有一个 USB 设备连接到电脑，可以直接使用默认串口配置：

1. 连接 Xsens IMU 设备
2. 找到 `xsens_mti_driver` 包中的 yaml 配置文件（通常位于 `config` 目录下）
3. 将 `port` 参数的注释解开，使用默认的 `/dev/ttyUSB0` 即可

   ![配置单个 USB 设备的 port 参数](/assets/image/2026/other/xsensRosUse/vmware_UZFTcfPgs9.png)

### 4.2 多个 USB 设备配置（设置串口别名）

如果有多个 USB 设备，为了避免设备端口号变化导致的问题，建议为 Xsens IMU 设置固定的串口别名：

1. 查看设备的详细信息，获取设备的 `idVendor` 和 `idProduct`：

```bash
sudo udevadm info --attribute-walk --name=/dev/ttyUSB0
```

2. 创建 udev 规则文件，为设备设置别名：

```bash
sudo nano /etc/udev/rules.d/99-xsens-imu.rules
```

3. 在文件中添加以下内容（替换为实际的 idVendor 和 idProduct）：

```bash
SUBSYSTEM=="tty", ATTRS{idVendor}=="2639", ATTRS{idProduct}=="0300", MODE="0666", SYMLINK+="xsens_imu"
```

4. 重新加载 udev 规则并重启服务：

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

5. 验证别名是否设置成功：

```bash
ls -l /dev/xsens_imu
```

![查看串口别名设置](/assets/image/2026/other/xsensRosUse/vmware_yllTj3O3nt.png)

![串口别名设置成功](/assets/image/2026/other/xsensRosUse/vmware_iFFqbKtOoy.png)

6. 修改 yaml 配置文件中的 `port` 参数为 `/dev/xsens_imu`：

   ![修改 port 参数为固定别名](/assets/image/2026/other/xsensRosUse/vmware_JhiUYM745O.png)

   > 更多串口别名设置详情，可参考：[设置权限和串口别名规则](https://blog.a7bz.cn/posts/2024/0622)

## 五、运行 ROS 节点

### 5.1 启动 ROS Master

打开一个新终端，启动 ROS 核心服务：

```bash
roscore
```

### 5.2 启动 IMU 节点

1. 打开一个新终端，进入工作空间目录
2. 加载工作空间环境变量
3. 启动 Xsens IMU 节点：

```bash
cd ~/app/ws/imu_ws

source devel/setup.bash

roslaunch xsens_mti_driver xsens_mti_node.launch
```

![IMU 节点启动成功](/assets/image/2026/other/xsensRosUse/vmware_Kn9zGdYj2v.png)

### 5.3 查看话题列表

打开一个新终端，查看当前 ROS 系统中的话题列表：

```bash
rostopic list
```

可以看到 Xsens IMU 发布的各种话题，如 `/imu/data`、`/imu/mag` 等：

![查看 ROS 话题列表](/assets/image/2026/other/xsensRosUse/vmware_kwlPnolexv.png)

### 5.4 查看 IMU 数据

查看 `/imu/data` 话题的实时数据：

```bash
rostopic echo /imu/data
```

可以看到 IMU 发布的加速度、角速度、姿态等数据：

![查看 IMU 数据](/assets/image/2026/other/xsensRosUse/vmware_JlPwG39hhg.png)

### 5.5 可视化数据（可选）

使用 RViz 可视化 IMU 数据：

```bash
roslaunch xsens_mti_driver xsens_mti_rviz.launch
```

在 RViz 中可以直观地看到 IMU 的姿态变化：

## 六、注意事项

1. **权限问题**：确保用户有访问串口设备的权限，可将用户添加到 dialout 组：

```bash
sudo usermod -a -G dialout $USER
```

2. **固件版本**：确保 Xsens IMU 的固件版本与驱动兼容，可在 Xsens 官方软件中查看和更新固件

3. **串口波特率**：默认波特率为 460800，如需修改，可在 yaml 配置文件中调整

4. **ROS 版本**：本文使用的是 ROS Noetic，其他 ROS 版本可能需要调整编译命令或依赖

## 七、小结

本文详细介绍了在 Ubuntu 20.04 系统上使用 Xsens IMU 的完整流程：

1. 从官方网站下载 MT 软件套件
2. 安装 MT 软件套件及解决依赖问题
3. 配置 ROS 工作空间并编译驱动包
4. 配置串口设备，包括单个设备和多个设备的情况
5. 运行 ROS 节点并查看 IMU 数据
6. 使用 RViz 可视化 IMU 数据

通过以上步骤，用户可以成功搭建 Xsens IMU 与 ROS 系统的连接，获取高精度的惯性测量数据，为后续的机器人开发或其他应用提供基础。

## 参考资料

- [Xsens 官方文档](https://www.movella.com/support/software-documentation)
- [ROS Wiki - xsens_mti_driver](http://wiki.ros.org/xsens_mti_driver)
