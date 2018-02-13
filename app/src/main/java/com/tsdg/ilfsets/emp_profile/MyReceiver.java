package com.tsdg.ilfsets.emp_profile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class MyReceiver extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		  if (intent.getAction().equals(Intent.ACTION_BOOT_COMPLETED)) {
			  Intent i = new Intent(context, MyService.class);
			  context.startService(i);
	        }

	}
	
	

}
