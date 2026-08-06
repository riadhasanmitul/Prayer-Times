package com.prayersilencer.notification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.prayersilencer.MainActivity
import com.prayersilencer.service.PrayerForegroundService

object NotificationHelper {
    const val CHANNEL_ACTIVE_ID = "prayer_silencer_active"
    const val CHANNEL_REMINDER_ID = "prayer_silencer_reminder"
    const val NOTIFICATION_ACTIVE_ID = 1001
    
    fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            // Active Channel (Silent)
            val activeChannel = NotificationChannel(
                CHANNEL_ACTIVE_ID,
                "Active Prayer Silence",
                NotificationManager.IMPORTANCE_HIGH // Can be high for foreground service
            ).apply {
                description = "Shows when prayer silencer is active"
                setSound(null, null)
                enableVibration(false)
            }
            
            // Reminder Channel
            val reminderChannel = NotificationChannel(
                CHANNEL_REMINDER_ID,
                "Prayer Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Shows reminders for prayers"
            }
            
            manager.createNotificationChannel(activeChannel)
            manager.createNotificationChannel(reminderChannel)
        }
    }
    
    fun buildActiveNotification(
        context: Context,
        prayerName: String,
        profileName: String,
        remainingMinutes: Int
    ): Notification {
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }

        val restoreIntent = PrayerForegroundService.buildRestoreIntent(context)
        val restorePendingIntent = PendingIntent.getService(
            context,
            0,
            restoreIntent,
            flags
        )
        
        val openAppIntent = Intent(context, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        }
        val openAppPendingIntent = PendingIntent.getActivity(
            context,
            1,
            openAppIntent,
            flags
        )
        
        return NotificationCompat.Builder(context, CHANNEL_ACTIVE_ID)
            .setContentTitle("Silencing for $prayerName")
            .setContentText("Profile: $profileName ($remainingMinutes min remaining)")
            .setSmallIcon(android.R.drawable.ic_lock_silent_mode)
            .setOngoing(true)
            .addAction(android.R.drawable.ic_lock_silent_mode, "Restore Now", restorePendingIntent)
            .addAction(android.R.drawable.ic_menu_view, "Open App", openAppPendingIntent)
            .setContentIntent(openAppPendingIntent)
            .build()
    }
}
