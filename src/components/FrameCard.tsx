import { Card, Button, Typography, Space, Spin, message, Tooltip } from 'antd';
import { EyeOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { VideoFrame } from '../types';
import { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { useVideoStore } from '../stores/videoStore';
import { llmService } from '../services/llmService';

const { Text, Paragraph } = Typography;

interface FrameCardProps {
  frame: VideoFrame;
}

export function FrameCard({ frame }: FrameCardProps) {
  const { t } = useTranslation();
  const { llmConfig } = useConfigStore();
  const { updateFrameDescription, setAnalyzing } = useVideoStore();
  const [error, setError] = useState<string>('');

  // 统一的分析方法，避免代码重复
  const analyzeFrame = async (showSuccessMessage = false) => {
    if (!frame.imageBlob) {
      setError(t('frameCard.analysisError'));
      return;
    }

    // 检查LLM配置
    if (!llmConfig.endpoint || !llmConfig.model) {
      setError(t('frameCard.noConfigDesc'));
      return;
    }

    setAnalyzing(frame.id, true);
    setError('');

    try {
      const description = await llmService.analyzeImage(frame.imageBlob, llmConfig);
      updateFrameDescription(frame.id, description);
      if (showSuccessMessage) {
        message.success(t('frameCard.regenerateSuccess'));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`${t('frameCard.analysisError')}: ${errorMsg}`);
      setAnalyzing(frame.id, false);
    }
  };

  const handleAnalyze = () => analyzeFrame(false);
  const handleRegenerate = () => analyzeFrame(true);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(t('frameCard.copySuccess'));
    } catch (err) {
      message.error(t('frameCard.copyError'));
    }
  };

  const handleCopyAll = async () => {
    if (!frame.description) return;

    const allText = `${t('frameCard.enDescription')}:\n${frame.description.en}\n\n${t('frameCard.zhDescription')}:\n${frame.description.zh}`;
    try {
      await navigator.clipboard.writeText(allText);
      message.success(t('frameCard.copyAllSuccess'));
    } catch (err) {
      message.error(t('frameCard.copyError'));
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
          <img
            alt={`帧于 ${formatTimestamp(frame.timestamp)}`}
            src={frame.imageUrl}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Text strong>{t('frameCard.time')}：{formatTimestamp(frame.timestamp)}</Text>

        {frame.analyzing && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin tip={t('frameCard.analyzing')} />
          </div>
        )}

        {frame.description && !frame.analyzing && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text strong>{t('frameCard.enDescription')}：</Text>
              <Tooltip title={t('tooltips.copyDescription')}>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(frame.description!.en)}
                />
              </Tooltip>
            </div>
            <Paragraph ellipsis={{ rows: 2, expandable: true }} style={{ marginBottom: 12 }}>
              {frame.description.en}
            </Paragraph>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text strong>{t('frameCard.zhDescription')}：</Text>
              <Tooltip title={t('tooltips.copyDescription')}>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(frame.description!.zh)}
                />
              </Tooltip>
            </div>
            <Paragraph ellipsis={{ rows: 2, expandable: true }} style={{ marginBottom: 12 }}>
              {frame.description.zh}
            </Paragraph>

            <Space style={{ width: '100%' }} size="small">
              <Tooltip title={t('tooltips.copyAllDescriptions')}>
                <Button
                  type="dashed"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={handleCopyAll}
                  style={{ flex: 1 }}
                >
                  {t('frameCard.copyAll')}
                </Button>
              </Tooltip>
              <Tooltip title={t('tooltips.regenerateFrame')}>
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={handleRegenerate}
                  disabled={frame.analyzing}
                  style={{ flex: 1 }}
                >
                  {t('frameCard.regenerate')}
                </Button>
              </Tooltip>
            </Space>
          </div>
        )}

        {error && (
          <Text type="danger" style={{ fontSize: '12px' }}>
            {error}
          </Text>
        )}

        {!frame.description && !frame.analyzing && (
          <Tooltip title={t('tooltips.analyzeFrame')}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={handleAnalyze}
              block
            >
              {t('frameCard.analyze')}
            </Button>
          </Tooltip>
        )}
      </Space>
    </Card>
  );
}
