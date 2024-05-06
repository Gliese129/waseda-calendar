<script setup lang="ts">
import type { SearchParams } from '@/api/syllabus/course'
import { dayOfWeek, term, timeOfDay } from '@/resources/courses-date'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const emit = defineEmits(['search', 'clear'])
const store = useStore(key)

const form = defineModel<SearchParams>() as unknown as SearchParams

const clearForm = () => {
    emit('clear')
    emit('search')
}
const isKeyword = ref(false)

const departments = computed(
    () => store.state.syllabus.departments
) as unknown as { name: string; value: number }[]
</script>

<template>
  <v-form id="courses-form">
    <v-container>
      <v-row>
        <v-col cols="3" class="label">
          <v-btn
            variant="text"
            class="text-none"
            @click="isKeyword = !isKeyword"
          >
            {{ isKeyword ? 'Keyword' : 'Name' }}
          </v-btn>
        </v-col>
        <v-col cols="9">
          <v-text-field
            v-show="isKeyword"
            v-model="form.keyword"
            label="Keyword"
            density="compact"
            clearable
            class="text-medium-emphasis"
            @update:model-value="$emit('search')"
          ></v-text-field>
          <v-text-field
            v-show="!isKeyword"
            v-model="form.name"
            label="Name"
            density="compact"
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
        <v-col cols="3" class="label"> Dept </v-col>
        <v-col cols="9">
          <v-autocomplete
            v-model="form.departmentId"
            label="Department"
            :items="departments"
            item-text="name"
            item-value="value"
            density="compact"
            clearable
            @update:model-value="$emit('search')"
          ></v-autocomplete>
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
    </v-container>
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
  .v-text-field {
    margin-bottom: 5px;
  }
  :deep(.v-input__details) {
    display: none;
  }
</style>
