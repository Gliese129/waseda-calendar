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
            component: () => import('@/pages/courses/index.vue'),
        },
    ],
})

export { router }
