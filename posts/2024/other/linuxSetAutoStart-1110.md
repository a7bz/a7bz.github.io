---
icon: linux
date: 2024-11-08
category:
  - 教程
tag:
  - linux
---

# ubuntu 设置开机自启动

## 创建.service 文件

在 **/etc/systemd/system/** 目录下新建一个 **.service** 文件。例如，为一个名为 **custom** 的服务，创建服务文件

```bash
sudo touch /etc/systemd/system/custom.service
```

## 编写 service 文件内容

在服务文件中，定义服务的基本信息和启动参数。以下是一个示例文件：

```ini
[Unit]
Description=Custom Service #服务描述。
After=network.target #定义服务依赖关系，network.target 表示在网络启动后再启动该服务。

[Service]
ExecStart=/path/to/your/executable --option #指定服务启动的命令和参数。
WorkingDirectory=/path/to/working/directory #指定服务运行时的工作目录。
User=username #指定服务的用户。
Restart=on-failure #设置服务异常时重启。
Environment="ENV_VAR_NAME=value" #设置环境变量


[Install]
WantedBy=multi-user.target #定义服务的目标，通常 multi-user.target 表示在系统多用户模式下启动。
```

::: tip
在 [Service] 部分，可以设置 StandardOutput 和 StandardError 选项，将日志输出重定向到指定的目标
可选值说明：

- journal: 将日志输出到 systemd 日志（即 journalctl），可以使用 journalctl -u <service_name> 查看。
- null: 忽略日志输出。
- tty: 将日志输出到 TTY（终端），如果正在使用终端调试时有用。
- file:/path/to/logfile: 将日志输出到指定文件。

:::

示例值:

```ini
[Service]
StandardOutput=journal
StandardError=file:/var/log/my_service_error.log
```

## 重新加载 systemd

每次修改 .service 文件后，都需要重新加载 systemd 配置：

```bash
sudo systemctl daemon-reload
```

## 启动并启用服务

启动服务并设置为开机自启：

```bash
sudo systemctl start custom.service
sudo systemctl enable custom.service
```

## 检查服务状态

可以检查服务的运行状态，确保服务已正常启动：

```bash
sudo systemctl status custom.service
```

## 停止和禁用服务

```bash
sudo systemctl stop custom.service
sudo systemctl disable custom.service
```
