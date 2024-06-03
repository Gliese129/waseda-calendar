package org.wasedacalendar.plugins.CourseNotification

import org.json.JSONArray
import org.json.JSONException
import org.wasedacalendar.plugins.CourseNotification.model.Course
import org.wasedacalendar.plugins.CourseNotification.model.PeriodInfo
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId


object CourseNotification{
    @Throws(JSONException::class)
    fun setCourses(courses: JSONArray) {
        this.courses.clear()
        for (i in 0 until courses.length()) {
            val course = courses.getJSONObject(i)
            this.courses.add(Course(course))
        }
    }

    @Throws(JSONException::class)
    fun setPeriods(periods: JSONArray) {
        this.periods.clear()
        for (i in 0 until periods.length()) {
            val period = periods.getJSONArray(i)
            this.periods.add(PeriodInfo(period))
        }
    }

    @Throws(JSONException::class)
    fun setHolidays(holidays: JSONArray) {
        this.holidays.clear()
        for (i in 0 until holidays.length()) {
            val holiday = holidays.getString(i).split("/").map {
                it.toInt()
            }
            this.holidays.add(LocalDate.of(holiday[0], holiday[1], holiday[2]))
        }
    }

    fun getNextCourse(): Course? {
        // skip holidays
        val today = LocalDate.now()
        if (holidays.contains(today)) {
            return null
        }
        val now = LocalTime.now()
        // find index of current period, if current time is before the first period, return 0
        val period = periods.indexOfFirst { period ->
            period.isDuring(now)
        }.takeIf {
            it != -1 || now < periods[0].start
        }?.let {
            it + 1 + 1 // since it's 0-indexed and we want the next period
        }?: return null
        return courses.find { course ->
            course.schedules.any {
                it.day == today.dayOfWeek.value &&
                it.startPeriod > period
            }
        }?.let { course ->
            Course(
                course.name,
                course.schedules.filter {
                    it.day == today.dayOfWeek.value &&
                    it.startPeriod > period
                }.toMutableList()
            )
        }
    }

    fun getCurrentCourse(useNextIfNotFound: Boolean = true): Course? {
        // skip holidays
        val today = LocalDate.now()
        if (holidays.contains(today)) {
            return null
        }
        val now = LocalTime.now()
        // find index of current period, if current time is before the first period, return 0
        val period = periods.indexOfFirst { period ->
            if (useNextIfNotFound)
                period.isBefore(now)
            else period.isDuring(now)
        }.takeIf {
            it != -1 || now < periods[0].start
        }?.let {
            it + 1 // since it's 0-indexed
        }?: return null
        val result = courses.find { course ->
            course.schedules.any {
                it.day == today.dayOfWeek.value &&
                it.startPeriod <= period &&
                it.endPeriod >= period
            }
        } ?: let {
            if(useNextIfNotFound) {
                courses.find { course ->
                    course.schedules.any {
                        it.day == today.dayOfWeek.value &&
                        it.startPeriod > period
                    }
                }
            } else {
                null
            }
        }
        return result?.let { course ->
            Course(
                course.name,
                course.schedules.filter {
                    it.day == today.dayOfWeek.value &&
                    it.endPeriod >= period
                }.toMutableList()
            )
        }
    }

    fun getPeriodEndTimeMillis(period: Int): Long {
        val endTime = periods[period - 1].end.let {
            LocalDateTime.of(LocalDate.now(), it)
        }
        return endTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }

    val courses: MutableList<Course> = ArrayList()
    val periods: MutableList<PeriodInfo> = ArrayList()
    val holidays: MutableList<LocalDate> = ArrayList() // month, day


}
