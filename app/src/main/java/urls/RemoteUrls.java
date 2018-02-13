package urls;

/**
 * Created by Deepak Borade on 23/01/2018.
 */

public class RemoteUrls {

    // test url

    public static final String TEST_BASE_URL="http://beta.test.ict.esg.ilfseducation.com/EmpEngage_API/api/EmpEngage/";
    // live url
    //public static final String TEST_BASE_URL="http://beta.test.ict.esg.ilfseducation.com/Profile_API/api/EmpEngage/";
    // method name
    public static final String GETNOTIFICATION_METHOD="GetRecentNotification";
    public static final String LOGIN_METHOD="ValidateMLogin";
    public static final String GETTOKEN_METHOD="GetResponseToken";

    // notification json data naming convention
    public static final String NOTIFICATION_JSON_ARRAY="tbl_RecentNotification";
    public static final String NOTIFICATION_ID="NotificationId";
    public static final String NOTIFICATION_TITLE="NotificationTitle";
    public static final String NOTIFICATION_TOPIC="NotificationTopic";
    public static final String NOTIFICATION_DESC="NotificationDesc";
    public static final String NOTIFICATION_TYPE="NotificationType";
    public static final String NOTIFICATION_CATEGORY="NotificationCategory";
    public static final String NOTIFICATION_CREATED_DATE="CreatedDate";
    public static final String NOTIFICATION_DATE="NotificationDate";
    public static final String NOTIFICATION_TIMEPART="TimePart";

}
