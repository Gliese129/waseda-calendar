package org.wasedacanlendar.android.model

import android.content.Context
import android.os.Parcelable
import kotlinx.parcelize.IgnoredOnParcel
import kotlinx.parcelize.Parcelize
import org.wasedacanlendar.android.R
import org.wasedacanlendar.android.network.parse.CourseDetailParser
import org.wasedacanlendar.android.utils.MathUtils

@Parcelize
data class Course(
    val code: String,
    val name: String,
    val instructors: List<String>,
    val school: String,
    val schedules: List<Schedule> = emptyList(),
    val key: String = "",
    val campus: String = "",
    val credits: Int = 0,
    val outline: String = "",
    val courseSchedule: String = "",
    val evaluations: List<Evaluation> = emptyList(),
    val note: String = "",
    val academicYear: Int = 0,
    val textbook: String = ""
): Parcelable {
    @IgnoredOnParcel
    val getUrl = { lang: String ->
        "https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=${lang}"
    }

    companion object {
        fun getCourseFromDetailedTable(table: Table, context: Context): Course {
            val getArray = { id: Int -> context.resources.getStringArray(id).toList() }
            return Course(
                academicYear = table.getValueByTitle(getArray(R.array.syllabus_academic_year)).let {
                    Regex("\\d{4}").find(it)?.value?.toIntOrNull() ?: 0
                },
                school = table.getValueByTitle(getArray(R.array.syllabus_school)),
                name = table.getValueByTitle(getArray(R.array.syllabus_name)),
                instructors = table.getValueByTitle(getArray(R.array.syllabus_instructors)).split('/').map { it.trim() },
                campus = table.getValueByTitle(getArray(R.array.syllabus_campus)),
                code = table.getValueByTitle(getArray(R.array.syllabus_code)),
                key = table.getValueByTitle(getArray(R.array.syllabus_key)),
                credits = table.getValueByTitle(getArray(R.array.syllabus_credits)).toIntOrNull() ?: 0,
                schedules = let {
                    val semesterStr = table.getValueByTitle(getArray(R.array.syllabus_date)).split(' ')[0]
                    val dayPeriodStr = table.getValueByTitle(getArray(R.array.syllabus_date)).split(' ')[1]
                    val classroomStr = table.getValueByTitle(getArray(R.array.syllabus_classroom))
                    getSchedulesFromString(semesterStr, dayPeriodStr, classroomStr)
                },
                outline = table.getValueByTitle(getArray(R.array.syllabus_outline)),
                courseSchedule = table.getValueByTitle(getArray(R.array.syllabus_course_schedule)),
                evaluations = table.getValueByTitle(getArray(R.array.syllabus_evaluations))
                    .let { Evaluation.getEvaluations(it) },
                note = table.getValueByTitle(getArray(R.array.syllabus_note)),
                textbook = table.getValueByTitle(getArray(R.array.syllabus_textbook))
            )
        }

         private fun getSchedulesFromString(
            semesterStr: String,
            dayPeriodStr: String,
            classroomStr: String
        ): List<Schedule> {
            val timeGroupRegex = Regex("([A-Za-z]+|[月火水木金土日])\\.?(\\d+)(-\\d+)?(時限)?")
            val classGroupRegex = Regex("\\d+-B?\\d+")
            val days = mutableListOf<Int>()
            val periods = mutableListOf<Pair<Int, Int>>()
            val classrooms = mutableListOf<String>()

            val weekdayMap = mapOf(
                "Mon" to 1, "Tues" to 2, "Wed" to 3, "Thur" to 4, "Fri" to 5, "Sat" to 6, "Sun" to 7,
                "月" to 1, "火" to 2, "水" to 3, "木" to 4, "金" to 5, "土" to 6, "日" to 7
            )

            timeGroupRegex.findAll(dayPeriodStr).forEach { match ->
                val day = weekdayMap[match.groupValues[1]] ?: error("Invalid day")
                val startPeriod = match.groupValues[2].toInt()
                val endPeriod = match.groupValues[3].drop(1).toIntOrNull() ?: startPeriod
                days.add(day)
                periods.add(startPeriod to endPeriod)
            }


            classGroupRegex.findAll(classroomStr).forEach { match ->
                classrooms.add(match.value)
            }

            val semesters = semesterStr.split('\n').map { FiscalQuarter.fromString(it) }

            // if either one is empty, user need to edit it manually
            if (semesters.isEmpty() || days.isEmpty() || periods.isEmpty() || classrooms.isEmpty()) {
                return emptyList()
            }

            val schedules = mutableListOf<Schedule>()
            val lcm = MathUtils.lcm(listOf(semesters.size, days.size, periods.size, classrooms.size))

            for (i in 0 until lcm) {
                val semesterIndex = i % semesters.size
                val dayIndex = i % days.size
                val periodIndex = i % periods.size
                val classroomIndex = i % classrooms.size

                schedules.add(
                    Schedule(
                        quarter = semesters[semesterIndex],
                        weekday = days[dayIndex],
                        period = periods[periodIndex],
                        classroom = classrooms[classroomIndex]
                    )
                )
            }
            return schedules
        }
    }
}