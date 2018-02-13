/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//testing
var WEB_BASE_URL = "http://beta.test.ict.esg.ilfseducation.com/EmpEngage_API/api/EmpEngage/";

//var WEB_BASE_TEST_URL = "http://beta.test.ict.esg.ilfseducation.com/EmpEngage_API/api/EmpEngage/";

//live
//var WEB_BASE_URL = "http://beta.test.ict.esg.ilfseducation.com/Profile_API/api/EmpEngage/";

//var WEB_BASE_LD_URL ="http://localhost/API/api/nodes";
//var WEB_BASE_LD_URL ="http://assessments.stampindia.in/vlelinqapi/api/nodes";

var WEB_BASE_LD_POSTREPSONSE_URL ="http://assessments.stampindia.in/vlelinqapi/api/nodes";
//var WEB_BASE_LD_URL ="http://10.61.9.117:80/VLEAPI/api/nodes";

//local URL
//var WEB_OPTS_BASE_URL = "http://10.61.9.113:8084/OPTS_WS/rest/OptsEndpoint/";

//server URL
var WEB_OPTS_BASE_URL = "http://qms.opts.ilfsets.com:8090/OPTS_WS/rest/OptsEndpoint/";
var WEB_METHOD_REGISTER = "CheckRegistration";
var WEB_METHOD_VALIDATE_OPT = "CheckValidOTP";
var WEB_METHOD_RESEND_OTP = "ResendOTP";
var WEB_METHOD_SET_PIN = "SetMpin";
var WEB_METHOD_LOGIN = "ValidateMLogin";
// Attendance Status
var WEB_METHOD_GET_ATTENDANCE_STATUS = "GetUserAttendanceStatus";
var WEB_METHOD_SUBMIT_ATTENDANCE = "SubmitUserAttendance";
var WEB_METHOD_ATTENDANCE_HISTORY = "GetUserMonthlyAttendance";




var WEB_METHOD_GET_USER_DETAILS = "GetUserFullDetails";
var WEB_METHOD_GET_USER_ADDRESS_BOOK_DETAILS = "GetUserAddresbookDetails";


var WEB_METHOD_POST_PROFILE_PIC = "UploadProfileImage";
var WEB_METHOD_POST_PROFILE_UPDATE = "UpdateUserProfile";
var WEB_METHOD_POST_PROFILE_ADDRESS_UPDATE = "UpdateUserAddress";


var WEB_METHOD_GET_ADDRESSBOOK = "GetAddressBook";
var WEB_METHOD_GET_MASTER_GET_MASTER = "GetCommonList";
//for reports
var WEB_METHOD_GET_CATEGORYTODAY_ATTENDANCE_COUNT = "GetCategoryTodayAttendanceCount";

var WEB_METHOD_GET_GET_IN_TIME_STATISTICS = "GetInTimeStatistics";

var WEB_METHOD_GET_GET_EMPLOYEE_REPORT_COUNT ="GetEmployeeReportCount";
//var WEB_METHOD_GET_GET_EMPLOYEE_DESIGNATION_REPORT_COUNT ="GetEmployeeReportCount";
var WEB_METHOD_GET_GET_USER_COMPANYLIST = "GetuserCompanyList";




//for OPTS WS methods
var WEB_OPTS_METHOD_TIMESHEET_HISTORY = "fetchActivityLog";
var WEB_OPTS_METHOD_FETCH_PROJECTS = "fetchProject";
var WEB_OPTS_METHOD_ADD_ACTIVITY = "addActivity";
var WEB_METHOD_GET_FETCH_PROJECT_MANAGER_REPORT = "fetchProjectManagerReport"

//for Birthday wishes
var WEB_METHOD_GET_BIRTHDAY_LIST ="GetBirthDayList";
var WEB_METHOD_GET_BIRTHDAY_COMMENTS ="GetBirthDayCommnets";
var WEB_METHOD_GET_BIRTHDAY_WISHES_INSERT ="InsertBirthDayWishes";

//for Festival Wish Methods
var WEB_METHOD_GET_FESTIVAL_DETAILS = "GetFestivalDetails";



// Error messages for the 

