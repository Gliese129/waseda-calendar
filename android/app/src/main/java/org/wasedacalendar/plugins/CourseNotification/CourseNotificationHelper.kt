package org.wasedacalendar.plugins.CourseNotification

import android.content.Context
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.wasedacalendar.app.R
import org.wasedacalendar.plugins.CourseNotification.model.Course

object CourseNotificationHelper {
    private const val CHANNEL_ID = "NotificationServiceChannel"
    private const val NOTIFICATION_ID = 1

    fun showCourseNotification(context: Context, course: Course) {
        val layout = RemoteViews(context.packageName, R.layout.course_notification).apply {
            setTextViewText(R.id.title, course.name)
            setTextViewText(R.id.position_info, course.schedules[0].classroom)
            setTextViewText(R.id.time_info, course.schedules[0].let {
                "${it.startPeriod} - ${it.endPeriod}"
            })
        }

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_notification_overlay)
            .setStyle(NotificationCompat.DecoratedCustomViewStyle())
            .setCustomContentView(layout)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setOngoing(true)
            .setAutoCancel(false)
            .setSound(null)
            .setVibrate(null)

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    fun showBreakNotification(context: Context) {

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_notification_overlay)
            .setContentTitle("Enjoy your break!")
            .setContentText("No classes today!")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setOngoing(true)
            .setAutoCancel(false)
            .setSound(null)
            .setVibrate(null)

        try {
            NotificationManagerCompat.from(context).notify(NOTIFICATION_ID, builder.build())
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }
}