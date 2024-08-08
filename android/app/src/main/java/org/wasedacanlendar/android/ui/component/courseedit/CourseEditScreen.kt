package org.wasedacanlendar.android.ui.component.courseedit

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.AccountBox
import androidx.compose.material.icons.outlined.Close
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material3.BottomSheetScaffold
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SheetValue
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberBottomSheetScaffoldState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.dokar.chiptextfield.Chip
import com.dokar.chiptextfield.m3.OutlinedChipTextField
import com.dokar.chiptextfield.rememberChipTextFieldState
import kotlinx.coroutines.launch
import org.wasedacanlendar.android.R
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.model.Table
import org.wasedacanlendar.android.ui.component.ClearableTextField
import org.wasedacanlendar.android.ui.component.SelectBox
import org.wasedacanlendar.android.utils.SharedPreferencesModule
import kotlin.math.roundToInt


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourseEdit(
    course: Course,
    modifier: Modifier = Modifier,
    closeDialog: () -> Unit,
) {
    val courseEditViewModel: CourseEditViewModel = hiltViewModel()
    val currentEditUiState by courseEditViewModel.uiState.collectAsState()
    val sharedPreferences = SharedPreferencesModule.provideSharedPreferences(LocalContext.current)

    courseEditViewModel.fetchCourse(course, LocalContext.current)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        modifier = Modifier.offset {
                            IntOffset(-(20.dp).roundToPx(), 0)
                        },
                    ) {
                        TextButton(
                            onClick = closeDialog,
                            contentPadding = PaddingValues(0.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.Transparent,
                                contentColor = MaterialTheme.colorScheme.primary
                            ),
                            modifier = Modifier
                                .align(Alignment.CenterVertically)
                                .padding(0.dp)

                        ) {
                            Icon(Icons.Outlined.Close, contentDescription = "Close")
                        }
                        Text(
                            text = course.name,
                            modifier = Modifier.align(Alignment.CenterVertically),
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                ),
                actions = {
                    TextButton(
                        onClick = { /*TODO*/ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Transparent,
                            contentColor = MaterialTheme.colorScheme.error
                        ),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(text = stringResource(R.string.action_undo), fontWeight = FontWeight.Light)
                    }
                    TextButton(
                        onClick = { /*TODO*/ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Transparent,
                            contentColor = MaterialTheme.colorScheme.primary
                        ),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(text = stringResource(R.string.action_redo), fontWeight = FontWeight.Light)
                    }
                }
            )
        }
    ) { innerPadding ->
        BoxWithConstraints(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize()
        ){
            val halfHeight = maxHeight / 2
            Column {
                Row {
                    val scaffoldState = rememberBottomSheetScaffoldState()
                    val scaffoldScope = rememberCoroutineScope()
                    BottomSheetScaffold(
                        scaffoldState = scaffoldState,

                        sheetContent = {
                            Box(
                                modifier = Modifier
                                    .height(halfHeight)
                                    .padding(top = 10.dp),
                            ) {
                                currentEditUiState.originalCourse?.getUrl?.let {
                                    it(sharedPreferences.getString("search_lang", "ja") ?: "ja")
                                }
                                    ?.let {
                                        SyllabusRawView(
                                            table = currentEditUiState.syllabusRaw,
                                            url = it
                                        )
                                    }
                            }
                        }
                    ) {
                        Column {
                            Card(
                                onClick = { scaffoldScope.launch {
                                    if(scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded) {
                                        scaffoldState.bottomSheetState.partialExpand()
                                    } else {
                                        scaffoldState.bottomSheetState.expand()
                                    }
                                } },
                                modifier = Modifier
                                    .height(50.dp)
                                    .fillMaxWidth(),
                                shape = RectangleShape
                            ) {
                                Box(modifier = Modifier.fillMaxSize()) {
                                    var text = stringResource(R.string.description_syllabus_raw_content)
                                    text = if(scaffoldState.bottomSheetState.currentValue == SheetValue.Expanded) {
                                        stringResource(R.string.hide_syllabus, text)
                                    } else {
                                        stringResource(R.string.show_syllabus, text)
                                    }
                                    Text(text = text, modifier = Modifier.align(Alignment.Center))
                                }
                            }

                            CourseEditForm(
                                course = currentEditUiState.course,
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(10.dp),
                                onValueChange = { courseEditViewModel.onCourseChanged(it) }
                            )
                        }
                    }
                }


            }

            FloatSaveBtn(
                widthRange = Pair(0.dp, maxWidth), heightRange = Pair(30.dp, maxHeight - 30.dp),
                initPosition = Pair(0.8f, 0.8f)
            )
        }
    }
}

