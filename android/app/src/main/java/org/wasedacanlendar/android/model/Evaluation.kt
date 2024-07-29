package org.wasedacanlendar.android.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Evaluation(
    var method: String,
    var weight: Int,
    var criteria: String = ""
): Parcelable {
    companion object {
        fun getEvaluations(text: String): List<Evaluation> {
            val matchReg = Regex("([^\\n ]*): (([0-9]+)%)?")
            val match = matchReg.findAll(text)

            return match.map {
                val (method, _, weight) = it.destructured
                Evaluation(method, weight.toIntOrNull() ?: 0)
            }.toList()
        }
    }

    fun toText(): String {
        return "$method: $weight% $criteria"
    }
}
