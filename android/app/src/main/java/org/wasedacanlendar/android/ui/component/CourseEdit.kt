package org.wasedacanlendar.android.ui.component

import android.widget.RelativeLayout
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType.Companion.Text
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import org.wasedacanlendar.android.model.Course
import kotlin.math.roundToInt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourseEdit(
    course: Course,
    modifier: Modifier = Modifier
) {
    val editStack = remember {
        mutableStateOf(listOf(course))
    }
    val currentEdit = editStack.value.last()
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = course.name) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                ),
                actions = {
                    Button(
                        onClick = { /*TODO*/ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Transparent,
                            contentColor = MaterialTheme.colorScheme.error
                        ),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(text = "Undo", fontWeight = FontWeight.Light)
                    }
                    Button(
                        onClick = { /*TODO*/ },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Transparent,
                            contentColor = MaterialTheme.colorScheme.primary
                        ),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(text = "Redo", fontWeight = FontWeight.Light)
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize()
        ){
            Column {
                Text(text = "Hello, World!")
                Text(text = "Hello, World!")
                Text(text = "Hello, World!")
                Text(text = "Hello, World!")
            }

            var offsetX by remember { mutableFloatStateOf(0f) }
            var offsetY by remember { mutableFloatStateOf(0f) }
            val boxSize = 80.dp
            val boxSidePx = with(LocalDensity.current) { boxSize.toPx() }
            val draggableState = rememberDraggableState {
                offsetX = (offsetX + it).coerceIn(0f, boxSidePx * 3)
                offsetY = (offsetY + it).coerceIn(0f, boxSidePx * 3)
            }
            FloatingActionButton(
                onClick = { /*TODO*/ },
                modifier = Modifier
                    .size(boxSize)
                    .offset {
                        IntOffset(offsetX.roundToInt(), offsetY.roundToInt())
                    }
                    .draggable(
                        orientation = Orientation.Horizontal,
                        state = draggableState
                    )
                    .padding(16.dp),
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add")
            }
        }
    }
}