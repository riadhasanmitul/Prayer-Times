package com.prayersilencer.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.IBinder
import androidx.localbroadcastmanager.content.LocalBroadcastManager
import com.prayersilencer.notification.NotificationHelper

class PrayerForegroundService : Service() {
    companion object {
        const val ACTION_START = "com.prayersilencer.ACTION_START"
        const val ACTION_STOP = "com.prayersilencer.ACTION_STOP"
        const val ACTION_RESTORE = "com.prayersilencer.ACTION_RESTORE"
        const val ACTION_UPDATE = "com.prayersilencer.ACTION_UPDATE"
        const val EXTRA_PRAYER_NAME = "prayer_name"
        const val EXTRA_PROFILE_NAME = "profile_name"
        const val EXTRA_REMAINING_MINUTES = "remaining_minutes"
        const val EXTRA_PREVIOUS_RINGER_MODE = "previous_ringer_mode"
        const val ACTION_RESTORED_BROADCAST = "com.prayersilencer.ACTION_RESTORED_BROADCAST"
        
        fun buildStartIntent(context: Context, prayerName: String, profileName: String, previousRingerMode: Int, remainingMinutes: Int): Intent {
            return Intent(context, PrayerForegroundService::class.java).apply {
                action = ACTION_START
                putExtra(EXTRA_PRAYER_NAME, prayerName)
                putExtra(EXTRA_PROFILE_NAME, profileName)
                putExtra(EXTRA_PREVIOUS_RINGER_MODE, previousRingerMode)
                putExtra(EXTRA_REMAINING_MINUTES, remainingMinutes)
            }
        }
        
        fun buildStopIntent(context: Context): Intent {
            return Intent(context, PrayerForegroundService::class.java).apply {
                action = ACTION_STOP
            }
        }
        
        fun buildRestoreIntent(context: Context): Intent {
            return Intent(context, PrayerForegroundService::class.java).apply {
                action = ACTION_RESTORE
            }
        }
    }

    private var previousRingerMode: Int = AudioManager.RINGER_MODE_NORMAL
    private var currentPrayerName: String = ""
    private var currentProfileName: String = ""

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        
        when (action) {
            ACTION_START -> {
                currentPrayerName = intent.getStringExtra(EXTRA_PRAYER_NAME) ?: "Prayer"
                currentProfileName = intent.getStringExtra(EXTRA_PROFILE_NAME) ?: "Default"
                previousRingerMode = intent.getIntExtra(EXTRA_PREVIOUS_RINGER_MODE, AudioManager.RINGER_MODE_NORMAL)
                val remainingMinutes = intent.getIntExtra(EXTRA_REMAINING_MINUTES, 0)
                
                val notification = NotificationHelper.buildActiveNotification(
                    this, currentPrayerName, currentProfileName, remainingMinutes
                )
                startForeground(NotificationHelper.NOTIFICATION_ACTIVE_ID, notification)
            }
            ACTION_UPDATE -> {
                val remainingMinutes = intent.getIntExtra(EXTRA_REMAINING_MINUTES, 0)
                val notification = NotificationHelper.buildActiveNotification(
                    this, currentPrayerName, currentProfileName, remainingMinutes
                )
                val manager = getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
                manager.notify(NotificationHelper.NOTIFICATION_ACTIVE_ID, notification)
            }
            ACTION_RESTORE -> {
                restoreRingerMode()
                stopSelf()
            }
            ACTION_STOP -> {
                stopSelf()
            }
        }
        
        return START_NOT_STICKY
    }
    
    private fun restoreRingerMode() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        try {
            audioManager.ringerMode = previousRingerMode
        } catch (e: Exception) {
            // Permission might have been revoked
        }
        val broadcastIntent = Intent(ACTION_RESTORED_BROADCAST)
        LocalBroadcastManager.getInstance(this).sendBroadcast(broadcastIntent)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
