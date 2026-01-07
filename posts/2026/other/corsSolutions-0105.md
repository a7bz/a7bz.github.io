---
icon: cors
date: 2026-01-05
category:
  - 其他
tag:
  - 前端
  - 跨域
  - cors
  - 开发工具
---

# 前端开发跨域问题解决方案

## 什么是跨域

跨域（Cross-Origin Resource Sharing，CORS）是浏览器安全策略的重要组成部分。当前端应用尝试访问不同源（协议、域名、端口任一不同）的资源时，浏览器会阻止这种请求，这就是跨域问题。

### 同源策略详解

同源策略是浏览器最核心的安全功能之一，要求以下三个要素必须完全相同：

| 要素 | 说明                 | 示例                               |
| ---- | -------------------- | ---------------------------------- |
| 协议 | http、https、file 等 | https vs http                      |
| 域名 | 完整的域名地址       | api.example.com vs www.example.com |
| 端口 | 服务端口号           | 8080 vs 3000                       |

```javascript
// 源示例
// 基础源: https://www.example.com:8080

// 以下都是跨域请求
// https://api.example.com:8080     - 域名不同
// https://www.example.com:3000     - 端口不同
// http://www.example.com:8080      - 协议不同
```

### 为什么会产生跨域问题

跨域限制主要是为了防止恶意网站窃取用户数据。例如，当用户登录了网上银行后访问恶意网站，恶意网站不能直接获取银行网站的数据。

## 常见跨域场景

### 1. 本地开发环境跨域

前端开发时通常使用 localhost 或 127.0.0.1，而 API 服务器可能运行在其他端口：

```javascript
// 前端开发服务器
// 地址: http://localhost:3000

// 后端 API 服务器
// 地址: http://localhost:8080/api/users

// 这会产生跨域问题
fetch("http://localhost:8080/api/users")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("跨域错误:", error));
```

### 2. 前后端分离项目跨域

生产环境中，前端和后端可能部署在不同域名：

```javascript
// 前端应用
// 地址: https://www.example.com

// 后端 API
// 地址: https://api.example.com

// 跨域请求
fetch("https://api.example.com/users")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("users").innerHTML = data
      .map(
        (user) =>
          `<div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.email}</p>
      </div>`
      )
      .join("");
  });
```

### 3. 第三方 API 访问跨域

调用第三方服务时可能遇到跨域限制：

```javascript
// 调用第三方天气 API
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://weather-api.example.com/v1/weather?city=${city}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("获取天气失败:", error);
    // 可能遇到 CORS 错误
  }
}
```

## 前端开发者可用的解决方案

### 方案一：代理服务器配置（开发环境首选）

代理服务器是前端开发中最常用的跨域解决方案，通过在开发服务器和目标服务器之间添加一个代理层，将跨域请求转换为同源请求。

#### Vite 代理配置

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  server: {
    port: 3000,

    proxy: {
      "/api": {
        // 目标服务器地址
        target: "http://localhost:8080",

        // 改变 Origin
        changeOrigin: true,

        // 重写路径
        rewrite: (path) => path.replace(/^\/api/, ""),

        // 配置代理规则
        secure: false,

        // 日志输出
        logLevel: "debug",

        // WebSocket 支持
        ws: true,

        // 自定义代理行为
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log(`[Proxy] ${req.method} ${req.url}`);
          });

          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(`[Proxy] ${proxyRes.statusCode} ${req.url}`);
          });
        },
      },

      // 多代理配置
      "/auth": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },

      "/static": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

#### Webpack 代理配置

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    port: 3000,

    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
        secure: false,

        // 上下文配置
        context: ["/api/users", "/api/products"],

        // 自定义头部
        headers: {
          "X-Custom-Header": "value",
        },
      },

      // 代理到多个后端
      "/auth": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
};
```

### 方案二：JSONP 跨域

JSONP 是较早的跨域解决方案，利用 script 标签的跨域能力：

```javascript
// 前端 JSONP 请求
function jsonp(url, callbackName, callback) {
  const script = document.createElement("script");

  // 生成唯一的回调函数名
  const callbackId = `jsonp_callback_${Date.now()}`;

  // 将回调函数挂载到 window
  window[callbackId] = (data) => {
    callback(data);
    // 清理
    delete window[callbackId];
    script.remove();
  };

  // 构建请求 URL
  const separator = url.includes("?") ? "&" : "?";
  script.src = `${url}${separator}callback=${callbackId}`;

  // 错误处理
  script.onerror = () => {
    delete window[callbackId];
    script.remove();
    callback(new Error("JSONP 请求失败"));
  };

  document.head.appendChild(script);
}

// 使用示例
jsonp("http://localhost:8080/api/users", "users", (data) => {
  console.log("用户数据:", data);
});

