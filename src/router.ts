import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'
import { children } from 'node_modules/cheerio/lib/esm/api/traversing'

const routes = [
    {
        path: '/',
        component: () => import('./pages/home/index.vue'),
        name: 'Calendar',
    },
    {
        path: '/search',
        component: () => import('@/pages/search/index.vue'),
        name: 'Search',
    },
    {
        path: '/my-courses/:keyword?',
        component: () => import('@/pages/my-courses/index.vue'),
        name: 'My Courses',
    },
    {
        path: '/settings/:subRoute(.*)?',
        component: () => import('@/pages/settings/index.vue'),
        name: 'Settings',
        children: [
            {
                path: '',
                component: () => import('@/pages/settings/category.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

router.afterEach((to, _) => {
    const currRoute = routes.filter((route) => route.name === to.name)[0]
    store.dispatch('system/updateRoute', {
        name: currRoute.name,
        path: currRoute.path,
        index: routes.indexOf(currRoute),
    })
})

export { router }
