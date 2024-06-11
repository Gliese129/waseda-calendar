<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store'
import { ref } from 'vue'
import { inject } from 'vue'
import { SimpleTime } from '@/model/date'

const store = useStore(key)
const $message = inject<Function>('$message') as Function

const periods = ref(
    store.state.calendar.periods.map((period) => {
        return {
            start: period.start,
            end: period.end,
        }
    })
)

const editPos = ref({ index: -1, pos: 'start' as 'start' | 'end' })
const pickedTime = ref('')
const dialog = ref(false)
const editTime = (index: number, pos: 'start' | 'end') => {
    editPos.value = { index, pos }
    dialog.value = true
    pickedTime.value = periods.value[index][pos].toString()
}
const closeDialog = () => {
    dialog.value = false
    if (editPos.value.index !== -1) {
        periods.value[editPos.value.index][editPos.value.pos] = new SimpleTime(
            pickedTime.value
        )
    }
}
const reset = () => {
    periods.value = store.state.syllabus.periods.map((period) => {
        return {
            start: period.start,
            end: period.end,
        }
    })
}

const update = async () => {
    // check if the periods are valid
    try {
        // check if any period is empty
        if (periods.value.some((period) => !period.start || !period.end))
            throw new Error('Empty Time')
        // check if start time is greater than end time
        if (periods.value.some((period) => period.start >= period.end))
            throw new Error(`Start time should be smaller then end time`)
        // check if any period is duplicate
        if (
            periods.value.some((period, index) =>
                periods.value
                    .slice(index + 1)
                    .some((p) => p.start === period.start && p.end === period.end)
            )
        )
            throw new Error('Duplicate Time')
        // check if i+1th period start time is greater than ith period end time
        if (
            periods.value.some((period, index) => {
                if (index === periods.value.length - 1) return false
                return period.end >= periods.value[index + 1].start
            })
        )
            throw new Error(`End time should be smaller then next start time`)
        // passed
        store.dispatch('calendar/setPeriods', periods.value)
        $message('Periods Updated', 'success')
    } catch (e: any) {
        console.log(e)
        $message(e.message, 'error')
    }
}

const periodInsertAt = (index: number, newItem: any) => {
    periods.value = [
        ...periods.value.slice(0, index),
        newItem,
        ...periods.value.slice(index),
    ]
}
const periodDeleteAt = (index: number) => {
    periods.value = [...periods.value.slice(0, index), ...periods.value.slice(index + 1)]
}
</script>

<template>
  <div>
    <v-card class="w-90vw py-4">
      <template #text>
        <v-row v-for="(period, index) in periods" :key="index" class="flex space-between">
          <v-col cols="2"> {{ index + 1 }} </v-col>
          <v-col cols="7" class="flex items-center justify-between justify-items-center">
            <v-chip class="m-0" outlined @click.prevent="editTime(index, 'start')">
              {{ period.start.toString() }}
            </v-chip>
            <div>~</div>
            <v-chip class="m-0" outlined @click.prevent="editTime(index, 'end')">
              {{ period.end.toString() }}
            </v-chip>
          </v-col>
          <v-col class="flex">
            <v-btn size="x-small" class="m-0" icon>
              <v-icon @click="periodInsertAt(index + 1, ['', ''])">mdi-plus</v-icon>
            </v-btn>
            <v-btn size="x-small" class="m-0" icon>
              <v-icon @click="periodDeleteAt(index)">mdi-delete</v-icon>
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
        :title="`Edit Period ${editPos.index + 1} ${editPos.pos}`"
      >
        <v-switch label=""></v-switch>
        <v-time-picker v-model="pickedTime" format="24hr"></v-time-picker>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Ok" @click="closeDialog"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped></style>