// 服务器端返回格式
// callback_name({"users": [...]})
```

### 方案三：postMessage 跨域

postMessage 主要用于 iframe 之间的通信：

```javascript
// 父页面
const iframe = document.createElement("iframe");
iframe.src = "https://child.example.com";
iframe.style.display = "none";
document.body.appendChild(iframe);

// 监听来自 iframe 的消息
window.addEventListener("message", (event) => {
  // 验证消息来源
  if (event.origin !== "https://child.example.com") {
    console.warn("忽略未知来源的消息:", event.origin);
    return;
  }

  const data = event.data;

  switch (data.type) {
    case "USER_DATA":
      console.log("收到用户数据:", data.payload);
      break;
    case "ERROR":
      console.error("错误:", data.message);
      break;
  }
});

// 发送消息到 iframe
iframe.contentWindow.postMessage(
  {
    type: "GET_USER",
    payload: { userId: 123 },
  },
  "https://child.example.com"
);

// iframe 页面代码 (child.example.com)
window.addEventListener("message", (event) => {
  if (event.origin !== "https://parent.example.com") {
    return;
  }

  const { type, payload } = event.data;

  if (type === "GET_USER") {
    // 处理请求
    const userData = { id: payload.userId, name: "示例用户" };

    // 发送响应
    window.parent.postMessage(
      {
        type: "USER_DATA",
        payload: userData,
      },
      "https://parent.example.com"
    );
  }
});
```

### 方案四：document.domain

同主域下的子域名可以进行通信：

```javascript
// 在所有相关页面设置相同的 document.domain
document.domain = "example.com";

// page1.example.com
const iframe = document.createElement("iframe");
iframe.src = "https://page2.example.com/data.html";
document.body.appendChild(iframe);

// page2.example.com
window.sharedData = { token: "xxx" };

// page1.example.com 访问 page2.example.com 的数据
window.addEventListener("load", () => {
  const iframeWindow = iframe.contentWindow;
  console.log(iframeWindow.sharedData); // 可以访问
});
```

### 方案五：WebSocket 跨域

WebSocket 不受同源策略限制：

```javascript
// 前端 WebSocket 连接
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.messageHandlers = [];
    this.connectionHandlers = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("WebSocket 连接成功");
        this.connectionHandlers.forEach((handler) => handler(null));
        resolve();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket 错误:", error);
        reject(error);
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket 关闭:", event.code, event.reason);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach((handler) => handler(data));
        } catch (e) {
          console.error("消息解析错误:", e);
        }
      };
    });
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error("WebSocket 未连接");
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  onConnection(handler) {
    this.connectionHandlers.push(handler);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// 使用
const client = new WebSocketClient("wss://api.example.com/ws");

client.onConnection((error) => {
  if (!error) {
    client.send("SUBSCRIBE", { channel: "users" });
  }
});

client.onMessage((data) => {
  console.log("收到消息:", data);
});

client.connect();
```

### 方案六：浏览器参数配置（仅限开发环境）

通过启动浏览器时添加特定参数，可以临时禁用浏览器的同源策略：

#### Chrome/Edge 浏览器启动参数

```powershell
# Chrome 浏览器
chrome.exe --disable-web-security --user-data-dir=C:\dev\chrome-dev

# Edge 浏览器
msedge.exe --disable-web-security --user-data-dir=C:\dev\edge-dev
```

#### 创建快捷方式

1. 创建桌面快捷方式
2. 右键选择"属性"
3. 在"目标"字段末尾添加参数：

```powershell
# Chrome 完整目标
"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir=C:\dev\chrome-dev

# Edge 完整目标
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --disable-web-security --user-data-dir=C:\dev\edge-dev
```

#### 使用命令行脚本

```powershell
# start-dev-browser.ps1
param(
    [string]$browser = "edge",
    [string]$dataDir = "C:\dev\browser-dev"
)

$browserPaths = @{
    "chrome" = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    "edge"   = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    "firefox" = "C:\Program Files\Mozilla Firefox\firefox.exe"
}

$browserPath = $browserPaths[$browser.ToLower()]

if (-not (Test-Path $browserPath)) {
    Write-Error "找不到浏览器: $browser"
    exit 1
}

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

$arguments = @(
    "--disable-web-security",
    "--user-data-dir=$dataDir",
    "--new-window",
    "http://localhost:3000"
)

Start-Process -FilePath $browserPath -ArgumentList $arguments -WindowStyle Normal

Write-Host "已启动 $browser 开发模式，访问 http://localhost:3000"
Write-Host "注意：此模式会禁用浏览器的安全策略，请仅用于本地开发！"
```

#### 注意事项

```markdown
⚠️ 重要警告：

1. **仅限开发环境**：此方法会严重削弱浏览器安全保护，绝对不能用于日常浏览
2. **独立用户数据**：使用独立的 `--user-data-dir` 避免影响正常浏览器配置
3. **临时使用**：完成跨域测试后建议关闭并使用正常浏览器
4. **团队协作**：确保团队成员了解这是临时解决方案
5. **不要登录敏感账户**：禁用安全策略后避免访问银行、邮箱等敏感网站
```

## 需要后端/服务器配置的解决方案

### 方案七：CORS 后端配置

#### Express.js 配置 CORS

```javascript
// 安装 cors 中间件
// npm install cors

const express = require("express");
const cors = require("cors");
const app = express();

// 基础配置
app.use(cors());

// 详细配置
app.use(
  cors({
    // 允许的源地址
    origin: "http://localhost:3000",

    // 允许携带的请求头
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // 允许的 HTTP 方法
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    // 允许携带凭证（cookies）
    credentials: true,

    // 预检请求缓存时间（秒）
    maxAge: 86400,

    // 添加额外的响应头
    exposedHeaders: ["X-Total-Count", "Content-Range"],
  })
);

// 处理预检请求
app.options("*", cors());

// 实际路由
app.get("/api/users", (req, res) => {
  res.json({ users: [] });
});

app.listen(8080, () => {
  console.log("服务器运行在 http://localhost:8080");
});
```

#### Spring Boot 配置 CORS

```java
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import java.util.Arrays

@Configuration
class CorsConfig {

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()

        // 允许的源地址
        configuration.allowedOrigins = listOf(
            "http://localhost:3000",
            "https://www.example.com"
        )

        // 允许携带凭证
        configuration.allowCredentials = true

        // 允许的请求头
        configuration.allowedHeaders = listOf(
            "Authorization",
            "Content-Type",
            "X-Requested-With"
        )

        // 允许的 HTTP 方法
        configuration.methods = listOf("GET", "POST", "PUT", "DELETE", "PATCH")

        // 预检请求缓存时间（秒）
        configuration.maxAge = 86400L

        // 暴露的响应头
        configuration.exposedHeaders = listOf("X-Total-Count", "Content-Range")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)

        return source
    }
}
```

#### Flask 配置 CORS

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# 基础配置
CORS(app)

# 详细配置
CORS(app,
     resources={
         r"/api/*": {
             "origins": "http://localhost:3000",
             "methods": ["GET", "POST", "PUT", "DELETE"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "max_age": 86400
         }
     })

@app.route('/api/users')
def get_users():
    return {'users': []}

if __name__ == '__main__':
    app.run(port=8080)
```

