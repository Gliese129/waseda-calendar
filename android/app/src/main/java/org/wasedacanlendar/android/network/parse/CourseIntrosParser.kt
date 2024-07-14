package org.wasedacanlendar.android.network.parse

import org.jsoup.nodes.Document
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.model.FiscalQuarter
import org.wasedacanlendar.android.model.Schedule
import org.wasedacanlendar.android.utils.MathUtils

class CourseIntrosParser: ResponseParser<List<Course>> {
    override fun parse(doc: Document): List<Course> {
        val courses = mutableListOf<Course>()
        val table = doc.select(".ct-vh").firstOrNull()
        table?.select("tr:not(.c-vh-title)")?.forEach { row ->
            val cells = row.children()

            if (cells.size >= 8) {  // Check to ensure there are enough cells to parse data from
                val course = Course(
                    code = cells[1].text(),
                    name = cells[2].select("a").text(),
                    instructors = cells[3].text().split('/').map { it.trim() },
                    school = cells[4].text(),
                    schedules = let {
                        val semesterStr = cells[5].html()
                        val dayPeriodStr = cells[6].html()
                        val classroomStr = cells[7].html()
                        getSchedules(semesterStr, dayPeriodStr, classroomStr)
                    },
                    academicYear = cells[0].text().toIntOrNull() ?: 0
                )
                courses.add(course)
            }
        }

        return courses
    }

    private fun getSchedules(semesterStr: String, dayPeriodStr: String, classroomStr: String): List<Schedule> {
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