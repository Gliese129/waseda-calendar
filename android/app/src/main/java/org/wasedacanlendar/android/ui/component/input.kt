package org.wasedacanlendar.android.ui.component

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.res.integerArrayResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringArrayResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import org.wasedacanlendar.android.R

@Composable
fun ClearableTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: @Composable (() -> Unit)? = null,
    readOnly: Boolean = false,
    outlined: Boolean = false,
) {
    if (outlined) {
        OutlinedTextField(
            value = value,
            onValueChange = {
                onValueChange(it)
            },
            modifier = modifier,
            label = label,
            readOnly = readOnly,
            singleLine = true,
            trailingIcon = { ClearIcon(value, onValueChange) }
        )
    } else {
        TextField(
            value = value,
            onValueChange = onValueChange,
            modifier = modifier,
            label = label,
            readOnly = readOnly,
            singleLine = true,
            trailingIcon = { ClearIcon(value, onValueChange) }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun <T> ClearableSelectBox(
    value: T?,
    onValueChange: (T?) -> Unit,
    options: Map<T, String>,
    modifier: Modifier = Modifier,
    resetValue: T? = null,
    label: @Composable (() -> Unit)? = null,
    outlined: Boolean = false,
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
    ) {
        if(outlined) {
            OutlinedTextField(
                value = options[value] ?: "", onValueChange = { },
                readOnly = true, label = label,
                modifier = modifier
                    .menuAnchor(MenuAnchorType.PrimaryNotEditable),
                trailingIcon = {
                    ClearIcon(value = options[value] ?: "", onValueChange = {
                        onValueChange(resetValue)
                        expanded = false
                    })
                },
            )
        } else {
            TextField(
                value = options[value] ?: "", onValueChange = { },
                readOnly = true, label = label,
                modifier = modifier
                    .menuAnchor(MenuAnchorType.PrimaryNotEditable),
                trailingIcon = {
                    ClearIcon(value = options[value] ?: "", onValueChange = {
                        onValueChange(resetValue)
                        expanded = false
                    })
                },
            )
        }

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
        ) {
            options.forEach { (value, label) ->
                DropdownMenuItem(
                    text = {
                        Text(label, style = MaterialTheme.typography.bodyLarge)
                    },
                    onClick = {
                        onValueChange(value)
                        expanded = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding,
                )
            }
        }

    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun <T> ClearableFilterBox(
    value: T?,
    onValueChange: (T?) -> Unit,
    options: Map<T, String>,
    modifier: Modifier = Modifier,
    resetValue: T? = null,
    label: @Composable (() -> Unit)? = null,
    outlined: Boolean = false,
    filter: (String, Map<T, String>) -> Map<T, String> = { _, _ ->
        options
    },
) {
    var expanded by remember { mutableStateOf(false) }
    var filterText by remember { mutableStateOf(TextFieldValue("", TextRange.Zero)) }
    var filteredOptions by remember(filterText) {
        mutableStateOf(filter(filterText.text, options))
    }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it },
    ) {
        if(outlined) {
            OutlinedTextField(
                value = filterText,
                onValueChange = {
                    filterText = it
                    filteredOptions = filter(it.text, options)
                    expanded = true
                },
                readOnly = true, label = label,
                modifier = modifier
                    .menuAnchor(MenuAnchorType.PrimaryEditable),
                trailingIcon = {
                    ClearIcon(value = filterText.text, onValueChange = {
                        filterText = TextFieldValue("", TextRange.Zero)
                        onValueChange(resetValue)
                        expanded = false
                    })
                },
            )
        } else {
            TextField(
                value = filterText,
                onValueChange = {
                    filterText = it
                    filteredOptions = filter(it.text, options)
                    expanded = true
                },
                label = label,
                modifier = modifier
                    .menuAnchor(MenuAnchorType.PrimaryEditable),
                trailingIcon = {
                    ClearIcon(value = options[value] ?: "", onValueChange = {
                        filterText = TextFieldValue("", TextRange.Zero)
                        onValueChange(resetValue)
                        expanded = false
                    })
                },
            )
        }

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = {
                expanded = false
                filterText = TextFieldValue(options[value]!!, TextRange(options[value]!!.length))
            },
        ) {
            filteredOptions.forEach { (value, label) ->
                DropdownMenuItem(
                    text = {
                        Text(label, style = MaterialTheme.typography.bodyLarge)
                    },
                    onClick = {
                        filterText = TextFieldValue(label, TextRange(label.length))
                        onValueChange(value)
                        expanded = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding,
                )
            }
        }

    }
}

@OptIn(ExperimentalComposeUiApi::class)
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
            }.pointerInteropFilter { false }

        )
    }
}