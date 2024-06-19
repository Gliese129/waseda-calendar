<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocale } from 'vuetify'

const router = useRouter()
const { t } = useLocale()

const name = computed(() => router.currentRoute.value.name?.toString() ?? '')
</script>

<template>
  <v-app-bar-title class="font-bold">{{
    name ? t(`navigation.${name}`) : ''
  }}</v-app-bar-title>
</template>

<style scoped></style>
