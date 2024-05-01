<script setup lang="ts">
import Navigator from './components/Navigator.vue'
</script>

<template>
  <v-app id="mobile">
    <v-app-bar>
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-bottom-navigation fixed> <Navigator /> </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
  v-bottom-navigation {
    align-items: center;
  }
  html {
    overflow-y: auto !important;
  }
</style>
<style></style>
