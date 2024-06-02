package org.wasedacalendar.plugins.CourseNotification.model

import org.json.JSONObject
import java.util.Objects

class Course(
    val name: String,
    val schedules: MutableList<Schedule>
) {

    constructor(item: JSONObject) : this(
        item.optString("name"),
        mutableListOf()
    ) {
        val schedules = item.optJSONArray("schedules")
        for (i in 0 until Objects.requireNonNull(schedules).length()) {
            val schedule = schedules!!.optJSONObject(i).let {
                Schedule(
                    it.optString("classroom"),
                    it.optInt("start"),
                    it.optInt("end"),
                    it.optInt("day")
                )
            }
            this.schedules.add(schedule)
        }
    }

    fun isDuring(day: Int, period: Int): Boolean {
        return schedules.any { it.day == day && it.startPeriod <= period && it.endPeriod >= period }
    }
    fun isToday(day: Int): Boolean {
        return schedules.any { it.day == day }
    }
}

data class Schedule(
    var classroom: String? = null,
    var startPeriod: Int = 0,
    var endPeriod: Int = 0,
    var day: Int = 0
) {
}
