import { Button, Select, Progress, Card, Space, Typography, Tooltip } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVideoStore } from '../stores/videoStore';
import type { ExtractionConfig } from '../types';

const { Title, Text } = Typography;

export function FrameExtractor() {
  const { t } = useTranslation();
  const { currentVideo, isExtracting, extractionProgress, extractFrames } = useVideoStore();
  const [interval, setInterval] = useState<3 | 5 | 10>(5);

  const handleExtract = async () => {
    const config: ExtractionConfig = {
      interval,
      maxFrames: 100,
    };

    try {
      await extractFrames(config);
    } catch (error) {
      console.error('Extraction failed:', error);
    }
  };

  if (!currentVideo) {
    return null;
  }

  const estimatedFrames = Math.min(
    Math.floor(currentVideo.duration / interval),
    100
  );

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5}>{t('extractor.videoInfo')}</Title>
          <Text>{t('extractor.fileName')}：{currentVideo.name}</Text>
          <br />
          <Text>{t('extractor.duration')}：{Math.floor(currentVideo.duration)} {t('extractor.seconds')}</Text>
          <br />
          <Text>{t('extractor.fileSize')}：{(currentVideo.size / 1024 / 1024).toFixed(2)} MB</Text>
        </div>

        <div>
          <Title level={5}>{t('extractor.extractionConfig')}</Title>
          <Space>
            <Text>{t('extractor.interval')}：</Text>
            <Tooltip title={t('tooltips.extractInterval')}>
              <Select
                value={interval}
                onChange={setInterval}
                disabled={isExtracting}
                style={{ width: 120 }}
              >
                <Select.Option value={3}>3 {t('extractor.seconds')}</Select.Option>
                <Select.Option value={5}>5 {t('extractor.seconds')}</Select.Option>
                <Select.Option value={10}>10 {t('extractor.seconds')}</Select.Option>
              </Select>
            </Tooltip>
            <Text type="secondary">
              （{t('gallery.total')} {estimatedFrames} {t('gallery.frames')}）
            </Text>
          </Space>
        </div>

        {isExtracting && (
          <Progress
            percent={Math.floor(extractionProgress * 100)}
            status="active"
          />
        )}

        <Tooltip title={t('tooltips.startExtraction')}>
          <Button
            type="primary"
            onClick={handleExtract}
            loading={isExtracting}
            disabled={isExtracting}
            size="large"
          >
            {isExtracting ? t('extractor.extracting') : t('extractor.startExtraction')}
          </Button>
        </Tooltip>
      </Space>
    </Card>
  );
}
