package com.prayersilencer.worker

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.work.CoroutineWorker
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.prayersilencer.receiver.AlarmReceiver
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar
import java.util.concurrent.TimeUnit

class PrayerScheduleWorker(
    private val context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        try {
            val prefs = context.getSharedPreferences("PrayerSchedulePrefs", Context.MODE_PRIVATE)
            val scheduleJson = prefs.getString("prayer_schedule_json", null)
            
            if (scheduleJson != null) {
                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                val alarms = JSONArray(scheduleJson)
                
                for (i in 0 until alarms.length()) {
                    val alarmObj = alarms.getJSONObject(i)
                    val alarmId = alarmObj.getString("id")
                    val triggerAtMillis = alarmObj.getLong("triggerAtMillis")
                    val prayerName = alarmObj.getString("prayerName")
                    val action = alarmObj.getString("action")
                    val profileName = alarmObj.optString("profileName", "Default")
                    val remainingMinutes = alarmObj.optInt("remainingMinutes", 0)
                    
                    if (triggerAtMillis > System.currentTimeMillis()) {
                        val intent = Intent(context, AlarmReceiver::class.java).apply {
                            this.action = action
                            putExtra(AlarmReceiver.EXTRA_PRAYER_NAME, prayerName)
                            putExtra("ALARM_ID", alarmId)
                            putExtra(AlarmReceiver.EXTRA_PROFILE_NAME, profileName)
                            putExtra(AlarmReceiver.EXTRA_REMAINING_MINUTES, remainingMinutes)
                        }
                        
                        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                        } else {
                            PendingIntent.FLAG_UPDATE_CURRENT
                        }
                        
                        val pendingIntent = PendingIntent.getBroadcast(
                            context,
                            alarmId.hashCode(),
                            intent,
                            flags
                        )
                        
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            alarmManager.setExactAndAllowWhileIdle(
                                AlarmManager.RTC_WAKEUP,
                                triggerAtMillis,
                                pendingIntent
                            )
                        } else {
                            alarmManager.setExact(
                                AlarmManager.RTC_WAKEUP,
                                triggerAtMillis,
                                pendingIntent
                            )
                        }
                    }
                }
            }
            
            scheduleMidnight(context)
            return Result.success()
        } catch (e: Exception) {
            e.printStackTrace()
            return Result.failure()
        }
    }
    
    companion object {
        const val WORK_NAME = "PrayerScheduleWorker"
        
        fun schedule(context: Context) {
            val request = OneTimeWorkRequestBuilder<PrayerScheduleWorker>().build()
            WorkManager.getInstance(context).enqueue(request)
        }
        
        fun scheduleMidnight(context: Context) {
            val calendar = Calendar.getInstance().apply {
                add(Calendar.DAY_OF_YEAR, 1)
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 1)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            
            val delay = calendar.timeInMillis - System.currentTimeMillis()
            if (delay > 0) {
                val request = OneTimeWorkRequestBuilder<PrayerScheduleWorker>()
                    .setInitialDelay(delay, TimeUnit.MILLISECONDS)
                    .build()
                WorkManager.getInstance(context).enqueue(request)
            }
        }
    }
}
