package org.wasedacanlendar.android.ui.screen.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.paging.Pager
import androidx.paging.PagingConfig
import androidx.paging.PagingData
import androidx.paging.cachedIn
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.network.paging.CourseSource

class SearchViewModel: ViewModel() {
    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState = _uiState.asStateFlow()

    private var updateJob: Job? = null
    private val UPDATE_DURATION = 500L

    init {
        updateCoursePage()
    }

    private fun updateCoursePage() {
        updateJob?.cancel()
        updateJob = viewModelScope.launch {
            _uiState.update { currentState ->
                currentState.copy(
                    courses = Pager(PagingConfig(pageSize = 10, prefetchDistance = 1)) {
                        CourseSource(
                            keyword = currentState.keyword,
                            name = currentState.name,
                            semester = currentState.semester,
                            weekday = currentState.weekday,
                            period = currentState.period,
                            school = currentState.school
                        )
                    }.flow.cachedIn(viewModelScope)
                )
            }
            delay(UPDATE_DURATION)
        }
    }

    fun resetForm() {
        _uiState.value = SearchUiState()
    }

    fun onKeywordChanged(keyword: String) {
        _uiState.value = _uiState.value.copy(keyword = keyword)
        updateCoursePage()
    }
    fun onNameChanged(name: String) {
        _uiState.value = _uiState.value.copy(name = name)
        updateCoursePage()
    }
    fun onSemesterChanged(semester: Int?) {
        _uiState.value = _uiState.value.copy(semester = semester)
        updateCoursePage()
    }
    fun onWeekdayChanged(weekday: Int?) {
        _uiState.value = _uiState.value.copy(weekday = weekday)
        updateCoursePage()
    }
    fun onPeriodChanged(period: Int?) {
        _uiState.value = _uiState.value.copy(period = period)
        updateCoursePage()
    }
    fun onSchoolChanged(school: String) {
        _uiState.value = _uiState.value.copy(school = school)
        updateCoursePage()
    }

}