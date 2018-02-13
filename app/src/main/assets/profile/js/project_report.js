/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tmp_json;

var IsActiveMenu_disable = localStorage.PROFILE_ACTIVEMENU;
//var temp_json;

$(document).ready(function () 
{
	init_project_count_report();
	
});


//Project Count Report

function init_project_count_report() {
	var ws_url = WEB_OPTS_BASE_URL + WEB_METHOD_GET_FETCH_PROJECT_MANAGER_REPORT;
    $.ajax({
        url:ws_url ,
        type: "GET"
    }).done(function (data) {
		console.log("jsondata"+data);
		//tmp_json = $.parseJSON(data);
		tmp_json=data;
		init_project_count_report_UI(data);
	 }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}


function init_project_count_report_UI(data) {
	
	$('#activeProject').html(data.totalProject);
	$('#userAssignedProject').html(data.assignedUsers);
	
	$('#completedProject').html(data.closedProject);	
}