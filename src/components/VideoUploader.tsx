import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useVideoStore } from '../stores/videoStore';

const { Dragger } = Upload;

export function VideoUploader() {
  const { t } = useTranslation();
  const { loadVideo } = useVideoStore();

  const handleUpload = async (file: File) => {
    // 检查文件类型
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      message.error(t('uploader.invalidFileType'));
      return false;
    }

    // 检查文件大小（限制为500MB）
    const isLt500M = file.size / 1024 / 1024 < 500;
    if (!isLt500M) {
      message.error(t('uploader.fileSizeExceeded'));
      return false;
    }

    try {
      await loadVideo(file);
      message.success(t('uploader.uploadSuccess'));
    } catch (error) {
      message.error(t('uploader.uploadError') + ': ' + error);
    }

    return false; // 阻止自动上传
  };

  return (
    <Dragger
      name="video"
      multiple={false}
      beforeUpload={handleUpload}
      showUploadList={false}
      accept="video/*"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t('uploader.dragTip')}</p>
      <p className="ant-upload-hint">
        {t('uploader.supportTip')}
      </p>
    </Dragger>
  );
}
