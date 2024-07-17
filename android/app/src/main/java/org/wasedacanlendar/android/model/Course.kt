package org.wasedacanlendar.android.model

import android.os.Parcelable
import kotlinx.parcelize.IgnoredOnParcel
import kotlinx.parcelize.Parcelize

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
): Parcelable {
    @IgnoredOnParcel
    val url = { lang: String ->
        "https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=${lang}"
    }
}