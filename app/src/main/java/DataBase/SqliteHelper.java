package DataBase;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * Created by Deepak Borade on 29/01/2018.
 */

public class SqliteHelper extends SQLiteOpenHelper {
    Context context;

    public static final String DATABASE_NAME="profile";
    public static int DATABASE_VERSION=1;
    public static final String NOTIFICATION_TABLE="notification_master";
    public static final String NOTIFICATION_ID="id";
    public static final String NOTIFICATION_TITLE="title";
    public static final String NOTIFICATION_BODY="body";
    public static final String NOTIFICATION_CATEGEGORY="category";
    public static final String NOTIFICATION_DATE="datetime";

    public static String CREATE_NOTIFICATION_TABLE=
            " CREATE TABLE "+ NOTIFICATION_TABLE +"(" + NOTIFICATION_ID
            + " INTEGER PRIMARY KEY ,"
            + NOTIFICATION_TITLE + " TEXT , "
            + NOTIFICATION_BODY + " TEXT , "
            + NOTIFICATION_CATEGEGORY + " TEXT ,"
            + NOTIFICATION_DATE + " TEXT , " + " UNIQUE " + "(" + NOTIFICATION_ID + " ) " + " ON CONFLICT REPLACE "
            +");";

    public SqliteHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        sqLiteDatabase.execSQL(CREATE_NOTIFICATION_TABLE);
        Log.i("TableCreated","222"+CREATE_NOTIFICATION_TABLE);

    }

    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
     sqLiteDatabase.execSQL("DROP TABLE IF  EXISTS "+ NOTIFICATION_TABLE);
     onCreate(sqLiteDatabase);
    }
}
