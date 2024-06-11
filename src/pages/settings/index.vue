<script setup lang="ts">
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
