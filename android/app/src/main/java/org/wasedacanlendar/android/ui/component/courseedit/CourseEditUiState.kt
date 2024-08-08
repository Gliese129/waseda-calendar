package org.wasedacanlendar.android.ui.component.courseedit

import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.model.Table

data class CourseEditUiState (
    val syllabusRaw: Table = Table(emptyList()), // row / col / cell
    val course: Course = Course("", "", emptyList(), ""),

    val editStack: List<Course> = emptyList(),
    val currentEditIndex: Int = -1,
) {
    val isEditing: Boolean
        get() = currentEditIndex >= 0
    val currentEdit: Course?
        get() = editStack.getOrNull(currentEditIndex)
    val originalCourse: Course?
        get() = editStack.firstOrNull()
}