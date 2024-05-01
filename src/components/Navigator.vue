<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-btn @click="router.push('/')">
    <v-icon>mdi-home</v-icon>
    <span>Home</span>
  </v-btn>
  <v-btn @click="router.push('/courses')">
    <v-icon>mdi-book-education</v-icon>
    <span>Courses</span>
  </v-btn>
</template>

<style scoped>
  * {
    display: flex;
  }
</style>
