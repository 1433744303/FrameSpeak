# Tooltip 工具提示功能

## 功能概述

为 FrameSpeak 应用的所有主要按钮和交互元素添加了 Tooltip 工具提示，帮助用户理解每个功能的作用。

## 实现的 Tooltips

### 1. 主应用界面 (App.tsx)

| 元素 | Tooltip 内容（中文） | Tooltip 内容（英文） |
|------|---------------------|---------------------|
| 语言切换按钮 | 切换界面语言 | Switch interface language |
| LLM 配置按钮 | 配置 LLM 服务（Ollama、OpenAI、LM Studio） | Configure LLM service (Ollama, OpenAI, LM Studio) |
| 清除视频按钮 | 清除当前视频和所有已提取的帧 | Clear current video and all extracted frames |

### 2. 视频上传组件 (VideoUploader.tsx)

上传区域已有明确的文字说明，无需额外 tooltip。

### 3. 帧提取组件 (FrameExtractor.tsx)

| 元素 | Tooltip 内容（中文） | Tooltip 内容（英文） |
|------|---------------------|---------------------|
| 间隔选择下拉框 | 设置每隔几秒提取一帧图片 | Set the interval between extracted frames in seconds |
| 开始提取按钮 | 开始从视频中提取帧图片 | Start extracting frames from the video |

### 4. 帧画廊组件 (FrameGallery.tsx)

| 元素 | Tooltip 内容（中文） | Tooltip 内容（英文） |
|------|---------------------|---------------------|
| 批量分析按钮 | 使用 AI 批量分析所有未分析的帧 | Batch analyze all unanalyzed frames with AI |
| 导出全部按钮 | 将所有已分析帧的描述导出为 Markdown 文件 | Export all analyzed frame descriptions to a Markdown file |

### 5. 帧卡片组件 (FrameCard.tsx)

| 元素 | Tooltip 内容（中文） | Tooltip 内容（英文） |
|------|---------------------|---------------------|
| 分析按钮 | 使用 AI 分析此帧并生成中英文描述 | Analyze this frame with AI and generate bilingual descriptions |
| 复制描述按钮 | 复制此描述到剪贴板 | Copy this description to clipboard |
| 复制全部按钮 | 复制英文和中文描述到剪贴板 | Copy both English and Chinese descriptions to clipboard |
| 重新生成按钮 | 重新生成此帧的描述（会覆盖原有描述） | Regenerate description for this frame (will overwrite existing) |

## 技术实现

### i18n 配置

在 `src/locales/zh-CN.json` 和 `src/locales/en-US.json` 中添加了 `tooltips` 对象：

```json
{
  "tooltips": {
    "languageSwitch": "切换界面语言",
    "llmConfig": "配置 LLM 服务（Ollama、OpenAI、LM Studio）",
    "clearVideo": "清除当前视频和所有已提取的帧",
    "uploadVideo": "支持拖拽上传或点击选择视频文件",
    "extractInterval": "设置每隔几秒提取一帧图片",
    "startExtraction": "开始从视频中提取帧图片",
    "batchAnalyze": "使用 AI 批量分析所有未分析的帧",
    "exportAll": "将所有已分析帧的描述导出为 Markdown 文件",
    "analyzeFrame": "使用 AI 分析此帧并生成中英文描述",
    "regenerateFrame": "重新生成此帧的描述（会覆盖原有描述）",
    "copyDescription": "复制此描述到剪贴板",
    "copyAllDescriptions": "复制英文和中文描述到剪贴板"
  }
}
```

### 使用方式

使用 Ant Design 的 Tooltip 组件包裹需要提示的元素：

```tsx
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<Tooltip title={t('tooltips.buttonName')}>
  <Button>按钮文字</Button>
</Tooltip>
```

## 用户体验优化

### 1. 悬停触发
- 鼠标悬停在按钮上 0.5 秒后自动显示 tooltip
- 移开鼠标后 tooltip 自动消失

### 2. 明确说明
- 每个 tooltip 都清楚说明该功能的作用
- 对于可能造成数据丢失的操作（如"重新生成"），在 tooltip 中明确提示

### 3. 多语言支持
- 所有 tooltip 都支持中英文切换
- 切换语言后 tooltip 自动更新

### 4. 一致性
- 所有 tooltip 使用统一的显示样式
- 文字描述遵循统一的格式和语气

