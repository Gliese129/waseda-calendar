<script setup lang="ts">
import { useStore } from 'vuex'
import Calendar from './calendar.tsx'
import { computed } from 'vue'
import { key } from '@/store'
import { ref } from 'vue'
const store = useStore(key)

let currQuarter = ref(0)
const courses = computed(() =>
    store.state.calendar.courses
        .map((course) => {
            return course.schedules
                .filter((schedule) => schedule.term.indexOf(currQuarter.value) !== -1)
                .map((schedule) => {
                    return {
                        name: course.name,
                        day: schedule.day,
                        start: schedule.period[0],
                        end: schedule.period[1],
                        classroom: schedule.classroom,
                    }
                })
        })
        .flat()
)
</script>

<template>
  <v-container>
    <v-row>
      <Calendar :courses="courses" :curr-quarter="currQuarter" />
    </v-row>
  </v-container>
</template>

<style scoped></style>
