package com.prayersilencer.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.prayersilencer.worker.PrayerScheduleWorker

class TimeChangeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        if (action == Intent.ACTION_TIME_CHANGED || 
            action == Intent.ACTION_TIMEZONE_CHANGED || 
            action == Intent.ACTION_DATE_CHANGED) {
            PrayerScheduleWorker.schedule(context)
        }
    }
}
