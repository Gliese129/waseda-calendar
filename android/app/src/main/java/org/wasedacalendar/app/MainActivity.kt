package org.wasedacalendar.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity
import org.wasedacalendar.plugins.CourseNotification.CourseNotificationPlugin

class MainActivity : BridgeActivity() {
    public override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(CourseNotificationPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
