/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tmp_json;
var temp_json;

$(document).ready(function () {
    init_attendance_report();
	init_attendance_statistics();
});

function init_attendance_report() {
    $.ajax({
        url: WEB_BASE_URL + WEB_METHOD_GET_CATEGORYTODAY_ATTENDANCE_COUNT,
        type: "GET"
    }).done(function (data) {
        tmp_json = $.parseJSON(data);
        init_attendance_report_UI(tmp_json);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function init_attendance_report_UI(jsonObj) {
	 if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
		
    } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data  //GreetingMessage   
	
		var totalCount = 0;
		
		totalCount =  tmp_json.tbl_CategoryTodayAttendanceCount[0].notmarked + tmp_json.tbl_CategoryTodayAttendanceCount[0].presentcount+tmp_json.tbl_CategoryTodayAttendanceCount[0].workfromhomecount+tmp_json.tbl_CategoryTodayAttendanceCount[0].onleavecount+tmp_json.tbl_CategoryTodayAttendanceCount[0].otherscount;
		
        $("#presentTodayCount").html(jsonObj.tbl_CategoryTodayAttendanceCount[0].presentcount);
        $("#workFormHomeCount").html(jsonObj.tbl_CategoryTodayAttendanceCount[0].workfromhomecount);
        $("#onLeaveCount").html(jsonObj.tbl_CategoryTodayAttendanceCount[0].onleavecount);
        $("#notMarkedCount").html(jsonObj.tbl_CategoryTodayAttendanceCount[0].notmarked);
        $("#otherCount").html(jsonObj.tbl_CategoryTodayAttendanceCount[0].otherscount);
		

		
		$("#totalAttendance").html(totalCount);
		
    }
//	return false;

}

function init_attendance_statistics() {

    $.ajax({
        url: WEB_BASE_URL + WEB_METHOD_GET_GET_IN_TIME_STATISTICS,
        type: "GET"
    }).done(function (data) {
        temp_json = $.parseJSON(data);
        init_attendance_statistics_UI(temp_json);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function init_attendance_statistics_UI(jsonObj) {
    if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
    } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data  //GreetingMessage   

		$('#before_9am_count').html(temp_json.tbl_InTimeStatistics[0].title);
		$('#between_9am_and_10am_count').html(temp_json.tbl_InTimeStatistics[1].title);
		$('#between_10am_and_11am_count').html(temp_json.tbl_InTimeStatistics[2].title);
		$('#after_11am_count').html(temp_json.tbl_InTimeStatistics[3].title);
    }
}