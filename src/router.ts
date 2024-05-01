import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('./pages/HelloWorld.vue'),
        },
        {
            path: '/courses',
            component: () => import('@/pages/courses/index.vue'),
        },
    ],
})

export { router }
