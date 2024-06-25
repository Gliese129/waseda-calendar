import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { createRouter, createWebHistory } from 'vue-router'
import LanguageRouter from './components/framework/LanguageRouter.vue'
import { useLocale } from 'vuetify'
import { languageOptions } from './resources/languages'
import { useStore } from 'vuex'
import { key } from './store'

const routes = [
    {
        path: '/:lang?',
        component: LanguageRouter,
        children: [
            {
                path: '',
                component: () => import('./pages/home/index.vue'),
                name: 'calendar',
                meta: {},
            },
            {
                path: 'search',
                component: () => import('@/pages/search/index.vue'),
                name: 'search',
                meta: {},
            },
            {
                path: 'my-courses/:keyword?',
                component: () => import('@/pages/my-courses/index.vue'),
                name: 'my_courses',
                meta: {},
            },
            {
                path: 'settings/:subRoute(.*)?',
                component: () => import('@/pages/settings/index.vue'),
                children: [
                    {
                        path: '',
                        name: 'settings',
                        component: () => import('@/pages/settings/settings.vue'),
                    },
                    {
                        path: 'periods',
                        name: 'period_edit',
                        component: () => import('@/pages/settings/sub/period.vue'),
                    },
                ],
            },
        ],
    },

    {
        path: '/start',
        component: () => import('@/pages/start-page/index.tsx'),
        name: 'start',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

const supportedLangs = languageOptions.map((x) => x.value)
router.afterEach((to, _) => {
    const { current } = useLocale()
    const store = useStore(key)

    const toLang = to.params.lang?.toString()

    if (toLang) {
        const lang = supportedLangs.includes(toLang) ? toLang : 'en'

        if (current.value !== lang) {
            store.commit('user/setDisplayLanguage', lang)
            current.value = lang
        }
    }
})

let exitLock = false
App.addListener('backButton', (event) => {
    if (!event.canGoBack) {
        if (exitLock) {
            App.exitApp()
        } else {
            exitLock = true
            setTimeout(() => {
                exitLock = false
            }, 3000)
        }
        Toast.show({
            text: 'Press back again to exit',
            duration: 'short',
        })
    } else router.back()
})

export { router }
