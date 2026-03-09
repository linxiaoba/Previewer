# Previewer
能够可视化所有当前主流前端编程语言的程序，软件端开发完成[呲牙]，且支持代码-UI双向修改，即在修改代码的同时，UI也会实时修改，修改UI，代码也会跟着修改，双向同步！

# Omni Previewer 桌面版

## 📦 打包步骤

### 第一步：安装 Node.js
下载地址：https://nodejs.org（推荐 LTS 版本，20.x 或更高）

### 第二步：准备项目
把这个文件夹放到任意位置，确保包含：
```
omni-previewer-app/
├── main.js          ← Electron 主进程
├── index.html       ← 你的工具（就是原来的 HTML 文件）
├── package.json     ← 项目配置
├── icon.ico         ← Windows 图标（可选，见下方说明）
├── icon.icns        ← macOS 图标（可选）
└── icon.png         ← Linux 图标 / 通用（可选）
```

### 第三步：安装依赖
打开终端（CMD / PowerShell / Terminal），进入项目目录：
```bash
cd 你的路径/omni-previewer-app
npm install
```
> 会下载 Electron，大约 100~200MB，需要等一会儿

### 第四步：先运行测试
```bash
npm start
```
如果弹出窗口正常显示，说明没问题，可以继续打包。

### 第五步：打包
**Windows（生成 .exe 安装包）：**
```bash
npm run build:win
```

**macOS（生成 .dmg）：**
```bash
npm run build:mac
```

**Linux（生成 AppImage）：**
```bash
npm run build:linux
```

打包完成后在 `dist/` 文件夹里找到安装包。

---

## 🖼️ 关于图标（可选）

不加图标也能打包，只是用默认的 Electron 图标。

如果想自定义图标：
- **Windows**：需要 `icon.ico`（256×256 推荐）
- **macOS**：需要 `icon.icns`
- **Linux/通用**：需要 `icon.png`（512×512 推荐）

可以用 [icoconvert.com](https://icoconvert.com) 在线把 PNG 转成 ico/icns。

---

## ❓ 常见问题

**npm install 很慢？**
换国内镜像：
```bash
npm install --registry https://registry.npmmirror.com
```

**打包失败，提示网络错误？**
Electron 二进制文件需要从 GitHub 下载，可以设置镜像：
```bash
# Windows PowerShell
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install

# macOS / Linux
ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" npm install
```

**Windows 打包后双击没反应？**
检查 icon.ico 是否格式正确，或者先删除 icon 相关配置再打包。
