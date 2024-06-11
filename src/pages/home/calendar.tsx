import { h, computed, defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { useRouter } from 'vue-router'
import { OnLongPress } from '@vueuse/components'
import { SimpleTime } from '@/model/date'
import { VCard } from 'vuetify/components'

h('div') // for h to be recognized

interface CourseInfo {
  code: string
  name: string
  classroom: string
  start: number
  end: number
  day: number
}

interface CalendarProps {
  courses: CourseInfo[]
  dateRange: {
    start: Date
    end: Date
  }
}
enum CellColor {
  BREAK = '#D1ECF1',
  RECESS = '#FFF3CD',
  CURRENT = '#D3EDDA',
  NORMAL = '#F0F9FF',
  CURRENT_PERIOD = '#F8D7DA',
  CURRENT_DAY = '#F2D99D',
}

export default defineComponent({
  name: 'Calendar',
  props: {
    courses: {
      type: Array as () => CalendarProps['courses'],
      required: true,
    },
    dateRange: {
      type: Object as () => CalendarProps['dateRange'],
      required: true,
    },
  },
  emits: [],
  setup(props: CalendarProps, _) {
    const store = useStore(key)
    const router = useRouter()
    const hiddenDays = [0] // hide Sunday column to save space
    const now = ref(new Date())
    onMounted(() => {
      setInterval(() => {
        now.value = new Date()
      }, 1000)
    })

    const periods = computed(() => store.state.calendar.periods)
    const holidays = computed(() =>
      store.state.syllabus.holidays
        .filter((holiday) =>
          holiday.isBetweenDate(props.dateRange.start, props.dateRange.end)
        )
        .map((holiday) => {
          return holiday.getAdjustedDate().getDay()
        })
    )
    const currentTime = computed(() => new SimpleTime(now.value))
    const currentPeriod = computed(() => {
      let nextPeriodIndex =
        periods.value.findIndex((period) => currentTime.value < period.start) + 1
      let currentPeriodIndex =
        periods.value.findIndex(
          (period) => currentTime.value >= period.start && currentTime.value <= period.end
        ) + 1

      if (currentPeriodIndex === 0) {
        return nextPeriodIndex === 0 ? -1 : nextPeriodIndex
      }
      return currentPeriodIndex
    })

    const computeCellColor = (day: number, startPeriod: number, _endPeriod?: number) => {
      const endPeriod = _endPeriod || startPeriod
      if (holidays.value.includes(day)) return CellColor.BREAK
      if (
        now.value.getDay() === day &&
        startPeriod <= currentPeriod.value &&
        currentPeriod.value <= endPeriod
      ) {
        if (currentPeriod.value >= startPeriod && currentPeriod.value <= endPeriod)
          if (currentTime.value < periods.value[startPeriod - 1].start)
            return CellColor.RECESS
        return CellColor.CURRENT
      }
      return CellColor.NORMAL
    }

    const courses = computed(() => {
      // Group courses by day
      const groupedCourses = Array.from({ length: 7 }, () => [] as CourseInfo[])
      props.courses.forEach((course) => {
        groupedCourses[course.day].push(course)
      })

      // Fill the table and transpose
      const filledTable = Array.from({ length: periods.value.length }, (_, periodIndex) =>
        groupedCourses.map((dayCourses) => {
          const course = dayCourses.find(
            // eslint-disable-next-line max-nested-callbacks
            (course) => course.start <= periodIndex + 1 && periodIndex + 1 <= course.end
          )
          if (course) {
            const repeated = periodIndex - (course.start - 1)
            return { course, repeated }
          }
          return null
        })
      )
      return filledTable
    })

    const header = computed(() => {
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const days = Array.from({ length: 7 }, (_, i) => {
        let day = new Date(props.dateRange.start.getTime() + i * 24 * 60 * 60 * 1000)
        if (hiddenDays.includes(day.getDay())) return null
        return (
          <VCard
            class="border border-slate-400 p-1 text-center flex flex-col"
            color={computeCellColor(day.getDay(), 1, periods.value.length)}
          >
            <span class="font-bold">{dayName[day.getDay()]}</span>
            <span class="text-sm">
              {day.getMonth() + 1}/{day.getDate()}
            </span>
          </VCard>
        )
      }).filter((cell) => cell)
      days.unshift(<VCard class="border border-slate-400 p-2 text-center"></VCard>)
      return days
    })
    const table = computed(() =>
      courses.value.map((courseInfo, periodIndex) => {
        const row = courseInfo
          .map((cellData, day) => {
            if (hiddenDays.includes(day)) return null
            if (!cellData)
              return (
                <OnLongPress
                  as={VCard}
                  options={{ delay: 1000 }}
                  // @ts-ignore-next-line
                  onTrigger={() =>
                    router.push({
                      name: 'Search',
                      query: { dayOfWeek: day, period: (periodIndex + 1) * 11 },
                    })
                  }
                  class="border border-slate-400 p-1 select-none backdrop-blur-md"
                >
                  &nbsp;
                </OnLongPress>
              )
            const { course, repeated } = cellData
            if (repeated) return null
            return (
              <OnLongPress
                as={VCard}
                options={{ delay: 1000 }}
                // @ts-ignore-next-line
                onTrigger={() =>
                  router.push({
                    name: 'My Courses',
                    params: { keyword: course.code },
                  })
                }
                class="flex flex-col justify-around border border-slate-400 p-2 text-xs"
                style={{ gridRow: `span ${course.end - course.start + 1}` }}
                color={computeCellColor(day, course.start, course.end)}
              >
                <div>
                  <div class="font-semibold mb-2">{course.name}</div>
                  <div class="rounded-md shadow-inner shadow">{course.classroom}</div>
                </div>
              </OnLongPress>
            )
          })
          .filter((cell) => cell)
        row.unshift(
          <VCard
            class="border border-slate-400 p-1 flex flex-col justify-center"
            color={computeCellColor(now.value.getDay(), periodIndex + 1)}
          >
            <div class="font-bold">{periodIndex + 1}</div>
            <div class="flex flex-col">
              <span class="text-sm">{periods.value[periodIndex].start}</span>
              <span class="rotate-90 leading-none">~</span>
              <span class="text-sm leading-tight">{periods.value[periodIndex].end}</span>
            </div>
          </VCard>
        )
        return row
      })
    )

    return () => (
      <div class="grid grid-cols-7 gap-1">
        {header.value}
        {table.value}
      </div>
    )
  },
})
