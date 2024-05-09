import { h, computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import type { Course } from '@/model/course'

h('div') // for h to be recognized

interface CalendarProps {
    courses: {
        name: string
        classroom: string
        start: number
        end: number
        day: number
    }[]
    currQuarter: number
}

export default defineComponent({
    props: {
        courses: {
            type: Array<any>,
            required: true,
        },
        currQuarter: {
            type: Number,
            required: true,
        },
    },
    emits: [],
    setup(props: CalendarProps, _) {
        const store = useStore(key)
        const periodSettings = computed(() => store.state.calendar.periodSettings)

        const date = ref(new Date())
        setInterval(() => {
            date.value = new Date()
        }, 1000)
        const hiddenDays = [0] // hide Sunday column to save space
        const holidays = [] as number[] // TODO: holidays

        const header = computed(() => {
            let currDay = date.value.getDay()
            let startOfWeek = date.value.getTime() - currDay * 24 * 60 * 60 * 1000

            let thisWeek = Array.from(
                { length: 7 },
                (_, i) => new Date(startOfWeek + i * 24 * 60 * 60 * 1000)
            )
            return (
                <tr>
                    <th class="border border-slate-300 w-1/8"></th>
                    {thisWeek
                        .map((date) => (
                            <th class="border border-slate-300  w-1/8">
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
                <td class="border border-slate-300 flex-col">
                    <div class="font-bold text-sm/6">{index + 1}</div>
                    <div class="text-sm/3">{periodInfo[0]}</div>
                    <div class="rotate-90 text-xs/2">~</div>
                    <div class="text-sm/4">{periodInfo[1]}</div>
                </td>,
            ])
            // process the timetable
            let table = periods.map(() => {
                return Array.from({ length: 7 }, () => <td class="border border-slate-300"></td>)
            })
            props.courses.forEach((course) => {
                table[course.start - 1][course.day] = (
                    <td rowspan={course.start - course.end + 1} class="border border-slate-300 text-xs">
                        <v-card>
                            <div class="font-bold">{course.name}</div>
                            <div>{course.classroom}</div>
                        </v-card>
                    </td>
                )
                for (let period = course.start; period <= course.end; ++period) {
                    table[period][course.day] = <td style="display: none"></td>
                }
            })
            // highlight the current period
            let currDay = date.value.getDay()
            let currPeriod = 0
            const time2num = (time: string) => {
                let [hour, minute] = time.split(':').map(Number)
                return hour * 60 + minute
            }
            let currTime = date.value.getHours() * 60 + date.value.getMinutes()
            while (currTime > time2num(periodSettings.value[currPeriod][1])) {
                currPeriod++
            }
            currDay += currPeriod === periodSettings.value.length ? 1 : 0
            currPeriod %= periodSettings.value.length
            // highlight the course cell
            let courseStarted = currTime >= time2num(periodSettings.value[currPeriod][0])
            if (table[currPeriod] && table[currPeriod][currDay])
                table[currPeriod][currDay]!!.props!!.bgcolor = courseStarted ? '#D4EDDA' : '#FFF3CD'
            // highlight the current time
            if (periods[currPeriod]) periods[currPeriod][0]!!.props!!.bgcolor = '#F8D7DA'

            return periods.map((period, index) => {
                return (
                    <tr>
                        {period}
                        {table[index].filter((_, index) => hiddenDays.indexOf(index) === -1)}
                    </tr>
                )
            })
        })

        // disable holidays
        const headerColors = computed(() => {
            return new Array(7)
                .fill(0)
                .map((_, index) => {
                    if (holidays.indexOf(index) !== -1) return <col class="bgc-#E2E3E5" />
                    return <col />
                })
                .filter((_, index) => hiddenDays.indexOf(index) === -1)
        })

        return () => (
            <table class="border-collapse border border-slate-400 rounded w-90vw m-auto">
                <colgroup>
                    <col />
                    {headerColors.value}
                </colgroup>
                {header.value} {content.value}
            </table>
        )
    },
})
