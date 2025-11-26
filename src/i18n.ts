import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// 获取浏览器语言或使用保存的语言
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.toLowerCase();
const defaultLanguage = savedLanguage || (browserLanguage.startsWith('zh') ? 'zh-CN' : 'en-US');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: zhCN,
      },
      'en-US': {
        translation: enUS,
      },
    },
    lng: defaultLanguage,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
  });

// 监听语言变化并保存到 localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  // 更新 HTML lang 属性
  document.documentElement.lang = lng;
});

export default i18n;
