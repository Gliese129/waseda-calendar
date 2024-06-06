<script setup lang="ts">
import { fetchCoursesDetail } from '@/api/syllabus/course'
import CourseOutline from '@/components/CourseOutline.vue'
import CourseEdit from '@/components/CourseEdit.vue'
import { Course } from '@/model/course'
import { defineModel, ref } from 'vue'
import { reactive } from 'vue'
import TermOverview from '@/components/TermOverview.vue'
const emit = defineEmits(['search'])
const courses = defineModel<Course[]>()
const isLastPage = defineModel('lastPage')

async function onLoad({ done }: { done: Function }) {
    if ((courses.value?.length || 0) >= 100) return done('error')
    emit('search')
    if (isLastPage.value) return done('empty')
    done('ok')
}

// dialog
const dialogActive = ref(false)
const selectedCourse: Course = reactive<Course>({} as any)

const loadCourse = async (course: Course) => {
    console.log(`clicked course: ${course.name}`)
    dialogActive.value = true
    Course.deepCopy(selectedCourse, course)
    await fetchCoursesDetail(selectedCourse)
}
</script>

<template>
  <TermOverview intro></TermOverview>
  <v-infinite-scroll
    class="m-auto flex flex-wrap justify-around"
    height="40vh"
    direction="horizontal"
    :items="courses"
    @load="onLoad"
  >
    <template v-for="item in courses" :key="item.name">
      <course-outline :item="item" @click="loadCourse(item)" />
    </template>
    <template #empty>
      <v-alert color="info" dense> No more courses to show </v-alert>
    </template>
    <template #error>
      <v-alert color="error" dense>
        Too many courses to show, please use stricter search criteria
      </v-alert>
    </template>
    <template #loading>
      <v-progress-circular
        class="w-full"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </template>
  </v-infinite-scroll>
  <span class="text-sm text-slate-400">
    Tip: due to the size limit, only the first teacher and period will be shown
  </span>

  <v-dialog v-model="dialogActive" fullscreen>
    <v-card>
      <course-edit
        :origin="selectedCourse"
        @after-save="dialogActive = false"
        @close="dialogActive = false"
      >
      </course-edit>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  :deep(.v-infinite-scroll__side) {
    display: block;
    width: 90%;
  }
</style>
