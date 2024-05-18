<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed } from 'vue'

const store = useStore(key)

const title = computed(() => store.state.system.currRoute.name)
</script>

<template>
  <v-app-bar-title class="font-bold">{{ title }}</v-app-bar-title>
</template>

<style scoped></style>
