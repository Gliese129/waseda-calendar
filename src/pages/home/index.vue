<script setup lang="ts">
import { useStore } from 'vuex'
import Calendar from './calendar.tsx'
import { computed, ref } from 'vue'
import { key } from '@/store'
import { SchoolYearDate } from '@/model/date'
const store = useStore(key)

let currQuarter = computed(() => {
    let quarters = store.state.syllabus.quarters
    console.log(quarters)
    let now = new SchoolYearDate()
    let quarter = quarters.findIndex((quarter) =>
        now.isBetween(quarter.start, quarter.end)
    )
    return quarter
})
const courses = computed(() =>
    store.state.calendar.courses
        .map((course) => {
            return course.schedules
                .filter((schedule) => schedule.term.indexOf(currQuarter.value) !== -1)
                .map((schedule) => {
                    return {
                        code: course.code,
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
let currDate = ref(new Date())

setInterval(() => {
    currDate.value = new Date()
}, 1000 * 60)
</script>

<template>
  <v-container>
    <v-row>
      <Calendar :courses="courses" :curr-date="currDate" />
    </v-row>
  </v-container>
</template>

<style scoped></style>
