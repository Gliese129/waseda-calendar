package org.wasedacanlendar.android.ui.screen.search

import android.view.View
import android.widget.Space
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldColors
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import org.wasedacanlendar.android.R
import org.wasedacanlendar.android.ui.component.ClearableTextField
import kotlin.math.round

@Composable
fun SearchScreen(
    searchViewModel: SearchViewModel = viewModel()
) {
    val searchUiState by searchViewModel.uiState.collectAsState()
    val keyword = searchUiState.keyword

    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Row {
            SearchFormLayout(
                keyword = keyword,
                onKeywordChanged = { searchViewModel.onKeywordChanged(it) },
                name = searchUiState.name,
                onNameChanged = { searchViewModel.onNameChanged(it) }
            )
        }
    }

}

@Composable
fun SearchFormLayout(
    keyword: String,
    onKeywordChanged: (String) -> Unit,
    name: String,
    onNameChanged: (String) -> Unit
) {
    var showKeywordSwitch by remember { mutableStateOf(true) }

    Column {
        Row{
            Column (
                modifier = Modifier.fillMaxWidth(0.7f)
            ) {
                if(showKeywordSwitch) {
                    ClearableTextField(
                        value = keyword,
                        onValueChange = { onKeywordChanged(it) },
                        label = { Text(stringResource(R.string.form_keyword)) },
                    )
                } else {
                    ClearableTextField(
                        value = name,
                        onValueChange = { onNameChanged(it) },
                        label = { Text(stringResource(R.string.form_name)) },
                    )
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Button(
                    onClick = { showKeywordSwitch = !showKeywordSwitch },
                    shape = RoundedCornerShape(8.dp)
                ) {
                    if(showKeywordSwitch)
                        Text(stringResource(R.string.form_name))
                    else
                        Text(stringResource(R.string.form_keyword))
                }
            }
        }
    }
}