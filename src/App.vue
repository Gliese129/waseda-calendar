<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navigator from './components/framework/Navigator.vue'
import Header from './components/framework/Header.vue'
import ErrorMsg from './components/framework/ErrorMsg.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { watch } from 'vue'

import courseNotification from '@/native/tasks/course-notification'
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
// course notification
watch(
    () => store.state.system.coursePush,
    (val) => {
        if (val) {
            let periods = store.state.calendar.periods
            let courses = store.state.calendar.courses
            let holidays = store.state.syllabus.holidays
            courseNotification.startPush(periods, courses, holidays)
        } else {
            courseNotification.stopPush()
        }
    }
)
watch(
    () => store.state.calendar,
    () => {
        if (!store.state.system.coursePush) return
        let periods = store.state.calendar.periods
        let courses = store.state.calendar.courses
        let holidays = store.state.syllabus.holidays
        courseNotification.updatePush(periods, courses, holidays)
    },
    { deep: true }
)
</script>

<template>
  <v-app id="mobile">
    <v-app-bar app>
      <Header />
    </v-app-bar>

    <v-main v-if="ifDataLoaded">
      <ErrorMsg />

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
@/native/native-tasks/course-notification
