import { App } from '@capacitor/app'
import { Toast } from '@capacitor/toast'
import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

const routes = [
    {
        path: '/',
        component: () => import('./pages/home/index.vue'),
        name: 'Calendar',
        meta: {
            needConfigDataLoaded: true,
        },
    },
    {
        path: '/search',
        component: () => import('@/pages/search/index.vue'),
        name: 'Search',
        meta: {
            needConfigDataLoaded: true,
        },
    },
    {
        path: '/my-courses/:keyword?',
        component: () => import('@/pages/my-courses/index.vue'),
        name: 'My Courses',
        meta: {
            needConfigDataLoaded: true,
        },
    },
    {
        path: '/settings/:subRoute(.*)?',
        component: () => import('@/pages/settings/index.vue'),
        name: 'Settings',
        children: [
            {
                path: '',
                name: 'Settings Home',
                component: () => import('@/pages/settings/category.vue'),
            },
            {
                path: 'periods',
                name: 'Periods Edit',
                component: () => import('@/pages/settings/sub/period.vue'),
            },
        ],
    },
    {
        path: '/start',
        component: () => import('@/pages/start-page/index.vue'),
        name: 'Start Page',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

router.beforeEach(async (to, _, next) => {
    if (
        to.meta.needConfigDataLoaded &&
    !(await store.dispatch('syllabus/checkConfigDataLoaded'))
    ) {
        next({ name: 'Settings Home' })
    } else {
        next()
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
