<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-btn @click="router.push('/')">
    <v-icon>mdi-home</v-icon>
    <span>Home</span>
  </v-btn>
  <v-btn @click="router.push('/search')">
    <v-icon>mdi-book-search-outline</v-icon>
    <span>Search</span>
  </v-btn>
</template>

<style scoped>
  * {
    display: flex;
  }
</style>
