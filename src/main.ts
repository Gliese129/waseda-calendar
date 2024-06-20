import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { store, key } from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VNumberInput, VTimePicker } from 'vuetify/labs/components'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'
import 'virtual:uno.css'

// i18n
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
// @ts-ignore-next-line
import { createI18n, useI18n } from 'vue-i18n'
import { en, ja, zhHans } from 'vuetify/locale'

import enUs from './locales/en.json'
import jaJp from './locales/ja.json'
import zh_Hans from './locales/zhHans.json'

type MessageSchema = typeof enUs & {
    $vuetify: typeof en
}

// Plugins
import { globalNotifyPlugin } from '@/components/plugins/message-alert'

const i18n = createI18n<[MessageSchema], 'en-US' | 'ja-JP' | 'zh-Hans'>({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',

    messages: {
        'en-US': {
            $vuetify: {
                ...en,
            },
            ...enUs,
        },
        'ja-JP': {
            $vuetify: {
                ...ja,
            },
            ...jaJp,
        },
        'zh-Hans': {
            $vuetify: {
                ...zhHans,
            },
            ...zh_Hans,
        },
    },
    datetimeFormats: {
        'en-US': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
            },
            weekday: {
                weekday: 'short',
            },
            weekdayLong: {
                weekday: 'long',
            },
            date: {
                month: 'numeric',
                day: 'numeric',
            },
        },
        'ja-JP': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
            },
            weekday: {
                weekday: 'short',
            },
            weekdayLong: {
                weekday: 'long',
            },
            date: {
                month: 'numeric',
                day: 'numeric',
            },
        },
        'zh-Hans': {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
            },
            weekday: {
                weekday: 'short',
            },
            weekdayLong: {
                weekday: 'long',
            },
            date: {
                month: 'numeric',
                day: 'numeric',
            },
        },
    },
})

const vuetify = createVuetify({
    components: {
        VNumberInput,
        VTimePicker,
        ...components,
    },
    directives,
    display: {
        mobileBreakpoint: 'sm',
    },
    locale: {
    // @ts-ignore-next-line
        adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
})

const app = createApp(App)

app.use(router).use(store, key).use(i18n).use(vuetify)

app.use(globalNotifyPlugin)

app.config.warnHandler = (msg, vm, trace) => {
    // ignore Non-function value encountered for default slot. Prefer function slots for better performance.
    if (msg.includes('Non-function value encountered for default slot')) return
    console.error(msg, vm, trace)
}

app.mount('#app')
