package org.wasedacanlendar.android.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Schedule(
    val quarter: List<FiscalQuarter>,
    val weekday: Int,
    val period: Pair<Int, Int>,
    val classroom: String,
): Parcelable