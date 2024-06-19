<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import Search from './Search.vue'
import ShowList from './ShowList.vue'
import { fetchCoursesList } from '@/api/syllabus/course'
import type { SearchParams } from '@/api/syllabus/course'
import type { Course } from '@/model/course'
import { useRoute } from 'vue-router'
import { key } from '@/store'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore(key)

const form = reactive<SearchParams>({
    keyword: '',
    name: '',
    semester: null,
    weekday: null,
    period: null,
    pageId: 0,
    departmentId: null,
})

watch(
    () => route.query,
    (query) => {
        form.keyword = query.keyword?.toString() || ''
        form.name = query.name?.toString() || ''
        form.semester = query.semester ? parseInt(query.semester.toString(), 10) : null
        form.weekday = query.weekday ? parseInt(query.weekday.toString(), 10) : null
        form.period = query.period ? parseInt(query.period.toString(), 10) : null
        form.pageId = query.pageId ? parseInt(query.pageId.toString(), 10) : 0
        form.departmentId = query.departmentId?.toString() ?? store.state.user.department
    },
    { immediate: true, deep: true }
)

const newSearch = async () => {
    if (lock.value) return
    lock.value = true

    courses.length = 0
    isLastPage.value = false
    form.pageId = 1

    let res = await fetchCoursesList(form)
    courses.push(...res)
    console.log(`new Courses: ${courses.length}`)

    lock.value = false
}
const appendSearch = async () => {
    if (lock.value) return
    lock.value = true

    form.pageId++
    try {
        let res = await fetchCoursesList(form)
        courses.push(...res)
        isLastPage.value = res.length === 0
        console.log(`new Courses: ${courses.length}`)
        lock.value = false
    } catch (e) {
        isLastPage.value = true
        lock.value = false
    }
}
const clearForm = () => {
    form.keyword = ''
    form.name = ''
    form.semester = null
    form.weekday = null
    form.period = null
    form.pageId = 0
    form.departmentId = null
    newSearch()
}

const courses = reactive<Course[]>([])
const isLastPage = ref(false)

const lock = ref(false)

defineOptions({
    name: 'SearchPage',
})
</script>

<template>
  <Search v-model="form" @search="newSearch" @clear="clearForm" />
  <v-divider></v-divider>
  <ShowList v-model="courses" :lastPage="isLastPage" @search="appendSearch" />
</template>

<style scoped></style>
