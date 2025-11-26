import { Modal, Form, Input, InputNumber, Select, Button, message, Space, Alert } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../stores/configStore';
import type { LLMConfig } from '../types';
import { llmService } from '../services/llmService';

interface LLMConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export function LLMConfigModal({ open, onClose }: LLMConfigModalProps) {
  const { t } = useTranslation();
  const { llmConfig, setLLMConfig } = useConfigStore();
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const providerEndpoints = {
    ollama: 'http://localhost:11434/api/chat',
    openai: 'https://api.openai.com/v1/chat/completions',
    lmstudio: 'http://localhost:1234/v1/chat/completions',
    custom: '',
  };

  const providerModels = {
    ollama: ['llava:latest', 'llava:13b', 'bakllava:latest'],
    openai: ['gpt-4-vision-preview', 'gpt-4o'],
    lmstudio: ['local-model'],
    custom: [],
  };

  const handleProviderChange = (provider: LLMConfig['provider']) => {
    form.setFieldsValue({
      endpoint: providerEndpoints[provider],
      model: providerModels[provider][0] || '',
    });
  };

  const handleTest = async () => {
    console.log('🔍 开始测试连接...');
    setTestResult(null); // 清除之前的结果

    try {
      const values = await form.validateFields();
      console.log('📝 表单验证通过:', values);

      setTesting(true);

      const testConfig: LLMConfig = {
        ...values,
      };

      try {
        console.log('🚀 调用testConnection...', testConfig);
        const isConnected = await llmService.testConnection(testConfig);
        console.log('✅ testConnection返回:', isConnected);

        if (isConnected) {
          console.log('✅ 连接成功，显示成功提示');
          setTestResult({ type: 'success', message: t('llmConfig.connectionSuccess') });
          message.success(t('llmConfig.connectionSuccess'), 3);
        } else {
          console.log('❌ 连接失败（返回false），显示失败提示');
          setTestResult({ type: 'error', message: t('llmConfig.connectionError') });
          message.error(t('llmConfig.connectionError'), 3);
        }
      } catch (testError) {
        const errorMsg = testError instanceof Error ? testError.message : String(testError);
        console.error('❌ testConnection抛出异常:', errorMsg);
        setTestResult({ type: 'error', message: `${t('llmConfig.connectionError')}: ${errorMsg}` });
        message.error(`${t('llmConfig.connectionError')}: ${errorMsg}`, 5);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('❌ 表单验证或其他错误:', errorMsg);
      setTestResult({ type: 'error', message: `${t('llmConfig.testError')}: ${errorMsg}` });
      message.error(`${t('llmConfig.testError')}: ${errorMsg}`, 3);
    } finally {
      console.log('🏁 测试连接完成，设置testing=false');
      setTesting(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const config: LLMConfig = {
        ...values,
      };
      setLLMConfig(config);
      message.success(t('llmConfig.configSaved'));
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={t('llmConfig.title')}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="test" onClick={handleTest} loading={testing}>
          {t('llmConfig.testConnection')}
        </Button>,
        <Button key="cancel" onClick={onClose}>
          {t('llmConfig.cancel')}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {t('llmConfig.save')}
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={llmConfig}
      >
        <Form.Item
          label={t('llmConfig.provider')}
          name="provider"
          rules={[{ required: true }]}
        >
          <Select onChange={handleProviderChange}>
            <Select.Option value="ollama">{t('llmConfig.providerOllama')}</Select.Option>
            <Select.Option value="openai">{t('llmConfig.providerOpenAI')}</Select.Option>
            <Select.Option value="lmstudio">{t('llmConfig.providerLMStudio')}</Select.Option>
            <Select.Option value="custom">{t('llmConfig.providerCustom')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('llmConfig.endpoint')}
          name="endpoint"
          rules={[{ required: true, message: t('llmConfig.endpointRequired') }]}
        >
          <Input placeholder={t('llmConfig.endpointPlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('llmConfig.model')}
          name="model"
          rules={[{ required: true, message: t('llmConfig.modelRequired') }]}
        >
          <Input placeholder={t('llmConfig.modelPlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('llmConfig.apiKey')}
          name="apiKey"
          tooltip={t('llmConfig.apiKeyTooltip')}
        >
          <Input.Password placeholder={t('llmConfig.apiKeyPlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('llmConfig.customPrompt')}
          name="customPrompt"
          tooltip={t('llmConfig.customPromptTooltip')}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('llmConfig.customPromptPlaceholder')}
          />
        </Form.Item>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item
            label={t('llmConfig.temperature')}
            name="temperature"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={2} step={0.1} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item
            label={t('llmConfig.maxTokens')}
            name="maxTokens"
            rules={[{ required: true }]}
            tooltip={t('llmConfig.maxTokensTooltip')}
          >
            <InputNumber min={500} max={8192} step={100} style={{ width: 120 }} />
          </Form.Item>
        </Space>
      </Form>

      {testResult && (
        <Alert
          message={testResult.type === 'success' ? t('llmConfig.connectionSuccess').split(':')[0] : t('llmConfig.connectionError')}
          description={testResult.message}
          type={testResult.type}
          showIcon
          closable
          onClose={() => setTestResult(null)}
          style={{ marginTop: 16 }}
        />
      )}

      <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
          <strong>{t('llmConfig.tips.title')}</strong>
          <br />
          - {t('llmConfig.tips.ollama')}
          <br />
          - {t('llmConfig.tips.openai')}
          <br />
          - {t('llmConfig.tips.lmstudio')}
          <br />
          <br />
          <strong>{t('llmConfig.tips.imageGenTitle')}</strong>
          <br />
          - {t('llmConfig.tips.imageGen1')}
          <br />
          - {t('llmConfig.tips.imageGen2')}
          <br />
          - {t('llmConfig.tips.imageGen3')}
          <br />
          - {t('llmConfig.tips.imageGen4')}
        </p>
      </div>
    </Modal>
  );
}
