---
icon: host
date: 2024-06-22
keywords: 串口别名设置,串口权限,udev规则,ROS设备管理
category:
  - 教程
tag:
  - linux
  - ros
---

# ROS 设备管理：设置串口权限和固定别名

## 前言

在 ROS 开发中，经常需要连接多个传感器和串口设备。然而，设备每次插拔时，系统分配的串口名称（如 `/dev/ttyUSB0`、`/dev/ttyUSB1`）可能会发生变化，这给开发和调试带来了不便。本文将详细介绍如何通过 udev 规则解决串口权限问题，并为设备设置固定别名，使设备管理更加便捷。

## 一、串口权限问题分析

当我们接入传感器等串口设备时，首先需要确保当前用户有访问该设备的权限。默认情况下，Linux 系统会将串口设备的权限设置为 `rw-rw----`，只有 root 用户和 dialout 组的用户才能访问。

### 1.1 查看当前设备权限

接入串口设备后，使用以下命令查看设备信息和权限：

```bash
 ls -l /dev/ttyUSB0
```

![查看设备信息和权限](/assets/image/2024/other/rosSetUdev-0622/vmware_UXutHu2uyk.png)

从输出结果可以看到设备权限，所属组为 `dialout`。

### 1.2 解决串口权限问题

我们可以通过以下两种方式解决串口权限问题：

#### 方法一：将用户添加到 dialout 组

将当前用户添加到 `dialout` 组，这样用户就有权访问串口设备：

```bash
sudo usermod -a -G dialout $USER
```

> 注意：执行完此命令后，需要重启会话或重新登录才能生效。

#### 方法二：创建 udev 规则自动设置权限

创建一个 udev 规则文件，使所有串口设备自动获得可读可写可执行权限：

1. 创建一个脚本文件：

```bash
touch ttyUSB_permission.sh
```

2. 编辑脚本文件，添加以下内容：

```bash
   # 创建 udev 规则文件，设置所有 ttyUSB 设备的权限为 777
echo 'KERNEL=="ttyUSB*", MODE:="0777", GROUP:="dialout"' > /etc/udev/rules.d/ttyUSB.rules

   # 重新加载 udev 规则
service udev reload
sleep 2
   
   # 重启 udev 服务
service udev restart
   
   # 触发 udev 规则，使规则立即生效
sudo udevadm trigger
   ```

3. 给予脚本执行权限：

```bash
sudo chmod +x ttyUSB_permission.sh
```

4. 运行脚本：

```bash
sudo sh ttyUSB_permission.sh
```

5. 验证权限设置是否成功：

```bash
ls -l /dev/ttyUSB0
```

![验证权限设置成功](/assets/image/2024/other/rosSetUdev-0622/vmware_XTmNJvWDLV.png)

可以看到，设备现在已经拥有可读可写可执行权限（`rwxrwxrwx`）。

## 二、设置串口固定别名

为了避免串口名称随设备插拔而变化，我们可以为每个设备设置一个唯一的固定别名。

### 2.1 查看设备的唯一标识符

首先，我们需要获取设备的唯一标识符，包括 `idVendor`（厂商 ID）、`idProduct`（产品 ID）和 `serial`（序列号）：

```bash
udevadm info --attribute-walk --name=/dev/ttyUSB0 | grep -E "idVendor|idProduct|serial"
```

或者查看更详细的信息：

```bash
udevadm info --attribute-walk --name=/dev/ttyUSB0
```

![查看设备属性](/assets/image/2024/other/rosSetUdev-0622/vmware_Hh5Mo3zDPb.png)

从输出中找到以下关键属性：
- `idVendor`：厂商 ID（如 `10c4`）
- `idProduct`：产品 ID（如 `ea60`）
- `serial`：设备序列号（如 `0003`）

这些属性的组合可以唯一标识一个设备。

### 2.2 创建 udev 规则设置固定别名

使用以下步骤为设备创建固定别名：

1. 创建一个脚本文件：

```bash
touch create_serial_alias.sh
```

2. 编辑脚本文件，添加以下内容（根据实际设备属性修改）：

```bash
   # 创建 udev 规则文件，为特定设备设置固定别名
echo 'KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0003", GROUP:="dialout", SYMLINK+="wheeltec_FDI_IMU_GNSS"' > /etc/udev/rules.d/wheeltec_fdi_imu_gnss.rules

   # 重新加载 udev 规则
service udev reload
sleep 2
   
   # 重启 udev 服务
service udev restart
   
   # 触发 udev 规则
sudo udevadm trigger
```

3. 给予脚本执行权限：

```bash
sudo chmod +x create_serial_alias.sh
```

4. 运行脚本：

```bash
sudo sh create_serial_alias.sh
```

![执行结果](/assets/image/2024/other/rosSetUdev-0622/vmware_wMHqP2Z6X9.png)

### 2.3 验证别名设置是否成功

使用以下命令验证别名是否设置成功：

```bash
ls -l /dev | grep wheeltec
```

如果输出中显示了我们设置的别名，则说明设置成功：

``` bash
lrwxrwxrwx 1 root root           7 Jun 22 10:00 wheeltec_FDI_IMU_GNSS -> ttyUSB0
```

## 三、udev 规则详解

udev 规则的各个部分：

``` bash
KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0003", GROUP:="dialout", SYMLINK+="wheeltec_FDI_IMU_GNSS"
```

- `KERNEL=="ttyUSB*"`：匹配所有以 `ttyUSB` 开头的设备
- `ATTRS{idVendor}=="10c4"`：匹配厂商 ID 为 `10c4` 的设备
- `ATTRS{idProduct}=="ea60"`：匹配产品 ID 为 `ea60` 的设备
- `ATTRS{serial}=="0003"`：匹配序列号为 `0003` 的设备
- `GROUP:="dialout"`：将设备的所属组设置为 `dialout`
- `SYMLINK+="wheeltec_FDI_IMU_GNSS"`：为设备创建一个名为 `wheeltec_FDI_IMU_GNSS` 的符号链接（别名）

## 四、多设备别名设置

如果需要为多个设备设置别名，只需要为每个设备创建一个对应的 udev 规则文件即可。例如：

1. 为第一个设备创建规则：

```bash
echo 'KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0003", GROUP:="dialout", SYMLINK+="sensor1"' > /etc/udev/rules.d/sensor1.rules
```

2. 为第二个设备创建规则：

```bash
echo 'KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0004", GROUP:="dialout", SYMLINK+="sensor2"' > /etc/udev/rules.d/sensor2.rules
```

3. 重新加载 udev 规则：

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

## 五、注意事项

1. **权限问题**：确保当前用户属于 `dialout` 组，或者设备权限设置正确
2. **设备唯一性**：使用 `idVendor`、`idProduct` 和 `serial` 的组合来唯一标识设备，避免混淆
3. **规则文件名**：udev 规则文件的扩展名必须是 `.rules`
4. **规则优先级**：文件名前缀的数字越大，规则优先级越高
5. **生效时间**：修改 udev 规则后，需要重新加载规则并触发，或者重新插拔设备才能生效
6. **设备类型**：不同类型的设备（如 USB 转串口、原生串口）可能需要不同的规则

## 参考资料

- [Linux udev 官方文档](https://www.kernel.org/pub/linux/utils/kernel/hotplug/udev/udev.html)
- [ROS Wiki - Serial 设备](http://wiki.ros.org/serial)
