import { useState, useEffect } from 'react';
import { Layout, Typography, Button, Space, Divider, Alert, Dropdown, Tooltip } from 'antd';
import { SettingOutlined, DeleteOutlined, GlobalOutlined, GithubOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { VideoUploader } from './components/VideoUploader';
import { FrameExtractor } from './components/FrameExtractor';
import { FrameGallery } from './components/FrameGallery';
import { LLMConfigModal } from './components/LLMConfigModal';
import { SEOHead } from './components/SEOHead';
import { useVideoStore } from './stores/videoStore';
import { useConfigStore } from './stores/configStore';

const { Header, Content, Footer } = Layout;
const { Title, Text, Link } = Typography;

function App() {
  const { t, i18n } = useTranslation();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { currentVideo, clearVideo, frames } = useVideoStore();
  const { loadLLMConfig } = useConfigStore();
  const [showConfigWarning, setShowConfigWarning] = useState(false);
  const [hasUserConfig, setHasUserConfig] = useState(false);
  const [showWelcomeTip, setShowWelcomeTip] = useState(false);

  useEffect(() => {
    loadLLMConfig();
    // 检查初始配置
    const savedConfig = localStorage.getItem('llm_config');
    const welcomeDismissed = localStorage.getItem('welcome_dismissed');
    setHasUserConfig(savedConfig !== null);

    // 如果没有配置且没有关闭过欢迎提示，则显示
    if (!savedConfig && !welcomeDismissed) {
      setShowWelcomeTip(true);
    }
  }, [loadLLMConfig]);

  // 检查用户是否保存过配置
  const checkUserConfig = () => {
    const savedConfig = localStorage.getItem('llm_config');
    setHasUserConfig(savedConfig !== null);
  };

  // 检查是否需要显示配置警告
  useEffect(() => {
    if (frames.length > 0 && !hasUserConfig) {
      setShowConfigWarning(true);
    } else {
      setShowConfigWarning(false);
    }
  }, [frames.length, hasUserConfig]);

  // 当配置弹窗关闭时，重新检查配置
  const handleConfigModalClose = () => {
    setConfigModalOpen(false);
    checkUserConfig();
    // 如果配置成功，关闭欢迎提示
    const savedConfig = localStorage.getItem('llm_config');
    if (savedConfig) {
      setShowWelcomeTip(false);
      localStorage.setItem('welcome_dismissed', 'true');
    }
  };

  // 关闭欢迎提示
  const handleDismissWelcome = () => {
    setShowWelcomeTip(false);
    localStorage.setItem('welcome_dismissed', 'true');
  };

  // 切换语言
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageMenuItems = [
    {
      key: 'zh-CN',
      label: '简体中文',
      onClick: () => changeLanguage('zh-CN'),
    },
    {
      key: 'en-US',
      label: 'English',
      onClick: () => changeLanguage('en-US'),
    },
  ];

  return (
    <>
      <SEOHead />
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ margin: 0 }}>
          {t('app.title')}
        </Title>
        <Space>
          <Tooltip title={t('tooltips.languageSwitch')}>
            <Dropdown menu={{ items: languageMenuItems }}>
              <Button icon={<GlobalOutlined />}>
                {i18n.language === 'zh-CN' ? '简体中文' : 'English'}
              </Button>
            </Dropdown>
          </Tooltip>
          <Tooltip title={t('tooltips.llmConfig')}>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setConfigModalOpen(true)}
            >
              {t('app.llmConfig')}
            </Button>
          </Tooltip>
        </Space>
      </Header>

      {/* Logo Banner */}
      <div style={{
        background: '#fff',
        padding: '20px 24px',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <img
          src="/logo-banner.png"
          alt="FrameSpeak Logo"
          style={{
            maxWidth: '300px',
            width: '100%',
            height: 'auto',
            display: 'inline-block'
          }}
        />
      </div>

      <Content style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 首次访问欢迎提示 */}
          {showWelcomeTip && (
            <Alert
              message={t('app.welcomeTitle')}
              description={t('app.welcomeDesc')}
              type="info"
              showIcon
              closable
              onClose={handleDismissWelcome}
              action={
                <Button type="primary" onClick={() => setConfigModalOpen(true)}>
                  {t('app.configNow')}
                </Button>
              }
              style={{ marginBottom: 0 }}
            />
          )}

          {!hasUserConfig && !showWelcomeTip && (
            <Alert
              message={t('app.setupReminder')}
              type="warning"
              showIcon
              closable={false}
              action={
                <Button size="small" type="link" onClick={() => setConfigModalOpen(true)}>
                  {t('app.llmConfig')}
                </Button>
              }
              style={{ marginBottom: 0 }}
            />
          )}

          {!currentVideo ? (
            <div>
              <Title level={4}>{t('app.uploadVideo')}</Title>
              <Text type="secondary">
                {t('app.uploadVideoDesc')}
              </Text>
              <Divider />
              <VideoUploader />
            </div>
          ) : (
            <>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4}>{t('app.videoLoaded')}</Title>
                <Tooltip title={t('tooltips.clearVideo')}>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => clearVideo()}
                  >
                    {t('app.clearVideo')}
                  </Button>
                </Tooltip>
              </Space>
              <FrameExtractor />
              <Divider />
              {showConfigWarning && (
                <Alert
                  message={t('app.configWarning')}
                  description={t('app.configWarningDesc')}
                  type="warning"
                  showIcon
                  closable
                  onClose={() => setShowConfigWarning(false)}
                  action={
                    <Button size="small" type="primary" onClick={() => setConfigModalOpen(true)}>
                      {t('app.configNow')}
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                />
              )}
              <FrameGallery />
            </>
          )}
        </Space>
      </Content>

        <LLMConfigModal
          open={configModalOpen}
          onClose={handleConfigModalClose}
        />

        <Footer style={{
          textAlign: 'center',
          background: '#f5f5f5',
          borderTop: '1px solid #e8e8e8',
          padding: '16px 24px'
        }}>
          <Space split={<Divider type="vertical" />}>
            <Text type="secondary">
              © 2025 FrameSpeak
            </Text>
            <Link
              href="https://github.com/1433744303/FrameSpeak"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              <Space size={4}>
                <GithubOutlined />
                <span>GitHub</span>
              </Space>
            </Link>
          </Space>
        </Footer>
      </Layout>
    </>
  );
}

export default App;
