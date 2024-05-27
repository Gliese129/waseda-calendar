import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export { router }
