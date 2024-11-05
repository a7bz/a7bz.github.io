---
icon: driverless
date: 2024-09-14
category:
  - ros
---

# ros 图像传输-web_video_server 的使用

在 ROS Noetic 环境下使用`web_video_server`将摄像头采集到的图像通过局域网传输给其他设备查看。

**环境：ubuntu20.04+ros-noetic 环境**

**项目连接：**

[https://github.com/RobotWebTools/web_video_server](https://github.com/RobotWebTools/web_video_server)

### 工作空间与源码准备

1. **创建工作空间目录`wvs_ws`和源码目录`src`**

```bash
mkdir -p wvs_ws/src
```

2. **进入源码目录并克隆`web_video_server`源码**

```bash
cd wvs_ws/src

git clone https://github.com/RobotWebTools/web_video_server.git
```

3. **返回工作空间目录并编译**

```bash
cd ../

catkin_make
```

### 配置 Launch 文件

1. **进入`web_video_server`目录**

```bash
cd src/web_video_server
```

2. **创建`launch`目录及`web_video_server.launch`文件**

```bash
mkdir launch
touch web_video_server.launch
```

3. **编辑`launch`文件**

```xml
<launch>
    <node pkg="web_video_server" type="web_video_server"
        name="web_video_server" output="screen">
        <param name="port" type="int" value="7653" />
        <param name="address" type="string" value="0.0.0.0" />
        <param name="server_threads" type="int" value="1" />
        <param name="ros_threads" type="string" value="2" />
        <param name="width" type="int" value="1280" />
        <param name="height" type="int" value="1080" />
        <param name="quality" type="int" value="90" />
    </node>
</launch>
```

::: tip 参数说明

- `port`: 服务器监听的端口，默认设置为 7653，可以根据需要更改。
- `address`: 服务器绑定的 IP 地址，0.0.0.0 表示绑定所有网络接口，适用于局域网中的其他设备访问。
- `server_threads`: 服务器线程数，默认为 1。可以根据硬件性能增加，适用于高并发情况。
- `ros_threads`: ROS 处理线程数，默认设置为 2，适合处理多话题的数据传输。
- `width`: 图像的宽度，设置为 1280 像素，用户可以根据摄像头输出自行调整。
- `height`: 图像的高度，设置为 1080 像素，符合高清图像标准。
- `quality`: 图像传输质量，设置为 90，值越高图像质量越好，但会占用更多带宽。
  :::

## 启动服务

1. **启动相机节点**

先根据自己的相机 ros 包，启动相机节点

```bash
#自行启动
...
```

2. **启动`web_video_server`**
   在 wvs_ws 目录打开终端，启动 web_video_server

```bash
source ./devel/setup.bash
roslaunch web_video_server web_video_server.launch
```

## 查看图像

![roslaunch启动](/assets/image/2024/other/rosWebVideoServer-0914/image.png)

查看 ip 地址

![选择网络设置](/assets/image/2024/other/rosWebVideoServer-0914/1.png)

![点击设置](/assets/image/2024/other/rosWebVideoServer-0914/2.png)

![查看ip](/assets/image/2024/other/rosWebVideoServer-0914/3.png)

同一局域网设备输入 ip 地址+launch 中设置的 port

我这里是 192.168.1.2:7653

![图像话题列表](/assets/image/2024/other/rosWebVideoServer-0914/4.png)

点击想查看的图像话题即可，如图

![图像内容](/assets/image/2024/other/rosWebVideoServer-0914/5.png)
