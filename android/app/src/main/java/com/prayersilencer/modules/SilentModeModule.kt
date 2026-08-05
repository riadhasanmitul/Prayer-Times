package com.prayersilencer.modules

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*

class SilentModeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        const val MODULE_NAME = "SilentModeModule"
        const val RINGER_SILENT = 0
        const val RINGER_VIBRATE = 1
        const val RINGER_NORMAL = 2
    }
    
    private val audioManager: AudioManager by lazy {
        reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    }
    
    private val notificationManager: NotificationManager by lazy {
        reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    }
    
    override fun getName(): String = MODULE_NAME
    
    @ReactMethod
    fun setRingerMode(mode: Int, promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!notificationManager.isNotificationPolicyAccessGranted) {
                    promise.reject("DND_PERMISSION_DENIED", "Notification Policy Access not granted. Please grant DND access in settings.")
                    return
                }
            }
            val androidMode = when (mode) {
                RINGER_SILENT -> AudioManager.RINGER_MODE_SILENT
                RINGER_VIBRATE -> AudioManager.RINGER_MODE_VIBRATE
                RINGER_NORMAL -> AudioManager.RINGER_MODE_NORMAL
                else -> {
                    promise.reject("INVALID_MODE", "Invalid ringer mode: $mode")
                    return
                }
            }
            audioManager.ringerMode = androidMode
            promise.resolve(null)
        } catch (e: SecurityException) {
            promise.reject("SECURITY_EXCEPTION", "Cannot change ringer mode: ${e.message}")
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Failed to set ringer mode: ${e.message}")
        }
    }
    
    @ReactMethod
    fun getRingerMode(promise: Promise) {
        try {
            val mode = when (audioManager.ringerMode) {
                AudioManager.RINGER_MODE_SILENT -> RINGER_SILENT
                AudioManager.RINGER_MODE_VIBRATE -> RINGER_VIBRATE
                AudioManager.RINGER_MODE_NORMAL -> RINGER_NORMAL
                else -> RINGER_NORMAL
            }
            promise.resolve(mode)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Failed to get ringer mode: ${e.message}")
        }
    }
    
    @ReactMethod
    fun hasDndAccess(promise: Promise) {
        try {
            val hasAccess = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                notificationManager.isNotificationPolicyAccessGranted
            } else {
                true
            }
            promise.resolve(hasAccess)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", e.message)
        }
    }
    
    @ReactMethod
    fun requestDndAccess(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val intent = Intent(Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
            }
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("UNKNOWN_ERROR", "Failed to open DND settings: ${e.message}")
        }
    }
}
