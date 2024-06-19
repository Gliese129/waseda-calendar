<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    icon: {
        type: String,
        default: '',
    },
    action: {
        type: Function,
        default: undefined,
    },
})

const clickedAction = async () => {
    if (props.action) {
        loading.value = true
        await props.action()
        loading.value = false
    }
}
const loading = ref(false)
</script>

<template>
  <v-list-item
    :prepend-icon="props.icon"
    :title="props.title"
    :subtitle="props.description"
    class="text-left"
    @click.prevent="clickedAction"
  >
    <template #prepend>
      <v-progress-circular
        v-if="loading"
        color="grey"
        indeterminate
        class="mr-6"
      ></v-progress-circular>
      <v-icon v-else :icon="props.icon"></v-icon>
    </template>
  </v-list-item>
</template>

<style scoped></style>
