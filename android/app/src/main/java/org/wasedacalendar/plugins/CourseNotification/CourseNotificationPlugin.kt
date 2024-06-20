package org.wasedacalendar.plugins.CourseNotification

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONException

@CapacitorPlugin(name = "CourseNotification")
class CourseNotificationPlugin : Plugin() {
    private var implementation = CourseNotification

    @PluginMethod
    fun start(call: PluginCall) {
        return // TODO: Implement this method
        try {
            call.data.getJSONArray("periods").run {
                implementation.setPeriods(this)
            }
            call.data.getJSONArray("courses").run {
                implementation.setCourses(this)
            }
            call.data.getJSONArray("holidays").run {
                implementation.setHolidays(this)
            }

            grantPermissions()
            val context = activity.applicationContext
            Intent(context, CourseNotificationService::class.java).run {
                action = CourseNotificationService.ACTION_SCHEDULE_NOTIFICATIONS
                ContextCompat.startForegroundService(context, this)
                call.resolve()
            }
        } catch (e: JSONException) {
            call.reject("Error parsing data")
        } catch (e: AssertionError) {
            call.resolve()
        }
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        return // TODO: Implement this method
        val context = activity.applicationContext
        Intent(context, CourseNotificationService::class.java).run {
            action = CourseNotificationService.ACTION_STOP_SERVICE
            ContextCompat.startForegroundService(context, this)
            call.resolve()
        }
    }

    @PluginMethod
    fun update(call: PluginCall) {
        return // TODO: Implement this method
        try {
            call.data.getJSONArray("periods").run {
                implementation.setPeriods(this)
            }
            call.data.getJSONArray("courses").run {
                implementation.setCourses(this)
            }
            call.data.getJSONArray("holidays").run {
                implementation.setHolidays(this)
            }
        } catch (e: JSONException) {
            call.reject("Error parsing data")
        } catch (e: AssertionError) {
            call.resolve()
        }
    }

    private fun grantPermissions() {
        val context = activity.applicationContext
        when {
            ContextCompat.checkSelfPermission(context, android.Manifest.permission.FOREGROUND_SERVICE) != PackageManager.PERMISSION_GRANTED -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                    ActivityCompat.requestPermissions(activity, arrayOf(android.Manifest.permission.FOREGROUND_SERVICE), 0)
            }
            ContextCompat.checkSelfPermission(context, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
                    ActivityCompat.requestPermissions(activity, arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 0)
            }
            ContextCompat.checkSelfPermission(context, android.Manifest.permission.SCHEDULE_EXACT_ALARM) != PackageManager.PERMISSION_GRANTED -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
                    ActivityCompat.requestPermissions(activity, arrayOf(android.Manifest.permission.SCHEDULE_EXACT_ALARM), 0)
            }
        }
    }
}
