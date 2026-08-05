package com.prayersilencer.modules

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.prayersilencer.receiver.AlarmReceiver
import org.json.JSONArray

class AlarmSchedulerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val alarmManager: AlarmManager = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val sharedPreferences: SharedPreferences = reactContext.getSharedPreferences("AlarmSchedulerPrefs", Context.MODE_PRIVATE)

    override fun getName(): String = "AlarmSchedulerModule"

    @ReactMethod
    fun scheduleAlarm(alarmId: String, triggerAtMillis: Double, prayerName: String, action: String, promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, AlarmReceiver::class.java).apply {
                this.action = action
                putExtra(AlarmReceiver.EXTRA_PRAYER_NAME, prayerName)
                putExtra("ALARM_ID", alarmId)
            }
            
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            
            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                alarmId.hashCode(),
                intent,
                flags
            )

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                    promise.reject("PERMISSION_DENIED", "Cannot schedule exact alarms. Please grant permission.")
                    return
                }
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis.toLong(),
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    triggerAtMillis.toLong(),
                    pendingIntent
                )
            }

            saveAlarmId(alarmId)
            promise.resolve(true)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Cannot schedule exact alarm: ${e.message}")
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", e.message)
        }
    }

    @ReactMethod
    fun cancelAlarm(alarmId: String, promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, AlarmReceiver::class.java)
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            
            val pendingIntent = PendingIntent.getBroadcast(
                reactApplicationContext,
                alarmId.hashCode(),
                intent,
                flags
            )
            
            alarmManager.cancel(pendingIntent)
            removeAlarmId(alarmId)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", e.message)
        }
    }

    @ReactMethod
    fun cancelAllAlarms(promise: Promise) {
        try {
            val alarmIds = getStoredAlarmIds()
            for (alarmId in alarmIds) {
                val intent = Intent(reactApplicationContext, AlarmReceiver::class.java)
                val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
                
                val pendingIntent = PendingIntent.getBroadcast(
                    reactApplicationContext,
                    alarmId.hashCode(),
                    intent,
                    flags
                )
                
                alarmManager.cancel(pendingIntent)
            }
            clearAlarmIds()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", e.message)
        }
    }
    
    private fun saveAlarmId(alarmId: String) {
        val ids = getStoredAlarmIds().toMutableSet()
        ids.add(alarmId)
        sharedPreferences.edit().putStringSet("ALARM_IDS", ids).apply()
    }
    
    private fun removeAlarmId(alarmId: String) {
        val ids = getStoredAlarmIds().toMutableSet()
        ids.remove(alarmId)
        sharedPreferences.edit().putStringSet("ALARM_IDS", ids).apply()
    }

    private fun getStoredAlarmIds(): Set<String> {
        return sharedPreferences.getStringSet("ALARM_IDS", emptySet()) ?: emptySet()
    }
    
    private fun clearAlarmIds() {
        sharedPreferences.edit().remove("ALARM_IDS").apply()
    }
}
