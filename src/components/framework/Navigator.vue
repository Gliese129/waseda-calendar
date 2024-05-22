<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { watch } from 'vue'

const router = useRouter()
const store = useStore(key)

const toggle = ref(0)
watch(
    () => store.state.system.currRoute.index,
    (idx) => {
        toggle.value = idx
    }
)
</script>

<template>
  <v-btn-toggle v-model="toggle" class="flex" color="light-grey" rounded="sm">
    <v-btn class="flex-auto" density="default" @click="router.push('/')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn class="flex-auto" density="default" @click="router.push('/search')">
      <v-icon>mdi-book-search-outline</v-icon>
    </v-btn>
    <v-btn class="flex-auto" density="default" @click="router.push('/my-courses')">
      <v-icon>mdi-book-open-variant</v-icon>
    </v-btn>
    <v-btn class="flex-auto" @click="router.push('/settings')">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<style scoped lang="scss"></style>
