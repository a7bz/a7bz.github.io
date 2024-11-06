---
icon: host
date: 2024-06-22
keywords: 串口别名设置,串口权限
category:
  - ros
tag:
  - 教程
---

# ros -设置权限和串口别名规则

在使用多个设备时，尤其是接入传感器和其他串口设备时，设备每次插入的串口名可能会发生变化。如果每次都需要手动查看串口名并修改配置文件，显得尤为麻烦。为了简化这个过程，我们可以通过设置规则文件来为设备配置别名，并解决设备权限问题。

## 解决权限问题

接入传感器，查看设备信息

```bash
 ls -l /dev/ttyUSB0
```

![设备信息](/assets/image/2024/other/rosSetUdev-0622/vmware_UXutHu2uyk.png)

只有读写权限无执行权限

新建一个 ttyUSB.sh 脚本文件

```bash
touch ttyUSB.sh
```

打开该文件，写入以下内容，保存

```bash
echo 'KERNEL=="ttyUSB*", MODE:="0777", GROUP:="dialout"' >/etc/udev/rules.d/ttyUSB.rules

service udev reload
sleep 2
service udev restart
sudo udevadm trigger
```

给予脚本执行权限并运行

```bash
sudo chmod 777 ttyUSB.sh
```

运行脚本

```bash
sudo sh ttyUSB.sh
```

将当前用户添加进 **dialout** 组:

```bash
sudo usermod -a -G dialout $USER
```

**$USER** 是当前用户的环境变量，执行完后需要重启会话或者重新登录才能生效。

再次查看设备信息

![设备信息](/assets/image/2024/other/rosSetUdev-0622/vmware_XTmNJvWDLV.png)

已经拥有执行权限

设置好规则后，以后任何 ttyUSB 设备都会自动获得 777 权限，无需手动调整。

## 设置串口别名

为了避免串口名称随设备插拔而变化，我们可以为每个串口设备设置一个唯一的别名。首先，我们需要查看设备的信息。

```bash
udevadm info --attribute-walk --name=/dev/ttyUSB0
```

找到 **idVendor** 、**idProduct** 和 **serial** 这几个属性，这些属性可以帮助我们唯一标识设备。

![设备属性](/assets/image/2024/other/rosSetUdev-0622/vmware_Hh5Mo3zDPb.png)

新建一个 wheeltec_udev.sh

```bash
touch wheeltec_udev.sh
```

编写 wheeltec_udev.sh 脚本

```bash
echo  'KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", ATTRS{serial}=="0003", GROUP:="dialout", SYMLINK+="wheeltec_FDI_IMU_GNSS"' >/etc/udev/rules.d/wheeltec_fdi_imu_gnss.rules

service udev reload
sleep 2
service udev restart
sudo udevadm trigger
```

`KERNEL=="ttyUSB*"`: `KERNEL`是指设备的内核名称，`ttyUSB*`适用于所有以`ttyUSB`开头的设备，通常指的是通过 USB 连接的串行设备。
`ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60"`: 精确匹配特定厂商和产品的设备
`ATTRS{serial}=="0003"`: 设备序列号(`serial`)为`0003` 区分同一型号但具有不同序列号的多个设备。
`GROUP:="dialout"`:设备文件的所属组为`dialout`。属于`dialout`组的用户都将有权访问此设备
`SYMLINK+="wheeltec_FDI_IMU_GNSS"`:设置别名`wheeltec_FDI_IMU_GNSS`

给脚本文件授权

```bash
sudo chmod 777 wheeltec_udev.sh
```

运行脚本

```bash
sudo sh wheeltec_udev.sh
```

![执行结果](/assets/image/2024/other/rosSetUdev-0622/vmware_wMHqP2Z6X9.png)

别名设置成功
