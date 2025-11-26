# Favicon 设置指南

Favicon 是显示在浏览器标签页上的小图标，对品牌识别很重要。

## 当前状态

目前使用的是 Vite 默认 favicon (`/vite.svg`)。建议创建自定义 favicon。

## Favicon 规格

### 推荐格式和尺寸

1. **ICO 格式** (传统)
   - 文件名: `favicon.ico`
   - 尺寸: 16x16, 32x32, 48x48 (多尺寸合并)

2. **PNG 格式** (现代)
   - 16x16: `favicon-16x16.png`
   - 32x32: `favicon-32x32.png`
   - 96x96: `favicon-96x96.png`
   - 192x192: `android-chrome-192x192.png` (Android)
   - 512x512: `android-chrome-512x512.png` (Android)

3. **SVG 格式** (推荐)
   - 文件名: `favicon.svg`
   - 优点: 矢量，任何尺寸都清晰
   - 缺点: 旧浏览器不支持

4. **Apple Touch Icon**
   - 文件名: `apple-touch-icon.png`
   - 尺寸: 180x180

## 快速创建 Favicon

### 方法 1: 在线工具（最简单）

#### RealFaviconGenerator（推荐）
https://realfavicongenerator.net/

1. 上传你的 logo（建议至少 512x512）
2. 自定义各平台效果
3. 下载生成的文件包
4. 复制到 `public/` 目录
5. 复制 HTML 代码到 `index.html`

#### Favicon.io
https://favicon.io/

提供三种方式：
- 从文字生成
- 从图片生成
- 从 Emoji 生成

### 方法 2: 使用设计工具

#### Figma
1. 创建 512x512 画布
2. 设计你的 icon
3. 导出为 PNG
4. 使用在线工具转换为其他格式

#### Adobe Illustrator/Photoshop
1. 创建矢量 logo
2. 导出多个尺寸
3. 使用工具生成 ICO

## 文件结构

将生成的 favicon 文件放入 `public/` 目录：

```
FrameSpeak/
└── public/
    ├── favicon.ico
    ├── favicon.svg
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    └── site.webmanifest
```

## HTML 配置

在 `index.html` 的 `<head>` 中添加以下代码：

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android -->
<link rel="manifest" href="/site.webmanifest">
```

## Web App Manifest

创建 `public/site.webmanifest` 文件：

```json
{
  "name": "FrameSpeak",
  "short_name": "FrameSpeak",
  "description": "AI-powered video frame analysis tool",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1890ff",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

## 设计建议

### Logo 要求
- **简洁**: 在小尺寸下清晰可辨
- **高对比度**: 在各种背景下都能看清
- **可识别**: 能代表品牌/产品
- **适配性**: 方形或接近方形

### 配色
- 使用品牌主色 (#1890ff)
- 考虑深色模式支持
- 确保在浅色和深色背景上都清晰

### 示例设计

#### 选项 1: 字母 Logo
```
+-------------+
|             |
|      F      |
|             |
+-------------+
```
使用 "F" 代表 FrameSpeak

#### 选项 2: 图标 Logo
```
+-------------+
|   +-----+   |
|   |     |   |  (代表视频帧)
|   +-----+   |
+-------------+
```

#### 选项 3: 组合 Logo
```
+-------------+
|   +---+     |
|   | F |     |  (帧 + 字母)
|   +---+     |
+-------------+
```

## SVG Favicon 示例

创建 `public/favicon.svg`：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#1890ff" rx="15"/>
  <text
    x="50"
    y="70"
    font-family="Arial, sans-serif"
    font-size="60"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
  >F</text>
</svg>
```

## 测试 Favicon

### 本地测试
1. 清除浏览器缓存
2. 访问 http://localhost:5173
3. 检查标签页图标
4. 测试书签图标

### 线上测试
1. 部署网站
2. 使用无痕模式访问
3. 添加到主屏幕（移动端）
4. 查看各平台效果

## 常见问题

### Q: Favicon 不显示或显示旧的？
A: 清除浏览器缓存，或者强制刷新 (Ctrl+Shift+R / Cmd+Shift+R)

### Q: 需要所有格式吗？
A: 建议至少提供 ICO、PNG (32x32) 和 SVG 格式

### Q: 可以使用 emoji 作为 favicon 吗？
A: 可以！使用 SVG 格式嵌入 emoji，或使用 data URI

### Q: 深色模式怎么适配？
A: 使用 SVG 并添加 CSS media query：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <style>
    @media (prefers-color-scheme: dark) {
      rect { fill: #ffffff; }
      text { fill: #1890ff; }
    }
  </style>
  <rect width="100" height="100" fill="#1890ff"/>
  <text x="50" y="70" font-size="60" fill="white" text-anchor="middle">F</text>
</svg>
```

## 工具推荐

### 在线工具
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/
- **Favicon Generator**: https://www.favicon-generator.org/

### 设计工具
- **Figma**: https://www.figma.com/
- **Canva**: https://www.canva.com/
- **Inkscape**: https://inkscape.org/ (免费)

### 验证工具
- Chrome DevTools: 查看 Network 面板的 favicon 请求
- Favicon Checker: https://www.websiteplanet.com/webtools/favicon-checker/

---

**最后更新**: 2025-11-24
