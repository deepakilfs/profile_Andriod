package app;


import android.app.Application;
import android.text.TextUtils;
 
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.ImageLoader;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.StandardExceptionParser;
import com.google.android.gms.analytics.Tracker;
import com.tsdg.ilfsets.emp_profile.R;

import utils.LruBitmapCache;

public class AppController extends Application {
 
    public static final String TAG = AppController.class
            .getSimpleName();
 
    private RequestQueue mRequestQueue;
    private ImageLoader mImageLoader;
 
    private static AppController mInstance;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    private int count;
    private static GoogleAnalytics googleAnalytics;
    private static Tracker googleTracker;

    @Override
    public void onCreate() {
        super.onCreate();
        mInstance = this;

        googleAnalytics=GoogleAnalytics.getInstance(this);



    }
 
    public static synchronized AppController getInstance() {
        return mInstance;
    }
 
    public RequestQueue getRequestQueue() {
        if (mRequestQueue == null) {
            mRequestQueue = Volley.newRequestQueue(getApplicationContext());
        }
 
        return mRequestQueue;
    }
 
    public ImageLoader getImageLoader() {
        getRequestQueue();
        if (mImageLoader == null) {
            mImageLoader = new ImageLoader(this.mRequestQueue,
                    new LruBitmapCache());
        }
        return this.mImageLoader;
    }
 
    public <T> void addToRequestQueue(Request<T> req, String tag) {
        // set the default tag if tag is empty
        req.setTag(TextUtils.isEmpty(tag) ? TAG : tag);
        getRequestQueue().add(req);
    }
 
    public <T> void addToRequestQueue(Request<T> req) {
        req.setTag(TAG);
        getRequestQueue().add(req);
    }
 
    public void cancelPendingRequests(Object tag) {
        if (mRequestQueue != null) {
            mRequestQueue.cancelAll(tag);
        }
    }
    public synchronized Tracker getGoogleAnalyticsTracker() {
        AnalyticsTrackers analyticsTrackers = AnalyticsTrackers.getInstance();
        return analyticsTrackers.get(AnalyticsTrackers.Target.APP);
    }

    /***
     * Tracking screen view
     *
     * @param screenName screen name to be displayed on GA dashboard
     */
    public void trackScreenView(String screenName){
        Tracker t = getGoogleAnalyticsTracker();
        // Set screen name.
        t.setScreenName(screenName);
        // Send a screen view.
        t.send(new HitBuilders.ScreenViewBuilder().build());
        GoogleAnalytics.getInstance(this).dispatchLocalHits();
    }

    /***
     * Tracking exception
     *
     * @param e exception to be tracked
     */
    public void trackException(Exception e) {
        if (e != null) {
            Tracker t = getGoogleAnalyticsTracker();

            t.send(new HitBuilders.ExceptionBuilder()
                    .setDescription(
                            new StandardExceptionParser(this, null)
                                    .getDescription(Thread.currentThread().getName(), e))
                    .setFatal(false)
                    .build()
            );
        }
    }

    synchronized public Tracker getDefaultTracker() {
        // To enable debug logging use: adb shell setprop log.tag.GAv4 DEBUG
        if (googleTracker == null) {
            //GoogleAnalytics analytics = GoogleAnalytics.getInstance(this);
            googleTracker = googleAnalytics.newTracker(R.xml.global_tracker);
            googleTracker.enableAutoActivityTracking(true);
            googleTracker.enableExceptionReporting(true);

        }
        return googleTracker;
    }

    public void setScreenName(Tracker tracker,String name)
    {
        tracker.setScreenName(name);
        tracker.send(new HitBuilders.ScreenViewBuilder().build());
    }

    public void sendeventToAnalytics(Tracker tracker,String action,String category,String label)
    {
        tracker.send(new HitBuilders.EventBuilder().setAction(action).setCategory(category).setLabel(label).build());

    }
}