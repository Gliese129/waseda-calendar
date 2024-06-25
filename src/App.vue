<script setup lang="ts">
import { computed, onMounted } from 'vue'
import Navigator from './components/framework/Navigator.vue'
import Header from './components/framework/Header.vue'
import ErrorMsg from './components/framework/ErrorMsg.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { watch } from 'vue'

import { App } from '@capacitor/app'
import courseNotification from '@/native/tasks/course-notification'
import { useRoute, useRouter } from 'vue-router'
import { Capacitor } from '@capacitor/core'
import { useLocale } from 'vuetify'
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import useSQLiteDB from './utils/sqlite'

const route = useRoute()
const router = useRouter()
const store = useStore(key)
const { current } = useLocale()

onMounted(async () => {
    await store.dispatch('syllabus/refresh')

    try {
        // init sqlite

        const platform = Capacitor.getPlatform()
        console.log('Platform: ', platform)
        // specify webSQLite for browser
        if (platform === 'web') {
            const sqlite = new SQLiteConnection(CapacitorSQLite)

            customElements.define('jeep-sqlite', JeepSqlite)
            const jeepSqliteEl = document.createElement('jeep-sqlite')
            document.body.appendChild(jeepSqliteEl)
            await customElements.whenDefined('jeep-sqlite')

            await sqlite.initWebStore()
            console.log('SQLite web initialized')
        }
        const { initialized, performSQLAction } = await useSQLiteDB()
        if (!initialized.value) {
            console.log('Initializing SQLite')
        }

        await store.dispatch('user/init', performSQLAction)
        await store.dispatch('calendar/init', performSQLAction)
    } catch (e) {
        console.error(e)
    }

    // set language
    current.value = store.state.user.displayLanguage

    // check if is the first time
    if (store.state.user.firstLogin) {
        router.replace('/start')
    }
})

// save before unmounted or app closed
App.addListener('appStateChange', async (state) => {
    if (!state.isActive) {
        const { performSQLAction } = await useSQLiteDB()
        await store.dispatch('user/saveToDB', performSQLAction)
    }
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
// i18n
// watch(
//     () => store.state.user.displayLanguage,
//     (locale) => {
//         current.value = locale
//     }
// )

const showNavigator = computed(() => !['start'].includes(route.name as string))
</script>

<template>
  <v-app id="mobile">
    <v-app-bar v-if="showNavigator" app>
      <Header />
    </v-app-bar>

    <v-main>
      <ErrorMsg />

      <v-container fluid>
        <router-view />
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