## 显示位置

Ant Design Tooltip 会根据屏幕位置自动调整显示方向：
- 默认显示在元素上方
- 如果上方空间不足，自动调整到下方或侧边
- 确保 tooltip 始终可见，不会被遮挡

## 特殊考虑

### 禁用状态
当按钮处于禁用状态时，tooltip 仍然可见，帮助用户理解为什么按钮不可用。

### 移动端适配
在触摸设备上：
- 点按元素会显示 tooltip
- 再次点击会执行按钮功能
- 建议在移动端使用时依赖明确的按钮文字

## 使用建议

### 何时使用 Tooltip

✅ **应该使用：**
- 图标按钮（无文字说明）
- 功能不明显的按钮
- 可能造成数据丢失的操作
- 需要额外说明的配置项

❌ **不需要使用：**
- 文字说明已经很清楚的按钮
- 大型文本区域
- 已有其他形式说明的元素（如表单的 label）

### Tooltip 文字建议

1. **简洁明了**: 一句话说明功能，不超过 20 字
2. **动词开头**: 使用"配置"、"分析"、"导出"等动词
3. **说明结果**: 告诉用户操作后会发生什么
4. **警告重要操作**: 对于不可逆操作，明确提示用户

## 示例代码

### 基础用法

```tsx
<Tooltip title="这是提示文字">
  <Button>按钮</Button>
</Tooltip>
```

### 带翻译

```tsx
const { t } = useTranslation();

<Tooltip title={t('tooltips.configButton')}>
  <Button icon={<SettingOutlined />}>
    {t('app.config')}
  </Button>
</Tooltip>
```

### 包裹 Dropdown

```tsx
<Tooltip title={t('tooltips.languageSwitch')}>
  <Dropdown menu={{ items: menuItems }}>
    <Button icon={<GlobalOutlined />}>
      语言
    </Button>
  </Dropdown>
</Tooltip>
```

## 维护指南

### 添加新 Tooltip

1. 在 `src/locales/zh-CN.json` 的 `tooltips` 对象中添加新的 key
2. 在 `src/locales/en-US.json` 中添加对应的英文翻译
3. 在组件中使用 `t('tooltips.yourKey')` 获取文字
4. 用 Tooltip 组件包裹需要提示的元素

### 更新 Tooltip 文字

直接修改 i18n 资源文件中的对应文字即可，无需修改组件代码。

### 移除 Tooltip

1. 从组件中移除 Tooltip 包裹
2. 可选：从 i18n 资源文件中删除不再使用的 key

## 未来改进

### 1. 帮助气泡
为复杂功能添加更详细的帮助气泡（Popover），包含：
- 功能说明
- 使用步骤
- 注意事项
- 示例图片

### 2. 新手引导
结合 tooltip 实现分步引导教程，引导新用户了解应用功能。

### 3. 快捷键提示
在 tooltip 中显示对应的快捷键（如果有）。

### 4. 视频教程
tooltip 中添加"查看教程"链接，打开相关的视频教程。

## 测试建议

### 功能测试
- ✅ 悬停时 tooltip 正常显示
- ✅ 移开鼠标后 tooltip 消失
- ✅ 切换语言后 tooltip 文字更新
- ✅ 禁用按钮的 tooltip 仍然可见
- ✅ 移动端点击触发 tooltip

### 文字测试
- ✅ 中文 tooltip 语句通顺
- ✅ 英文 tooltip 语法正确
- ✅ 描述准确反映功能
- ✅ 没有错别字或翻译错误

### 视觉测试
- ✅ Tooltip 位置合适，不遮挡内容
- ✅ 在不同屏幕尺寸下显示正常
- ✅ 深色模式下 tooltip 可读性好

## 常见问题

### Q: Tooltip 不显示？
A:
- 检查是否正确导入 Tooltip 组件
- 确认 tooltip 文字不为空
- 检查元素是否被其他元素遮挡

### Q: 如何自定义 tooltip 样式？
A: 使用 Ant Design 的 overlayInnerStyle 或 overlayClassName 属性

### Q: Tooltip 在移动端如何表现？
A: 首次点击显示 tooltip，再次点击执行操作

### Q: 如何禁用某个 tooltip？
A: 不使用 Tooltip 组件包裹，或设置 `visible={false}`

---

**更新日期**: 2025-11-24
