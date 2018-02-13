package app;

import android.content.Context;

import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.HitBuilders;
import com.google.android.gms.analytics.Tracker;
import com.tsdg.ilfsets.emp_profile.R;

/**
 * Created by Deepak Borade on 09/02/2018.
 */

public class TrackerHelper {

    Tracker tracker=null;
    Context mcontext;


    public TrackerHelper(Context context)
    {
        mcontext=context;

        try
        {
            if(tracker==null&context!=null)
            {
                tracker= GoogleAnalytics.getInstance(mcontext).newTracker(R.string.analytics_id);
                GoogleAnalytics.getInstance(mcontext).dispatchLocalHits();
                tracker.enableAutoActivityTracking(true);
                tracker.enableExceptionReporting(true);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

    }

    public void setScreenName(String name)
    {
        tracker.setScreenName(name);
        tracker.send(new HitBuilders.ScreenViewBuilder().build());
    }

    public void sendeventToAnalytics(String action,String category,String label)
    {
        tracker.send(new HitBuilders.EventBuilder().setAction(action).setCategory(category).setLabel(label).build());


    }


}
