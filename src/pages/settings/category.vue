<script setup lang="ts">
import { store } from '@/store'
import type { Ref } from 'vue'
import { inject } from 'vue'
import SettingItem from '@/components/SettingItem.vue'
import { computed } from 'vue'
const $message = inject('$message') as Function

interface SettingGroup {
    name: string
    color: string
    items: {
        title: string
        text?: string
        icon: string
        href?: string
        action?: Function
        val?: Ref<Boolean>
    }[]
}
const settings: SettingGroup[] = [
    {
        name: 'Schedule',
        color: 'grey',
        items: [
            {
                title: 'Periods',
                text: 'Set up your school periods',
                icon: 'mdi-clock-time-four-outline',
                href: '/settings/periods',
            },
        ],
    },
    {
        name: 'General',
        color: 'blue',
        items: [
            {
                title: 'Course Notifications',
                text: 'Get notifications of the current course',
                icon: 'mdi-bell',
                val: computed({
                    get() {
                        return store.state.system.coursePush
                    },
                    set(value) {
                        store.dispatch('system/setCoursePush', value)
                    },
                }),
            },
        ],
    },
    {
        name: 'Danger Zone',
        color: 'red',
        items: [
            {
                title: 'Clear Cache',
                text: 'If you have any problem, try this',
                icon: 'mdi-delete',
                action: async () => {
                    await store.dispatch('syllabus/forceRefresh')
                    $message('Cache cleared', 'success')
                },
            },
        ],
    },
]
</script>

<template>
  <v-list lines="three" select-strategy="classic" class="w-90vw">
    <div v-for="group in settings" :key="group.name">
      <v-list-subheader :color="group.color">{{ group.name }}</v-list-subheader>
      <setting-item
        v-for="item in group.items"
        :key="item.title"
        :icon="item.icon"
        :title="item.title"
        :description="item.text"
        :link="item.href"
        :action="item.action"
        :modelValue="item.val"
        class="text-left"
      ></setting-item>
      <v-divider inset></v-divider>
    </div>
  </v-list>
</template>

<style scoped></style>
