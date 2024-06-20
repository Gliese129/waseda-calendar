<script setup lang="ts">
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { CustomNotification } from '@/utils/message-alert'

const msgStack = inject<Ref<CustomNotification[]>>('$msgStack')
</script>

<template>
  <div class="absolute z-9999 w-full">
    <transition-group name="list">
      <v-alert
        v-for="msg in msgStack"
        :key="msg.message"
        :text="msg.message"
        :type="msg.type"
        density="comfortable"
        class="w-full mx-auto my-2"
      ></v-alert>
    </transition-group>
  </div>
</template>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.25s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
</style>
@/utils/message-alert
