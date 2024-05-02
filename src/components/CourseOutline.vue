<script setup lang="ts">
import type { Course } from '@/model/course'

const course = defineModel<Course>('item') as unknown as Course

const termShow = [
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
const dayOfWeek = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const showPeriod = (period: number[]): string => {
    if (period.length === 0) return ''
    if (period[0] === period[1]) return period[0].toString()
    return `${period[0]}-${period[1]}`
}
</script>
<template>
  <v-card class="course" elevation="4" link>
    <template v-slot:text>
      <h2 class="name">{{ course.name }}</h2>
      <div class="info">
        <div class="teacher">
          <v-icon>mdi-book-education-outline</v-icon>
          <v-chip
            v-if="course.teachers.length"
            class="teacher-name"
            variant="text"
          >
            {{ course.teachers[0] }}
          </v-chip>
          <v-chip v-else class="teacher-name" color="grey" variant="text">
            TBA
          </v-chip>
        </div>
        <div class="time-place">
          <v-chip v-if="course.timePlace.length" class="time-place-name">
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <div
              v-for="(term, index) in course.timePlace[0].term"
              :key="index"
              :style="{ backgroundColor: termShow[term].color }"
              class="term-circle"
            ></div>
            {{ dayOfWeek[course.timePlace[0].day] }}
            {{ showPeriod(course.timePlace[0].period) }}
            <div v-if="course.timePlace[0].classroom">
              <v-icon>mdi-google-classroom</v-icon>
              {{ course.timePlace[0].classroom }}
            </div>
          </v-chip>
          <v-chip v-else class="time-place-name" color="grey">
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <span> TBA </span>
          </v-chip>
        </div>
      </div>
    </template>
  </v-card>
</template>

<style scoped>
  .course {
    min-height: 90px !important;
    margin: 5px 0;
  }
  .name {
    text-align: start;
    overflow: hidden;
    white-space: nowrap;
    font-size: medium;
  }
  .info {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
  }
  .teacher {
    display: flex;
    align-items: center;
    font-size: 0.9em;
  }
  .teacher-name {
    padding: 0 3px;
  }
  .term-circle {
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }
</style>
