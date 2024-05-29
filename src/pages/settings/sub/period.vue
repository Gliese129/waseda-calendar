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

let _clearInterval: any
const update = async () => {
    // check if the periods are valid
    const time2num = (time: string) => {
        const [hour, minute] = time.split(':').map(Number)
        return hour * 60 + minute
    }
    if (_clearInterval) clearInterval(_clearInterval)
    msgText.value = ''
    msgTitle.value = ''
    try {
        // check if any period is empty
        if (periods.value.some((period) => period[0] === '' || period[1] === ''))
            throw new Error('Empty Time')
        // check if start time is greater than end time
        if (periods.value.some((period) => time2num(period[0]) >= time2num(period[1])))
            throw new Error(`Start time should be smaller then end time`)
        // check if any period is duplicate

        if (
            periods.value.some((period, index) =>
                periods.value
                    .slice(index + 1)
                    .some((p) => p[0] === period[0] || p[1] === period[1])
            )
        )
            throw new Error('Duplicate Time')
        // check if i+1th period start time is greater than ith period end time
        if (
            periods.value.some((period, index) => {
                if (index === periods.value.length - 1) return false
                return time2num(period[1]) >= time2num(periods.value[index + 1][0])
            })
        )
            throw new Error(`End time should be smaller then next start time`)
        // passed
        store.dispatch('calendar/setPeriods', periods.value)
        msgTitle.value = 'Success'
        msgText.value = 'Periods Updated'
        msgType.value = 'success'
        _clearInterval = setInterval(() => {
            msgText.value = ''
            msgTitle.value = ''
        }, 3000)
    } catch (e: any) {
        console.log(e)
        msgTitle.value = 'Invalid Periods'
        msgText.value = e.message
        msgType.value = 'error'
        _clearInterval = setInterval(() => {
            msgText.value = ''
            msgTitle.value = ''
        }, 3000)
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
const msgTitle = ref('')
const msgText = ref('')
const msgType = ref<any>('error')
</script>

<template>
  <div>
    <v-alert
      :text="msgText"
      :title="msgTitle"
      density="compact"
      :type="msgType"
      :class="[
        'absolute z-9999 w-90vw transition-top',
        msgText === '' ? 'top-neg-50' : 'top-5',
      ]"
    ></v-alert>
    <v-card class="w-90vw py-4">
      <template #text>
        <v-row v-for="(period, index) in periods" :key="index" class="flex space-between">
          <v-col cols="2"> {{ index + 1 }} </v-col>
          <v-col cols="7" class="flex items-center justify-between justify-items-center">
            <v-chip class="m-0" outlined @click.prevent="editTime(index, 0)">
              {{ period[0] }}
            </v-chip>
            <div>~</div>
            <v-chip class="m-0" outlined @click.prevent="editTime(index, 1)">
              {{ period[1] }}
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
        :title="`Edit Period ${editPos.index + 1} ${editPos.pos === 0 ? 'Start' : 'End'}`"
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
