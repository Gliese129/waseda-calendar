<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navigator from './components/framework/Navigator.vue'
import Header from './components/framework/Header.vue'
import ErrorMsg from './components/framework/ErrorMsg.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
const store = useStore(key)

onMounted(async () => {
    console.log('App mounted')
    await store.dispatch('syllabus/refresh')
    store.dispatch('calendar/init')
})
const ifDataLoaded = computed(
    () =>
        store.state.calendar.periods.length > 0 &&
        store.state.syllabus.holidays.length > 0 &&
        store.state.calendar.periods.length > 0
)
</script>

<template>
  <v-app id="mobile">
    <v-app-bar app>
      <Header />
    </v-app-bar>

    <v-main v-if="ifDataLoaded">
      <ErrorMsg class="" />

      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-bottom-navigation app> <Navigator class="w-full" /> </v-bottom-navigation>
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
