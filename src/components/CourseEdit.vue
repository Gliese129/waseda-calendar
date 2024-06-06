<script setup lang="ts">
import { Course } from '@/model/course'
import { inject, reactive } from 'vue'
import { watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import TermOverview from '@/components/TermOverview.vue'
const props = defineProps({
    edit: {
        type: Boolean,
        default: false,
    },
})
const emits = defineEmits(['afterSave', 'close'])
const $message = inject<Function>('$message') as Function
const store = useStore(key)

const origin = defineModel<Course>('origin')

const course = reactive<Course>(new Course('', ''))
watch(
    origin,
    (newCourse) => {
        if (newCourse) {
            Course.deepCopy(course, newCourse)
        }
    },
    { deep: true, immediate: true }
)

const reset = () => {
    Course.deepCopy(course, origin.value || ({} as any))
}

const showDay = (day: number) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
}
const showPeriod = (startPeriod: number, endPeriod: number) => {
    if (startPeriod === endPeriod) return `${startPeriod}`
    return `${startPeriod}-${endPeriod}`
}

const save = async () => {
    try {
        if (props.edit) {
            await store.dispatch('calendar/deleteCourse', origin.value)
        }
        await store.dispatch('calendar/addCourse', course)

        emits('afterSave')
        $message('Saved successfully', 'success')
    } catch (e: any) {
        $message(e.message, 'warning')
    }
}
const addPeriod = () => {
    course.schedules.push({
        day: -1,
        period: [1, 1],
        term: [],
        classroom: '',
    })
}
const deleteEmpty = () => {
    course.schedules = course.schedules.filter((tp) => tp.day !== -1)
}

const openInNew = (url: string | undefined) => {
    if (!url) return
    window.open(url, '_blank')
}
</script>

<template>
  <v-toolbar>
    <v-btn icon="mdi-close" @click="$emit('close')"></v-btn>

    <v-toolbar-title>{{ origin?.name }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <slot name="extra-actions">
        <v-btn text="Reset" color="red" variant="text" @click="reset"></v-btn>
      </slot>
      <v-btn text="Save" color="blue" variant="text" @click="save"></v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <v-expansion-panels elevation="1" class="w-full mb-5">
    <v-expansion-panel>
      <v-expansion-panel-title class="py-1">
        <p>Syllabus Raw Content</p>
        <v-btn
          class="ml-1"
          variant="text"
          icon="mdi-open-in-new"
          @click.stop="openInNew(origin?.url)"
        ></v-btn>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <iframe :src="origin?.url" class="mx-auto h-30vh w-full" frameborder="0"></iframe>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-form class="w-90vw mx-auto">
    <v-row>
      <v-col>
        <v-text-field
          v-model="course.name"
          prepend-icon="mdi-rename-box-outline"
          label="Name"
          variant="solo"
          density="comfortable"
          :readonly="!props.edit"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="course.department"
          :items="store.state.syllabus.departments"
          prepend-icon="mdi-school-outline"
          label="Department"
          variant="solo"
          density="comfortable"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="course.campus"
          prepend-icon="mdi-map-marker-outline"
          label="Campus"
          variant="solo"
          density="comfortable"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-combobox
          v-model="course.teachers"
          :items="[]"
          prepend-icon="mdi-account-outline"
          label="Teachers"
          chips
          multiple
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <TermOverview intro class="mx-auto"></TermOverview>
    </v-row>
    <v-row>
      <v-expansion-panels class="mx-4">
        <v-expansion-panel
          v-for="(tp, index) in course.schedules"
          :key="index"
          show-expand
          expand-on-click
        >
          <v-expansion-panel-title class="py-1">
            <div>
              <span class="font-bold mr-4"> Period {{ index + 1 }} </span>
              <span v-if="tp.day !== -1">
                {{ showDay(tp.day) }} {{ showPeriod(tp.period[0], tp.period[1]) }}
              </span>
              <span v-else> Not set </span>
            </div>

            <template v-slot:actions>
              <v-btn
                color="red"
                class="del-btn"
                @click.stop="course.schedules.splice(index, 1)"
              >
                <v-icon>mdi-delete</v-icon>
                del
              </v-btn>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-checkbox
                v-for="(quarter, index) in ['Spring', 'Summer', 'Fall', 'Winter']"
                :key="index"
                v-model="tp.term"
                class="mx-auto"
                hide-details
                :value="index"
                :label="quarter"
                @update:model-value="tp.term.sort((a, b) => a - b)"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-btn-toggle
                v-model="tp.day"
                class="mx-auto"
                rounded="2"
                group
                density="compact"
              >
                <v-btn
                  v-for="(day, index) in [1, 2, 3, 4, 5, 6]"
                  :key="index"
                  :value="day"
                >
                  {{ showDay(day) }}
                </v-btn>
              </v-btn-toggle>
            </v-row>
            <v-row>
              <v-col cols="6" class="flex">
                <v-icon class="m-auto">mdi-clock-time-four-outline</v-icon>

                <v-number-input
                  v-model="tp.period[0]"
                  label="Start"
                  variant="solo"
                  density="compact"
                  control-variant="stacked"
                  hide-details
                  :max="store.state.calendar.periods.length"
                  :min="1"
                  @update:model-value="
                    tp.period[1] = Math.max(tp.period[0], tp.period[1])
                  "
                >
                </v-number-input>
                <v-number-input
                  v-model="tp.period[1]"
                  label="End"
                  variant="solo"
                  density="compact"
                  control-variant="stacked"
                  hide-details
                  :max="store.state.calendar.periods.length"
                  :min="1"
                  @update:model-value="
                    tp.period[0] = Math.min(tp.period[0], tp.period[1])
                  "
                >
                </v-number-input>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="tp.classroom"
                  prepend-icon="mdi-door"
                  label="Room"
                  variant="solo"
                  density="compact"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel readonly>
          <v-expansion-panel-title class="py-1 flex justify-around">
            <v-btn color="orange" prepend-icon="mdi-delete" @click.stop="deleteEmpty">
              Delete Empty
            </v-btn>

            <template v-slot:actions>
              <v-btn color="blue" @click.stop="addPeriod">
                <v-icon>mdi-plus</v-icon>
                Add
              </v-btn>
            </template>
          </v-expansion-panel-title>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-number-input
          v-model="course.credits"
          label="Credits"
          variant="solo"
          density="compact"
          control-variant="stacked"
          :min="1"
        >
        </v-number-input>
      </v-col>
      <v-col cols="8">
        <v-text-field
          v-model="course.textbook"
          label="Textbook"
          variant="solo"
          density="compact"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped></style>
