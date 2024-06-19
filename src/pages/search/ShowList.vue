<script setup lang="ts">
import { fetchCoursesDetail } from '@/api/syllabus/course'
import CourseOutline from '@/components/CourseOutline.vue'
import CourseEdit from '@/components/CourseEdit.vue'
import { Course } from '@/model/course'
import { defineModel, ref } from 'vue'
import { reactive } from 'vue'
import { useLocale } from 'vuetify'
import SemesterOverview from '@/components/SemesterOverview.vue'

const emit = defineEmits(['search'])
const { t } = useLocale()
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
  <SemesterOverview intro></SemesterOverview>
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
      <v-alert color="info" dense> {{ t('searchPage.no_course_warn') }}</v-alert>
    </template>
    <template #error>
      <v-alert color="error" dense>
        {{ t('searchPage.too_many_courses_warn') }}
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
    {{ t('searchPage.overflow_tip') }}
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
