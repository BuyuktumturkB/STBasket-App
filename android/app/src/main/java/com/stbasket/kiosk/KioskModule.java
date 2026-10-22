package com.stbasket.kiosk;

import android.app.Activity;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.stbasket.admin.MyDeviceAdminReceiver;

public class KioskModule extends ReactContextBaseJavaModule {

    public KioskModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "KioskModule";
    }

    @ReactMethod
    public void startKiosk() {
        Activity activity = getCurrentActivity();
        if (activity == null) return;

        DevicePolicyManager dpm =
                (DevicePolicyManager) activity.getSystemService(Context.DEVICE_POLICY_SERVICE);

        ComponentName adminComponent =
                new ComponentName(activity, MyDeviceAdminReceiver.class);

        if (dpm != null && dpm.isDeviceOwnerApp(activity.getPackageName())) {
            dpm.setLockTaskPackages(adminComponent,
                    new String[]{activity.getPackageName()});
            activity.startLockTask();
        }
    }

    @ReactMethod
    public void stopKiosk() {
        Activity activity = getCurrentActivity();
        if (activity == null) return;
        activity.stopLockTask();
    }
}

