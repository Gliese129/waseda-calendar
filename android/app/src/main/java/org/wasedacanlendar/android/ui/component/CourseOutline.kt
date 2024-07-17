package org.wasedacanlendar.android.ui.component

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.Chip
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CardElevation
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.ImageProvider
import androidx.glance.appwidget.components.CircleIconButton
import androidx.compose.foundation.layout.Box
import androidx.compose.material.ChipDefaults
import androidx.compose.material3.ColorScheme
import org.wasedacanlendar.android.R
import org.wasedacanlendar.android.model.Course
import org.wasedacanlendar.android.model.FiscalQuarter
import org.wasedacanlendar.android.model.Schedule
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale

@Composable
fun CourseOutline(
    course: Course,
    modifier: Modifier = Modifier
) {
    Card(
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp
        ),
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier
                .padding(10.dp)
                .fillMaxSize(),
        ) {
            Row {
                Text(
                    text = course.name,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 18.sp
                )
            }
            Row {
                Text(
                    text = course.code,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Light,
                )
            }
            Spacer(modifier = Modifier.weight(1f))
            Row {
                Column {
                    Row {
                        Icon(
                            painter = painterResource(R.drawable.classroom),
                            contentDescription = "Instructor",
                            modifier = Modifier
                                .height(20.dp)
                                .padding(end = 5.dp)
                        )
                        Text(
                            text = course.instructors[0] + if (course.instructors.size > 1) "..." else "",
                            fontSize = 12.sp,
                            modifier = Modifier.align(Alignment.CenterVertically)
                        )
                    }
                }
                Spacer(modifier = Modifier.weight(1f))
                Column {
                    Row {
                        Icon(
                            painter = painterResource(R.drawable.calendar_days),
                            contentDescription = "Schedule",
                            modifier = Modifier
                                .height(20.dp)
                        )
                        Column(
                            modifier = Modifier.height(20.dp)
                        ) {
                            if (course.schedules.isNotEmpty()) {
                                CourseScheduleChip(course.schedules[0])
                                if(course.schedules.size > 1)
                                    Text(text = "...") // Show ellipsis if there are more than one schedules
                            } else {
                                Text(text = "TBA")
                            }
                            course.schedules.forEach {
                                CourseScheduleChip(it)
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun CourseScheduleChip(
    schedule: Schedule
) {
    Chip(
        onClick = {},
        colors = ChipDefaults.chipColors(
            backgroundColor = MaterialTheme.colorScheme.secondaryContainer,
        ),
        enabled = false
    ) {
        Row {
            QuarterCompactLayout(
                quarters = schedule.quarter,
                modifier = Modifier
                    .align(Alignment.CenterVertically)
                    .padding(end = 3.dp)
            )
            Text(
                text = DayOfWeek.of(schedule.weekday).getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                fontSize = 12.sp,
                modifier = Modifier.padding(end = 2.dp)
            )
            Text(
                text = if (schedule.period.first == schedule.period.second)
                    schedule.period.first.toString()
                else "${schedule.period.first}-${schedule.period.second}",
                fontSize = 12.sp,
                modifier = Modifier.padding(end = 3.dp)
            )
            Text(
                text = schedule.classroom,
                fontSize = 12.sp
            )
        }
    }
}
@Composable
fun QuarterCompactLayout(
    modifier: Modifier = Modifier,
    quarters: List<FiscalQuarter> = listOf(FiscalQuarter.Spring),
) {
    val calculateColor = { quarter: FiscalQuarter ->
        if (quarters.contains(quarter)) {
            when (quarter) {
                FiscalQuarter.Spring -> Color.Green
                FiscalQuarter.Summer -> Color.Red
                FiscalQuarter.Autumn -> Color.Yellow
                FiscalQuarter.Winter -> Color.Blue
            }
        } else {
            Color.Gray
        }
    }
    Column(
        modifier = modifier
    ) {
        Row {
            Box(modifier = Modifier
                .background(calculateColor(FiscalQuarter.Spring), CircleShape)
                .padding(3.dp)
            )
            Box(modifier = Modifier
                .background(calculateColor(FiscalQuarter.Summer), CircleShape)
                .padding(3.dp)
            )
        }
        Row {
            Box(modifier = Modifier
                .background(calculateColor(FiscalQuarter.Autumn), CircleShape)
                .padding(3.dp)
            )
            Box(modifier = Modifier
                .background(calculateColor(FiscalQuarter.Winter), CircleShape)
                .padding(3.dp)
            )
        }
    }
}