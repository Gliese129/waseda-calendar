<script setup lang="ts">
import CourseOutline from '@/components/CourseOutline.vue'
import CourseEdit from '@/components/CourseEdit.vue'
import type { Course } from '@/model/course'
import { key } from '@/store'
import { watch } from 'vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore(key)

const keyword = ref('')
const courses = computed(() =>
    store.state.calendar.courses.filter(
        (course) =>
            keyword.value === '' || course.name.toLowerCase().includes(keyword.value)
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
}
</script>

<template>
  <v-container>
    <v-row class="w-80vw m-auto">
      <v-text-field
        v-model="keyword"
        label="Course Name"
        outlined
        dense
        clearable
        prepend-icon="mdi-filter-menu-outline"
        @click:clear="keyword = ''"
      ></v-text-field>
    </v-row>
    <v-row>
      <div v-if="courses.length">
        <CourseOutline
          v-for="course in courses"
          :key="course.name"
          :item="course"
          class="w-90vw"
          @click="loadCourse(course)"
        ></CourseOutline>
      </div>
      <v-alert v-else type="info">
        <template #title> Oops, we found nothing </template>
        <template #text>
          Maybe you need to
          <v-btn variant="outlined" slim size="small" @click="router.push('/search')">
            add some courses
          </v-btn>
          first.
        </template>
      </v-alert>
    </v-row>
    <v-dialog v-model="dialogActive" fullscreen>
      <v-card :title="selectedCourse?.name">
        <div class="mx-auto" style="width: 90%">
          <course-edit edit :origin="selectedCourse" @after-save="afterSave" />
        </div>

        <v-divider class="m-auto"></v-divider>

        <v-row class="w-90vw m-auto max-h-8vw">
          <v-col cols="6">
            <v-btn class="w-full" color="red" @click="deleteCourse">delete</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn class="w-full" @click="dialogActive = false"> close </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
