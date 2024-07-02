import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en, ja, zhHans } from './translations'

const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  'zh-Hans': {
    translation: zhHans,
  },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
})

export default i18n
