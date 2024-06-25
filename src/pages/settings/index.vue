<script setup lang="ts">
import { key } from '@/store'
import useSQLiteDB from '@/utils/sqlite'
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore(key)
const $sqlite = ref()

onMounted(async () => {
    const { performSQLAction } = await useSQLiteDB()
    $sqlite.value = performSQLAction
})

watch(
    () => store.state.user,
    () => {
        store.dispatch('user/saveToDB', $sqlite.value)
    },
    { deep: true }
)

defineOptions({
    name: 'SettingsPage',
})
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
  .slide-fade-enter-active {
    transition: all 0.2s ease-out;
  }

  .slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
