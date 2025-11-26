# 重新生成描述功能

## 功能概述

为已分析的视频帧添加了"重新生成"按钮，允许用户对 AI 生成的描述不满意时重新生成新的描述。

## 功能位置

在每个已分析的帧卡片底部，与"复制全部"按钮并排显示。

## 使用方法

1. 上传视频并提取帧
2. 使用"分析"按钮生成描述
3. 如果对生成的描述不满意，点击"重新生成"按钮
4. 系统将重新调用 LLM 生成新的描述
5. 成功后显示提示消息

## 界面布局

```
+----------------------------------------+
|  [帧图片]                               |
+----------------------------------------+
|  时间: 0:05                             |
|                                        |
|  英文描述: [描述内容]     [复制]        |
|  中文描述: [描述内容]     [复制]        |
|                                        |
|  [复制全部]  [重新生成]                 |
+----------------------------------------+
```

## 按钮状态

### 显示条件
- ✅ 帧已经有生成的描述
- ✅ 未在分析中

### 禁用条件
- ❌ 正在分析中（显示为禁用状态）

### 按钮样式
- 图标: 刷新图标 (ReloadOutlined)
- 尺寸: small
- 宽度: 与"复制全部"按钮等宽（flex: 1）

## 功能特性

### 1. 保持原有分析逻辑
重新生成使用与首次分析相同的逻辑：
- 检查图片数据
- 验证 LLM 配置
- 调用 LLM 服务
- 更新描述

### 2. 成功提示
重新生成成功后显示提示消息：
- 中文: "重新生成成功！"
- 英文: "Regenerated successfully!"

### 3. 错误处理
如果重新生成失败：
- 显示错误消息
- 保留原有描述
- 不会清空已有内容

### 4. 分析状态指示
重新生成时：
- 显示"分析中..."加载状态
- 按钮变为禁用
- 无法再次点击

## 技术实现

### 新增函数
```typescript
const handleRegenerate = async () => {
  // 1. 验证图片数据
  if (!frame.imageBlob) {
    setError(t('frameCard.analysisError'));
    return;
  }

  // 2. 检查LLM配置
  if (!llmConfig.endpoint || !llmConfig.model) {
    setError(t('frameCard.noConfigDesc'));
    return;
  }

  // 3. 设置分析状态
  setAnalyzing(frame.id, true);
  setError('');

  try {
    // 4. 调用 LLM 分析
    const description = await llmService.analyzeImage(frame.imageBlob, llmConfig);

    // 5. 更新描述
    updateFrameDescription(frame.id, description);

    // 6. 显示成功消息
    message.success(t('frameCard.regenerateSuccess'));
  } catch (err) {
    // 7. 处理错误
    const errorMsg = err instanceof Error ? err.message : String(err);
    setError(`${t('frameCard.analysisError')}: ${errorMsg}`);
    setAnalyzing(frame.id, false);
  }
};
```

### UI 实现
```tsx
<Space style={{ width: '100%' }} size="small">
  <Button
    type="dashed"
    size="small"
    icon={<CopyOutlined />}
    onClick={handleCopyAll}
    style={{ flex: 1 }}
  >
    {t('frameCard.copyAll')}
  </Button>
  <Button
    size="small"
    icon={<ReloadOutlined />}
    onClick={handleRegenerate}
    disabled={frame.analyzing}
    style={{ flex: 1 }}
  >
    {t('frameCard.regenerate')}
  </Button>
</Space>
```

## i18n 支持

### 中文 (zh-CN)
```json
{
  "frameCard": {
    "regenerate": "重新生成",
    "regenerating": "重新生成中...",
    "regenerateSuccess": "重新生成成功！"
  }
}
```

### 英文 (en-US)
```json
{
  "frameCard": {
    "regenerate": "Regenerate",
    "regenerating": "Regenerating...",
    "regenerateSuccess": "Regenerated successfully!"
  }
}
```

## 使用场景

### 场景 1: 描述不准确
用户发现 AI 生成的描述不够准确或遗漏了重要细节，可以重新生成。

### 场景 2: 调整配置后重试
用户修改了 LLM 配置（如切换模型、调整温度参数），想用新配置重新分析。

### 场景 3: 优化提示词后重试
用户在 LLM 配置中自定义了提示词，想测试新提示词的效果。

### 场景 4: LLM 服务恢复后重试
之前因为 LLM 服务问题导致分析失败，服务恢复后可以重新生成。

## 注意事项

### 1. 覆盖原有描述
重新生成会完全覆盖原有描述，无法恢复。如果需要保留多个版本，建议先复制原描述。

### 2. 并发限制
重新生成时会设置分析状态，防止同时触发多次分析。

### 3. 网络和服务依赖
重新生成需要：
- LLM 服务正常运行
- 网络连接正常
- 有效的 LLM 配置

### 4. 响应时间
重新生成的响应时间取决于：
- LLM 模型大小
- 网络速度
- 服务器性能
- 图片复杂度

通常为 5-30 秒。

## 未来优化建议

### 1. 历史版本
保存多个生成版本，允许用户在不同版本间切换。

### 2. 对比视图
并排显示新旧描述，方便用户对比选择。

### 3. 快速配置
添加快捷方式，无需打开配置弹窗即可调整关键参数。

### 4. 批量重新生成
为选中的多个帧批量重新生成描述。

### 5. 生成参数记录
记录每次生成使用的配置参数，便于追溯。

---

**更新日期**: 2025-11-24
