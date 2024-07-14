package org.wasedacanlendar.android.model

import androidx.compose.ui.text.toLowerCase
import java.util.Locale

enum class FiscalQuarter {
    Spring, Summer, Autumn, Winter;

    companion object {
        fun fromInt(value: Int): FiscalQuarter {
            return when (value) {
                0 -> Spring
                1 -> Summer
                2 -> Autumn
                3 -> Winter
                else -> throw IllegalArgumentException("Invalid value for FiscalQuarter")
            }
        }
        fun fromString(value: String): List<FiscalQuarter> {
            val text = value.trim().lowercase()
            val isSemester = text.contains("semester") || text.contains("学期")
            return when (value) {
                "full year" -> listOf(Spring, Summer, Autumn, Winter)
                "通年" -> listOf(Spring, Summer, Autumn, Winter)
                "others" -> listOf()
                "その他" -> listOf()
                else -> {
                    val quarter = when {
                        text.contains("spring") || text.contains("春") -> Spring
                        text.contains("summer") || text.contains("夏") -> Summer
                        text.contains("autumn") || text.contains("fall") || text.contains("秋") -> Autumn
                        text.contains("winter") || text.contains("冬") -> Winter
                        else -> throw IllegalArgumentException("Invalid value for FiscalQuarter")
                    }
                    if (isSemester && quarter == Spring) {
                        listOf(Spring, Summer)
                    } else if (isSemester && quarter == Autumn) {
                        listOf(Autumn, Winter)
                    } else {
                        listOf(quarter)
                    }
                }

            }
        }
    }
}