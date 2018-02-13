package remotecall;

import android.content.Context;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.tsdg.ilfsets.emp_profile.R;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import app.AppController;
import urls.RemoteUrls;

/**
 * Created by Deepak Borade on 30/01/2018.
 */

public class GetRecentNotification {

    Context context;
    public GetRecentNotification(Context context)
    {
        this.context=context;
    }
    public void getNotificationData(final String header, final NotificationDataInterface notificationDataInterface)
    {
        String url= RemoteUrls.TEST_BASE_URL+RemoteUrls.GETNOTIFICATION_METHOD;
        /*JsonObjectRequest jsonObjectRequest=new JsonObjectRequest(Request.Method.GET, url, null,new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                notificationDataInterface.onSuccess(response.toString());
                Log.i("NotificationData","444"+response.toString());

            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                notificationDataInterface.onFailure(error.toString());

            }
        }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String>map=new HashMap<String, String>();
                map.put(context.getString(R.string.Auth),header);
                return  map;
            }
        };
*/
        StringRequest stringRequest = new StringRequest(Request.Method.GET,url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        notificationDataInterface.onSuccess(response);

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                notificationDataInterface.onFailure(error.toString());

            }

        }){
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String,String>map=new HashMap<>();
                map.put(context.getString(R.string.Auth),header);
                return  map;
            }
        };
        AppController.getInstance().addToRequestQueue(stringRequest);
        //AppController.getInstance().addToRequestQueue(jsonObjectRequest);
    }

    public interface NotificationDataInterface
    {
        public void onSuccess(String success);
        public void onFailure(String error);
    }

}
