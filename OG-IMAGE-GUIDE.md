# Open Graph 图片创建指南

为了在社交媒体上获得最佳的分享效果，你需要创建合适的 OG (Open Graph) 图片。

## 图片规格要求

### Facebook / Open Graph 图片
- **文件名**: `og-image.jpg` 或 `og-image.png`
- **推荐尺寸**: 1200 x 630 像素
- **最小尺寸**: 600 x 315 像素
- **最大文件大小**: 8 MB
- **宽高比**: 1.91:1

### Twitter Card 图片
- **文件名**: `twitter-image.jpg` 或 `twitter-image.png`
- **推荐尺寸**: 1200 x 675 像素
- **最小尺寸**: 300 x 157 像素
- **最大文件大小**: 5 MB
- **宽高比**: 16:9

## 设计建议

### 内容要素
1. **品牌标识**: 包含 FrameSpeak logo
2. **应用截图**: 展示应用界面或关键功能
3. **标题文字**: 简洁的应用描述 (可选)
4. **配色方案**: 使用应用主色调 (#1890ff)

### 设计原则
- ✅ 保持简洁，避免过度设计
- ✅ 文字清晰可读（即使在小屏幕上）
- ✅ 高对比度
- ✅ 居中或留白合理
- ❌ 避免在边缘放置重要内容（可能被裁剪）
- ❌ 不要放置过多文字

## 设计工具

### 在线工具（免费）
1. **Canva**: https://www.canva.com/
   - 提供 OG 图片模板
   - 操作简单，无需设计经验

2. **Figma**: https://www.figma.com/
   - 专业设计工具
   - 团队协作功能

3. **Photopea**: https://www.photopea.com/
   - 在线版 Photoshop
   - 免费使用

### 设计软件
1. **Adobe Photoshop**
2. **Sketch** (macOS)
3. **Affinity Designer**

## 快速创建步骤

### 使用 Canva（推荐）

1. 访问 Canva 并登录
2. 搜索 "Facebook Post" 或 "Twitter Post" 模板
3. 自定义设计：
   - 添加 FrameSpeak logo
   - 添加应用截图
   - 调整颜色和文字
4. 调整尺寸到 1200 x 630 (OG) 或 1200 x 675 (Twitter)
5. 下载为 JPG 或 PNG
6. 将文件放入 `public/` 目录

## 示例设计

### 基础版本
```
+------------------------------------------+
|                                          |
|           [FrameSpeak Logo]              |
|                                          |
|    AI-Powered Video Frame Analysis       |
|                                          |
|        [应用界面截图]                      |
|                                          |
|   Extract • Analyze • Generate            |
|                                          |
+------------------------------------------+
```

### 功能展示版本
```
+------------------------------------------+
|  FrameSpeak                 [Logo]       |
|                                          |
|  +---------+  +---------+  +---------+   |
|  | 视频    |  | AI     |  | 导出    |   |
|  | 上传    |  | 分析    |  | 结果    |   |
|  +---------+  +---------+  +---------+   |
|                                          |
|  支持 Ollama • OpenAI • LM Studio        |
+------------------------------------------+
```

## 测试图片效果

创建图片后，使用以下工具测试效果：

### Facebook 分享调试器
https://developers.facebook.com/tools/debug/

1. 输入你的网站 URL
2. 点击 "Fetch new information"
3. 查看预览效果
4. 如有缓存，点击 "Scrape Again"

### Twitter Card 验证器
https://cards-dev.twitter.com/validator

1. 输入你的网站 URL
2. 点击 "Preview card"
3. 查看 Twitter 卡片效果

### LinkedIn Post Inspector
https://www.linkedin.com/post-inspector/

1. 输入你的网站 URL
2. 点击 "Inspect"
3. 查看 LinkedIn 分享效果

## 图片文件放置

创建好图片后，将它们放置在以下位置：

```
FrameSpeak/
└── public/
    ├── og-image.jpg      (Facebook/OG 图片)
    └── twitter-image.jpg (Twitter 图片)
```

然后更新 `index.html` 中的图片路径（已配置）：
```html
<meta property="og:image" content="https://yourwebsite.com/og-image.jpg" />
<meta name="twitter:image" content="https://yourwebsite.com/twitter-image.jpg" />
```

## 注意事项

1. **文件大小**: 尽量控制在 500KB 以下，加快加载速度
2. **文件格式**: JPG 适合照片，PNG 适合图标和文字
3. **CDN**: 建议使用 CDN 托管图片，提高加载速度
4. **更新缓存**: 修改图片后，使用调试工具刷新缓存

## 优化建议

### 压缩图片
使用以下工具压缩图片：
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim (macOS): https://imageoptim.com/

### 使用 WebP (高级)
现代浏览器支持 WebP 格式，文件更小：
```html
<meta property="og:image" content="https://yourwebsite.com/og-image.webp" />
<meta property="og:image:type" content="image/webp" />
```

## 常见问题

### Q: 为什么我的图片在社交媒体上不显示？
A:
- 检查图片 URL 是否可访问
- 确认图片符合尺寸要求
- 使用调试工具刷新缓存
- 检查 meta 标签是否正确

### Q: 可以用同一张图片吗？
A: 可以，但建议分别优化以获得最佳效果。

### Q: 图片需要多久更新一次？
A: 根据需要更新，通常在重大功能更新时更换。

---

**最后更新**: 2025-11-24
