package org.wasedacanlendar.android.dao.type

import androidx.room.ProvidedTypeConverter
import androidx.room.TypeConverter
import org.json.JSONArray
import org.json.JSONObject
import org.wasedacanlendar.android.model.Evaluation

@ProvidedTypeConverter
class EvaluationsConverter {
    @TypeConverter
    fun fromString(value: String): List<Evaluation> {
        // load from json
        if(value.isEmpty()) return emptyList()
        val data = JSONArray(value)
        val evaluations = mutableListOf<Evaluation>()
        for (i in 0 until data.length()) {
            val item = data.getJSONObject(i)
            evaluations.add(Evaluation(
                item.getString("method"),
                item.getInt("weight"),
                item.getString("criteria"),
            ))
        }
        return evaluations
    }

    @TypeConverter
    fun fromList(list: List<Evaluation>): String {
        // save to json
        val data = JSONArray()
        for (evaluation in list) {
            val item = JSONObject()
            item.put("name", evaluation.method)
            item.put("weight", evaluation.weight)
            item.put("criteria", evaluation.criteria)
            data.put(item)
        }
        return data.toString()
    }
}