var SUCCESS_TITLE = 'Success!';
var INVALID_INPUT_TITLE = 'Invalid Input!';
var INVALID_INPUT_MSG = 'please enter valid data';
var INVALID_INPUT_REMARKS_MSG = 'please enter your Remarks';

var INVALID_REQUEST_TITLE = 'Invalid Request!';
var INVALID_REQUEST_MSG = 'Invalid Data';
var SERVER_ERROR_TILTLE = 'Server Error!';

var SERVER_ERROR_TILTLE_MENU = 'PROFile';

var SERVER_ERROR_TILTLE_MENU_TITLE = 'Not Enabled';


var DEVICE_ERROR_TILTLE = 'Internal Device Error!';
var DEVICE_ERROR_MSG = 'Please contact App administrator';
var SERVER_ERROR_MSG = 'We can not process your request now, pls try later';
var SESSION_TIMED_TILTLE = 'Session Expired!';
var SESSION_TIMED_TILTLE_MSG = 'Please login again';
var VALIDATION_INPUT_REQUIRED_TITLE = 'Input Required!';
var VALIDATION_INPUT_REQUIRED_MSG = 'please fill all the required fields';
var VALIDATION_INPUT_REQUIRED_BIRTHDAY_MSG = 'please enter your comments';
var VALIDATION_INPUT_REQUIRED_TITLE = 'Invalid Data!';
var VALIDATION_INPUT_REQUIRED_MSG = 'please enter a valid data!';
var VALIDATION_INPUT_RMARKS_REQUIRED_MSG = 'please enter your Remarks';


var MSG_CONFIRM_LOGOUT = "Are you sure you want to logout ?";
var MSG_CONFIRM_FORGOT_PASSWORD = "You will receive an OTP to reset your MPIN!";
var MSG_ATTENDANCE_IN_SUBMIT_CONFIRM = "Have a Nice Day !!";
var MSG_ATTENDANCE_OUT_SUBMIT_CONFIRM = "Have a Pleasant Day !!";

var MSG_BIRTHDAY_UNSCBSCRIBE_TITLE ="Sucessfully unsubscribe your birthday wish";

var MSG_BIRTHDAY_SCBSCRIBE_TITLE ="Sucessfully subscribe your birthday wish";


var MSG_UPDATE_SUCCESS ="Data updated successfully";

var MSG_SITE_VERSION_CONTROL = "Version 2.0.3";


var IsActiveMenu_disable = localStorage.PROFILE_ACTIVEMENU;
var EmpType = localStorage.PROFILE_EMPTYPE


//var IsActiveMenu_disable = 0;

//https://www.script-tutorials.com/image-crop-plugin-using-jcrop-jquery/

