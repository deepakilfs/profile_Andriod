package com.tsdg.ilfsets.emp_profile;


import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.provider.Settings;

import com.tsdg.ilfsets.emp_profile.R;
public class UtilFunction {

    public static void addStringAppData(Context ctx, String key, String value) {
        SharedPreferences sharedPref = ctx.getSharedPreferences(
                ctx.getString(R.string.app_name), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public static void deleteStringAppData(Context ctx, String key) {
        SharedPreferences sharedPref = ctx.getSharedPreferences(
                ctx.getString(R.string.app_name), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.remove(key);
        editor.commit();
    }

    public static String getStringAppData(Context ctx, String key) {
        String data;
        SharedPreferences sharedPref = ctx.getSharedPreferences(
                ctx.getString(R.string.app_name), Context.MODE_PRIVATE);
        data = sharedPref.getString(key, "");
        return data;
    }


    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager
                .getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }


    public static void main(String args[]) {
        System.out.println("got emailid from form:::");
        //	new HomeActivity().saveUserDetails("http://ict.esg.ilfseducation.com/ictportal/Services/frmregister_IOS.aspx?abc=123&xyz=9890655708&txtEmailid=prashant");
    }



    public static String getAndroidDeviceId(Context context) {
        WifiManager m_wm = (WifiManager) context
                .getSystemService(Context.WIFI_SERVICE);
        String m_wlanMacAdd = m_wm.getConnectionInfo().getMacAddress();
        if (m_wlanMacAdd == null || m_wlanMacAdd.length() <= 0) {
            // Get android Id
            m_wlanMacAdd = Settings.Secure.getString(context.getContentResolver(),
                    Settings.Secure.ANDROID_ID);
        }
        return m_wlanMacAdd;
    }


}
