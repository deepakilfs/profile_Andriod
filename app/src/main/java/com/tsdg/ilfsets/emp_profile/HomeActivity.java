package com.tsdg.ilfsets.emp_profile;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.app.usage.ConfigurationStats;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Location;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.MailTo;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Build.VERSION_CODES;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.Tracker;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.firebase.messaging.FirebaseMessaging;
import com.tsdg.ilfsets.emp_profile.R;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import app.AppController;
import app.Config;
import app.TrackerHelper;
import model.NotificationData;
import utils.NotificationUtils;

@SuppressLint("SetJavaScriptEnabled")
public class HomeActivity extends Activity {

    //Local
    private final String REGISTER_URL = "file:///android_asset/profile/registration.html";
    private final String LOGIN_URL = "file:///android_asset/profile/splash.html";
    public static int notification_counter=0;
    public static ArrayList<NotificationData>notificationlist;
    NotificationData data;

     //WEB
     //private final String REGISTER_URL = "http://103.28.141.92/profile/registration.html";
     //private final String LOGIN_URL = "http://103.28.141.92/profile/login.html";
     // notification code

    private static final String TAG = HomeActivity.class.getSimpleName();
    private BroadcastReceiver mRegistrationBroadcastReceiver;

    final private int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 124;
    WebView webview;
    ProgressDialog progressBar;
    // private NetworkChangeReceiver receiver;
    private static boolean isConnected;
    private int securityPIN;
    private static final int INPUT_FILE_REQUEST_CODE = 1;
    private static final int FILECHOOSER_RESULTCODE = 1;
    private WebSettings webSettings;
    private ValueCallback<Uri> mUploadMessage;
    private Uri mCapturedImageURI = null;
    private ValueCallback<Uri[]> mFilePathCallback;
    private String mCameraPhotoPath;
    private boolean LOCATION_STATUS = false;
    JavaScriptInterface jsInterface;
    Context context;
    private static final int REQUEST_CHECK_SETTINGS = 0x1;
    private static GoogleApiClient mGoogleApiClient;
    private static final int ACCESS_FINE_LOCATION_INTENT_ID = 3;
    private static final String BROADCAST_ACTION = "android.location.PROVIDERS_CHANGED";
    public static boolean isLocationon=false;
    public String getFcmid="";
    private AlertDialog alert;
    AppController controller;
    Tracker tracker;

    @SuppressLint("NewApi")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        context=HomeActivity.this;

        controller= (AppController) getApplication();
        tracker=controller.getDefaultTracker();
        // notification for gobal topic
        // registered a topic so notification can send to all devices.
        FirebaseMessaging.getInstance().subscribeToTopic(Config.TOPIC_GLOBAL);

        // test topic
        //FirebaseMessaging.getInstance().subscribeToTopic("Test");
        getWindow( ).setFlags( WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE );
        //initGoogleAPIClient();// registered api client
        //checkPermissions();//Check Permission//*/
        progressBar= new ProgressDialog(HomeActivity.this);
        progressBar.setTitle("Loading...");
        progressBar.setMessage("Please wait for a moment...");
        webview = (WebView) findViewById(R.id.webViewHome);
        webview.setWebViewClient(new MyWebViewClient());

        webSettings = webview.getSettings();
        webSettings.setAppCacheEnabled(true);
        webSettings.setCacheMode(webSettings.LOAD_CACHE_ELSE_NETWORK);

