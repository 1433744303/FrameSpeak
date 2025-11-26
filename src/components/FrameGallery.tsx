import { Row, Col, Button, Space, Typography, message, Tooltip } from 'antd';
import { ThunderboltOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useVideoStore } from '../stores/videoStore';
import { useConfigStore } from '../stores/configStore';
import { FrameCard } from './FrameCard';
import { llmService } from '../services/llmService';
import { useState } from 'react';

const { Title, Text } = Typography;

export function FrameGallery() {
  const { t } = useTranslation();
  const { frames, updateFrameDescription, setAnalyzing } = useVideoStore();
  const { llmConfig } = useConfigStore();
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const handleBatchAnalyze = async () => {
    // 检查LLM配置
    if (!llmConfig.endpoint || !llmConfig.model) {
      message.error(t('gallery.noConfigWarning'));
      return;
    }

    const framesToAnalyze = frames.filter(f => !f.description && f.imageBlob);
    if (framesToAnalyze.length === 0) return;

    setIsBatchProcessing(true);
    setBatchProgress({ current: 0, total: framesToAnalyze.length });

    let successCount = 0;
    let failCount = 0;

    // 并发控制：每次处理3个frame
    const CONCURRENT_LIMIT = 3;

    for (let i = 0; i < framesToAnalyze.length; i += CONCURRENT_LIMIT) {
      const batch = framesToAnalyze.slice(i, i + CONCURRENT_LIMIT);

      // 标记当前批次为分析中
      batch.forEach(frame => setAnalyzing(frame.id, true));

      // 并发处理当前批次
      const results = await Promise.allSettled(
        batch.map(frame =>
          llmService.analyzeImage(frame.imageBlob!, llmConfig)
            .then(description => ({ frame, description, success: true }))
            .catch(error => ({ frame, error, success: false }))
        )
      );

      // 处理结果
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const value = result.value;
          if (value.success && 'description' in value) {
            updateFrameDescription(value.frame.id, value.description);
            successCount++;
          } else if (!value.success && 'error' in value) {
            console.error(`Failed to analyze frame ${value.frame.id}:`, value.error);
            setAnalyzing(value.frame.id, false);
            failCount++;
          }
        } else {
          failCount++;
        }
      });

      setBatchProgress({ current: Math.min(i + CONCURRENT_LIMIT, framesToAnalyze.length), total: framesToAnalyze.length });
    }

    setIsBatchProcessing(false);

    // 显示完成提示
    if (failCount === 0) {
      message.success(t('gallery.analysisComplete'));
    } else if (successCount === 0) {
      message.error(`${t('frameCard.analysisError')}: ${failCount} ${t('gallery.frames')}`);
    } else {
      message.warning(`${successCount} ${t('gallery.analyzed')}, ${failCount} ${t('frameCard.analysisError')}`);
    }
  };

  const handleExportAll = () => {
    const analyzedFrames = frames.filter(f => f.description);
    if (analyzedFrames.length === 0) {
      message.warning(t('gallery.noFrames'));
      return;
    }

    let exportText = `# FrameSpeak ${t('gallery.title')}\n\n`;
    exportText += `${t('gallery.total')}: ${frames.length}\n`;
    exportText += `${t('gallery.analyzed')}: ${analyzedFrames.length}\n\n`;
    exportText += '---\n\n';

    analyzedFrames.forEach((frame, index) => {
      const mins = Math.floor(frame.timestamp / 60);
      const secs = Math.floor(frame.timestamp % 60);
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

      exportText += `## ${t('gallery.frames')} ${index + 1} (${t('frameCard.time')}: ${timeStr})\n\n`;
      exportText += `**${t('frameCard.enDescription')}:**\n${frame.description!.en}\n\n`;
      exportText += `**${t('frameCard.zhDescription')}:**\n${frame.description!.zh}\n\n`;
      exportText += '---\n\n';
    });

    // 创建Blob并下载
    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `framespeak-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success(t('gallery.exportSuccess'));
  };

  if (frames.length === 0) {
    return null;
  }

  const unanalyzedCount = frames.filter(f => !f.description).length;
  const analyzedCount = frames.filter(f => f.description).length;

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }} size="middle">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('gallery.title')} ({frames.length})
            {analyzedCount > 0 && (
              <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>
                - {t('gallery.analyzed')} {analyzedCount} {t('gallery.frames')}
              </Text>
            )}
          </Title>

          <Space>
            {analyzedCount > 0 && (
              <Tooltip title={t('tooltips.exportAll')}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportAll}
                >
                  {t('gallery.exportAll')}
                </Button>
              </Tooltip>
            )}
            {unanalyzedCount > 0 && (
              <Tooltip title={t('tooltips.batchAnalyze')}>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={handleBatchAnalyze}
                  loading={isBatchProcessing}
                  disabled={isBatchProcessing}
                >
                  {isBatchProcessing
                    ? `${t('gallery.analyzing')} ${batchProgress.current}/${batchProgress.total}...`
                    : `${t('gallery.analyzeAll')} (${unanalyzedCount})`}
                </Button>
              </Tooltip>
            )}
          </Space>
        </div>

        {isBatchProcessing && (
          <Text type="secondary">
            {batchProgress.current} / {batchProgress.total} {t('gallery.frames')} {t('gallery.analyzed')}
          </Text>
        )}
      </Space>

      <Row gutter={[16, 16]}>
        {frames.map((frame) => (
          <Col key={frame.id} xs={24} sm={12} md={8} lg={6}>
            <FrameCard frame={frame} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
