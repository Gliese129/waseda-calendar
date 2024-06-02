package org.wasedacalendar.plugins.CourseNotification.model

import org.json.JSONArray
import java.time.LocalTime
import java.time.format.DateTimeFormatter

data class PeriodInfo(
    val start: LocalTime,
    val end: LocalTime
) {
    constructor(periods: JSONArray) : this(
        LocalTime.parse(periods.optString(0).let {
            if (it.length == 4) "0$it" else it
        }, DateTimeFormatter.ofPattern("HH:mm")),
        LocalTime.parse(periods.optString(1).let {
            if (it.length == 4) "0$it" else it
        }, DateTimeFormatter.ofPattern("HH:mm"))
    )

    fun isDuring(time: LocalTime): Boolean {
        return time.isAfter(start) && time.isBefore(end)
    }

    fun isAfter(time: LocalTime): Boolean {
        return time.isAfter(end)
    }
    fun isBefore(time: LocalTime): Boolean {
        return time.isBefore(start)
    }
}
