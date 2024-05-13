<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-btn density="default" @click="router.push('/')">
    <v-icon>mdi-home</v-icon>
    <span>Home</span>
  </v-btn>
  <v-btn density="default" @click="router.push('/search')">
    <v-icon>mdi-book-search-outline</v-icon>
    <span>Search</span>
  </v-btn>
  <v-btn density="default" @click="router.push('/my-courses')">
    <v-icon>mdi-book-open-variant</v-icon>
    <span>List</span>
  </v-btn>
  <v-btn>
    <v-icon>mdi-account</v-icon>
    <span>Profile</span>
  </v-btn>
</template>

<style scoped lang="scss">
  * {
    display: flex;
    height: 100%;
  }
</style>
