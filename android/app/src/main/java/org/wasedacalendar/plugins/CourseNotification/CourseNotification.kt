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
        // current or next period
        val now = LocalTime.now()
        val nextPeriod = let find@{
            for (i in 0 until periods.size - 1) {
                if (periods[i + 1].isAfter(now) && periods[i].isBefore(now)) {
                    return@find periods[i]
                }
            }
            return null
        }
        return courses.find {
            it.isDuring(today.dayOfWeek.value, periods.indexOf(nextPeriod))
        }?.let { course ->
            Course(
                course.name,
                course.schedules.find {
                    it.day == today.dayOfWeek.value &&
                    it.startPeriod <= periods.indexOf(nextPeriod) &&
                    it.endPeriod >= periods.indexOf(nextPeriod)
                }?.let {
                    mutableListOf(it)
                } ?: mutableListOf()
            )
        }
    }

    fun getPeriodEndTimeMillis(period: Int): Long {
        val now = LocalTime.now()
        val endTime = periods[period - 1].end.let {
            LocalDateTime.of(LocalDate.now(), it)
        }
        return endTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
    }

    private val courses: MutableList<Course> = ArrayList()
    private val periods: MutableList<PeriodInfo> = ArrayList()
    private val holidays: MutableList<LocalDate> = ArrayList() // month, day


}
