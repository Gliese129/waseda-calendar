<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { watch, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const router = useRouter()
const route = useRoute()
const store = useStore(key)

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
const lang = computed(() => store.state.user.displayLanguage)
watch(
    () => route.path,
    (paths) => {
        let pointer = route.params.lang ? 2 : 1
        let firstPath = paths.split('/')[pointer]
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
      @click="router.push(`/${lang}${item.path}`)"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<style scoped lang="scss"></style>