### 方案八：Nginx 代理配置

```nginx
server {
    listen 80;
    server_name localhost;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;

        # 设置代理请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # 缓存配置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 认证代理
    location /auth/ {
        proxy_pass http://localhost:9000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源代理
    location /static/ {
        proxy_pass http://localhost:8080/static/;
        proxy_cache_valid 200 1d;
        expires 1d;
    }
}
```

### 方案九：Node.js 中间层代理

```javascript
// 使用 http-proxy-middleware
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");

const app = express();

// API 代理
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },

    // 日志
    logLevel: "debug",

    // 错误处理
    onError: (err, req, res) => {
      console.error("代理错误:", err.message);
      res.status(500).json({
        error: "代理服务器错误",
        message: err.message,
      });
    },

    // 请求处理
    onProxyReq: (proxyReq, req, res) => {
      // 添加自定义请求头
      proxyReq.setHeader("X-Forwarded-Host", req.hostname);

      // 修改请求体
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    // 响应处理
    onProxyRes: (proxyRes, req, res) => {
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url} -> ${
          proxyRes.statusCode
        }`
      );
    },
  })
);

// 认证代理
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:9000",
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("代理服务器运行在 http://localhost:3000");
});
```

## 实际项目中的解决方案

### Vue 项目配置

```javascript
// vue.config.js
module.exports = {
  devServer: {
    port: 3000,

    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_URL || "http://localhost:8080",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },

        // 认证支持
        onProxyReq: (proxyReq, req, res) => {
          if (req.headers.authorization) {
            proxyReq.setHeader("Authorization", req.headers.authorization);
          }
        },
      },

      "/ws": {
        target: "ws://localhost:8080",
        ws: true,
      },
    },

    // 禁用主机检查
    disableHostCheck: true,
  },
};
```

### React 项目配置

```javascript
// package.json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "env": {
    "REACT_APP_API_URL": "http://localhost:8080"
  }
}

// setupProxy.js (src/setupProxy.js)
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}
```

## 调试技巧

### 浏览器开发者工具

```javascript
// 在控制台中查看 CORS 错误
window.addEventListener("error", (event) => {
  if (event.message.includes("CORS")) {
    console.error("CORS 错误:", event.message);
    console.error("详细错误:", event.error);
  }
});

