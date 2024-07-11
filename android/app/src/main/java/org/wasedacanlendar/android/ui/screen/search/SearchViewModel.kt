package org.wasedacanlendar.android.ui.screen.search

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class SearchViewModel: ViewModel() {
    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState = _uiState.asStateFlow()

    fun resetForm() {
        _uiState.value = SearchUiState()
    }
    fun onKeywordChanged(keyword: String) {
        _uiState.value = _uiState.value.copy(keyword = keyword)
    }
    fun onNameChanged(name: String) {
        _uiState.value = _uiState.value.copy(name = name)
    }
}