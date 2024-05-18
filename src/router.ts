import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store'

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
