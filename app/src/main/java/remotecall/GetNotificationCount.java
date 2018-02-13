package remotecall;

import android.app.ProgressDialog;
import android.content.Context;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;

import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.tsdg.ilfsets.emp_profile.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import app.AppController;
import urls.RemoteUrls;

import static app.AppController.TAG;
import static com.android.volley.Response.*;

/**
 * Created by Deepak Borade on 23/01/2018.
 */

public class GetNotificationCount {

    Context context;
    ProgressDialog pd;
    String NotificationListUrl;

    public GetNotificationCount(Context context)
    {
        this.context=context;
    }

    public synchronized void showNotification(String deviceid, final getNotificationInterface notificationcallback)
    {
        NotificationListUrl=RemoteUrls.TEST_BASE_URL+RemoteUrls.GETTOKEN_METHOD+"?"+"userDeviceRegId="+deviceid;
        pd=new ProgressDialog(context);
        pd.setMessage(context.getString(R.string.progress_dialog_text));
        pd.setCanceledOnTouchOutside(false);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET, NotificationListUrl,null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        pd.dismiss();
                        notificationcallback.onSuccess(response.toString());
                        //...
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                        notificationcallback.onError(error.toString());
                        //...
                    }
                }){
            @Override
            protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
                String tocken=response.headers.get("responsetoken");
                notificationcallback.onGetTocken(tocken);
                return super.parseNetworkResponse(response);

            }
        };

        AppController.getInstance().addToRequestQueue(request);
    }


     public interface getNotificationInterface
     {
         public void onSuccess(String success);
         public void onError(String error);
         public void onGetTocken(String tocken);
     }
}
