package localstorage;

import android.content.Context;
import android.content.SharedPreferences;

import com.tsdg.ilfsets.emp_profile.R;

/**
 * Created by Deepak Borade on 23/01/2018.
 */

public class LocalSharedPreference {

    Context context;
    //SharedPreferences tokenpref;
    public LocalSharedPreference(Context context)
    {
        this.context=context;
    }

    public synchronized  void saveToken(String token)
    {
        SharedPreferences tokenpref=context.getSharedPreferences(context.getString(R.string.unique_shared_pref),Context.MODE_PRIVATE);
        SharedPreferences.Editor edit=tokenpref.edit();
        edit.putString(context.getString(R.string.token),token);
        edit.commit();
    }
    public String getTocken()
    {
         String tocken;
         SharedPreferences tokenpref=context.getSharedPreferences(context.getString(R.string.unique_shared_pref),Context.MODE_PRIVATE);
         tocken=tokenpref.getString(context.getString(R.string.token),null);
         return tocken;
    }
}
