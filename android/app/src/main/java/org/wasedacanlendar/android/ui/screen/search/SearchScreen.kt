package org.wasedacanlendar.android.ui.screen.search

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.integerArrayResource
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.paging.LoadState
import androidx.paging.compose.LazyPagingItems
import androidx.paging.compose.collectAsLazyPagingItems
import org.wasedacanlendar.android.R
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.ui.component.ClearableFilterBox
import org.wasedacanlendar.android.ui.component.ClearableSelectBox
import org.wasedacanlendar.android.ui.component.ClearableTextField
import org.wasedacanlendar.android.ui.component.courseedit.CourseEdit
import org.wasedacanlendar.android.ui.component.CourseOutline
import java.time.DayOfWeek
import java.time.format.TextStyle
import java.util.Locale

@Preview
@Composable
fun SearchScreen() {
    val searchViewModel: SearchViewModel = hiltViewModel()
    val searchUiState by searchViewModel.uiState.collectAsState()

    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Row {
            SearchFormLayout(
                keyword = searchUiState.keyword,
                onKeywordChanged = { searchViewModel.onKeywordChanged(it) },
                name = searchUiState.name,
                onNameChanged = { searchViewModel.onNameChanged(it) },
                semester = searchUiState.semester,
                onSemesterChanged = { searchViewModel.onSemesterChanged(it) },
                weekday = searchUiState.weekday,
                onWeekdayChanged = { searchViewModel.onWeekdayChanged(it) },
                period = searchUiState.period,
                onPeriodChanged = { searchViewModel.onPeriodChanged(it) },
                school = searchUiState.school,
                onSchoolChanged = { searchViewModel.onSchoolChanged(it?:"") },
            )
        }
        HorizontalDivider(Modifier.padding(vertical = 16.dp))
        Row {
            InfiniteScrollLayout(
                lazyCourseItems = searchUiState.courses!!.collectAsLazyPagingItems(),
                onSelectedCourseChanged = { searchViewModel.onSelectedCourseChanged(it) },
                selectedCourse = searchUiState.selectedCourse
            )
        }
    }

}

@Composable
fun InfiniteScrollLayout(
    lazyCourseItems: LazyPagingItems<Course>,
    onSelectedCourseChanged: (Course) -> Unit,
    selectedCourse: Course?
) {
    val scrollState = rememberLazyListState()
    val dialogShow = remember { mutableStateOf(false) }

    if (dialogShow.value && selectedCourse != null) {
        Dialog(
            onDismissRequest = { dialogShow.value = false },
            properties = DialogProperties(
                usePlatformDefaultWidth = false
            )
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxSize(),
                shape = RoundedCornerShape(8.dp),
                color = MaterialTheme.colorScheme.surfaceContainer,
            ) {
                CourseEdit(selectedCourse, closeDialog = { dialogShow.value = false })
            }
        }
    }

    Surface {
        Scaffold { innerPadding ->
            Box(modifier = Modifier) {
                LazyColumn(
                    contentPadding = innerPadding,
                    state = scrollState
                ) {
                    items(lazyCourseItems.itemCount) { index ->
                        lazyCourseItems[index]?.let {
                            CourseOutline(
                                it,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .heightIn(80.dp)
                                    .padding(4.dp)
                                    .clickable {
                                        dialogShow.value = true
                                        onSelectedCourseChanged(it)
                                    }
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                        }
                    }
                    lazyCourseItems.apply {
                        when (loadState.append) {
                            is LoadState.Loading -> {
                                item {
                                    Box(modifier = Modifier.fillMaxWidth()) {
                                        CircularProgressIndicator(
                                            modifier = Modifier
                                                .width(64.dp)
                                                .align(Alignment.Center),
                                            color = MaterialTheme.colorScheme.secondary,
                                            trackColor = MaterialTheme.colorScheme.surfaceVariant,
                                        )
                                    }
                                }
                            }
                            else -> {}
                        }
                        when (loadState.refresh) {
                            is LoadState.Loading -> {
                                item {
                                    Box(modifier = Modifier.fillMaxWidth()) {
                                        CircularProgressIndicator(
                                            modifier = Modifier
                                                .width(64.dp)
                                                .align(Alignment.Center),
                                            color = MaterialTheme.colorScheme.secondary,
                                            trackColor = MaterialTheme.colorScheme.surfaceVariant,
                                        )
                                    }
                                }
                            }
                            else -> {}
                        }
                        if (loadState.hasError) {
                            item {
                                Box(modifier = Modifier.fillMaxWidth()) {
                                    Text(
                                        text = "An error occurred",
                                        modifier = Modifier.align(Alignment.Center)
                                    )
                                }
                            }
                        }
                    }
                    item {
                        Spacer(modifier = Modifier.height(6.dp))
                    }
                }

            }

        }
    }
}

@Composable
fun SearchFormLayout(
    keyword: String,
    onKeywordChanged: (String) -> Unit,
    name: String,
    onNameChanged: (String) -> Unit,
    semester: Int?,
    onSemesterChanged: (Int?) -> Unit,
    weekday: Int?,
    onWeekdayChanged: (Int?) -> Unit,
    period: Int?,
    onPeriodChanged: (Int?) -> Unit,
    school: String,
    onSchoolChanged: (String?) -> Unit,
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
        Spacer(modifier = Modifier.height(12.dp))
        Row {
            val semesterOptions = let {
                val semesterNames = stringArrayResource(R.array.semester_name).toList()
                val semesterValues = integerArrayResource(R.array.semester_value).toList()
                semesterValues.zip(semesterNames).toMap()
            }
            ClearableSelectBox(
                value = semester,
                onValueChange = { onSemesterChanged(it) },
                options = semesterOptions,
                modifier = Modifier.fillMaxWidth(),
                label = { Text(stringResource(R.string.form_semester)) },
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row {
            Column(
                modifier = Modifier.fillMaxWidth(0.45f)
            ) {
                val dayOfWeekOptions = DayOfWeek.entries.toTypedArray()
                    .sortedBy { it.value % 7 }
                    .map { it.getDisplayName(TextStyle.FULL, Locale.getDefault()) }
                    .let {
                        (0..7).toList().zip(it).toMap()
                    }
                ClearableSelectBox(
                    value = weekday,
                    onValueChange = onWeekdayChanged,
                    options = dayOfWeekOptions,
                    label = { Text(stringResource(R.string.form_weekday)) },
                    modifier = Modifier.fillMaxWidth()
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                val periodOptions = let {
                    val periodNames = stringArrayResource(R.array.period_name).toList()
                    val periodValues = integerArrayResource(R.array.period_value).toList()
                    periodValues.zip(periodNames).toMap()
                }
                ClearableSelectBox(
                    value = period,
                    onValueChange = onPeriodChanged,
                    options = periodOptions,
                    label = { Text(stringResource(R.string.form_period)) },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row {
            val schoolOptions = let {
                val schoolNames = stringArrayResource(R.array.school_name).toList()
                val schoolValues = stringArrayResource(R.array.school_value).toList()
                schoolValues.zip(schoolNames).toMap()
            }
            ClearableFilterBox(
                value = school,
                onValueChange = onSchoolChanged,
                options = schoolOptions,
                label = { Text(stringResource(R.string.form_school)) },
                filter = { text, options ->
                    options.filter { it.value.contains(text, ignoreCase = true) }
                },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}