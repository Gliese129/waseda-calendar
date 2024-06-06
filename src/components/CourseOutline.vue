<script setup lang="ts">
import type { Course } from '@/model/course'

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
        required: false,
    },
})

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
  <v-card
    class="m-2 flex flex-col w-full min-w-85 md:w-90 h-22"
    elevation="4"
    link
    :disabled="props.disabled"
  >
    <template #title>
      <h2 class="text-left text-base font-semibold">
        {{ course?.name }}
        <span class="font-normal text-slate-400 text-sm">{{ course?.year }}</span>
      </h2>
    </template>
    <template #text>
      <v-row class="flex justify-between">
        <v-col cols="4" class="flex items-center overflow-visible">
          <v-icon>mdi-book-education-outline</v-icon>
          <v-chip v-if="course?.teachers.length" class="px-1" variant="text" size="small">
            {{ course.teachers[0] }} {{ course.teachers.length > 1 ? '...' : '' }}
          </v-chip>
          <v-chip v-else class="px-1 max-w-40" color="grey" variant="text"> TBA </v-chip>
        </v-col>
        <v-col v-if="course?.schedules.length" class="flex justify-end">
          <v-chip class="rounded-r-none m-r-px">
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <div
              v-for="(term, index) in course.schedules[0].term"
              :key="index"
              :style="{ backgroundColor: termColor[term].color }"
              class="rounded-full w-2.5 h-2.5"
            ></div>
            {{ dayOfWeek[course.schedules[0].day] }}
            {{ showPeriod(course.schedules[0].period) }}
          </v-chip>
          <v-chip class="rounded-l-none">
            <div v-if="course.schedules[0].classroom" class="ml-1">
              <v-icon>mdi-google-classroom</v-icon>
              {{ course.schedules[0].classroom }}
            </div>
          </v-chip>
        </v-col>
        <v-col v-else>
          <v-chip color="grey">
            <v-icon>mdi-calendar-clock-outline</v-icon>
            <span> TBA </span>
          </v-chip>
        </v-col>
      </v-row>
    </template>
  </v-card>
</template>

<style scoped></style>
