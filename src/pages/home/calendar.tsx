import { h, computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

interface CourseInfo {
  name: string
  classroom: string
  start: number
  end: number
  length: number
  bgcolor: string
}

h('div') // for h to be recognized

interface CalendarProps {
  courses: {
    name: string
    classroom: string
    start: number
    end: number
    day: number
  }[]
  currDate: Date
}
enum CellColor {
  BREAK = '#D1ECF1',
  RECESS = '#FFF3CD',
  CURRENT = '#D3EDDA',
  NORMAL = '#FFFFFF',
  CURRENT_PERIOD = '#F8D7DA',
  CURRENT_DAY = '#F0C04F',
  DISABLED = '#F5F5F5',
}

export default defineComponent({
  props: {
    courses: {
      type: Array<any>,
      required: true,
    },
    currDate: {
      type: Date,
      required: true,
    },
  },
  emits: [],
  setup(props: CalendarProps, _) {
    const store = useStore(key)
    const time2num = (time: string) => {
      let [hour, minute] = time.split(':').map(Number)
      return hour * 60 + minute
    }
    const hiddenDays = [0] // hide Sunday column to save space
    const periodSettings = computed(() => store.state.calendar.periodSettings)
    const startOfWeek = computed(() => {
      let currDay = props.currDate.getDay()
      return new Date(props.currDate.getTime() - currDay * 24 * 60 * 60 * 1000)
    })
    //
    const holidays = computed(() =>
      store.state.syllabus.holidays
        .filter((holiday) =>
          holiday.isBetweenDate(
            startOfWeek.value,
            new Date(startOfWeek.value.getTime() + 7 * 24 * 60 * 60 * 1000)
          )
        )
        .map((holiday) => {
          // get the dayOfWeek of the holiday
          return holiday.getAdjustedDate().getDay()
        })
    )
    const currTime = computed(
      () => props.currDate.getHours() * 60 + props.currDate.getMinutes()
    )
    const currPeriod = computed(() => {
      let currPeriod = 0
      while (currTime.value > time2num(periodSettings.value[currPeriod][1])) {
        currPeriod++
      }
      return currPeriod
    })

    const courses = computed(() => {
      let table = props.courses
        .map((course) => {
          // add some additional info
          let isNextOrCurrCourse =
            currPeriod.value >= course.start && currPeriod.value <= course.end
          let isRecess =
            currTime.value < time2num(periodSettings.value[course.start - 1][0])
          let isBreak = holidays.value.indexOf(course.day) !== -1

          let color = CellColor.NORMAL
          if (isNextOrCurrCourse) color = isRecess ? CellColor.RECESS : CellColor.CURRENT
          else if (isBreak) color = CellColor.BREAK
          else color = CellColor.NORMAL

          return {
            ...course,
            length: course.end - course.start + 1,
            bgcolor: color,
          }
        })
        .reduce(
          // group courses by day
          (acc, course) => {
            let day = course.day
            if (!acc[day]) acc[day] = []
            acc[day].push(course)
            return acc
          },
          Array.from({ length: 7 }, () => [] as CourseInfo[])
        )
        .map((dayCol) => {
          // fill the table
          let length = periodSettings.value.length
          let result = Array.from({ length }, () => null) as Array<{
            course: CourseInfo
            repeated: number
          } | null>
          dayCol.forEach((course) => {
            let repeated = 0
            for (let i = course.start - 1; i < course.end; i++) {
              result[i] = { course, repeated }
              repeated++
            }
          })
          return result
        })
      // transpose the table
      return table[0].map((_, colIndex) => table.map((row) => row[colIndex]))
    })
    //
    const header = computed(() => {
      console.log(courses.value)

      let thisWeek = Array.from(
        { length: 7 },
        (_, i) => new Date(Number(startOfWeek.value) + i * 24 * 60 * 60 * 1000)
      )
      return (
        <tr>
          <th class="border border-slate-300 w-1/8"></th>
          {thisWeek
            .map((date) => (
              <th
                style={{
                  backgroundColor:
                    date.getDay() === props.currDate.getDay()
                      ? CellColor.CURRENT_DAY
                      : '',
                }}
                class="border border-slate-300  w-1/8"
              >
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                <br />
                {date.getMonth() + 1}/{date.getDate()}
              </th>
            ))
            .filter((_, index) => hiddenDays.indexOf(index) === -1)}
        </tr>
      )
    })

    const content = computed(() => {
      // generate the period column
      let periods = periodSettings.value.map((periodInfo, index) => [
        <td
          class="border border-slate-300 flex-col"
          style={{
            backgroundColor: currPeriod.value === index ? CellColor.CURRENT_PERIOD : '',
          }}
        >
          <div class="font-bold text-sm/6">{index + 1}</div>
          <div class="text-sm/3">{periodInfo[0]}</div>
          <div class="rotate-90 text-xs/2">~</div>
          <div class="text-sm/4">{periodInfo[1]}</div>
        </td>,
      ])
      // process the timetable
      let table = courses.value.map((row) =>
        row
          .map((col) =>
            col ? (
              <td
                rowspan={col.course.length}
                class="border border-slate-300 text-xs/3 p-px w-1/8"
                style={{
                  backgroundColor: col.course.bgcolor,
                  display: col.repeated === 0 ? '' : 'none',
                }}
              >
                <v-card>
                  <div
                    class="font-bold text-wrap break-all"
                    style={`font-size: ${col.course.name.length >= 10 ? 80 : 100}%`}
                  >
                    {col.course.name}
                  </div>
                  <div>{col.course.classroom}</div>
                </v-card>
              </td>
            ) : (
              <td class="border border-slate-300 text-xs/3 p-px w-1/8"></td>
            )
          )
          .filter((_, index) => hiddenDays.indexOf(index) === -1)
      )
      return periods.map((period, index) => {
        return (
          <tr>
            {period}
            {table[index]}
          </tr>
        )
      })
    })

    // disable holidays
    const headerColors = computed(() => {
      return new Array(7)
        .fill(0)
        .map((_, index) => (
          <col
            style={{
              backgroundColor:
                holidays.value.indexOf(index) !== -1 ? CellColor.DISABLED : '',
            }}
          />
        ))
        .filter((_, index) => hiddenDays.indexOf(index) === -1)
    })

    return () => (
      <table class="border-collapse border border-slate-400 rounded w-90vw m-auto table-fixed">
        <colgroup>
          <col />
          {headerColors.value}
        </colgroup>
        {header.value} {content.value}
      </table>
    )
  },
})
