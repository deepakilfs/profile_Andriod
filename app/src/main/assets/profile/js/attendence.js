/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
// WEB_METHOD_USERATTENDANCE_STATUS
 
 
 
var attendance_json = '';
$(document).ready(function () {

    var frm_id = 'frm_attendence_in';
    var latitude = '';
    var longitude = '';
    var isLocation = false;
    var isIN = false;
    var locationCounter = 0;
    var myVar;

    //showToast();

myFunction();



    init_attendance();

    function init_attendance() {
        //INPUT DATA GLOBALY SENT THROGH HEADER
        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_GET_ATTENDANCE_STATUS + "?userDeviceRegId=" + getUserDeviceRegId(),
            type: "GET"
        }).done(function (data) {
            attendance_json = data;
            init_IN_OUT_UI(data);
        }).error(function (err) {
            //    showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    }

/*
function showToast()
{
		window.JSInterface.setLocationOn();
		return false;
}
*/


function myFunction() {
        //myVar = setInterval(showToast, 5000);

        if(!myVar)
        {
            myVar = setInterval(showToast, 15000);
            //myVar=true;
        }
        return false;
    }


    function init_IN_OUT_UI(data) {
        var jsonObj = $.parseJSON(data);
		
		var leave = jsonObj.tbl_TodaysAttendance[0].statusId
		var wfHome = jsonObj.tbl_TodaysAttendance[0].statusId

        if (jsonObj.message[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_REMARKS_MSG);
        } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data  //GreetingMessage          
            if (jsonObj.tbl_TodaysAttendance[0].Data === "false") {
                //init UI for IN
                $("#div_mark_attendance").show();
                $("#div_attendance_main").hide();
                $("#select_status").show();
                $("#but_submit_out").hide();
                $("#but_submit_in").show();
                //set name & date
                setUsersInfo(jsonObj);

                $.each(jsonObj.tbl_AttendanceStatus, function (key, data) {
                    $("#select_status").append('<option value="' + data["statusId"] + '">' + data["status"] + '</option>');
                });

            } else if(leave === 6 || wfHome === 5)
				{
					var date = new Date();
					showAttendanceHistory(date.getMonth() + 1, date.getFullYear());
				
				}else if (jsonObj.tbl_TodaysAttendance[0].Data === "true" && jsonObj.tbl_TodaysAttendance[0]["OutTime"] === null)
				{
					$("#div_mark_attendance").show();
					$("#div_attendance_history").hide();
					$("#select_status").hide();
					$("#but_submit_out").show();
					$("#but_submit_in").hide();
					setUsersInfo(jsonObj);
				 }
			//else if (jsonObj.tbl_TodaysAttendance[0].Data === "true" && jsonObj.tbl_TodaysAttendance[0]["OutTime"] === null) {
//                //init UI for OUT     
//                $("#div_mark_attendance").show();
//                $("#div_attendance_history").hide();
//                $("#select_status").hide();
//                $("#but_submit_out").show();
//                $("#but_submit_in").hide();
//                setUsersInfo(jsonObj);
//
//            } else if (jsonObj.tbl_TodaysAttendance[0].Data === "true" && jsonObj.tbl_TodaysAttendance[0]["OutTime"] !== null) {
//                //show history              
//                var date = new Date();
//        		showAttendanceHistory(date.getMonth() + 1, date.getFullYear());
//            }
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }

    function setUsersInfo(jsonObj) {

        $("<img/>", {
            src: jsonObj.tbl_UserInfo[0].ProfileImagePath,
            alt: 'profile pic',
            class: 'profile_icon'
        }).appendTo('#div_profile_pic');
        $("#div_greeting").html(jsonObj.tbl_UserInfo[0].GreetingMessage + "<br/> ");
        $("#spn_name").html(jsonObj.tbl_UserInfo[0].UserName);
        $("#spn_date_time").html(jsonObj.tbl_UserInfo[0].DateTime);
    }

    function validateForm() {
        var inputCount = 0;
        $("#" + frm_id + " select").each(function () {

            var tmp = this.value;
            if (tmp !== 'undefined' && tmp.length > 0) {
                inputCount++;
                $(this).removeClass('validation_error');
            } else {
                $(this).addClass('validation_error');
            }
        });


        if (inputCount === $("#" + frm_id + " select").length) {
            //check if remark is optional or not
            var status = $("#select_status").val();
            var remark = $("#text_remark").val();
            if (status !== '1' && remark.trim().length <= 0) {
                $("#text_remark").addClass('validation_error');
                showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_RMARKS_REQUIRED_MSG);
                return null;
            } else {
                $("#text_remark").removeClass('validation_error');
                return true;
            }

        } else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_RMARKS_REQUIRED_MSG);
            return null;
        }

    }

    function configLocationUpdate() {

        var locationInterval = setInterval(function () {
            var location = fetchLocation();
            if (location !== null && location.length > 0) {
                location = location.split("#");
                latitude = location[0];
                longitude = location[1];
                clearInterval(locationInterval);
                isLocation = true;
                //auot submit if data is field...
                if (isIN) {
                    $("#but_submit_in").trigger("click");
                } else {
                    $("#but_submit_out").trigger("click");
                }

            }
        }, 1000);

    }



    $("#but_submit_in").bind("click", function () {
				
		//get form data
        var isValid = validateForm();
        if (isValid === null) {
            return;
        }
		
				
        //check for location
        if (isLocationEnabled() && !isLocation && locationCounter <= 1) {
            //request for location update            
            isIN = true;
            reuestForLocationUpdate();

            if (locationCounter === 0) {
                configLocationUpdate();
            }

            locationCounter++;
            return;
        }

       
        var form_data = 'userDeviceRegId=' + getUserDeviceRegId() + "&latitudeIN=" + encodeURI(latitude) + "&longitudeIN=" + encodeURI(longitude);
        var status = $("#select_status").val();
        form_data += "&remarkIN=" + encodeURI($("#text_remark").val()) + "&statusId=" + status;

        //console.log('form_data: ' + form_data);

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_SUBMIT_ATTENDANCE,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data) {
            processResponse(data, true);
        }).error(function (err) {
            //    showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });
    });


    function processResponse(data, isIN) {
        var jsonObj = $.parseJSON(data);
        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_REMARKS_MSG);
        } else if (jsonObj[0].message === 'Success') {
            $("#frm_attendence_in").hide();
            $("#div_msg_block").show();             
            if (isIN) {
                $("#div_msg_block_msg_content").html(MSG_ATTENDANCE_IN_SUBMIT_CONFIRM);
            } else {
                $("#div_msg_block_msg_content").html(MSG_ATTENDANCE_OUT_SUBMIT_CONFIRM);
            }

        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }

    $("#but_submit_out").bind("click", function () {

        if (isLocationEnabled() && !isLocation) {
            //request for location update            
            reuestForLocationUpdate();
            configLocationUpdate();
            return;
        }
		

        var form_data = 'userDeviceRegId=' + getUserDeviceRegId() + "&latitudeOUT=" + encodeURI(latitude) + "&longitudeOUT=" + encodeURI(longitude);
        form_data += "&remarkOUT=" + encodeURI($("#text_remark").val());
        // console.log('form_data: ' + form_data);

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_SUBMIT_ATTENDANCE,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data) {
            processResponse(data, false);
        }).error(function (err) {
            //   showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });
    });


    $("#but_attendance_hostory").bind("click", function () {
        //INPUT DATA GLOBALY SENT THROGH HEADER
        var date = new Date();
        showAttendanceHistory(date.getMonth() + 1, date.getFullYear());
    });

    function showAttendanceHistory(month, year) {
        $("#div_mark_attendance").hide();
        $("#div_attendance_main").show();   
         $("#div_attendance_history").show();
        
        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_ATTENDANCE_HISTORY + "?userDeviceRegId=" + getUserDeviceRegId() + "&month=" + month + "&year=" + year,
            type: "GET"
        }).done(function (data) {            
            init_attendance_history_UI(data);
        }).error(function (err) {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    }


    function init_attendance_history_UI(json) {       
        
        json = $.parseJSON(json);
        if (json.message[0].message === 'IVALID') {
            showMsgDialog(INVALID_REQUEST_TITLE, INVALID_REQUEST_MSG);
        } else if (json.message[0].message === 'Success') {
            var html = '<table class="table table-bordered">'
                    + '<thead>'
                    + '<tr>'
                    + '<th>Date</th>'
                    + '<th>InTime</th>'
                    + '<th>OutTime</th>'
                    + '<th>Hours</th>'
                    + '<th>Status</th>'
                    + '</tr>'
                    + '</thead>'
                    + '<tbody>'
            
            var tmpHtml = '';
            
            $.each(json.tbl_MonthlyAttendance, function (key, obj) {
               // console.log(obj["Date"]);
				
				
				var strHoliday ="Holiday";
				var strWeekoff = "Weekly Off"
				
				if(obj.status.indexOf(strWeekoff) != -1)
					{
					 tmpHtml += '<tr><td scope="row">' + obj["Date"] + '</td><td>' + obj["InTime"] + '</td><td>' + obj["OutTime"] + '</td>\n\
												<td>' + obj["Hours"] + '</td><td style="color:#ff0000; font-weight:600;">' + obj["status"] + '</td>\n\
											</tr>'
					}else if(obj.status.indexOf(strHoliday) != -1)
					{
						tmpHtml += '<tr><td scope="row">' + obj["Date"] + '</td><td>' + obj["InTime"] + '</td><td>' + obj["OutTime"] + '</td>\n\
												<td>' + obj["Hours"] + '</td><td style="color:#00ff00; font-weight:600;">' + obj["status"] + '</td>\n\
											</tr>'
					}
					else 
					{
					  tmpHtml += '<tr><td scope="row">' + obj["Date"] + '</td><td>' + obj["InTime"] + '</td><td>' + obj["OutTime"] + '</td>\n\
												<td>' + obj["Hours"] + '</td><td>' + obj["status"] + '</td>\n\
											</tr>'
					}
			  //  tmpHtml += '<tr><td scope="row">' + obj["Date"] + '</td><td>' + obj["InTime"] + '</td><td>' + obj["OutTime"] + '</td>\n\
//                            <td>' + obj["Hours"] + '</td><td>' + obj["status"] + '</td>\n\
//                        </tr>';
            });
            var trTotal = '<tr><td colspan="3" style="background-color:gray;text-align:right;"><b>Total </b></td><td style="background-color:gray;" colspan="2"> <b>' + json.tbl_TotalHrs[0].Total + '</b></td></tr>'
            html += tmpHtml + trTotal + '</tbody></table>';
            $("#div_attendance_history").html(html);
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }

    $("#div_attendance_main").on("change", "#input_atd_month", function () {
        console.log('in click');
        var date = $(this).val();
        if (date !== '') {
            date = date.split("-");
            showAttendanceHistory(date[1], date[0]);
        }

    });

});


