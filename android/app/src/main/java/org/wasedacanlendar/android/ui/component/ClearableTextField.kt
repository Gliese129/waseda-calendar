package org.wasedacanlendar.android.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.clickable
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.TextFieldValue
import org.wasedacanlendar.android.R

@Composable
fun ClearableTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: @Composable (() -> Unit)? = null,
    outlined: Boolean = false,
) {
    if (outlined) {
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier,
            label = label,
            singleLine = true,
            trailingIcon = { ClearIcon(value, onValueChange) }
        )
    } else {
        TextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier,
            label = label,
            singleLine = true,
            trailingIcon = { ClearIcon(value, onValueChange) }
        )
    }
}

@Composable
fun ClearIcon(
    value: String,
    onValueChange: (String) -> Unit
) {
    AnimatedVisibility(
        visible = value.isNotEmpty(),
        enter = slideInHorizontally (
            initialOffsetX = { 30 },
            animationSpec = tween(100, easing = FastOutLinearInEasing)
        ),
        exit = slideOutHorizontally (
            targetOffsetX = { 30 },
            animationSpec = tween(100, easing = FastOutLinearInEasing)
        )
    ) {
        Icon(
            painter = painterResource(R.drawable.outline_cancel_24),
            contentDescription = stringResource(R.string.action_clear),
            modifier = Modifier.clickable {
                onValueChange("")
            }
        )
    }
}