package org.wasedacanlendar.android.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Table(
    val data: List<List<Pair<String, String>>> // row / col / cell <name, value>
): Parcelable {
    fun getRow(row: Int): List<Pair<String, Any>> {
        return data[row]
    }

    fun getCellByTitle(title: List<String>): Pair<String, String>? {
        val matchSet = title.map {
            it.trim().replace(" ", "").lowercase()
        }
        data.forEach { row ->
            row.forEach { cell ->
                if(cell.first.trim().replace(" ", "").lowercase() in matchSet)
                    return cell
            }
        }
        return null
    }

    fun getCellByPosition(rowId: Int, colId: Int): Pair<String, String>? {

        if(rowId < 0 || rowId >= data.size) return null
        if(colId < 0 || colId >= data[rowId].size) return null
        return try {
            data[rowId][colId]
        } catch (e: ClassCastException) {
            null
        }
    }

    fun getValueByPosition(rowId: Int, colId: Int): String {
        return getCellByPosition(rowId, colId)?.second ?: ""
    }

    fun getValueByTitle(title: List<String>): String {
        return getCellByTitle(title)?.second ?: ""
    }
}