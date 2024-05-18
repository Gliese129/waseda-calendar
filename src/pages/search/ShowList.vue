<script setup lang="ts">
import { fetchCoursesDetail } from '@/api/syllabus/course'
import CourseOutline from '@/components/CourseOutline.vue'
import CourseEdit from '@/components/CourseEdit.vue'
import { Course } from '@/model/course'
import { defineEmits, defineModel, ref } from 'vue'
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

const openInNew = (url: string | undefined) => {
    if (!url) return
    window.open(url, '_blank')
}
</script>

<template>
  <TermOverview intro></TermOverview>
  <v-infinite-scroll
    class="m-auto w-90vw"
    height="45vh"
    :items="courses"
    mode="manual"
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
  </v-infinite-scroll>
  <span style="color: gray; font-size: 0.8em">
    Tip: due to the size limit, only the first teacher and period will be shown
  </span>

  <v-dialog v-model="dialogActive" fullscreen>
    <v-card
      :title="selectedCourse?.name"
      :subtitle="
        selectedCourse
          ? selectedCourse.departmentFull || selectedCourse.department
          : 'Unknown'
      "
    >
      <div class="mx-auto" style="width: 90%">
        <v-expansion-panels>
          <v-expansion-panel>
            <template #title>
              <p>Syllabus Raw Content</p>
              <v-btn
                icon="mdi-open-in-new"
                style="margin-left: 10px"
                @click.stop="openInNew(selectedCourse?.url)"
              ></v-btn>
            </template>
            <template #text>
              <iframe
                :src="selectedCourse?.url"
                class="mx-auto h-30vh"
                frameborder="0"
              ></iframe>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
        <course-edit :origin="selectedCourse" @after-save="dialogActive = false" />
      </div>
      <v-btn @click="dialogActive = false"> close </v-btn>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  :deep(.v-expansion-panel-title) {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
