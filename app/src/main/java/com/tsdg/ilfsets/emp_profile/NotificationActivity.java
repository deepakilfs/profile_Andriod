package com.tsdg.ilfsets.emp_profile;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.AppCompatButton;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.Tracker;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

import java.util.ArrayList;

import DataBase.SqliteHelper;

import adapters.NotificationAdapter;
import app.AppController;
import app.TrackerHelper;
import localstorage.LocalSharedPreference;
import model.AllNotifications;
import model.NotificationIds;
import remotecall.GetNotificationCount;
import remotecall.GetRecentNotification;
import urls.RemoteUrls;

public class NotificationActivity extends AppCompatActivity {

    Context context;
    String curretntocken,validstring;
    boolean isdatareceived=false;
    SqliteHelper databaseHelper;
    SQLiteDatabase sqLiteDatabase;
    AllNotifications allNotifications;
    RecyclerView recyclerView;
    NotificationAdapter noti_adapter;
    int counter=0;
    Tracker tracker;

   public  ArrayList<AllNotifications> notification_list=new ArrayList<AllNotifications>();
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    public ArrayList<Integer>dataset=new ArrayList<>();
    public ArrayList<NotificationIds>notification_id_from_table=new ArrayList<NotificationIds>();
    public static ArrayList<NotificationIds> readNotiIds;
    AppController controller;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_notification);

        controller= (AppController) getApplication();
        tracker=controller.getDefaultTracker();

        context=NotificationActivity.this;
        databaseHelper=new SqliteHelper(context);
        sqLiteDatabase=databaseHelper.getReadableDatabase();

        initActionBar();
        getNotificationCount();

    }

    private void initViews() {

        recyclerView= (RecyclerView) findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        // use linear layout manager
        mLayoutManager=new LinearLayoutManager(context);
        recyclerView.setLayoutManager(mLayoutManager);

        noti_adapter=new NotificationAdapter(context,notification_list);
        recyclerView.setAdapter(noti_adapter);

    }

    public void getTocken()
    {
        if(isdatareceived)
        {
            curretntocken=new LocalSharedPreference(context).getTocken();
            sendTockenAndGetNotificationData(curretntocken);
        }


    }

    private void sendTockenAndGetNotificationData(String curretntocken) {

        new GetRecentNotification(context).getNotificationData(curretntocken, new GetRecentNotification.NotificationDataInterface() {
            @Override
            public void onSuccess(String success) {
                Log.i("NotificationData","444"+success);
                // parse data and
                   /*if(success.charAt(0) =='"' && success.charAt(success.length() -1) =='"')
                    {

                        validstring=success.substring(1,success.length() -1);
                        Log.i("String","222"+validstring);

                    }*/
                    //validstring=convertStandardJSONString(success.replaceAll("//",""));
                //String validstring=success.substring(1,success.length()-1);
                //String validatestring=success.replaceAll("^\"|\"$", "");
                String strTest=success;
                strTest=strTest.replaceAll("\\\\","");
                strTest=strTest.replaceAll("^\"|\"$", "");
                JSONObject json=null;
                try {
                    json = new JSONObject(strTest);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                JSONArray notification_array= null;


                try {
                    notification_array = json.getJSONArray("tbl_RecentNotification");

                    for(int i=0;i<notification_array.length();i++)
                    {
                        JSONObject notification_array_json=notification_array.getJSONObject(i);
                        String notification_id=notification_array_json.getString(RemoteUrls.NOTIFICATION_ID);
                        String notification_title=notification_array_json.getString(RemoteUrls.NOTIFICATION_TITLE);
                        String notification_topic=notification_array_json.getString(RemoteUrls.NOTIFICATION_TOPIC);
                        String notification_desc=notification_array_json.getString(RemoteUrls.NOTIFICATION_DESC);
                        String notification_type=notification_array_json.getString(RemoteUrls.NOTIFICATION_TYPE);
                        String notification_category=notification_array_json.getString(RemoteUrls.NOTIFICATION_CATEGORY);
                        String notification_created_date=notification_array_json.getString(RemoteUrls.NOTIFICATION_CREATED_DATE);
                        String notification_date=notification_array_json.getString(RemoteUrls.NOTIFICATION_DATE);
                        String notification_timepart=notification_array_json.getString(RemoteUrls.NOTIFICATION_TIMEPART);

                        allNotifications=new AllNotifications();
                        allNotifications.setId(notification_id);
                        allNotifications.setTitle(notification_title);
                        allNotifications.setTopic(notification_topic);
                        allNotifications.setDesc(notification_desc);
                        allNotifications.setCategory(notification_category);
                        allNotifications.setCreated_date(notification_created_date);
                        allNotifications.setNoti_date(notification_date);
                        notification_list.add(allNotifications);

                    }
                    // insert notification into table
                    // save global count variable
                    AppController.getInstance().setCount(notification_list.size());
                    insertNotificationData();
                    showNewNotification();
                    initViews();


                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }

            private void showNewNotification() {
                // get all notification ids first
                // check new ids with prevois one in not insert into arraylist
                sqLiteDatabase=databaseHelper.getWritableDatabase();
                String getAllIds=" SELECT * FROM "+SqliteHelper.NOTIFICATION_TABLE;
                Cursor cursor=sqLiteDatabase.rawQuery(getAllIds,null);
                String ids;

                if(cursor.moveToFirst()){
                    do {
                    ids=cursor.getString(0);
                    NotificationIds notificationIds=new NotificationIds();
                    notificationIds.setIds(ids);
                    notification_id_from_table.add(notificationIds);
                    }while(cursor.moveToNext());
                }

                /*readNotiIds=NotificationAdapter.notificationIds;

                for(int i=0;i<notification_list.size();i++)
                {
                    if(!notification_list.get(i).getId().contains(readNotiIds.get(i).getIds()))
                    {
                        counter++;
                        // new notification

                    }
                }
*/



            }

            @Override
            public void onFailure(String error) {
                Log.i("NotificationData","444"+error.toString());
            }
        });


    }

    private void insertNotificationData() {

        sqLiteDatabase=databaseHelper.getWritableDatabase();
        ContentValues values;
        for(int i=0;i<notification_list.size();i++)
        {
            allNotifications=notification_list.get(i);
            values=new ContentValues();
            values.put(SqliteHelper.NOTIFICATION_ID,allNotifications.getId());
            values.put(SqliteHelper.NOTIFICATION_TITLE,allNotifications.getTitle());
            values.put(SqliteHelper.NOTIFICATION_BODY,allNotifications.getDesc());
            values.put(SqliteHelper.NOTIFICATION_CATEGEGORY,allNotifications.getCategory());
            values.put(SqliteHelper.NOTIFICATION_DATE,allNotifications.getNoti_date());

            long id= sqLiteDatabase.insertWithOnConflict(SqliteHelper.NOTIFICATION_TABLE,null,values,SQLiteDatabase.CONFLICT_REPLACE);

        }

    }

    private void getNotificationCount() {
        new GetNotificationCount(context).showNotification(getDeviceRegId(), new GetNotificationCount.getNotificationInterface() {
            @Override
            public void onSuccess(String success) {
                Log.i("JsonResponse","222"+success);
                // create a tables

            }
            @Override
            public void onError(String error) {
                Log.i("JsonError","222"+error);

            }
            @Override
            public void onGetTocken(final String tocken) {
            Log.i("Tocken Inserted","222"+tocken);
            // store this tocken into local storage\
                isdatareceived=true;
                new LocalSharedPreference(context).saveToken(tocken);
                getTocken();


            }
        });
    }

    private void initActionBar() {
        Toolbar myToolbar = (Toolbar)findViewById(R.id.my_toolbar);
        setSupportActionBar(myToolbar);
        ActionBar actionBar=getSupportActionBar();
        actionBar.setCustomView(R.layout.appbar_layout);

        AppCompatButton  clear_all= (AppCompatButton) actionBar.getCustomView().findViewById(R.id.clear_all_btn);
        clear_all.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                NotificationAdapter.mDataset.clear();
                noti_adapter.notifyDataSetChanged();
                controller.sendeventToAnalytics(tracker,"click","button","clear all data");
                //tracker.send(new HitBuilders.EventBuilder().setAction("click").setCategory("button").setLabel("click on clear all").build());
                // send event to analytics
                //new TrackerHelper(context).sendeventToAnalytics("custome action","button","click on clear all button");
            }
        });
        actionBar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM
                | ActionBar.DISPLAY_SHOW_HOME);

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {

            default:
                // If we got here, the user's action was not recognized.
                // Invoke the superclass to handle it.
                return super.onOptionsItemSelected(item);

        }
    }

    public String getDeviceRegId()
    {
        String result=UtilFunction.getStringAppData(getApplicationContext(),Constants.DEVICE_KEY);
        Log.i("DeviceRedId","333"+result);
        if(result!=null&&result.length()>0){
            return  result;
        }
        return "";
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

    }

    @Override
    protected void onResume() {
        super.onResume();
        //new TrackerHelper(context).setScreenName(context.getString(R.string.notification_activity));
        controller.setScreenName(tracker,getResources().getString(R.string.notification_activity));


    }
}
