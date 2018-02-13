/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {

    //rest local storage data

    localStorage.SESSION_TOKEN = '';
    localStorage.PROFILE_NAME = '';
    localStorage.PROFILE_PIC = '';
	localStorage.PROFILE_ROLE_ID='';
	localStorage.PROFILE_FIRSTNAME ='';
	localStorage.PROFILE_LASTNAME = '';
	localStorage.PROFILE_DEPARTMENTID = '';

	localStorage.PROFILE_CURRENTADDRESS='';
	
	localStorage.PROFILE_ATTENDANCE ='';
	
	localStorage.PROFILE_ACTIVEMENU ='';
	localStorage.PROFILE_EMPTYPE ='';


    var frm_id = 'frm_login';

 /*  Firebase();*/

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


    function validateForm() {
        var mpin = '';
        var mpinCount = 4;
        $("#" + frm_id + " input").each(function () {
            var tmp = this.value;
            if (tmp !== 'undefined' && tmp.length > 0) {
                mpin += tmp;
                $(this).removeClass('validation_error');
            } else {
                $(this).addClass('validation_error');
            }
        });


        if (mpin.length === mpinCount) {
            return mpin;
        } else {
            showMsgDialog(INVALID_INPUT_TITLE, "Please enter your mpin")
            return null;
        }

    }



    $("#but_forgot").bind("click", function () {
        var successCall = function () {
            window.location = "vertification.html";
        };
        
        if (confirm(MSG_CONFIRM_FORGOT_PASSWORD)) {
           
		   requestForNewOTP(successCall, null);
        }

    });


    $("#but_login").bind("click", function () {
        //get form data
        var mpin = validateForm();
        var fcmID = getFcmid();
        if (mpin === null) {
            return;
        }
        var form_data = '';
        form_data = "Mpin=" + mpin + "&userDeviceRegId=" + getUserDeviceRegId() + "&FCMRegToken=" + fcmID;

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_LOGIN,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data, txtStatus, xhr) {
            // console.log('Response Header: ' + xhr.getResponseHeader('ResponseToken'));
            localStorage.SESSION_TOKEN = xhr.getResponseHeader('ResponseToken');
            //console.log(xhr.getAllResponseHeaders());
            processResponse(data);
			checkattendance(data);
			//saveFcmid();

        }).error(function (err) {
             showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    });

    function processResponse(data) {
        var jsonObj = $.parseJSON(data);
        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, "please enter correct MPIN");
			
        } else if (jsonObj[0].message === 'Success') 
		{
            localStorage.PROFILE_PIC = jsonObj[0].Profile_pic_url;
            localStorage.PROFILE_EMAIL = jsonObj[0].EmailId;
            localStorage.PROFILE_NAME = jsonObj[0].Firstname + " " + jsonObj[0].LastName;	
			localStorage.PROFILE_ROLE_ID=jsonObj[0].RoleId;
			localStorage.PROFILE_FIRSTNAME = jsonObj[0].Firstname;
			localStorage.PROFILE_LASTNAME = jsonObj[0].LastName;
			localStorage.PROFILE_DEPARTMENTID = jsonObj[0].DepartmentId;
			localStorage.PROFILE_ACTIVEMENU = jsonObj[0].isActiveMenu;
			localStorage.PROFILE_EMPTYPE = jsonObj[0].EmpType
			
			var Currentaddress=jsonObj[0].CurrentAddress;

			if (Currentaddress=='' || Currentaddress=='null')
				{
					window.location = "additionemployeeinfo.html";
				}
				else
				{
					window.location = "dashboard.html";
				}
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }
    }
	
	
	function checkattendance(data)
	{
		var jsonObj = $.parseJSON(data);
		
		var d = new Date();
		var weekday=new Array(7);
		weekday[0]="Sunday"; 
		weekday[1]="Monday"; 
		weekday[2]="Tuesday"; 
		weekday[3]="Wednesday"; 
		weekday[4]="Thursday"; 
		weekday[5]="Friday"; 
		weekday[6]="Saturday";
		var n = weekday[d.getDay()];
		
		
		
		 if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, "please enter correct MPIN");
        } else if (jsonObj[0].message === 'Success') 
		{
			localStorage.PROFILE_PIC = jsonObj[0].Profile_pic_url;
            localStorage.PROFILE_EMAIL = jsonObj[0].EmailId;
            localStorage.PROFILE_NAME = jsonObj[0].Firstname + " " + jsonObj[0].LastName;	
			localStorage.PROFILE_ROLE_ID=jsonObj[0].RoleId;
			
			var CAttendance=jsonObj[0].CheckAttendance;
			
			
			
			if (CAttendance==0)
			{
				if (n!= weekday[0] && n!= weekday[6])
				{
					window.location = "attendance_in.html";
				}
				else
				{
					window.location = "dashboard.html";
				}
			}
			else
			{
			    window.location = "dashboard.html";
			}
        } 
		else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }
		
		}



});
