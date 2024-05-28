<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store'
import { ref } from 'vue'

const store = useStore(key)

const periods = ref(store.state.calendar.periods.map((period: string[]) => [...period]))

const editPos = ref({ index: -1, pos: -1 })
const pickedTime = ref('')
const dialog = ref(false)
const editTime = (index: number, pos: number) => {
    editPos.value = { index, pos }
    dialog.value = true
    pickedTime.value = periods.value[index][pos]
}
const closeDialog = () => {
    dialog.value = false
    if (editPos.value.index !== -1 && editPos.value.pos !== -1) {
        periods.value[editPos.value.index][editPos.value.pos] = pickedTime.value
    }
}
const reset = () => {
    periods.value = store.state.syllabus.periods.map((period) => [
        period.start,
        period.end,
    ])
}
const update = async () => {
    store.dispatch('calendar/setPeriods', periods.value)
}
</script>

<template>
  <div>
    <v-card class="w-90vw py-4">
      <template #text>
        <v-row v-for="(period, index) in periods" :key="index" class="flex space-between">
          <v-col cols="2"> {{ index + 1 }} </v-col>
          <v-col cols="7">
            <v-chip class="m-0" outlined @click="editTime(index, 0)">
              {{ period[0] }}
            </v-chip>
            ~
            <v-chip class="m-0" outlined @click="editTime(index, 1)">
              {{ period[1] }}
            </v-chip>
          </v-col>
          <v-col class="flex">
            <v-btn size="x-small" class="m-0" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn size="x-small" class="m-0" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="reset">Reset</v-btn>
        <v-btn variant="text" color="blue" @click="update">Update</v-btn>
      </template>
    </v-card>
    <v-dialog v-model="dialog">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        :title="`Edit Period ${editPos.index + 1} ${editPos.pos === 0 ? 'Start' : 'End'}`"
      >
        <v-time-picker v-model="pickedTime" format="24hr"></v-time-picker>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="closeDialog"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
