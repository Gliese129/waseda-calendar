<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navigator from './components/framework/Navigator.vue'
import Header from './components/framework/Header.vue'
import ErrorMsg from './components/framework/ErrorMsg.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { watch } from 'vue'

import courseNotification from '@/native/tasks/course-notification'
import { useRoute, useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
const route = useRoute()
const router = useRouter()
const store = useStore(key)

onMounted(async () => {
    console.log('App mounted')
    await store.dispatch('user/init')

    // check if is the first time
    if (store.state.user.firstLogin) {
        router.replace('/start')
    }

    await store.dispatch('syllabus/refresh')
    console.log(store.state.syllabus.periods)
    store.dispatch('calendar/init', store.state.syllabus.holidays)
})

// course notification
if (Capacitor.getPlatform() !== 'web') {
    watch(
        () => [store.state.user.courseNotification, store.state.calendar],
        (val) => {
            if (val) {
                let periods = store.state.calendar.periods.map((p) => [
                    p.start.toString(),
                    p.end.toString(),
                ])
                let courses = store.state.calendar.courses
                let holidays = store.state.syllabus.holidays
                courseNotification.startPush(periods, courses, holidays)
            } else {
                courseNotification.stopPush()
            }
        },
        { immediate: true, deep: true }
    )
}

const showNavigator = computed(() => !['Start Page'].includes(route.name as string))
</script>

<template>
  <v-app id="mobile">
    <v-app-bar v-if="showNavigator" app>
      <Header />
    </v-app-bar>

    <v-main>
      <ErrorMsg />

      <v-container fluid>
        <router-view v-slot="{ Component }">
          <KeepAlive include="SearchPage">
            <component :is="Component" />
          </KeepAlive>
        </router-view>
      </v-container>
    </v-main>

    <v-bottom-navigation v-if="showNavigator" app>
      <Navigator class="w-full" />
    </v-bottom-navigation>
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

<style>
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
