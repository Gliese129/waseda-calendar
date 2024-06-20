<script setup lang="ts">
import { useLocale } from 'vuetify'

const props = defineProps({
    intro: Boolean,
    editable: Boolean,
})

const item = defineModel<Array<number>>('item')
const { t } = useLocale()

const semesterColor = [
    {
        name: t('semester.spring'),
        color: '#4CAF50',
    },
    {
        name: t('semester.summer'),
        color: '#FFC107',
    },
    {
        name: t('semester.fall'),
        color: '#FF5722',
    },
    {
        name: t('semester.winter'),
        color: '#2196F3',
    },
]
</script>

<template>
  <div v-if="props.intro">
    <div v-for="semester in semesterColor" :key="semester.name" class="mx-2 inline-block">
      <v-chip :color="semester.color">
        {{ semester.name }}
      </v-chip>
    </div>
  </div>
  <div v-else-if="props.editable">
    <div
      v-for="(semester, index) in semesterColor"
      :key="index"
      class="mx-2 inline-block"
    >
      <v-checkbox
        v-model="item"
        :value="index"
        :label="semester.name"
        :color="semester.color"
      ></v-checkbox>
    </div>
  </div>
  <div v-else>
    <div
      v-for="(semester, index) in item"
      :key="index"
      class="rounded-full w-5 mr-2"
      :style="{ backgroundColor: semesterColor[semester].color }"
    ></div>
  </div>
</template>

<style scoped></style>
