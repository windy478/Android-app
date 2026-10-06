import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import vi from './vi.json';

const resources = {
  en: en,
  vi: vi,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    //nhận diện ngôn ngữ thiết bị
    lng: Localization.getLocales()[0]?.languageCode?.startsWith('vi') ? 'vi' : 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;