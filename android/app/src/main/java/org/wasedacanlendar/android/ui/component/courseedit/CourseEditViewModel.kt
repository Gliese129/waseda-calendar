package org.wasedacanlendar.android.ui.component.courseedit

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import androidx.compose.runtime.mutableStateOf
import androidx.glance.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.internal.Contexts.getApplication
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.network.api.CourseApi
import org.wasedacanlendar.android.ui.screen.config.UserConfigViewModel
import org.wasedacanlendar.android.utils.SyllabusHttpClient
import javax.inject.Inject
import kotlin.math.max
import kotlin.math.min

@HiltViewModel
class CourseEditViewModel @Inject constructor(
    private val sharedPreferences: SharedPreferences
): ViewModel() {

    private val _uiState = MutableStateFlow(CourseEditUiState())
    val uiState = _uiState.asStateFlow()

    private var updateJob: Job? = null
    private val UPDATE_DURATION = 300L


    fun getCurrentEditCourse() = uiState.value.editStack.getOrNull(uiState.value.currentEditIndex)

    fun fetchCourse(course: Course, context: Context) {
        viewModelScope.launch {
            _uiState.update { currentState ->
                val result = SyllabusHttpClient.create(CourseApi::class.java).getCourseDetail(
                    key = course.key,
                    lang = sharedPreferences.getString("search_lang", "ja")!!
                )
                val detailedCourse = Course.getCourseFromDetailedTable(result, context).copy(
                    key = course.key, // keep the key
                )
                currentState.copy(
                    syllabusRaw = result,
                    course = detailedCourse,
                    editStack = listOf(detailedCourse),
                    currentEditIndex = 0
                )
            }
        }
    }

    fun onCourseChanged(course: Course) {
        // update course periodically
        updateJob?.cancel()
        updateJob = viewModelScope.launch {
            _uiState.update { currentState ->
                currentState.copy(
                    course = course,
                    editStack = currentState.editStack.toMutableList().apply {
                        subList(0, currentState.currentEditIndex)
                        add(course)
                    },
                    currentEditIndex = currentState.currentEditIndex + 1
                )
            }
            delay(UPDATE_DURATION)
        }
    }

    fun redo() {
        viewModelScope.launch {
            _uiState.update { currentState ->
                currentState.copy(
                    currentEditIndex = min(currentState.currentEditIndex + 1, currentState.editStack.size - 1)
                )
            }
        }
    }
    fun undo() {
        viewModelScope.launch {
            _uiState.update { currentState ->
                currentState.copy(
                    currentEditIndex = max(currentState.currentEditIndex - 1, 0)
                )
            }
        }
    }
}