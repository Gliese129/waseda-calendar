<script setup lang="ts">
import CourseOutline from '@/components/CourseOutline.vue'
import { key } from '@/store'
import { watch } from 'vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRoute()
const store = useStore(key)

const keyword = ref('')
const courses = computed(() =>
    store.state.calendar.courses.filter(
        (course) =>
            keyword.value === '' || course.name.toLowerCase().includes(keyword.value)
    )
)
watch(
    () => router.params.keyword,
    () => {
        keyword.value = router.params.keyword as string
    },
    { immediate: true }
)
</script>

<template>
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
      ></CourseOutline>
    </div>
    <span v-else>No course to show</span>
  </v-row>
</template>

<style scoped></style>
