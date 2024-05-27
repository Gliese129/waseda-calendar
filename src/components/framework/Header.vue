<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-app-bar-title class="font-bold">{{
    router.currentRoute.value.name
  }}</v-app-bar-title>
</template>

<style scoped></style>
