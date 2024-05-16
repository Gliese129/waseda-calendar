<script setup lang="ts">
import type { Course } from '@/model/course'

const course = defineModel<Course>('item')

const termColor = [
    {
        name: 'Spring',
        color: '#4CAF50',
    },
    {
        name: 'Summer',
        color: '#FFC107',
    },
    {
        name: 'Fall',
        color: '#FF5722',
    },
    {
        name: 'Winter',
        color: '#2196F3',
    },
]
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const showPeriod = (period: number[]): string => {
    if (period.length === 0) return ''
    if (period[0] === period[1]) return period[0].toString()
    return `${period[0]}-${period[1]}`
}
</script>
<template>
  <v-card class="min-h-22 my-1" elevation="4" link>
    <template v-slot:text>
      <h2 class="text-left overflow-hidden whitespace-nowrap text-base font-semibold">
        {{ course?.name }}
      </h2>
      <div class="my-1 flex justify-between">
        <div class="flex text-sm items-center">
          <v-icon>mdi-book-education-outline</v-icon>
          <v-chip v-if="course?.teachers.length" class="px-1" variant="text">
            {{ course.teachers[0] }}
            {{ course.teachers.length > 1 ? '...' : '' }}
          </v-chip>
          <v-chip v-else class="px-1" color="grey" variant="text"> TBA </v-chip>
        </div>
        <div>
          <v-chip
            v-if="course?.schedules.length"
            :class="[course.schedules.length > 1 ? 'rounded-r-lg' : '']"
          >
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <div
              v-for="(term, index) in course.schedules[0].term"
              :key="index"
              :style="{ backgroundColor: termColor[term].color }"
              class="rounded-full w-2.5 h-2.5"
            ></div>
            {{ dayOfWeek[course.schedules[0].day] }}
            {{ showPeriod(course.schedules[0].period) }}
            <div v-if="course.schedules[0].classroom" class="ml-1">
              <v-icon>mdi-google-classroom</v-icon>
              {{ course.schedules[0].classroom }}
            </div>
          </v-chip>
          <v-chip v-else color="grey">
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <span> TBA </span>
          </v-chip>
        </div>
      </div>
    </template>
  </v-card>
</template>

<style scoped></style>
