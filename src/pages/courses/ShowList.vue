<script setup lang="ts">
import CourseOutline from '@/components/CourseOutline.vue'
import type { Course } from '@/model/course'
import { defineEmits, defineModel } from 'vue'
const emit = defineEmits(['search'])
const courses = defineModel<Course[]>()
const isLastPage = defineModel('lastPage')

async function onLoad({ done }: { done: Function }) {
    if (courses.length >= 100) return done('error')
    emit('search')
    if (isLastPage.value) return done('empty')
    done('ok')
}

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
</script>

<template>
  <div>
    Term color:
    <div v-for="term in termShow" :key="term.name" class="term-group">
      <v-chip :color="term.color">
        {{ term.name }}
      </v-chip>
    </div>
  </div>
  <v-infinite-scroll height="50vh" :items="courses" @load="onLoad">
    <template v-for="item in courses" :key="item.name">
      <course-outline :item="item" />
    </template>
    <template #empty>
      <v-alert color="info" dense> No more courses to show </v-alert>
    </template>
    <template #error>
      <v-alert color="error" dense>
        Too many courses to show, please use stricter search criteria
      </v-alert>
    </template>
  </v-infinite-scroll>
  <span style="color: gray; font-size: 0.8em"
    >Tip: due to the size, only the first teacher and period will be shown</span
  >
</template>

<style scoped>
  .v-infinite-scroll {
    max-width: 80vw;
    vertical-align: top;
  }
  .term-group {
    display: inline-block;
    margin: 3px 0;
  }
</style>
