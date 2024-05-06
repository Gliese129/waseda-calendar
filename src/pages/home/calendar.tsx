import { h, computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import type { Course } from '@/model/course'

import style from './calendar.module.scss'

interface CalendarProps {
    courses: Course[]
}

export default defineComponent({
    props: {
        courses: {
            type: Array<Course>,
            required: true,
        },
    },
    emits: [],
    setup(props, ctx) {
        const store = useStore(key)
        const periodSettings = computed(() => store.state.calendar.periodSettings)

        const header = computed(() => {
            let currDay = new Date().getDay()
            let startOfWeek = new Date().getTime() - currDay * 24 * 60 * 60 * 1000

            let thisWeek = Array.from(
                { length: 7 },
                (_, i) => new Date(startOfWeek + i * 24 * 60 * 60 * 1000)
            )
            return (
                <tr>
                    <th class="border border-slate-300 w-30"></th>
                    {thisWeek.map((date) => (
                        <th class="border border-slate-300">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            <br />
                            {date.getMonth() + 1}/{date.getDate()}
                        </th>
                    ))}
                </tr>
            )
        })

        const content = computed(() => {
            let periods = []
            for (let i = 0; i < periodSettings.value.length; ++i) {
                periods.push([
                    <div class="flex-col">
                        <div class="font-bold">{i + 1}</div>
                        <div class="text-sm">{periodSettings.value[i][0]}</div>
                        <div class="rotate-90">~</div>
                        <div class="text-sm">{periodSettings.value[i][1]}</div>
                    </div>,
                ])
            }

            let rows = periods.map((period) => {
                return <td class="border border-slate-300">{period}</td>
            })
            console.log(rows)

            return rows.map((row) => {
                return <tr>{row}</tr>
            })
        })

        return () => (
            <table
                class="border-collapse border border-slate-400 rounded"
                style="width: 90vw"
            >
                {header.value} {content.value}
            </table>
        )
    },
})