        webSettings.setLoadWithOverviewMode(true);
        webSettings.setAllowFileAccess(true);

// location code
      /*  webview.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.i("WebUrl","111"+url);
                //progressBar.setVisibility(View.VISIBLE);

              *//* compare your URL from here*//*

                //updateUrl(url);
            }
            @Override
            public void onPageFinished(WebView view, String url) {
//                progressDialog.dismiss();
               // progressBar.setVisibility(View.GONE);
                Log.i("WebUrl","111"+url);
                if(url.equalsIgnoreCase("file:///android_asset/profile/login.html")||url.equalsIgnoreCase("file:///android_asset/profile/login.html#")){
                    Log.i("InLogin","111");
                    //initGoogleAPIClient();// registered api client
                    *//*mGoogleApiClient = new GoogleApiClient.Builder(HomeActivity.this)
                            .addApi(LocationServices.API)

                            .build();
                    mGoogleApiClient.connect();
                    checkPermissions();
                    BroadcastReceiver gpsLocationReceiver = new BroadcastReceiver() {

                        @Override
                        public void onReceive(Context context, Intent intent) {

                            //If Action is Location
                            if (intent.getAction().matches(BROADCAST_ACTION)) {
                                LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
                                //Check if GPS is turned ON or OFF
                                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                                    Log.e("About GPS", "GPS is Enabled in your device");
                                    updateGPSStatus("GPS is Enabled in your device");
                                } else {
                                    //If GPS turned OFF show Location Dialog
                                    new Handler().postDelayed(sendUpdatesToUI, 10);
                                    // showSettingDialog();
                                    updateGPSStatus("GPS is Disabled in your device");
                                    Log.e("About GPS", "GPS is Disabled in your device");
                                }

                            }
                        }
                    };
*//*
                    //Init Google API Client

                }
            }
        });*/

        if (Build.VERSION.SDK_INT >= 19) {
            webview.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        }
        else if(Build.VERSION.SDK_INT >=11 && Build.VERSION.SDK_INT < 19) {
            webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }

        webview.setWebChromeClient(new MyChromeClient());

        if (!isNetworkAvailable()) {
            showNetworkAlert();

        } else {
            webview.getSettings().setJavaScriptEnabled(true);
            webview.getSettings().setDomStorageEnabled(true);
            webview.getSettings().setDatabaseEnabled(true);
            webview.getSettings().setAppCacheEnabled(true);
            webview.getSettings().setGeolocationEnabled(true);
            webview.getSettings().setDisplayZoomControls(true);
            webview.getSettings().setSupportZoom(true);
            webview.getSettings().setBuiltInZoomControls(true);
            webview.getSettings().setAllowUniversalAccessFromFileURLs(true);
            webview.getSettings().setAllowContentAccess(true);
            webview.getSettings().setAllowFileAccessFromFileURLs(true);
            webview.getSettings().setAllowFileAccess(true);
            webview.getSettings().setGeolocationDatabasePath(getFilesDir().getPath());
            webview.getSettings()
                    .setJavaScriptCanOpenWindowsAutomatically(true);
            webview.getSettings().setUseWideViewPort(true);
            jsInterface = new JavaScriptInterface(this);
            webview.addJavascriptInterface(jsInterface, "JSInterface");
            if (Build.VERSION.SDK_INT >= VERSION_CODES.JELLY_BEAN) {
                webview.getSettings().setAllowUniversalAccessFromFileURLs(true);
            }


           if (savedInstanceState == null) {

                if(jsInterface.getDeviceRegId()!=null && jsInterface.getDeviceRegId().length()>0){
                    webview.loadUrl(LOGIN_URL);
                }else{
                    webview.loadUrl(REGISTER_URL);
                }
            } else {
                webview.restoreState(savedInstanceState);
            }

        }

        if (Build.VERSION.SDK_INT >= 23) {
            System.out.println("android is above 23...");
            checkForPermission();

        }else
        {

            System.out.println("android is below 23...");
        }

        mRegistrationBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {

                // checking for type intent filter
                if (intent.getAction().equals(Config.REGISTRATION_COMPLETE)){
                    // gcm successfully registered
                    // now subscribe to `global` topic to receive app wide notifications
                    FirebaseMessaging.getInstance().subscribeToTopic(Config.TOPIC_GLOBAL);
                    //FirebaseMessaging.getInstance().subscribeToTopic("Test");
                    displayFirebaseRegId();

                } else if (intent.getAction().equals(Config.PUSH_NOTIFICATION)) {
                    // new push notification is received

                    // notification received when app is foreground
                    notification_counter++;
                    String message = intent.getStringExtra("message");
                    data=new NotificationData();
                    data.setData(message);
                    notificationlist=new ArrayList<NotificationData>();
                    notificationlist.add(data);
                    Log.i("Notificationcounter","333"+notification_counter);

                    Toast.makeText(getApplicationContext(), "Push notification: " + message, Toast.LENGTH_LONG).show();

                    //txtMessage.setText(message);
                }
            }
        };


        displayFirebaseRegId();


    }



    private void initGoogleAPIClient() {
        //Without Google API Client Auto Location Dialog will not work
        mGoogleApiClient = new GoogleApiClient.Builder(HomeActivity.this)
                .addApi(LocationServices.API)

                .build();
        mGoogleApiClient.connect();
    }

    private void checkPermissions() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (ContextCompat.checkSelfPermission(HomeActivity.this,
                    android.Manifest.permission.ACCESS_FINE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED)
                requestLocationPermission();
            else
                showSettingDialog();
        } else
            showSettingDialog();

    }

    private void requestLocationPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(HomeActivity.this, android.Manifest.permission.ACCESS_FINE_LOCATION)) {
            ActivityCompat.requestPermissions(HomeActivity.this,
                    new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION},
                    ACCESS_FINE_LOCATION_INTENT_ID);

        } else {
            ActivityCompat.requestPermissions(HomeActivity.this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    ACCESS_FINE_LOCATION_INTENT_ID);
        }
    }
    private void showSettingDialog() {
        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);//Setting priotity of Location request to high
        locationRequest.setInterval(30 * 1000);
        locationRequest.setFastestInterval(5 * 1000);//5 sec Time interval for location update

        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);

        builder.setAlwaysShow(true);

        //this is the key ingredient to show dialog always when GPS is off

        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient, builder.build());
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();
                final LocationSettingsStates state = result.getLocationSettingsStates();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        // All location settings are satisfied. The client can initialize location
                        // requests here.
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        // Location settings are not satisfied. But could be fixed by showing the user
                        // a dialog.
                        try {
                            // Show the dialog by calling startResolutionForResult(),
                            // and check the result in onActivityResult().
                            status.startResolutionForResult(HomeActivity.this, REQUEST_CHECK_SETTINGS);
                        } catch (IntentSender.SendIntentException e) {
                            e.printStackTrace();
                            // Ignore the error.
                        }
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        // Location settings are not satisfied. However, we have no way to fix the
                        // settings so we won't show the dialog

                        break;
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case ACCESS_FINE_LOCATION_INTENT_ID: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    //If permission granted show location dialog if APIClient is not null
                    if (mGoogleApiClient == null) {
                        initGoogleAPIClient();
                        showSettingDialog();
                    } else
                        showSettingDialog();


                } else {
                    updateGPSStatus("Location Permission denied.");
                    Toast.makeText(HomeActivity.this, "Location Permission denied.", Toast.LENGTH_SHORT).show();
                    // permission denied, boo! Disable the
                    // functionality that depends on this permission.
                }
                return;
            }
        }

    }

    private void updateGPSStatus(String status) {
        Log.e("GpsStatus","333"+status);
    }
    private Runnable sendUpdatesToUI = new Runnable() {
        public void run() {
            showSettingDialog();
        }
    };

    private BroadcastReceiver gpsLocationReceiver = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {

            //If Action is Location
            if (intent.getAction().matches(BROADCAST_ACTION)) {
                LocationManager locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
                //Check if GPS is turned ON or OFF
                if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                    Log.e("About GPS", "GPS is Enabled in your device");
                    updateGPSStatus("GPS is Enabled in your device");
                } else {
                    //If GPS turned OFF show Location Dialog
                    new Handler().postDelayed(sendUpdatesToUI, 10);
                    // showSettingDialog();
                    updateGPSStatus("GPS is Disabled in your device");
                    Log.e("About GPS", "GPS is Disabled in your device");
                }

            }
        }
    };
    private void displayFirebaseRegId() {
        SharedPreferences pref = getApplicationContext().getSharedPreferences(Config.SHARED_PREF, 0);
        String regId = pref.getString("regId", null);
        Log.e(TAG, "Firebase reg id: " + regId);
        if (!TextUtils.isEmpty(regId))
        {
            Log.e(TAG, "Firebase reg id: " + regId);
        }
        else
        {
            Log.e(TAG, "Firebase reg id: " + regId);
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

            if (requestCode != INPUT_FILE_REQUEST_CODE || mFilePathCallback == null) {
                super.onActivityResult(requestCode, resultCode, data);
                return;
            }

            Uri[] results = null;

            // Check that the response is a good one
            if (resultCode == Activity.RESULT_OK) {
                if (data == null) {
                    // If there is not data, then we may have taken a photo
                    if (mCameraPhotoPath != null) {
                        results = new Uri[]{Uri.parse(mCameraPhotoPath)};
                    }
                } else {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
            }

            mFilePathCallback.onReceiveValue(results);
            mFilePathCallback = null;

        } else if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
            if (requestCode != FILECHOOSER_RESULTCODE || mUploadMessage == null) {
                super.onActivityResult(requestCode, resultCode, data);
                return;
            }

            if (requestCode == FILECHOOSER_RESULTCODE) {

                if (null == this.mUploadMessage) {

                    //return; commented by pkj
                    Uri result = null;

                    try {
                        if (resultCode != RESULT_OK) {

                            result = null;

                        } else {

                            // retrieve from the private variable if the intent is null
                            result = data == null ? mCapturedImageURI : data.getData();
                        }
                    } catch (Exception e) {
                        Toast.makeText(getApplicationContext(), "activity :" + e,
                                Toast.LENGTH_LONG).show();
                    }

                    mUploadMessage.onReceiveValue(result);
                    mUploadMessage = null;

                }
            }

            return;
        }
        switch (requestCode) {
            // Check for the integer request code originally supplied to startResolutionForResult().
            case REQUEST_CHECK_SETTINGS:
                switch (resultCode) {
                    case RESULT_OK:
                        Log.e("Settings", "Result OK");
                        updateGPSStatus("GPS is Enabled in your device");
                        //startLocationUpdates();
                        break;
                    case RESULT_CANCELED:
                        Log.e("Settings", "Result Cancel");
                        updateGPSStatus("GPS is Disabled in your device");

                        break;
                }
                break;
        }

    }


    private File createImageFile() throws IOException {
      //  System.out.println("in createImageFile:::::");
        // Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_PICTURES);
        File imageFile = File.createTempFile(
                imageFileName,  /* prefix */
                ".jpg",         /* suffix */
                storageDir      /* directory */
        );
        return imageFile;
    }



    public class MyChromeClient extends WebChromeClient {

        // For Android 5.0
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> filePath, WebChromeClient.FileChooserParams fileChooserParams) {
            // Double check that we don't have any existing callbacks
            if (mFilePathCallback != null) {
                mFilePathCallback.onReceiveValue(null);
            }
            mFilePathCallback = filePath;

            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
                // Create the File where the photo should go
                File photoFile = null;
                try {
                    photoFile = createImageFile();
                    takePictureIntent.putExtra("PhotoPath", mCameraPhotoPath);
                } catch (IOException ex) {
                    // Error occurred while creating the File
                    Log.e("PKJ", "Unable to create Image File", ex);
                }

                // Continue only if the File was successfully created
                if (photoFile != null) {
                    mCameraPhotoPath = "file:" + photoFile.getAbsolutePath();
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT,
                            Uri.fromFile(photoFile));
                } else {
                    takePictureIntent = null;
                }
            }

            Intent contentSelectionIntent = new Intent(Intent.ACTION_GET_CONTENT);
            contentSelectionIntent.addCategory(Intent.CATEGORY_OPENABLE);
            contentSelectionIntent.setType("image/*");

            Intent[] intentArray;
            if (takePictureIntent != null) {
                intentArray = new Intent[]{takePictureIntent};
            } else {
                intentArray = new Intent[0];
            }

            Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
            chooserIntent.putExtra(Intent.EXTRA_INTENT, contentSelectionIntent);
            chooserIntent.putExtra(Intent.EXTRA_TITLE, "Image Chooser");
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, intentArray);

            startActivityForResult(chooserIntent, INPUT_FILE_REQUEST_CODE);

            return true;

        }

        // openFileChooser for Android 3.0+
        public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {

            mUploadMessage = uploadMsg;
            // Create AndroidExampleFolder at sdcard
            // Create AndroidExampleFolder at sdcard

            File imageStorageDir = new File(
                    Environment.getExternalStoragePublicDirectory(
                            Environment.DIRECTORY_PICTURES)
                    , "AndroidExampleFolder");

            if (!imageStorageDir.exists()) {
                // Create AndroidExampleFolder at sdcard
                imageStorageDir.mkdirs();
            }

            // Create camera captured image file path and name
            File file = new File(
                    imageStorageDir + File.separator + "IMG_"
                            + String.valueOf(System.currentTimeMillis())
                            + ".jpg");

            Log.d("File", "File: " + file);

            mCapturedImageURI = Uri.fromFile(file);

            // Camera capture image intent
            final Intent captureIntent = new Intent(
                    android.provider.MediaStore.ACTION_IMAGE_CAPTURE);

            captureIntent.putExtra(MediaStore.EXTRA_OUTPUT, mCapturedImageURI);

            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");

            // Create file chooser intent
            Intent chooserIntent = Intent.createChooser(i, "Image Chooser");

            // Set camera intent to file chooser
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS
                    , new Parcelable[] { captureIntent });

            // On select image call onActivityResult method of activity
            startActivityForResult(chooserIntent, FILECHOOSER_RESULTCODE);


        }

        //openFileChooser for Android < 3.0
        public void openFileChooser(ValueCallback<Uri> uploadMsg) {
            openFileChooser(uploadMsg, "");
        }

        //openFileChooser for other Android versions
        public void openFileChooser(ValueCallback<Uri> uploadMsg,
                                    String acceptType,
                                    String capture) {
            openFileChooser(uploadMsg, acceptType);
        }




        public void onProgressChanged(WebView view, int progress) {

            if(progress==100){
                jsInterface.hideProgressDialog();
            }

        }


        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            AlertDialog.Builder alertBldr = new AlertDialog.Builder(HomeActivity.this);
            alertBldr.setMessage(message);
            alertBldr.setTitle("");
            alertBldr.show();
            result.confirm();
            return true;
        }

        @Override
        public boolean onJsConfirm(WebView view, String url, String message, final JsResult result) {
            new AlertDialog.Builder(HomeActivity.this)
                    .setTitle("")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok,
                            new DialogInterface.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                    result.confirm();
                                }
                            }).setNegativeButton(android.R.string.cancel,
                    new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            result.cancel();
                        }
                    }).create().show();
            return true;
        }





        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
            callback.invoke(origin, true, false);
        }


    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
      /* if(gpsLocationReceiver != null)
            unregisterReceiver(gpsLocationReceiver);*/

    }

    @Override
    public void onBackPressed() {

        if (webview.canGoBack()) {
            webview.goBack();
        } else {
            //overriding back button


                AlertDialog.Builder backAlertDialog = new AlertDialog.Builder(HomeActivity.this);

                backAlertDialog.setTitle("Exit Alert");

                backAlertDialog.setMessage("Are you sure want to exit ?");

                backAlertDialog.setPositiveButton("NO",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {

                                //Cancel alert dialog box .
                                dialog.cancel();
                            }
                        });

                backAlertDialog.setNegativeButton("YES",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                //Exit from activity.
                                finish();
                            }
                        });

                // create alert dialog
                AlertDialog alertDialog = backAlertDialog.create();

                // show it
                alertDialog.show();


            }


    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webview.saveState(outState);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        webview.restoreState(savedInstanceState);
    }

    public boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getApplicationContext()
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager
                .getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    private void showNetworkAlert() {

        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        // set title
        alertDialogBuilder.setTitle("Network not available");
        alertDialogBuilder.setMessage("Click Ok to exit!").setCancelable(false)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        HomeActivity.this.finish();
                    }
                });

        // create alert dialog
        AlertDialog alertDialog = alertDialogBuilder.create();

        // show it
        alertDialog.show();

    }


    private class MyWebViewClient extends WebViewClient {

        // when finish loading page
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            view.clearCache(true);
           // jsInterface.hideProgressDialog();
            view.clearHistory();
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            view.setInitialScale(100);
            jsInterface.showProgressDialog();
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Log.i("UrlINfo","333"+url);

            if (!isNetworkAvailable()) {
                showNetworkAlert();
                return true;
            } else {


                if(url.contains(Constants.EPF_URL)) {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.contains(Constants.COURSERA))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.contains(Constants.EDX))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.equalsIgnoreCase(Constants.ONLINE))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.contains(Constants.OPENSTUDY))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.contains(Constants.THECOMPLETE))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }else if(url.contains(Constants.ANNEXURES))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if(url.equalsIgnoreCase(Constants.ANNEXUREA))
                {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                }
                else if (url.startsWith(Constants.TEL_TYPE)){
                    try {
                        HomeActivity.this.startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse(url)));
                        return true;
                    } catch (ActivityNotFoundException e) {
                        return true;
                    }
                }else if (url.startsWith(Constants.MAIL_TYPE)) {
                    MailTo mt = MailTo.parse(url);
                    String body = "";
                    Intent mail = new Intent(Intent.ACTION_SEND);
                    mail.setType("application/octet-stream");
                    mail.putExtra(Intent.EXTRA_EMAIL, new String[]{mt.getTo()});
                    mail.putExtra(Intent.EXTRA_SUBJECT, "");
                    mail.putExtra(Intent.EXTRA_TEXT, body);

                    startActivity(mail);
                    return true;
                }else {
                    view.loadUrl(url);
                    Log.e("UrlInfo","333"+url);
                }
                return true;
            }
        }

    }

    public class NetworkChangeReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(final Context context, final Intent intent) {

            isNetworkAvailable(context);

        }

        private boolean isNetworkAvailable(Context context) {
            ConnectivityManager connectivity = (ConnectivityManager) context
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            if (connectivity != null) {
                NetworkInfo[] info = connectivity.getAllNetworkInfo();
                if (info != null) {
                    for (int i = 0; i < info.length; i++) {
                        if (info[i].getState() == NetworkInfo.State.CONNECTED) {
                            if (!isConnected) {
                                isConnected = true;
                            }
                            return true;
                        }
                    }
                }
            }
            Toast.makeText(getApplicationContext(),
                    "You are not connected to Internet!", Toast.LENGTH_LONG)
                    .show();
            isConnected = false;
            return false;
        }

    }


    public  class JavaScriptInterface {
        Activity activity;

        JavaScriptInterface(Activity activiy) {
            this.activity = activiy;
        }

        @JavascriptInterface
        public boolean isNetworkAvailable() {
            ConnectivityManager connectivityManager = (ConnectivityManager) getApplicationContext()
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo activeNetworkInfo = connectivityManager
                    .getActiveNetworkInfo();
            return activeNetworkInfo != null && activeNetworkInfo.isConnected();
        }

        @JavascriptInterface
        public void closeApp() {
            finish();
        }

        @JavascriptInterface
        public void showMSGDialog(String title,String msg){
            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(HomeActivity.this);

            // set title
            alertDialogBuilder.setTitle(title);
            alertDialogBuilder.setMessage(msg).setCancelable(false)
                    .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int id) {
                            dialog.dismiss();
                        }
                    });

            // create alert dialog
            AlertDialog alertDialog = alertDialogBuilder.create();

            // show it
            alertDialog.show();

        }




        @JavascriptInterface
        public void showProgressDialog(){

            HomeActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.show();
                }
            });
        }

        @JavascriptInterface
        public String getAndroidDeviceId() {

            return UtilFunction.getAndroidDeviceId(getApplicationContext());

        }

        @JavascriptInterface
        public void hideProgressDialog(){
            HomeActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.hide();

                }
            });

        }
        @JavascriptInterface
        public boolean saveDeviceRegId(String deviceRegId)
        {
            System.out.println(" in saveDeviceRegId:::::::::::::::"+deviceRegId);
            if(deviceRegId!=null&&deviceRegId.length()>0){
                UtilFunction.addStringAppData(getApplicationContext(), Constants.DEVICE_KEY,deviceRegId);
                return true;
            }else{
                return false;
            }

        }

        @JavascriptInterface
        public String getDeviceRegId()
        {
            String result=UtilFunction.getStringAppData(getApplicationContext(),Constants.DEVICE_KEY);
            Log.i("DeviceRedId","333"+result);
            if(result!=null&&result.length()>0){
              return  result;
            }
            return "";
        }

        @JavascriptInterface
        public String getGcmRegId()
        {
            SharedPreferences pref = getApplicationContext().getSharedPreferences(Config.SHARED_PREF, 0);
            getFcmid = pref.getString("regId", null);
            Log.i("FcmId","333"+getFcmid);
            return  getFcmid;

        }
        @JavascriptInterface
        public String getDeviceDetails()
        {
            String os=System.getProperty("os.version");        // OS version
            String apiLevel=android.os.Build.VERSION.SDK;      // API Level
            String device=android.os.Build.DEVICE      ;     // Device
            String model=android.os.Build.MODEL      ;      // Model
            String product=android.os.Build.PRODUCT ;         // Product
            return os+", "+apiLevel+", "+device+", "+model+", "+product;
        }

        @JavascriptInterface
        public boolean isLocationEnabled(){
            return checkForLocationSetting();
        }

        @JavascriptInterface
        public boolean showLocationSetting(){
            return checkForLocationSetting();
        }


        @JavascriptInterface
        public void updateLocation(){
            callUpdateLocation();
        }

        @JavascriptInterface
        public String getLocation(){
            System.out.println("Location: "+Constants.location);
        if(Constants.location!=null){
            return Constants.location.getLatitude()+"#"+ Constants.location.getLongitude();
        }else if(LOCATION_STATUS){
           return "-1#-1";
        }else{
            return null;
        }

        }
        @JavascriptInterface
        public void setLocationOn()
        {
            /*initGoogleAPIClient();
            checkPermissions();*/
            EnableGPSIfPossible();

        }
        @JavascriptInterface
        public void callNotificationActivity()
        {
            Intent intent=new Intent(context,NotificationActivity.class);
            startActivity(intent);
        }
        @JavascriptInterface
        public int getNotificationCount()
        {
            return AppController.getInstance().getCount();

        }





    }

    @RequiresApi(api = VERSION_CODES.M)
    private void checkForPermission(){
        List<String> permissionsNeeded = new ArrayList<String>();
        final List<String> permissionsList = new ArrayList<String>();

        if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION))
            permissionsNeeded.add("Location");

        if (!addPermission(permissionsList, Manifest.permission.CALL_PHONE))
            permissionsNeeded.add("Call Phone");

        if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION))
            permissionsNeeded.add("Location");

        if (!addPermission(permissionsList, Manifest.permission.CAMERA))
            permissionsNeeded.add("CAMERA");

        if (!addPermission(permissionsList, Manifest.permission.READ_EXTERNAL_STORAGE))
            permissionsNeeded.add("Read Storage");

        if (!addPermission(permissionsList, Manifest.permission.WRITE_EXTERNAL_STORAGE))
            permissionsNeeded.add("Write Storage");


        if (permissionsList.size() > 0) {
            if (permissionsNeeded.size() > 0) {
                // Need Rationale
                String message = "You need to grant access to " + permissionsNeeded.get(0);
                for (int i = 1; i < permissionsNeeded.size(); i++)

                message = message + ", " + permissionsNeeded.get(i);
                showMessageOKCancel(message,
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                                        REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                            }
                        });
                return;
            }
            requestPermissions(permissionsList.toArray(new String[permissionsList.size()]),
                    REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            return;
        }

    }

    @RequiresApi(api = VERSION_CODES.M)
    private boolean addPermission(List<String> permissionsList, String permission) {
        if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
            permissionsList.add(permission);
            // Check for Rationale Option
            if (!shouldShowRequestPermissionRationale(permission))
                return false;
        }
        return true;
    }


    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new AlertDialog.Builder(HomeActivity.this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
    }

    private void callUpdateLocation() {
        Intent intent = new Intent(HomeActivity.this, UpdateLocationActivity.class);
        startActivityForResult(intent, 101);
    }



    private boolean checkForLocationSetting(){
        LocationManager locationManager = (LocationManager) HomeActivity.this.getSystemService(Context.LOCATION_SERVICE);

        return (locationManager
                .isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager
                .isProviderEnabled(LocationManager.NETWORK_PROVIDER));
    }



    private boolean showAlertForLocationSettings(){

        boolean result=false;
        final AlertDialog.Builder builder = new AlertDialog.Builder(HomeActivity.this);
        builder.setCancelable(false);

        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch (which){
                    case DialogInterface.BUTTON_POSITIVE:
                        dialog.dismiss();
                        startActivityForResult(new Intent(android.provider.Settings.ACTION_SETTINGS), 0);
                        break;
                    case DialogInterface.BUTTON_NEGATIVE:
                        LOCATION_STATUS=true;
                        dialog.dismiss();
                        break;
                }

            }
        };

        builder.setMessage("Location is not enabled!").setPositiveButton("Enable Location", dialogClickListener)
               .show();

       return result;

    }
    protected void onResume() {
        super.onResume();
        // register GCM registration complete receiver
        LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                new IntentFilter(Config.REGISTRATION_COMPLETE));
        // register new push message receiver
        // by doing this, the activity will be notified each time a new message arrives
        LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                new IntentFilter(Config.PUSH_NOTIFICATION));
        // clear the notification area when the app is opened
        NotificationUtils.clearNotifications(getApplicationContext());
        //registerReceiver(gpsLocationReceiver, new IntentFilter(BROADCAST_ACTION));
        controller.setScreenName(tracker,getResources().getString(R.string.home_activity));




    }

    @Override
    protected void onPause() {
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mRegistrationBroadcastReceiver);
        super.onPause();
            }

    public  boolean EnableGPSIfPossible()
    {
        boolean isGpsOn=false;
        final LocationManager manager = (LocationManager) getSystemService( Context.LOCATION_SERVICE );
        if ( !manager.isProviderEnabled( LocationManager.GPS_PROVIDER ) ) {
            buildAlertMessageNoGps();
            isGpsOn=true;
        }
        return isGpsOn;
    }

    private  void buildAlertMessageNoGps() {
        if(alert == null) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(HomeActivity.this);
        builder.setMessage("Device location off!! \nSwitch on your location \nto mark your Attendance")
                .setCancelable(false)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    public void onClick(@SuppressWarnings("unused") final DialogInterface dialog, @SuppressWarnings("unused") final int id) {
                        startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
                        isLocationon=true;
                    }
                });
               /* .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog, @SuppressWarnings("unused") final int id) {
                        dialog.cancel();
                        finish();


                    }
                });*/

            alert = builder.create();
        }
        if(alert != null && !alert.isShowing()) {
            alert.show();
        }

    }
}
