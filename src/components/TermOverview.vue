<script setup lang="ts">

const props = defineProps({
    intro: Boolean,
    editable: Boolean,
})

const item = defineModel<Array<number>>('item')

const quarterShow = [
    {
        name: 'Spring',
        color: '#4CAF50',
    },
    {
        name: 'Summer',
        color: '#FFC107',
    },
    {
        name: 'Fall',
        color: '#FF5722',
    },
    {
        name: 'Winter',
        color: '#2196F3',
    },
]
</script>

<template>
  <div v-if="props.intro">
    Term color:
    <div v-for="quarter in quarterShow" :key="quarter.name" class="term-group">
      <v-chip :color="quarter.color">
        {{ quarter.name }}
      </v-chip>
    </div>
  </div>
  <div v-else-if="props.editable">
    <div
      v-for="(quarter, index) in quarterShow"
      :key="index"
      class="term-group"
    >
      <v-checkbox
        v-model="item"
        :value="index"
        :label="quarter.name"
        :color="quarter.color"
      ></v-checkbox>
    </div>
  </div>
  <div v-else>
    <div
      v-for="(quarter, index) in item"
      :key="index"
      class="circle"
      :style="{ backgroundColor: quarterShow[quarter].color }"
    ></div>
  </div>
</template>

<style scoped>
  .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
  }
   .term-group {
    display: inline-block;
    margin: 3px 0;
  }
</style>
