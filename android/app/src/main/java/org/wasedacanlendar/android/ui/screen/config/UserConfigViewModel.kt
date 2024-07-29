package org.wasedacanlendar.android.ui.screen.config

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class UserConfigViewModel @Inject constructor(): ViewModel() {
    private val _config = MutableStateFlow(UserConfig())
    val config = _config.asStateFlow()

}