# FrameSpeak 图标使用指南

## 当前图标
✅ 已创建 `logo.svg` - 主图标（蓝色视频帧+AI星光效果）

## 生成完整图标集

为了最佳兼容性，建议生成以下格式的图标：

### 方案一：在线生成（最简单）⭐

1. 访问 https://realfavicongenerator.net/
2. 上传 `public/logo.svg`
3. 点击 "Generate your Favicons and HTML code"
4. 下载生成的图标包
5. 解压到 `public/` 目录

### 方案二：使用命令行工具

```bash
# 安装 sharp-cli
npm install -g sharp-cli

# 生成不同尺寸
sharp -i public/logo.svg -o public/favicon-16x16.png resize 16 16
sharp -i public/logo.svg -o public/favicon-32x32.png resize 32 32
sharp -i public/logo.svg -o public/apple-touch-icon.png resize 180 180
sharp -i public/logo.svg -o public/android-chrome-192x192.png resize 192 192
sharp -i public/logo.svg -o public/android-chrome-512x512.png resize 512 512
```

### 方案三：使用 Photoshop/GIMP/Figma

1. 打开 `public/logo.svg`
2. 导出为以下尺寸的PNG：
   - 16x16 → `favicon-16x16.png`
   - 32x32 → `favicon-32x32.png`
   - 180x180 → `apple-touch-icon.png`
   - 192x192 → `android-chrome-192x192.png`
   - 512x512 → `android-chrome-512x512.png`

## 图标文件清单

完整的图标集应包含：
- ✅ `logo.svg` - 主SVG图标（已创建）
- ⏳ `favicon-16x16.png` - 小尺寸浏览器标签图标
- ⏳ `favicon-32x32.png` - 标准浏览器标签图标
- ⏳ `apple-touch-icon.png` - iOS主屏幕图标
- ⏳ `android-chrome-192x192.png` - Android桌面图标
- ⏳ `android-chrome-512x512.png` - Android启动画面

## 自定义图标

如果想使用自己的图标设计：

1. 替换 `public/logo.svg` 为你的SVG文件
2. 或者直接添加PNG格式图标到public目录
3. 保持文件名不变，或修改 `index.html` 中的引用

## 当前效果

现代浏览器会优先使用 `logo.svg`，看起来清晰锐利。
旧浏览器会fallback到PNG格式（如果提供的话）。

## 注意事项

- SVG图标在现代浏览器中效果最好
- 建议图标使用简单的几何形状和清晰的配色
- 确保图标在小尺寸下仍然可辨识
- 主题色 `#1890ff` 与应用UI保持一致
