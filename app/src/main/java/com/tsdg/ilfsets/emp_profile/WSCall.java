package com.tsdg.ilfsets.emp_profile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by prashant.jha on 14-10-2015.
 */
public class WSCall {

    private final static String USER_AGENT = "Mozilla/5.0";

    public static String registerUser(String pin)
    {
String result="";

        try{
            URL webURL=new URL(Constants.REGISTER_URL+pin);
            HttpURLConnection conn=(HttpURLConnection)webURL.openConnection();
            conn.setRequestMethod("GET");
            //add request header
            conn.setRequestProperty("User-Agent", USER_AGENT);

            int responseCode = conn.getResponseCode();
            System.out.println("\nSending 'GET' request to URL : " + webURL);
            System.out.println("Response Code : " + responseCode);
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));
            StringBuilder sb=new StringBuilder();
            String tmp="";
            while((tmp=br.readLine())!=null){
                System.out.println("result::::: "+tmp);
                sb.append(tmp);
            }
            result=new String(sb);
            System.out.println("WS call output : "+result);


        }catch(Exception ex){
            ex.printStackTrace();
        }
return result;
    }


   /* public static void main(String[] args) {

        try {
            String input = "123456";
            URL url = new URL("http://103.28.141.110/skillsreport/rest/ServiceEndPoint/registerDevice/" + input);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("GET");

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));
            String output;
            System.out.println("Output from Server.... \n");
            StringBuilder sb=new StringBuilder();
            while ((output = br.readLine()) != null) {
                sb.append(output);

            }
            System.out.println("Result:::"+sb);
            conn.disconnect();

        } catch (MalformedURLException e) {

            e.printStackTrace();

        } catch (IOException e) {

            e.printStackTrace();

        }

    }*/
}
