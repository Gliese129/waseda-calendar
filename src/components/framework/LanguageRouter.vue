<template>
  <router-view v-slot="{ Component }">
    <KeepAlive include="search">
      <component :is="Component" />
    </KeepAlive>
  </router-view>
</template>
