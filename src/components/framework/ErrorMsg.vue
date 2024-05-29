<script setup lang="ts">
import { ref } from 'vue'
import { inject, watch } from 'vue'

const error = inject<Error>('error')

const errorStack = ref<Error[]>([])
watch(
    () => error as Error,
    (newError: Error) => {
        errorStack.value.push(newError)
        setInterval(() => {
            errorStack.value.shift()
        }, 3000)
    }
)
</script>

<template>
  <div>{{ error }}</div>
</template>

<style scoped></style>
