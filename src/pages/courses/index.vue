<script setup lang="ts">
import { reactive, ref } from 'vue'
import Search from './Search.vue'
import ShowList from './ShowList.vue'
import { fetchCoursesList } from '@/api/syllabus/course'
import type { SearchParams } from '@/api/syllabus/course'
import type { Course } from '@/model/course'

const form = reactive<SearchParams>({
    keyword: '',
    name: '',
    term: null,
    dayOfWeek: null,
    period: null,
    pageId: 0,
    departmentId: null,
})

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
    form.term = null
    form.dayOfWeek = null
    form.period = null
    form.pageId = 0
    newSearch()
}

const courses = reactive<Course[]>([])
const isLastPage = ref(false)

const lock = ref(false)
</script>

<template>
  <Search v-model="form" @search="newSearch" @clear="clearForm" />
  <v-divider></v-divider>
  <ShowList v-model="courses" :lastPage="isLastPage" @search="appendSearch" />
</template>

<style scoped></style>