// 发送带详细信息的请求
async function debugRequest(url, options = {}) {
  console.log(`[Request] ${options.method || "GET"} ${url}`);
  console.log("[Headers]", options.headers);

  const startTime = Date.now();

  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;

    console.log(`[Response] ${response.status} ${response.statusText}`);
    console.log(`[Duration] ${duration}ms`);
    console.log("[Response Headers]");
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    return response;
  } catch (error) {
    console.error("[Error]", error.message);
    throw error;
  }
}
```

### 网络请求分析

```javascript
// 封装请求工具
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(method, path, data = null, headers = {}) {
    const url = `${this.baseURL}${path}`;

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    // 调试模式
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${method} ${url}`, data);
    }

    const response = await fetch(url, config);

    // 检查 CORS 相关头部
    const corsHeaders = {
      "access-control-allow-origin": response.headers.get(
        "access-control-allow-origin"
      ),
      "access-control-allow-credentials": response.headers.get(
        "access-control-allow-credentials"
      ),
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`[API] Response headers:`, corsHeaders);
    }

    if (!response.ok) {
      const error = new Error(`HTTP Error: ${response.status}`);
      error.status = response.status;
      error.response = await response.json().catch(() => ({}));
      throw error;
    }

    return response.json();
  }

  get(path, headers) {
    return this.request("GET", path, null, headers);
  }

  post(path, data, headers) {
    return this.request("POST", path, data, headers);
  }

  put(path, data, headers) {
    return this.request("PUT", path, data, headers);
  }

  delete(path, headers) {
    return this.request("DELETE", path, null, headers);
  }
}

// 使用
const api = new ApiClient("http://localhost:8080/api");
```

## 最佳实践总结

### 1. 开发环境

- 使用 Vite/Webpack 代理是最简单直接的方案
- 配置代理时注意 pathRewrite 的使用
- 开启详细的日志输出便于调试
- 浏览器参数配置适合快速测试，但要注意安全风险

### 2. 生产环境

- 优先在后端配置 CORS
- 使用 Nginx 反向代理统一处理
- 配置适当的缓存策略减少重复请求
- 生产环境中 origin 要明确指定，避免使用通配符

### 3. 安全考虑

- 敏感接口需要验证请求来源
- 定期更新依赖包修复安全漏洞
- 禁用安全策略的浏览器仅用于本地开发测试

### 4. 性能优化

- 合理设置 CORS 预检请求缓存时间
- 使用 HTTP/2 提高并发性能
- 开启 gzip 压缩减少传输数据量

## 常见问题排查

### 问题一：预检请求失败

```javascript
// 预检请求 OPTIONS 返回 404 或 405
// 解决方案：确保服务器正确处理 OPTIONS 请求

// Express.js
app.options("*", cors());

// 或者
app.options("/api/*", cors());
```

### 问题二：凭证请求被阻止

```javascript
// 当 credentials 为 true 时，origin 不能使用通配符

// 错误配置
app.use(
  cors({
    origin: "*", // 这会导致凭证请求失败
    credentials: true,
  })
);

// 正确配置
app.use(
  cors({
    origin: "http://localhost:3000", // 具体来源
    credentials: true,
  })
);
```

### 问题三：Cookie 未传递

```javascript
// 前端请求需要设置 withCredentials
fetch("http://localhost:8080/api/data", {
  credentials: "include", // 或 'same-origin'
});

// 后端需要设置 Access-Control-Allow-Credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### 问题四：自定义头部被阻止

```javascript
// 前端发送自定义头部
fetch("http://localhost:8080/api/data", {
  headers: {
    "X-Custom-Token": "xxx",
    "X-Request-ID": "123",
  },
});

// 后端需要允许这些头部
app.use(
  cors({
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Custom-Token",
      "X-Request-ID",
    ],
  })
);
```

## 总结

跨域问题是前端开发中不可避免的挑战，选择合适的解决方案需要考虑项目规模、开发环境和生产需求等多个因素：

1. **前端开发者可用**：代理服务器配置、JSONP、postMessage、document.domain、WebSocket、浏览器参数配置
2. **需要后端配合**：CORS 后端配置、Nginx 代理配置、Node.js 中间层代理

理解跨域的原理和解决方案，能够帮助我们更好地设计系统架构，提高开发效率。

## 参考资料

- [MDN CORS 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [Chrome 启动参数](https://peter.sh/experiments/chromium-command-line-switches/)
- [Vite 代理配置](https://vitejs.dev/config/server-options.html#server-proxy)
- [Express CORS 中间件](https://github.com/expressjs/cors)
