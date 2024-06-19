<script setup lang="ts">
import type { SearchParams } from '@/api/syllabus/course'
import { weekday, semester, period } from '@/assets/courses-date'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { useLocale } from 'vuetify'

const emit = defineEmits(['search', 'clear'])
const store = useStore(key)
const { t } = useLocale()

const form = defineModel<SearchParams>()

const clearForm = () => {
    emit('clear')
    emit('search')
}
const isKeyword = ref(false)

const departments = computed(() =>
    store.state.syllabus.departments.map((item) => ({
        title: item.name,
        value: item.value,
    }))
)
</script>

<template>
  <v-form v-if="form" class="m-auto">
    <v-container>
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-show="isKeyword"
            v-model="form.keyword"
            :label="t('form.keyword')"
            density="compact"
            hide-details
            clearable
            class="text-medium-emphasis"
            @update:model-value="$emit('search')"
          ></v-text-field>
          <v-text-field
            v-show="!isKeyword"
            v-model="form.name"
            :label="t('form.name')"
            density="compact"
            hide-details
            clearable
            class="text-medium-emphasis"
            @update:model-value="$emit('search')"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn class="capitalize" @click="isKeyword = !isKeyword">
            {{ isKeyword ? t('form.name') : t('form.keyword') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            v-model="form.semester"
            :label="t('form.semester')"
            :items="semester"
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
            v-model="form.weekday"
            :label="t('form.weekday')"
            :items="weekday"
            density="compact"
            hide-details
            clearable
            @update:model-value="$emit('search')"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="form.period"
            :label="t('form.period')"
            :items="period"
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
            :label="t('form.department')"
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
          <v-btn color="error" @click="clearForm">{{ t('form.reset') }}</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn color="primary" @click="$emit('search')">{{ t('form.search') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped></style>
