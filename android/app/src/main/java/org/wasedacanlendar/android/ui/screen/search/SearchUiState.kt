package org.wasedacanlendar.android.ui.screen.search

import androidx.paging.Pager
import androidx.paging.PagingConfig
import androidx.paging.PagingData
import androidx.paging.cachedIn
import kotlinx.coroutines.flow.Flow
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.network.paging.CourseSource

data class SearchUiState(
    val keyword: String = "",
    val name: String = "",
    val semester: Int? = null,
    val weekday: Int? = null,
    val period: Int? = null,
    val school: String = "",
    val lang: String = "",

    val courses: Flow<PagingData<Course>>? = null,
    val selectedCourse: Course? = null
)