@Composable
fun CourseEditForm(
    course: Course,
    modifier: Modifier = Modifier,
    onValueChange: (Course) -> Unit,
) {
    println(course)
    val schoolOptions = " ".let {
        val schoolNames = stringArrayResource(R.array.school_name).toList()
        val schoolValues = stringArrayResource(R.array.school_value).toList()
        schoolValues.zip(schoolNames).toMap()
    }
    Column(modifier = modifier.padding(5.dp, 0.dp)) {
        ClearableTextField(
            value = course.name,
            onValueChange = { onValueChange(course.copy(name = it)) },
            label = { Text(text = stringResource(R.string.form_name)) },
            icon = { Icon(Icons.Outlined.Edit, contentDescription = "Edit") },
            outlined = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(10.dp))
        Row(modifier = Modifier.height(65.dp)) {
            Column{
                Icon(
                    Icons.Outlined.LocationOn, contentDescription = "Location",
                    modifier = Modifier.padding(0.dp, 25.dp, 5.dp, 0.dp)
                )
            }
            Column(modifier = Modifier.weight(0.5f)) {
                SelectBox(
                    value = course.school,
                    onValueChange = { if(it != null) onValueChange(course.copy(school = it)) },
                    options = schoolOptions,
                    outlined = true,
                    label = { Text(text = stringResource(R.string.form_school)) },
                    clearable = false,

                )
            }
            Spacer(modifier = Modifier.width(5.dp))
            Column(modifier = Modifier.weight(0.4f)) {
                ClearableTextField(
                    value = course.campus,
                    onValueChange = { onValueChange(course.copy(campus = it)) },
                    outlined = true,
                    label = { Text(text = stringResource(R.string.form_campus)) },
                )
            }
        }
        Spacer(modifier = Modifier.height(10.dp))
        Row {
            var value by remember { mutableStateOf("") }
            println(course.instructors)
            val state = rememberChipTextFieldState<Chip>()
            state.chips = course.instructors.map { Chip(it) }
            Column(
                modifier = Modifier.align(Alignment.CenterVertically).padding(end = 5.dp)
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.classroom),
                    contentDescription = "Instructors",
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(5.dp))
            Column {
                OutlinedChipTextField(
                    state = state,
                    value = value,
                    onValueChange = { value = it },
                    onSubmit = {text ->
                        val instructors = state.chips.map { it.text } + text.trim()
                        onValueChange(course.copy(instructors = instructors))
                        Chip(text)
                    },
                    label = { Text(text = stringResource(R.string.form_instructors)) },
                )
            }

        }
    }
}
@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun SyllabusRawView(
    table: Table,
    url: String,
    modifier: Modifier = Modifier,
) {
    println(url)

    val clipboardManager = LocalClipboardManager.current
    val context = LocalContext.current
    val browserIntent by remember {
        mutableStateOf(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
    }
    Column(
        modifier = Modifier.pointerInteropFilter { false }
    ) {
        Button(onClick = {
                browserIntent.data = Uri.parse(url)
                context.startActivity(browserIntent)
            },
            modifier = Modifier.fillMaxWidth(),
            shape = MaterialTheme.shapes.extraSmall,
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.secondary,
                contentColor = MaterialTheme.colorScheme.onSecondary
            )
        ) {
            Text(text = "Open in browser")
        }

        LazyColumn(
            modifier = modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.secondaryContainer)
        ) {
            table.data.forEach { row ->
                item {
                    row.forEach { cell ->
                        Column {
                            Card(
                                modifier = modifier
                                    .padding(5.dp)
                                    .heightIn(30.dp)
                                    .fillMaxWidth()
                                    .clickable {
                                        // copy to clipboard
                                        clipboardManager.setText(AnnotatedString(text = cell.second))
                                        Toast
                                            .makeText(
                                                context,
                                                "Copied to clipboard",
                                                Toast.LENGTH_SHORT
                                            )
                                            .show()
                                    },
                                shape = RectangleShape,
                                colors = CardDefaults.cardColors(
                                    containerColor = Color.Transparent
                                )
                            ) {
                                Row {
                                    Text(text = cell.first, modifier = Modifier.width(100.dp))
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Text(text = cell.second, )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun FloatSaveBtn(
    widthRange: Pair<Dp, Dp>,
    heightRange: Pair<Dp, Dp>,
    initPosition: Pair<Float, Float>,
) {

    val density = LocalDensity.current
    val margin = 10.dp
    val size = 60.dp

    val calculatePosition = { fragment: Float, range: Pair<Dp, Dp> ->
        with(density) {
            (1f - fragment) * (range.first.roundToPx().toFloat()) + fragment * (range.second.roundToPx().toFloat())
        }
    }
    // subtract margin from range
    val actualWidthRange = Pair(widthRange.first + margin, widthRange.second - margin)
    val actualHeightRange = Pair(heightRange.first + margin, heightRange.second - margin)

    var x by remember {
        val initX = calculatePosition(initPosition.first, actualWidthRange)
        mutableFloatStateOf(initX)
    }
    val goToSideX by animateFloatAsState(
        targetValue = x,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "goToSideX"
    )
    var y by remember {
        with(density) {
            val initY = calculatePosition(initPosition.second, actualHeightRange)
            mutableFloatStateOf(initY)
        }
    }
    var isDragging by remember { mutableStateOf(false) }

    val goToSide = {
        isDragging = false
        with(density) {
            x = if (x < (widthRange.first + widthRange.second - size).roundToPx() / 2f) {
                (widthRange.first + margin).roundToPx().toFloat()
            } else {
                (widthRange.second - size - margin * 3).roundToPx().toFloat()
            }
            // adjust y
            y = if(y < heightRange.first.roundToPx().toFloat()) {
                heightRange.first.roundToPx().toFloat()
            } else if(y > heightRange.second.roundToPx().toFloat() - size.roundToPx()) {
                heightRange.second.roundToPx().toFloat() - size.roundToPx()
            } else {
                y
            }
        }
    }
    val dragModifier = Modifier
        .padding(margin)
        .offset {
            if (isDragging) {
                IntOffset(x.roundToInt(), y.roundToInt())
            } else {
                IntOffset(goToSideX.roundToInt(), y.roundToInt())
            }
        }
        .pointerInput(Unit) {
            detectDragGestures(
                onDragCancel = goToSide,
                onDragEnd = goToSide,
                onDragStart = {
                    isDragging = true
                }
            ) { _, dragAmount ->
                x += dragAmount.x
                y += dragAmount.y
            }
        }

    FloatingActionButton(
        onClick = { /*TODO*/ },
        modifier = dragModifier,
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
    ) {
        Icon(Icons.Filled.Add, contentDescription = "Add")
    }
}