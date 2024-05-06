<script setup lang="ts">
import type { Course } from '@/model/course'
import { reactive } from 'vue'
import { watch } from 'vue'
import { useStore } from 'vuex'
import TermOverview from '@/components/TermOverview.vue'
const store = useStore()

const origin = defineModel<Course | null>('item')
const course = reactive<Course>({} as any)

watch(
    origin,
    (newCourse) => {
        if (newCourse) {
            console.log(newCourse.deepCopy())
            Object.assign(course, newCourse.deepCopy())
        }
    },
    { deep: true, immediate: true }
)

const reset = () => {
    Object.assign(course, origin.value?.deepCopy() || {})

}

const expanded = reactive([])

const showDay = (day: number) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
}
const showPeriod = (startPeriod: number, endPeriod: number) => {
    if(startPeriod === endPeriod) return `${startPeriod}`
    return `${startPeriod}-${endPeriod}`
}
</script>

<template>
  <v-form>
    <v-row>
      <v-text-field
        v-model="course.name"
        prepend-icon="mdi-rename-box-outline"
        label="Name"
        variant="solo"
        density="comfortable"
      ></v-text-field>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="course.department"
          :items="store.state.syllabus.departments"
          prepend-icon="mdi-school-outline"
          label="Department"
          variant="solo"
          density="comfortable"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="course.campus"
          prepend-icon="mdi-map-marker-outline"
          label="Campus"
          variant="solo"
          density="comfortable"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <TermOverview intro></TermOverview>
      <v-data-table
        :expanded="expanded"
        :items="course.timePlace"
        show-expand
        expand-on-click
      >
        <template #expanded-row="{ item }">
          <tr>
            <td colspan="4">
              <v-row>
                <v-col cols="2">Term</v-col>
                <v-col cols="10" style="display: flex;">
                  <v-checkbox
                    v-for="(quarter, index) in ['Spring', 'Summer', 'Fall', 'Winter']"
                    :key="index"
                    v-model="item.term"
                    :value="index"
                    :label="quarter"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
        <template v-slot:[`item.term`]="{ value }">
          <TermOverview :item="value"></TermOverview>
        </template>
        <template v-slot:[`item.day`]="{ value }">
          {{ showDay(value) }}
        </template>
        <template v-slot:[`item.period`]="{ value }">
          {{ showPeriod(value[0], value[1]) }}
        </template>
      </v-data-table>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="red" @click="reset">Refresh</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
  .v-form {
    margin-top: 20px;
  }
  :deep(.v-data-table-footer) {
    display: none;
  }
  :deep(.v-input__details) {
    display: none;
  }
</style>
