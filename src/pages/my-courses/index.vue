<script setup lang="ts">
import CourseOutline from '@/components/CourseOutline.vue'
import CourseEdit from '@/components/CourseEdit.vue'
import type { Course } from '@/model/course'
import { key } from '@/store'
import { watch } from 'vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { inject } from 'vue'
import { AcademicDate } from '@/model/date'

const route = useRoute()
const router = useRouter()
const store = useStore(key)
const $message = inject<Function>('$message') as Function

const keyword = ref('')
const courses = computed(() =>
    store.state.calendar.courses.filter(
        (course) =>
            keyword.value === '' ||
            course.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
            course.code.toLowerCase().includes(keyword.value.toLowerCase())
    )
)

const dialogActive = ref(false)
const selectedCourse = ref<Course>({} as any)

const loadCourse = async (course: Course) => {
    dialogActive.value = true
    console.log('loadCourse', course)
    selectedCourse.value = course
}

watch(
    () => route.params.keyword,
    () => {
        keyword.value = route.params.keyword as string
        // if there is only one course, show the dialog
        let courses = store.state.calendar.courses.filter(
            (course) =>
                keyword.value === '' || course.name.toLowerCase().includes(keyword.value)
        )
        if (
            courses.length === 1 &&
            route.params.keyword === courses[0].name.toLowerCase()
        ) {
            dialogActive.value = true
            selectedCourse.value = courses[0]
        }
    },
    { immediate: true }
)

const afterSave = () => {
    dialogActive.value = false
    router.push({ name: 'my-courses', params: { keyword: '' } })
}
const deleteCourse = async () => {
    await store.dispatch('calendar/deleteCourse', selectedCourse.value)
    dialogActive.value = false
    $message('Course deleted', 'success')
}

defineOptions({
    name: 'MyCoursesPage',
})
</script>

<template>
  <v-row class="m-auto">
    <v-text-field
      v-model="keyword"
      label="Course Name or Code"
      outlined
      dense
      clearable
      prepend-icon="mdi-filter-menu-outline"
      @click:clear="keyword = ''"
    ></v-text-field>
  </v-row>
  <v-row>
    <div v-if="courses.length" class="flex flex-wrap w-90vw">
      <course-outline
        v-for="course in courses"
        :key="course.name"
        class="mx-auto"
        :item="course"
        :disable="course.academicYear !== new AcademicDate().academicYear"
        @click="loadCourse(course)"
      ></course-outline>
    </div>
    <v-alert v-else type="info" @click="router.push('/search')">
      <template #title> Oops, we found nothing </template>
      <template #text> Maybe you need to add some courses first </template>
    </v-alert>
  </v-row>
  <v-dialog v-model="dialogActive" fullscreen>
    <v-card>
      <course-edit
        edit
        :origin="selectedCourse"
        @after-save="afterSave"
        @close="dialogActive = false"
      >
        <template #extra-actions>
          <v-btn variant="text" color="red" @click="deleteCourse">Delete</v-btn>
        </template>
      </course-edit>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
