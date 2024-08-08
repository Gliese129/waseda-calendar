package org.wasedacanlendar.android.utils

import android.content.Context
import androidx.compose.ui.res.stringArrayResource
import org.wasedacanlendar.android.R

object LocalizedOptionsGetter {
    fun getSchoolOptions(context: Context): Map<String, String> {
        val searchLang = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("search_lang", "ja") ?: "ja"
        val schoolNames = if(searchLang == "ja")
                                context.resources.getStringArray(R.array.school_name).toList()
                            else context.resources.getStringArray(R.array.school_name_en).toList()
        val schoolValues = context.resources.getStringArray(R.array.school_value).toList()
        return schoolValues.zip(schoolNames).toMap()
    }

}