<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const currPage = computed(() => router.currentRoute.value.path)
const settings: Settings[] = [
    {
        name: 'User Settings',
        path: '/user',
        children: [],
    },
    {
        name: 'Schedule',
        path: '/schedule',
        children: [
            {
                name: 'Periods',
                path: '/periods',
            },
        ],
    },
]
interface Settings {
    name: string
    path: string
    children?: Settings[]
}

const navItems = computed(() => {
    let items = settings
    let prefix = '/settings'
    currPage.value.split('/').every((path) => {
        let route = items.filter((item) => item.path === `/${path}`)[0]
        if (route && route.children) {
            items = route.children
            prefix += `/${path}`
            return true
        } else return false
    })
    return items
})
</script>

<template>
  <div></div>
</template>

<style scoped></style>
