package org.wasedacanlendar.android.ui.screen.search

data class SearchUiState(
    val keyword: String = "",
    val name: String = "",
    val semester: Int? = null,
    val weekday: Int? = null,
    val period: Int? = null,
    val department: String = "",
    val lang: String = "",
) {
    var pageId: Int = 1
}