import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./pages/home/index.vue'),
        },
        {
            path: '/search',
            component: () => import('@/pages/search/index.vue'),
        },
        {
            path: '/my-courses/:keyword?',
            component: () => import('@/pages/my-courses/index.vue'),
        },
    ],
})

export { router }
