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
const emits = defineEmits(['afterSave'])
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
    } catch (e: any) {
        $message({
            message: e.message,
            type: 'warning',
        })
    }
}
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12">
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
      <TermOverview intro style="margin: auto"></TermOverview>
      <v-btn
        color="blue"
        style="margin: auto; margin-right: 0"
        @click="
          course.schedules.push({
            day: -1,
            period: [1, 1],
            term: [],
            classroom: '',
          })
        "
      >
        <v-icon>mdi-plus</v-icon>
        Add
      </v-btn>

      <v-expansion-panels>
        <v-expansion-panel
          v-for="(tp, index) in course.schedules"
          :key="index"
          show-expand
          expand-on-click
        >
          <template #title>
            <div v-show="tp.day !== -1">
              <span style="font-weight: bold; margin-right: 20px">
                Period {{ index + 1 }}
              </span>
              {{ showDay(tp.day) }} {{ showPeriod(tp.period[0], tp.period[1]) }}
            </div>
            <div v-show="tp.day === -1">
              <span style="font-weight: bold; margin-right: 20px">
                Period {{ index + 1 }}
              </span>
              <span style="color: gray">Not set</span>
            </div>
            <v-btn
              color="red"
              class="del-btn"
              @click.stop="course.schedules.splice(index, 1)"
            >
              <v-icon>mdi-delete</v-icon>
              del
            </v-btn>
          </template>
          <template #text>
            <v-row>
              <v-checkbox
                v-for="(quarter, index) in ['Spring', 'Summer', 'Fall', 'Winter']"
                :key="index"
                v-model="tp.term"
                class="term-checkbox"
                :value="index"
                :label="quarter"
                @update:model-value="tp.term.sort((a, b) => a - b)"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-btn-toggle v-model="tp.day" rounded="2" group density="compact">
                <v-btn
                  v-for="(day, index) in [1, 2, 3, 4, 5, 6]"
                  :key="index"
                  class="day-button"
                  :value="day"
                  size="small"
                >
                  {{ showDay(day) }}
                </v-btn>
              </v-btn-toggle>
            </v-row>
            <v-row>
              <v-col cols="1">
                <v-icon>mdi-clock-time-four-outline</v-icon>
              </v-col>
              <v-col cols="5">
                <v-number-input
                  v-model="tp.period[0]"
                  label="Start"
                  variant="solo"
                  density="compact"
                  control-variant="stacked"
                  :max="7"
                  :min="1"
                  @update:model-value="
                    tp.period[1] = Math.max(tp.period[0], tp.period[1])
                  "
                >
                </v-number-input>
              </v-col>
              <v-col cols="5">
                <v-number-input
                  v-model="tp.period[1]"
                  label="End"
                  variant="solo"
                  density="compact"
                  control-variant="stacked"
                  :max="7"
                  :min="1"
                  @update:model-value="
                    tp.period[0] = Math.min(tp.period[0], tp.period[1])
                  "
                >
                </v-number-input>
              </v-col>
            </v-row>
            <v-row>
              <v-text-field
                v-model="tp.classroom"
                prepend-icon="mdi-door"
                label="Room"
                variant="solo"
                density="compact"
              ></v-text-field>
            </v-row>
          </template>
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
    <v-row>
      <v-col cols="6">
        <v-btn color="red" width="100%" @click="reset">Reset</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="blue" width="100%" @click="save"> Save </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<style lang="scss" scoped>
  .v-form {
    margin: 20px auto;
  }
  .v-row {
    margin: 5px auto;
  }
  :deep(.v-data-table-footer) {
    display: none;
  }
  :deep(.v-input__details) {
    display: none;
  }
  .label {
    font-weight: bold;
    text-align: center;
    margin: auto;
  }
  .term-checkbox {
    font-size: 0.8rem;
    :deep(.v-label) {
      font-size: 0.9rem !important;
    }
  }
  .day-button {
    margin-bottom: 5px;
  }
  .del-btn {
    margin: auto;
    margin-right: 0;
  }
</style>
