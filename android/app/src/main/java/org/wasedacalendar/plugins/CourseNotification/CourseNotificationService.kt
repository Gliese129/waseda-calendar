package org.wasedacalendar.plugins.CourseNotification

import android.app.AlarmManager
import androidx.core.app.NotificationCompat
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.icu.util.Calendar
import android.os.IBinder
import com.getcapacitor.Logger
import org.wasedacalendar.app.R
import org.wasedacalendar.plugins.CourseNotification.model.Course

class CourseNotificationService: Service() {
    companion object {
        const val CHANNEL_ID = "NotificationServiceChannel"
        const val ACTION_SCHEDULE_NOTIFICATIONS = "org.wasedacalendar.plugins.ACTION_SCHEDULE_NOTIFICATIONS"
        const val ACTION_STOP_SERVICE = "org.wasedacalendar.plugins.ACTION_STOP_SERVICE"
        const val ACTION_NOTIFY_NEXT_COURSE = "org.wasedacalendar.plugins.ACTION_NOTIFY_NEXT_COURSE"
        const val ACTION_UPDATE_NOTIFICATIONS = "org.wasedacalendar.plugins.ACTION_UPDATE_NOTIFICATIONS"
    }

    private val data = CourseNotification

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Notification Service")
            .setContentText("Running...")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .setSound(null)
            .setVibrate(null)
            .build()
        startForeground(1, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_SCHEDULE_NOTIFICATIONS -> {
                Logger.debug("Scheduling notifications")
                scheduleDailyCalculation()
                notifyNearestCourse()
            }
            ACTION_STOP_SERVICE -> {
                Logger.debug("Stopping service")
                stopSelf()
            }
            ACTION_NOTIFY_NEXT_COURSE -> {
                Logger.debug("Notifying next course")
                notifyNextCourse()
            }
            ACTION_UPDATE_NOTIFICATIONS -> {
                Logger.debug("Updating notifications")
                notifyNearestCourse()
            }
        }
        return START_STICKY
    }


    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        val notificationChannel = NotificationChannel(CHANNEL_ID, "Course Notifications",
            NotificationManager.IMPORTANCE_MIN).apply {
            setSound(null, null)
        }
        getSystemService(NotificationManager::class.java).run {
            createNotificationChannel(notificationChannel)
        }
    }

    private fun scheduleDailyCalculation() {
        // set up alarm manager to calculate
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(this, CourseNotificationService::class.java).apply {
            action = ACTION_SCHEDULE_NOTIFICATIONS
        }
        val pendingIntent = PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 8)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
        }
        if (calendar.timeInMillis < System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        try {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    private fun notifyNextCourse() {
        val course = data.getNextCourse()
        if (course != null) {
            notifyCourse(course)
        } else {
            Logger.debug("No course to notify")
            CourseNotificationHelper.showBreakNotification(this)
        }
    }

    private fun notifyNearestCourse() {
        val course = data.getCurrentCourse(true)
        if (course != null) {
            notifyCourse(course)
        } else {
            Logger.debug("No course to notify")
            CourseNotificationHelper.showBreakNotification(this)
        }
    }

    private fun notifyCourse(course: Course) {
        CourseNotificationHelper.showCourseNotification(
            this,
            course
        )
        scheduleNextCourse(course.schedules[0].endPeriod.let {
            data.getPeriodEndTimeMillis(it)
        })
    }

    private fun scheduleNextCourse(endTime: Long) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(this, CourseNotificationService::class.java).apply {
            action = ACTION_NOTIFY_NEXT_COURSE
        }
        val pendingIntent = PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        try {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                endTime,
                pendingIntent
            )
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

}