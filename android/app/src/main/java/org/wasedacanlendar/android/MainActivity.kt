package org.wasedacanlendar.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import org.wasedacanlendar.android.ui.component.NavBar
import org.wasedacanlendar.android.ui.screen.home.HomeScreen
import org.wasedacanlendar.android.ui.screen.search.SearchScreen
import org.wasedacanlendar.android.ui.theme.WasedaCalendarTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WasedaCalendarTheme {
                NavApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview
@Composable
fun NavApp() {
    var currentScreen by remember { mutableStateOf(Screen.Home) }
    val navController = rememberNavController()

    val screens = Screen.entries


    Scaffold(
        bottomBar = {
            NavigationBar(
                contentColor = MaterialTheme.colorScheme.primaryContainer
            ) {
                screens.forEach  { item ->
                    NavigationBarItem(
                        label = { Text(text = stringResource(item.label)) },
                        icon = {
                            Icon(
                                painterResource(id = item.icon),
                                contentDescription = stringResource(item.label),
                            )
                        },
                        selected = currentScreen == item,
                        onClick = {
                            currentScreen = item
                            navController.navigate(item.name)
                        },
                    )
                }
            }
        },
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(currentScreen.label)) },
                colors = TopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                    actionIconContentColor = MaterialTheme.colorScheme.primary,
                    navigationIconContentColor = MaterialTheme.colorScheme.primary,
                    scrolledContainerColor = MaterialTheme.colorScheme.secondaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.secondary,
                )
            )
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.name,
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            composable(Screen.Home.name) { HomeScreen() }
            composable(Screen.Search.name) { SearchScreen() }
//        composable(Screen.MyCourses.name) { MyCoursesScreen() }
//        composable(Screen.Settings.name) { SettingsScreen() }
        }
    }
}

enum class Screen(val label: Int, val icon: Int) {

    Home(R.string.navigation_home, R.drawable.outline_home_24),
    Search(R.string.navigation_search, R.drawable.outline_search_24),
    MyCourses(R.string.navigation_my_courses, R.drawable.outline_school_24),
    Settings(R.string.navigation_settings, R.drawable.outline_settings_24)
}