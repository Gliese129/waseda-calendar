<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const store = useStore(key)

const periods = computed(() => store.state.calendar.periods)
</script>

<template>
  <v-list class="w-90vw">
    <v-list-item-group>
      <v-list-item
        v-for="(period, index) in periods"
        :key="index"
        class="flex space-between"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ index + 1 }} [ "{{ period[0] }}", "{{ period[1] }}" ]
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action class="flex">
          <v-btn size="small" class="m-0" icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn size="small" class="m-0" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<style scoped>
  :deep(.v-data-table-footer) {
    display: none;
  }
</style>
