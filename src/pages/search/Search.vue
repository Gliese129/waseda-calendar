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

const departments = computed(() => store.state.syllabus.departments) as unknown as {
    name: string
    value: number
}[]
</script>

<template>
  <v-form class="m-auto">
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-show="isKeyword"
            v-model="form.keyword"
            label="Keyword"
            density="compact"
            hide-details
            clearable
            class="text-medium-emphasis"
            @update:model-value="$emit('search')"
          ></v-text-field>
          <v-text-field
            v-show="!isKeyword"
            v-model="form.name"
            label="Name"
            density="compact"
            hide-details
            clearable
            class="text-medium-emphasis"
            @update:model-value="$emit('search')"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn class="capitalize" @click="isKeyword = !isKeyword">
            {{ isKeyword ? 'Name' : 'Keyword' }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="form.term"
            label="Term"
            :items="term"
            density="compact"
            hide-details
            clearable
            @update:model-value="$emit('search')"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="form.dayOfWeek"
            label="Day"
            :items="dayOfWeek"
            density="compact"
            hide-details
            clearable
            @update:model-value="$emit('search')"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="form.period"
            label="Period"
            :items="timeOfDay"
            density="compact"
            hide-details
            clearable
            @update:model-value="$emit('search')"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="form.departmentId"
            label="Department"
            :items="departments"
            item-text="name"
            item-value="value"
            density="compact"
            hide-details
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

<style scoped></style>
