package com.tsdg.ilfsets.emp_profile;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class UpdateLocationActivity extends Activity {


    boolean netFlag = false;
    ProgressDialog progressBar;
    protected LocationManager locationManager;
    protected LocationListener locationListener;
    protected boolean gps_enabled, network_enabled;
    Location location;
    Timer timer1;
    int accuracy = 10000; // best accuracy
    int minAccuracy = 15000; // acceptable accuracy
    @SuppressLint("UseSparseArrays")
    Map<Integer, Location> locations = new HashMap<Integer, Location>();
    int maxAttempt =3;
    long timeOut = 1000 * 60 * 30;
    int counter = 0;
    int locCounter = 0;
    String currentAddress;
    //TextView txtCurLoc;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (locationManager == null)
            locationManager = (LocationManager) this
                    .getSystemService(Context.LOCATION_SERVICE);

    }

    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        progressBar = new ProgressDialog(UpdateLocationActivity.this);
        progressBar.setMessage("updating current location...");
        progressBar.setCancelable(false);
        progressBar.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialogInterface) {
                Constants.IS_CANCELED = true;
                finish();
            }
        });
        progressBar.show();
        configureBastLocation();

    }



    public void goBack(View view) {
        super.finish();
    }

    private void configureBastLocation() {
        try {
            gps_enabled = locationManager
                    .isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
        }

        try {
            network_enabled = locationManager
                    .isProviderEnabled(LocationManager.NETWORK_PROVIDER);

            //System.out.println("Loc Flag ::: " + gps_enabled + " , "
            //+ network_enabled);
            if (gps_enabled)
                locationManager.requestLocationUpdates(
                        LocationManager.GPS_PROVIDER, 0, 0,
                        locationListenerGps);
            if (network_enabled)
                locationManager.requestLocationUpdates(
                        LocationManager.NETWORK_PROVIDER, 0, 0,
                        locationListenerNetwork);

            timer1 = new Timer();
            timer1.schedule(new GetLastLocation(), (10 * 1000), (1000 * 20));

        } catch (Exception ex) {
        }


    }

    class GetLastLocation extends TimerTask {

        @Override
        public void run() {

            try {
                if (locCounter >= 3) {
                    UpdateLocationActivity.this.timer1.cancel();
                    UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            //	txtCurLoc.setText(currentAddress);
                            progressBar.dismiss();
                            Intent intent = new Intent();
                            setResult(RESULT_OK, intent);
                            finish();

                        }
                    });

                    return;
                }

                //System.out.println("Ge location >>>>>>>>>>>>>> ");
                locCounter++;
                Location net_loc = null, gps_loc = null;
                if (gps_enabled)
                    gps_loc = locationManager
                            .getLastKnownLocation(LocationManager.GPS_PROVIDER);
                if (network_enabled)
                    net_loc = locationManager
                            .getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
                if (gps_loc != null && net_loc != null) {
                    if (gps_loc.getTime() > net_loc.getTime())
                        UpdateLocationActivity.this.location = gps_loc;
                    else
                        UpdateLocationActivity.this.location = net_loc;

                    UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {

                            checkForValidLocation();
                        }
                    });
                    return;
                } else if (gps_loc != null) {
                    UpdateLocationActivity.this.location = gps_loc;
                    UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            checkForValidLocation();
                        }
                    });
                    return;
                } else if (net_loc != null) {
                    UpdateLocationActivity.this.location = net_loc;
                    UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            checkForValidLocation();
                        }
                    });
                    return;
                }

                return;

            } catch (SecurityException se) {


            }

        }
    }

    private void checkForValidLocation() {
        //System.out.println("Check for valid location..");
        Date currentTime;
        currentTime = new Date();

        if ((currentTime.getTime() - UpdateLocationActivity.this.location.getTime()) <= timeOut) {
            counter++;

            UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.setMessage("[Attempt-" + counter + "] ["
                            + UpdateLocationActivity.this.location.getLatitude()
                            + " , "
                            + UpdateLocationActivity.this.location.getLongitude()
                            + "] # "
                            + UpdateLocationActivity.this.location.getAccuracy()
                            + " meter");
                }
            });

            if (UpdateLocationActivity.this.location.getAccuracy() <= accuracy) {
                updateLattestLocation();
            } else {
                locations.put(
                        (int) UpdateLocationActivity.this.location.getAccuracy(),
                        UpdateLocationActivity.this.location);
            }
        }

        if (counter >= maxAttempt) {
            UpdateLocationActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    progressBar.dismiss();
                    Intent intent = new Intent();
                    setResult(RESULT_OK, intent);
                    finish();
                }
            });
            timer1.cancel();

            if (locations.size() > 0) {
                int minccr = Collections.min(locations.keySet());
                if (minccr <= minAccuracy) {
                    UpdateLocationActivity.this.location = locations.get(minccr);
                    updateLattestLocation();
                } else {
                    /*
                     * Toast.makeText(this,
					 * "Very low accuracy!, please try latter.",
					 * Toast.LENGTH_LONG).show();
					 */
                }
            } else {
                /*
                 * Toast.makeText(this,
				 * "Unable to find current location!, please try latter.",
				 * Toast.LENGTH_LONG).show();
				 */
            }

        }
    }

    LocationListener locationListenerGps = new LocationListener() {
        public void onLocationChanged(Location location) {
            UpdateLocationActivity.this.location = location;
        }

        public void onProviderDisabled(String provider) {
        }

        public void onProviderEnabled(String provider) {
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {
        }
    };

    LocationListener locationListenerNetwork = new LocationListener() {
        public void onLocationChanged(Location location) {
            UpdateLocationActivity.this.location = location;
        }

        public void onProviderDisabled(String provider) {
        }

        public void onProviderEnabled(String provider) {
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {
        }
    };

    private void updateLattestLocation() {
        FetchAddressTask task = new FetchAddressTask();
        task.execute();
    }

    private class FetchAddressTask extends AsyncTask<String, Void, Void> {


        @Override
        protected Void doInBackground(String... params) {
            try {
                Constants.location = UpdateLocationActivity.this.location;
              /*  String latLong = UpdateLocationActivity.this.location.getLatitude()
                        + "," + UpdateLocationActivity.this.location.getLongitude();*/

               // currentAddress = glfun.fetchAddressByLatLong(latLong);


            } catch (Exception e) {
            }

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
           /* try {
                if (currentAddress == null || currentAddress.trim().length() <= 0) {
                    if (Constants.location != null) {
                      //GlobalFlag.CURRENT_LOC = "Lat: " + UpdateLocationActivity.this.location.getLatitude() + ", Long: " + UpdateLocationActivity.this.location.getLongitude();
                    }
                }
                locationManager.removeUpdates(locationListenerGps);
                locationManager.removeUpdates(locationListenerNetwork);
                progressBar.dismiss();
                Intent intent = new Intent();
                intent.putExtra("curAddr",currentAddress);
                setResult(RESULT_OK, intent);
                finish();
            } catch (Exception se) {

            }*/

            locationManager.removeUpdates(locationListenerGps);
            locationManager.removeUpdates(locationListenerNetwork);
            progressBar.dismiss();
            Intent intent = new Intent();
            intent.putExtra("curAddr",currentAddress);
            setResult(RESULT_OK, intent);
            finish();


        }

    }

}
