<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()

const toggle = ref(0)
const items = [
    {
        name: 'Home',
        icon: 'mdi-home',
        path: '/',
    },
    {
        name: 'Search',
        icon: 'mdi-book-search-outline',
        path: '/search',
    },
    {
        name: 'My Courses',
        icon: 'mdi-book-open-variant',
        path: '/my-courses',
    },
    {
        name: 'Settings',
        icon: 'mdi-account',
        path: '/settings',
    },
]
watch(
    () => router.currentRoute.value.path,
    (paths) => {
        let firstPath = paths.split('/')[1]
        toggle.value = items.findIndex((item) => item.path === `/${firstPath}`)
    }
)
</script>

<template>
  <v-btn-toggle v-model="toggle" class="flex" color="light-grey" rounded="sm">
    <v-btn
      v-for="item in items"
      :key="item.name"
      class="flex-auto"
      density="default"
      @click="router.push(item.path)"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<style scoped lang="scss"></style>
