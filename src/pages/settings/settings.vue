<script setup lang="ts">
import UserInfo from './user-info.tsx'
import Category from './category.tsx'
</script>

<template>
  <v-sheet lines="three" select-strategy="classic" class="w-90vw">
    <user-info class="my-3" />
    <category />
  </v-sheet>
</template>

<style scoped></style>
