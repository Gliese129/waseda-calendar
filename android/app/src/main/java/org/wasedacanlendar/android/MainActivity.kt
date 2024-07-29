package org.wasedacanlendar.android

import android.app.Application
import android.os.Bundle
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import dagger.hilt.android.AndroidEntryPoint
import dagger.hilt.android.HiltAndroidApp
import org.wasedacanlendar.android.ui.screen.home.HomeScreen
import org.wasedacanlendar.android.ui.screen.search.SearchScreen
import org.wasedacanlendar.android.ui.theme.WasedaCalendarTheme

@HiltAndroidApp
class MainApplication : Application()

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        WebView.setWebContentsDebuggingEnabled(true) //  TODO Remove this line before release

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
            startDestination = Screen.Search.route, // TODO: Change to HomeScreen
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            composable(Screen.Home.route) { HomeScreen() }
            composable(Screen.Search.route) { SearchScreen() }
//        composable(Screen.MyCourses.name) { MyCoursesScreen() }
//        composable(Screen.Settings.name) { SettingsScreen() }
        }
    }
}

enum class Screen(val label: Int, val icon: Int, val route: String) {

    Home(R.string.navigation_home, R.drawable.outline_home_24, "home"),
    Search(R.string.navigation_search, R.drawable.outline_search_24, "search?period={period}&weekday={weekday}&semester={semester}&school={school}&name={name}&keyword={keyword}"),
    MyCourses(R.string.navigation_my_courses, R.drawable.outline_school_24, "my-courses"),
    Settings(R.string.navigation_settings, R.drawable.outline_settings_24, "settings");
}