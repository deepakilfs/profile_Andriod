package com.tsdg.ilfsets.emp_profile;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;
import android.util.Log;



public class MyService extends Service {

	Timer timer;
//	Timer timer1;
	TimerTask timerTask;
//	TimerTask timerTask1;
	SimpleDateFormat sDate = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	
DatabaseHelper dbHelp;
	@Override
	public void onCreate() {
		super.onCreate();

		startTimer();


	}


	@Override
	public void onStart(Intent intent, int startId) {

		try {


		} catch (Exception ex) {
			ex.printStackTrace();
		}

	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	public void initializeTimerTask() {
		dbHelp=new DatabaseHelper(getApplicationContext());
		final int intFirstTimer=dbHelp.getNotification(sDate.format( getMorningTime()));
		//final int intSecondTimer=dbHelp.getNotification(sDate.format(getEveTime()));

		timerTask = new TimerTask() {
			public void run() {
				if(intFirstTimer<=0){
					dbHelp.deleteoldNotifications();
					NotifyMorning("KClass Plus", "view updates!");
					dbHelp.addNotification(sDate.format(getMorningTime()));
				}

			}
		};

		/*timerTask1 = new TimerTask() {
			public void run() {
if(intSecondTimer<=0){
	NotifyEve("Skills Report", "view updates!");
	dbHelp.deleteoldNotifications();
	dbHelp.addNotification(sDate.format(getEveTime()));
	System.out.println("after add..............");
}

			}

		};*/

	}

	public void startTimer() {

		timer = new Timer();
		// initialize the TimerTask's job
		initializeTimerTask();
		// schedule the timer, after the first 5000ms the TimerTask will run
		// every 10000ms
		timer.scheduleAtFixedRate(timerTask, getMorningTime(), 1000 * 60 * 60 * 24); //  1000 * 60 * 60 * 24

//		timer1 = new Timer();
//		timer1.scheduleAtFixedRate(timerTask1, getEveTime(), 1000 * 60 * 60 * 24); //1000 * 60 * 60 * 24

	}

	public void stoptimertask() {

		if (timer != null) {
			timer.cancel();
			timer = null;

		}

	}


	private void NotifyMorning(String notificationTitle, String notificationMessage){
		NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
		@SuppressWarnings("deprecation")

		//Notification notification = new Notification(R.drawable.kclassplus_logo_notification,"view updates!",(getMorningTime().getTime()));
		Intent notificationIntent = new Intent(this,SplashScreen.class);
		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0,notificationIntent, 0);

		//notification.setLatestEventInfo(MyService.this, notificationTitle,notificationMessage, pendingIntent);
		//notification.flags|= Notification.FLAG_AUTO_CANCEL|Notification.FLAG_ONLY_ALERT_ONCE;
		//notificationManager.notify(101, notification);
	}

/*	private void NotifyEve(String notificationTitle, String notificationMessage){
		NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
		@SuppressWarnings("deprecation")

		Notification notification = new Notification(R.drawable.skills_logo_notification,"view updates!",( getEveTime().getTime()));

		Intent notificationIntent = new Intent(this,SplashScreen.class);
		PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);

		notification.setLatestEventInfo(MyService.this, notificationTitle, notificationMessage, pendingIntent);
		notification.flags|= Notification.FLAG_AUTO_CANCEL|Notification.FLAG_ONLY_ALERT_ONCE;
		notificationManager.notify(102, notification);
	}

*/
	private static Date getMorningTime(){
		Calendar cal930AM=Calendar.getInstance();
		cal930AM.set(Calendar.HOUR, 9);
		cal930AM.set(Calendar.MINUTE, 30);
		cal930AM.set(Calendar.SECOND, 0);
		cal930AM.set(Calendar.AM_PM,Calendar.AM);

		return cal930AM.getTime();
	}
/*	private static Date getEveTime(){
		Calendar cal1430PM=Calendar.getInstance();
		cal1430PM.set(Calendar.HOUR, 14);
		cal1430PM.set(Calendar.MINUTE, 55);
		cal1430PM.set(Calendar.SECOND, 0);
		cal1430PM.set(Calendar.AM_PM, Calendar.PM);
		return cal1430PM.getTime();
	}

*/

}
