<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const infoSettings = [
    {
        name: 'Schedule',
        items: [
            {
                title: 'Periods',
                subtitle: 'Set up your school periods',
                icon: 'mdi-clock-time-four-outline',
                href: '/settings/periods',
            },
        ],
    },
]
</script>

<template>
  <v-list lines="three" select-strategy="classic" class="w-90vw">
    <div v-for="group in infoSettings" :key="group.name">
      <v-list-subheader>{{ group.name }}</v-list-subheader>
      <v-list-item
        v-for="item in group.items"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
        class="text-left"
        @click="router.push(item.href)"
      ></v-list-item>
    </div>
    <v-divider inset></v-divider>
    <v-list-subheader>General</v-list-subheader>
  </v-list>
</template>

<style scoped></style>
