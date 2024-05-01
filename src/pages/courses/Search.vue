<script setup lang="ts">
import type { SearchParams } from '@/api/syllabus/course'
import { dayOfWeek, term, timeOfDay } from '@/resources/courses-date'

const emit = defineEmits(['search'])
const form = defineModel<SearchParams>() as unknown as SearchParams

const clearForm = () => {
    form.keyword = ''
    form.term = null
    form.dayOfWeek = null
    form.period = null
    form.pageId = 1
    emit('search')
}
</script>

<template>
  <v-form id="courses-form">
    <v-row>
      <v-col cols="3" class="label"> Keyword </v-col>
      <v-col cols="9">
        <v-text-field
          v-model="form.keyword"
          label="Keyword"
          density="comfortable"
          clearable
          class="text-medium-emphasis"
          @update:model-value="$emit('search')"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="label"> Term </v-col>
      <v-col cols="9">
        <v-select
          v-model="form.term"
          label="Term"
          :items="term"
          density="compact"
          clearable
          @update:model-value="$emit('search')"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="label"> Period </v-col>
      <v-col cols="5">
        <v-select
          v-model="form.dayOfWeek"
          label="Day"
          :items="dayOfWeek"
          density="compact"
          clearable
          @update:model-value="$emit('search')"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="form.period"
          label="Period"
          :items="timeOfDay"
          density="compact"
          clearable
          @update:model-value="$emit('search')"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-btn color="error" @click="clearForm">Reset</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="primary" @click="$emit('search')">Search</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
  #courses-form {
    margin: auto;
    width: 80vw;
    margin-bottom: 10px;
  }
  .v-row {
    margin: 0 !important;
  }
  .v-col {
    padding: 0 !important;
  }
  .label {
    vertical-align: middle;
    font-size: 1.1em;
    margin: auto;
  }
</style>
