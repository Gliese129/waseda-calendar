<script setup lang="ts">
import { useStore } from 'vuex'
import Calendar from './calendar.tsx'
import { computed } from 'vue'
import { key } from '@/store'
const store = useStore(key)

const courses = computed(() => store.state.calendar.courses)
</script>

<template>
  <v-container>
    <v-row>
      <Calendar :courses="courses" />
    </v-row>
  </v-container>
</template>

<style scoped></style>
