<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navigator from './components/Navigator.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
const store = useStore(key)

onMounted(async () => {
    console.log('App mounted')
    store.dispatch('syllabus/forceRefresh')
    store.dispatch('calendar/init')
})
const ifDataLoaded = computed(() => 
    store.state.calendar.periodSettings.length > 0 &&
    store.state.syllabus.holidays.length > 0 
)
</script>

<template>
  <v-app id="mobile">
    <v-app-bar app>
      <v-app-bar-title>Application</v-app-bar-title>
    </v-app-bar>

    <v-main v-if="ifDataLoaded">
      <v-container>
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