$(document).ready(function () {

    init_footer();
    //skipp menu
    if (window.location.href.indexOf("login.html") < 0 &&
            window.location.href.indexOf("registration.html") < 0 &&
            window.location.href.indexOf("vertification.html") < 0 &&
            window.location.href.indexOf("create_mpin.html") < 0) {
        init_left_menu();
		
    }

    $.ajaxSetup({
        headers: {'userDeviceRegId': getUserDeviceRegId(), 'Authorization': localStorage.SESSION_TOKEN, 'userName': localStorage.PROFILE_EMAIL}
    });

    $(document).ajaxStart(function () {
        try {
            window.JSInterface.showProgressDialog();
        } catch (err) {

        }


    });

    $(document).ajaxStop(function () {

        try {
            window.JSInterface.hideProgressDialog();
        } catch (err) {

        }
    });

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        //console.log('Error! ' + jqxhr.status);
        if (jqxhr.status === 401) { //session timed out
            showMsgDialog(SESSION_TIMED_TILTLE, SESSION_TIMED_TILTLE_MSG);
            setTimeout(function () {
                window.location = "login.html";
            }, 3000);
        } else {
            //  showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    });


    $("input,select,textarea").bind("focus", function () {
        $(".footer").hide();
    });


    $(".txt_auto_tab input").on("keyup", function () {
        var tmp_val = $(this).val().trim();
        if (tmp_val.length > 0) {
            if (tmp_val.length === 1) {
                $(this).next().focus();
            } else {
                $(this).val('');
            }

        } else {
            $(this).prev().focus();
        }

    });


    $("#div_main_task_block").on('keyup', '.hoursInput', function (e) {
        var val = $(this).val();
        val = parseInt(val);

        if (val > 16) {
            $(this).val('');
            alert('Minutes entered should not be greater than 16');
            //$(this).focus();
        }

    });


    $("#div_main_task_block").on('keyup', '.minutesInput', function (e) {
        var val = $(this).val();
        val = parseInt(val);
        if (val > 59) {
            $(this).val('');
            alert('Minutes entered should be less than 60');
            // $(this).focus();
        }

    });

    $(".onlyTextInput").bind('keyup', function (e) {
        var val = $(this).val();
        if (val.match(/[^a-zA-Z _]/g)) {
            $(this).val(val.replace(/[^a-zA-Z _]/g, ''));
        }
    });

    $('.onlyNumericInput').on('keydown', function (e) {
        -1 !== $.inArray(e.keyCode, [8, 9, 27, 13, 110, 190]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault();
    });

    $('.onlyMobileNo').on('keypress', function (e) {

        if ($(this).val().length > 9) {

            return false;
        }

    });


    $('.index_menu').change(function () {
        $(".index_menu option:selected").each(function () {
            window.location.href = $(this).val();
            var aTag = $(this).val();
            var atagtop = $(aTag).offset().top;
            var wrapper_top = $('.wrapper').offset().top;
            // alert(atagtop + wrapper_top);
            $('html,body').scrollTop(atagtop + wrapper_top);

        });
    });


	//todayBirthday();
	

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function getUserDeviceRegId() {
    //var userRegId = 23;
    var encUserRegId = '';


    try {
        encUserRegId = window.JSInterface.getDeviceRegId();


    } catch (err) {
        encUserRegId = 6;
    }

    // console.log("encUserRegId:::" + encUserRegId);


    return encUserRegId;
}

function getFcmid()
{
     var fcmid='';
  try
      {
           fcmid=window.JSInterface.getGcmRegId();
            //showMsgDialog(INVALID_INPUT_TITLE,"FCMID"+fcmid)
       }
    catch(err)
    {
    }

      return fcmid;

}
function getHardwareId() {
    var hdid;
    try {
        var hdid = window.JSInterface.getAndroidDeviceId();
    } catch (err) {
        hdid = 'AOQP676767A';
    }
    return hdid;
}
function saveUserDeviceRegId(deviceRegId) {
    //call android API         
    var result = true;
    try {
        result = window.JSInterface.saveDeviceRegId(deviceRegId);
    } catch (err) {
        result = true;
    }
    return result;

}

function getDeviceInfo() {
    try {
        return window.JSInterface.getDeviceDetails();
    } catch (err) {
        return "Android Testing";
    }

}

function showLocationSetting() {
    try {
        window.JSInterface.showLocationSetting();
    } catch (err) {
        return null;
    }

}
function reuestForLocationUpdate() {
    try {
        window.JSInterface.updateLocation();
    } catch (err) {
        return null;
    }

}

function isLocationEnabled() {
    try {
        return window.JSInterface.isLocationEnabled();
    } catch (err) {
        return null;
    }

}

function Notification()
{
     try
     {
       var count=window.JSInterface.getNotificationCount();
       console.log(count);
       //localStorage.NOTIFICATION = window.JSInterface.getNotificationCount();
       $('#linkbellcount').html(count);
     }
     catch(err)
     {
        return null;
     }

}

function showToast()
{
//var iflag =true;
	try{
	  return window.JSInterface.setLocationOn();

	}
	catch(err)
	{
		return null;
	}
}



function fetchLocation() {
    try {
        var location = window.JSInterface.getLocation();
        console.log('location: ' + location);
        if (location !== null && location.length > 0) {
            return location;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }

}

function showMsgDialog(title, msg) {
    try {
        window.JSInterface.showMSGDialog(title, msg);
    } catch (err) {
        alert(msg);
    }


}

function init_footer() {
    var html = ' <div class="row">'
            + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> <img src="images/iets_logo.png" alt="IETS"  class="img-responsive" /> </div>'
            + '</div>'
    $(".footer").html(html);
}


function requestForNewOTP(successCallback, errorCallback) {

    var form_data = '';
    form_data = "userDeviceRegId=" + getUserDeviceRegId();

    $.ajax({
        url: WEB_BASE_URL + WEB_METHOD_RESEND_OTP,
        type: "POST",
        dataType: "json",
        data: form_data
    }).done(function (data) {

        processResponseForReSendOTP(data);

        if (successCallback !== null) {
            setTimeout(function () {

                if (successCallback && typeof successCallback === "function") {
                    successCallback();
                }

            }, 3000);
        }

    }).error(function (err) {
        showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        if (errorCallback !== null) {
            setTimeout(function () {
                if (errorCallback && typeof errorCallback === "function") {
                    errorCallback();
                }
            }, 1000);

        }

    });

}


function processResponseForReSendOTP(data) {
    var jsonObj = $.parseJSON(data);

    if (jsonObj[0].message === 'Invalid')
    {
        showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    } else if (jsonObj[0].message === 'Success') {
        showMsgDialog('Sent!', 'A new OTP has been sent to your registered mobile no');
    } else {
        showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    }
}



function init_left_menu() {

    var menuHtml = '<ul class="drawer-menu list-group">'
            + '<div class="head">'
            + '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'
            + '<div class="profile_box profile_icon" id="div_menu_profile_pic">'
            + '</div> '
            + '</div> '
            + '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">'
            + '<div class="user_caption" id="div_menu_profile_name" ></div> '
            + '</div> '
            + '</div>'
            + '<a href="#" class="list-group-item icon_home"><span class="menu_icon"> <img src="images/menu_home.png" class="img-responsive"></span> Home</a>'
            + '<a href="#" class="list-group-item icon_myprofile"><span class="menu_icon"> <img src="images/menu_user.png" class="img-responsive"></span> My Profile</a>'
            + '<a href="#" class="list-group-item icon_addressbook"><span class="menu_icon"> <img src="images/menu_address.png" class="img-responsive"></span> Address Book</a>'
            + '<a href="#" class="list-group-item icon_attendance"><span class="menu_icon"> <img src="images/menu_calender.png" class="img-responsive"></span> Attendance</a>'
            + '<a href="#" class="list-group-item icon_manual"><span class="menu_icon"> <img src="images/menu_manual.png" class="img-responsive"></span> Employee Manual</a>'
            + '<a href="#" class="list-group-item icon_timesheet"><span class="menu_icon"> <img src="images/menu_calender.png" class="img-responsive"></span> Time Sheet</a>'
			+ '<a href="#" class="list-group-item lightbulb_LD"><span class="menu_icon"> <img src="images/menu_l_D.png" class="img-responsive"></span> L&D </a>'
            + '<a href="#" style="display:none;" id="drawer_report" class="list-group-item icon_reports"><span class="menu_icon"> <img src="images/menu_reports.png" class="img-responsive"></span> Reports</a>'
            + '<a href="#" class="list-group-item icon_logout"><span class="menu_icon"> <img src="images/menu_logout.png" class="img-responsive"></span> Logout</a>'
            + '</ul>'
            + '<div id="siteversion" style="display:none;">'
            + '<div id="siteversion_message"></div>'
            + '</div>'

    /*var menuHtml = '<ul class="list-group">  '
     + '<div class="head">'
     + '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'
     + '<div class="profile_box profile_icon" id="div_menu_profile_pic">'
     + '</div> '
     + '</div> '
     + '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">'
     + '<div class="user_caption" id="div_menu_profile_name" ></div> '
     + '</div> '
     + '</div>'
     + '<a href="#" class="list-group-item icon_home"><span class="menu_icon"> <img src="images/menu_home.png" class="img-responsive"></span> Home</a>'
     + '<a href="#" class="list-group-item icon_myprofile"><span class="menu_icon"> <img src="images/menu_user.png" class="img-responsive"></span> My Profile</a>'
     + '<a href="#" class="list-group-item icon_addressbook"><span class="menu_icon"> <img src="images/menu_address.png" class="img-responsive"></span> Address Book</a>'
     + '<a href="#" class="list-group-item icon_attendance"><span class="menu_icon"> <img src="images/menu_calender.png" class="img-responsive"></span> Attendance</a>'
     + '<a href="#" class="list-group-item icon_manual"><span class="menu_icon"> <img src="images/menu_manual.png" class="img-responsive"></span> Employee Manual</a>'
     + '<a href="#" class="list-group-item icon_timesheet"><span class="menu_icon"> <img src="images/menu_calender.png" class="img-responsive"></span> Time Sheet</a>'
     + '<a href="#" class="list-group-item icon_logout"><span class="menu_icon"> <img src="images/menu_logout.png" class="img-responsive"></span> Logout</a>'
     + '</ul>'
     */
    
    $("#dw-s2").html(menuHtml);
	

    //  $('.drawer').drawer();


    //set name & pic

    $("#div_menu_profile_pic").append("");

    $("<img/>", {
        src: localStorage.PROFILE_PIC,
        alt: 'profile pic',
        class: 'img-responsive title_icon'
    }).appendTo('#div_menu_profile_pic');
    $("#div_menu_profile_name").html(localStorage.PROFILE_NAME);

    // $('body').append("header");

    $(".icon_myprofile").bind("click", function () {
        window.location = "my_profile.html";
    });
    $(".icon_attendance").bind("click", function () {
        window.location = "attendance_in.html";
    });

    $(".icon_logout").bind("click", function () {
        if (confirm(MSG_CONFIRM_LOGOUT)) {
            window.location = "login.html";
        }
    });

    $(".icon_home").bind("click", function () {
        window.location = "dashboard.html";
    });
    $(".icon_manual").bind("click", function () {
      if(EmpType === 'Associate' || EmpType === 'Project Consultant' || EmpType === 'Consultant')
	   {
		   showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
		   
	   }else if(EmpType != 'Associate' || EmpType != 'Project Consultant' || EmpType != 'Consultant')
	   {
		   if(IsActiveMenu_disable == 1)
		   {
				   window.location = "employee_manual.html";		   
		   }else
		   {
						 showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
		   }

	   }
	   
    });

    $(".icon_timesheet").bind("click", function () {
		if(IsActiveMenu_disable == 1)												 
		{
    		window.location = "timesheet_add_task.html";			
		}
		else{
			 showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
	   }
    });
	
	$(".lightbulb_LD").bind("click", function () {
       if(EmpType === 'Associate' || EmpType === 'Project Consultant' || EmpType === 'Consultant')
	   {
		   showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
		   
	   }else if(EmpType != 'Associate' || EmpType != 'Project Consultant' || EmpType != 'Consultant')
	   {
		   if(IsActiveMenu_disable == 1)
		   {
				   window.location = "L_Dpage.html";	   
		   }else
		   {
						 showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
		   }

	   }
    });
	
	
	$("#li_projectreport").bind("click", function () {
       if(IsActiveMenu_disable == 1)												 
		{
			window.location = "project_report.html";	
		}
		else{			
			showMsgDialog(SERVER_ERROR_TILTLE_MENU, SERVER_ERROR_TILTLE_MENU_TITLE);
		}
    });
	
	
	
    $(".icon_addressbook").bind("click", function () {
        localStorage.removeItem('q_addr_companies');
        localStorage.removeItem('q_addr_locations');
        localStorage.removeItem('q_addr_grades');
        localStorage.removeItem('q_addr_blood_group');
        localStorage.removeItem('totalFilter');
        window.location = "addressbook.html";
        //  alert('Coming Soon!');
    });
	$(".icon_reports").bind("click", function () {
        window.location = "reports.html";
    });

//    $("#icon_menu_close").bind("click", function () {
//        $("#a_menu_icon").trigger('click');
//    });

}


//$(function(){
//  // Bind the swipeleftHandler callback function to the swipe event on div.box
//  $( "div#dw-s2" ).on( "swipeleft", swipeleftHandler );
// 
//  // Callback function references the event target and adds the 'swipeleft' class to it
//  function swipeleftHandler( event ){
//  //  $( event.target ).addClass( "swipeleft" );
//   $("#a_menu_icon").trigger('click');
//  }
//});

function myReplaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

