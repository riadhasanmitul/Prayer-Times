package com.prayersilencer.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import com.prayersilencer.service.PrayerForegroundService

class AlarmReceiver : BroadcastReceiver() {
    companion object {
        const val ACTION_PRAYER_START = "com.prayersilencer.PRAYER_START"
        const val ACTION_PRAYER_END = "com.prayersilencer.PRAYER_END"
        const val EXTRA_PRAYER_NAME = "prayer_name"
        const val EXTRA_PREVIOUS_RINGER_MODE = "previous_ringer_mode"
        const val EXTRA_PROFILE_NAME = "profile_name"
        const val EXTRA_REMAINING_MINUTES = "remaining_minutes"
    }
    
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        
        if (action == ACTION_PRAYER_START) {
            val prayerName = intent.getStringExtra(EXTRA_PRAYER_NAME) ?: "Prayer"
            val profileName = intent.getStringExtra(EXTRA_PROFILE_NAME) ?: "Default"
            val remainingMinutes = intent.getIntExtra(EXTRA_REMAINING_MINUTES, 0)
            
            val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val currentMode = audioManager.ringerMode
            
            val serviceIntent = PrayerForegroundService.buildStartIntent(
                context, prayerName, profileName, currentMode, remainingMinutes
            )
            
            try {
                audioManager.ringerMode = AudioManager.RINGER_MODE_SILENT
            } catch (e: Exception) {
                // Ignore if DND permission is missing
            }
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        } else if (action == ACTION_PRAYER_END) {
            val serviceIntent = PrayerForegroundService.buildRestoreIntent(context)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        }
    }
}
