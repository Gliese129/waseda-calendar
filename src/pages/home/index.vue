<script setup lang="ts">
import { useStore } from 'vuex'
import Calendar from './calendar.tsx'
import { computed, ref } from 'vue'
import { key } from '@/store'
import { AcademicDate } from '@/model/date'
const store = useStore(key)

const date = ref(new Date())
const quarter = computed(() => {
    const quarters = store.state.syllabus.quarters
    const now = new AcademicDate()
    return quarters.findIndex((quarter) => now.isBetween(quarter.start, quarter.end))
})
const academicYear = computed(() => {
    const now = new AcademicDate()
    return now.academicYear
})
const courses = computed(() => {
    return store.state.calendar.courses
        .filter((course) => course.academicYear === academicYear.value)
        .flatMap((course) =>
            course.schedules
                .filter((schedule) => schedule.semester.includes(quarter.value))
                .map((schedule) => ({
                    code: course.code,
                    name: course.name,
                    day: schedule.day,
                    start: schedule.period[0],
                    end: schedule.period[1],
                    classroom: schedule.classroom,
                }))
        )
})
const dateRange = computed(() => {
    let weekday = date.value.getDay()
    return {
        start: new Date(date.value.getTime() - 1000 * 60 * 60 * 24 * weekday),
        end: new Date(date.value.getTime() + 1000 * 60 * 60 * 24 * (6 - weekday)),
    }
})

defineOptions({
    name: 'CalendarPage',
})
</script>

<template>
  <v-container>
    <v-row>
      <Calendar :courses="courses" :date-range="dateRange" />
    </v-row>
  </v-container>
</template>

<style scoped></style>
