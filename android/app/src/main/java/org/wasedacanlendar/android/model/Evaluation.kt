package org.wasedacanlendar.android.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Evaluation(
    val method: String,
    val weight: Double,
    val criteria: String
): Parcelable
