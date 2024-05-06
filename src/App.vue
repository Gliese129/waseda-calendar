<script setup lang="ts">
import { onMounted } from 'vue'
import Navigator from './components/Navigator.vue'
import { store } from '@/store/index'

onMounted(() => {
    store.dispatch('syllabus/refresh')
    store.dispatch('calendar/init')
})
</script>

<template>
  <v-app id="mobile">
    <v-app-bar app>
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-bottom-navigation app> <Navigator /> </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
  .v-bottom-navigation {
    align-items: center;
  }
  .v-main {
    height: fit-content;
  }
</style>
<style></style>
