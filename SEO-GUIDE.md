# FrameSpeak SEO 优化指南

本文档说明 FrameSpeak 项目中实现的所有 SEO 优化措施。

## 📋 目录

1. [HTML Meta 标签](#html-meta-标签)
2. [Open Graph 标签](#open-graph-标签)
3. [结构化数据 (JSON-LD)](#结构化数据-json-ld)
4. [Robots.txt](#robotstxt)
5. [Sitemap.xml](#sitemapxml)
6. [动态 SEO](#动态-seo)
7. [部署前配置](#部署前配置)
8. [SEO 检查清单](#seo-检查清单)

---

## HTML Meta 标签

### 位置
`index.html`

### 包含的标签

#### 基础 Meta 标签
- `<title>` - 页面标题 (50-60字符最佳)
- `<meta name="description">` - 页面描述 (150-160字符最佳)
- `<meta name="keywords">` - 关键词 (不超过10个关键词)
- `<meta name="author">` - 作者信息
- `<meta name="robots">` - 搜索引擎爬虫指令
- `<meta name="theme-color">` - 浏览器主题色

#### 移动端优化
- `<meta name="viewport">` - 响应式设计
- `<meta name="mobile-web-app-capable">` - 移动端 Web 应用
- `<meta name="apple-mobile-web-app-capable">` - iOS Web 应用

---

## Open Graph 标签

### 用途
用于社交媒体（Facebook、LinkedIn 等）分享时的展示效果。

### 包含的标签
- `og:type` - 内容类型 (website)
- `og:url` - 页面 URL
- `og:title` - 分享标题
- `og:description` - 分享描述
- `og:image` - 分享图片 (推荐尺寸: 1200x630px)
- `og:site_name` - 网站名称
- `og:locale` - 语言区域设置

### Twitter Card 标签
- `twitter:card` - 卡片类型 (summary_large_image)
- `twitter:title` - Twitter 分享标题
- `twitter:description` - Twitter 分享描述
- `twitter:image` - Twitter 分享图片

---

## 结构化数据 (JSON-LD)

### 位置
`index.html` 中的 `<script type="application/ld+json">`

### Schema.org 类型
使用 `SoftwareApplication` 类型，包含：
- 应用名称和描述
- 应用分类
- 价格信息 (免费)
- 功能列表
- 评分信息

### 好处
- 帮助 Google 更好理解网站内容
- 可能在搜索结果中显示富媒体片段
- 提高点击率 (CTR)

---

## Robots.txt

### 位置
`public/robots.txt`

### 配置说明

```txt
User-agent: *
Allow: /
Sitemap: https://yourwebsite.com/sitemap.xml
Crawl-delay: 1
```

### 重要性
- 指导搜索引擎爬虫如何抓取网站
- 指定 sitemap 位置
- 控制爬取速率

---

## Sitemap.xml

### 位置
`public/sitemap.xml`

### 配置说明
包含网站的所有 URL，并支持多语言：
- 主页 (中文)
- 英文版本页面
- `hreflang` 标签指定语言版本

### 好处
- 帮助搜索引擎发现所有页面
- 加快索引速度
- 支持多语言 SEO

---

## 动态 SEO

### SEOHead 组件
位置：`src/components/SEOHead.tsx`

#### 功能
- 根据当前语言动态更新页面标题和描述
- 自动更新 Open Graph 标签
- 更新 HTML `lang` 属性

#### 使用方法
```tsx
<SEOHead
  title="自定义标题"
  description="自定义描述"
  keywords="关键词1,关键词2"
  ogImage="https://example.com/image.jpg"
/>
```

### i18n SEO 配置
位置：`src/locales/zh-CN.json` 和 `src/locales/en-US.json`

包含 `seo` 对象，定义了不同语言的：
- 页面标题
- 页面描述
- 关键词

---

## 部署前配置

### ⚠️ 必须修改的内容

#### 1. 更新网站 URL
在以下文件中将 `https://yourwebsite.com/` 替换为实际域名：
- `index.html` (canonical, og:url, twitter:url)
- `public/robots.txt`
- `public/sitemap.xml`

#### 2. 添加 Open Graph 图片
创建并上传以下图片：
- **OG 图片**: `public/og-image.jpg` (推荐: 1200x630px)
- **Twitter 图片**: `public/twitter-image.jpg` (推荐: 1200x675px)

图片要求：
- 格式: JPG, PNG
- 大小: < 5MB
- 包含品牌元素和应用截图

#### 3. 更新 Sitemap 日期
在 `public/sitemap.xml` 中更新 `<lastmod>` 标签为最新部署日期。

#### 4. 配置 Analytics (可选)
在 `index.html` 中添加 Google Analytics 或其他统计代码：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## SEO 检查清单

部署前请确认以下项目：

### 基础 SEO
- [ ] 所有 URL 已更新为实际域名
- [ ] 页面标题唯一且描述性强 (50-60字符)
- [ ] Meta 描述吸引人 (150-160字符)
- [ ] 关键词相关且不过度堆砌
- [ ] Robots.txt 配置正确
- [ ] Sitemap.xml 完整且最新

### 技术 SEO
- [ ] 网站加载速度快 (< 3秒)
- [ ] 移动端友好
- [ ] HTTPS 启用
- [ ] 无 404 错误
- [ ] URL 结构清晰
- [ ] 图片有 alt 属性

### Open Graph & 社交媒体
- [ ] OG 图片已创建并上传
- [ ] OG 标签正确配置
- [ ] Twitter Card 配置完成
- [ ] 社交媒体分享测试通过

### 结构化数据
- [ ] JSON-LD 数据有效
- [ ] Schema 类型正确
- [ ] 使用 [Google 结构化数据测试工具](https://search.google.com/test/rich-results) 验证

### 多语言 SEO
- [ ] hreflang 标签正确
- [ ] 每个语言版本都在 sitemap 中
- [ ] SEOHead 组件正常工作
- [ ] 语言切换正常

---

## 提交到搜索引擎

部署后，主动提交网站到搜索引擎：

### Google Search Console
1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加网站并验证所有权
3. 提交 sitemap: `https://yourwebsite.com/sitemap.xml`
4. 使用 URL 检查工具测试索引

### Bing Webmaster Tools
1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加网站并验证
3. 提交 sitemap
4. 启用 URL 提交 API (可选)

### 百度站长平台
1. 访问 [百度站长平台](https://ziyuan.baidu.com/)
2. 添加网站并验证
3. 提交 sitemap
4. 使用链接提交工具

---

## 性能优化

SEO 与网站性能密切相关，建议：

1. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用懒加载

2. **代码优化**
   - 启用代码分割
   - 使用 CDN
   - 启用 Gzip/Brotli 压缩

3. **缓存策略**
   - 设置合理的缓存头
   - 使用 Service Worker

4. **Core Web Vitals**
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

---

## 监控和维护

### 定期检查
- 每周检查 Google Search Console
- 监控关键词排名
- 分析用户行为数据
- 检查死链接

### 内容更新
- 定期更新 sitemap
- 保持内容新鲜
- 修复 SEO 问题

### 性能监控
- 使用 [PageSpeed Insights](https://pagespeed.web.dev/)
- 使用 [GTmetrix](https://gtmetrix.com/)
- 监控服务器响应时间

---

## 工具和资源

### SEO 工具
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Google Analytics](https://analytics.google.com/)
- [Ahrefs](https://ahrefs.com/) (付费)
- [SEMrush](https://www.semrush.com/) (付费)

### 测试工具
- [Google 结构化数据测试工具](https://search.google.com/test/rich-results)
- [Facebook 分享调试器](https://developers.facebook.com/tools/debug/)
- [Twitter Card 验证器](https://cards-dev.twitter.com/validator)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### 学习资源
- [Google SEO 指南](https://developers.google.com/search/docs)
- [Moz SEO 学习中心](https://moz.com/learn/seo)
- [百度搜索资源平台](https://ziyuan.baidu.com/)

---

## 常见问题

### Q: 多久能看到 SEO 效果？
A: 通常需要 3-6 个月才能看到明显效果。新网站可能需要更长时间。

### Q: 如何提高排名？
A:
1. 创建高质量内容
2. 获取外部链接
3. 提高网站速度
4. 优化用户体验
5. 保持内容更新

### Q: 需要付费 SEO 工具吗？
A: 初期使用免费工具（Google Search Console, Google Analytics）即可。随着规模增长，可考虑付费工具。

---

## 联系和支持

如有 SEO 相关问题，请通过以下方式联系：
- GitHub Issues
- 项目文档

---

**最后更新**: 2025-11-24
