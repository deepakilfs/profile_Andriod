package com.tsdg.ilfsets.emp_profile;




import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseHelper extends SQLiteOpenHelper {

	static final int DATABASE_VERSION =15;

	// Database Name
	static final String DATABASE_NAME = "skillsreport";
	static final String LOG = "DatabaseHelper";

	// Table Names
	private static final String TABLE_NOTIFICATION_MASTER = "tbl_notification";


	// Column names
	private static final String KEY_ID = "id";
	private static final String KEY_DATE_TIME = "datetime";

	// TABLE_CONTACT_MASTER create statement

	private static final String CREATE_TABLE_NOTIFICATION_MASTER = "CREATE TABLE "
			+ TABLE_NOTIFICATION_MASTER + "(" + KEY_ID + " INTEGER PRIMARY KEY,"
			+ KEY_DATE_TIME + " TEXT" +  ")";


	public DatabaseHelper(Context context) {
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		// Create tables
		//System.out.println("SQL:::"+CREATE_TABLE_NOTIFICATION_MASTER);
		db.execSQL(CREATE_TABLE_NOTIFICATION_MASTER);

	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		// Drop older tables if existed
		db.execSQL("DROP TABLE IF EXISTS " + TABLE_NOTIFICATION_MASTER);

		onCreate(db);
	}

	// Adding new contact
	public String addNotification(String datetime) {
		//System.out.println("in add....................."+datetime);
		String result = "fail";
		SQLiteDatabase db = this.getWritableDatabase();

		try {
			db.beginTransaction();
			ContentValues values = new ContentValues();
			values.put(KEY_DATE_TIME, datetime);
			db.insert(TABLE_NOTIFICATION_MASTER, null, values);
			db.setTransactionSuccessful();// marks a commit
			result = "success";
		}catch(Exception ex){
			ex.printStackTrace();

		} finally {
			db.endTransaction();
			db.close(); // Closing database connection
		}
	//	System.out.println("Add Result:  "+result);
		return result;
	}



	public void deleteoldNotifications() {
		SQLiteDatabase db = this.getWritableDatabase();
		//System.out.println("in deleteOldNotification...........................");
		try {
			db.beginTransaction();
			db.delete(TABLE_NOTIFICATION_MASTER, KEY_ID + " not in(select "+KEY_ID+" from "+TABLE_NOTIFICATION_MASTER+" order by "+KEY_ID+" desc limit 2)",
					null);
			db.setTransactionSuccessful();// marks a commit
		}catch(Exception ex){
			ex.printStackTrace();
		} finally {
			db.endTransaction();
			db.close(); // Closing database connection
		}
	}

	public int getNotification(String datetime) {
		//System.out.println("getNotification ::: "+datetime);
		SQLiteDatabase db = this.getWritableDatabase();
		int result=0;
		try {

			Cursor cursor = db.rawQuery("select " + KEY_ID +
				" from "
					+ TABLE_NOTIFICATION_MASTER+ " where " + KEY_DATE_TIME + "=?",
					new String[] { String.valueOf(datetime) });
			if (cursor.moveToFirst()) {
				result=cursor.getInt(cursor
						.getColumnIndex(KEY_ID));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			db.close();

		}
		//System.out.println("result::::"+result);
		return result;
	}

}
