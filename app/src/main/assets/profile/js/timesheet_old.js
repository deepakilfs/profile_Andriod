/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var attendance_json = '';
var project_map = new Array();
var jsonProjectArr = new Array();
var itemCounter = 0;
var pageSize = 10;
var pageCounter = 0;

//function log(message) {
//    $("<div>").text(message).prependTo("#log");
//    $("#log").scrollTop(0);
//}

$(document).ready(function () {
    var today = new Date();
    localStorage.TIME_SHEET_MONTH = today.getMonth()+1;
    localStorage.TIME_SHEET_YEAR = today.getFullYear();
});



function init_add_activity() {
    var frm_id = 'frm_add_activity';

    $.ajax({
        url: WEB_OPTS_BASE_URL + WEB_OPTS_METHOD_FETCH_PROJECTS,
        type: "GET"
    }).done(function (json) {
        project_map = new Array();

        $.each(json, function (key, obj) {
            project_map[obj.projectName] = obj.projectId;
            jsonProjectArr[key] = obj.projectName;
        });

        $(".input_project").autocomplete({
            source: jsonProjectArr,
            minLength: 2
        });

        //set default date 

        var today = new Date();
        var month = today.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var strDate = today.getFullYear() + '-' + month + '-' + today.getDate();
        $("input[type=date]").val(strDate);


    }).error(function (err) {
        alert("Project has not been assigned to you");
    });


//----------------


    $("#div_main_task_block").on("click", ".but_remove_task_block", function () {
        console.log('in remove block');
        $(this).parent().parent().remove();
    });


    $("#but_add_task_block").bind("click", function () {

        var blockCount = $(".task_block").length;

        var block_html = '<div class="task_block" style="border-top: 1px solid #ccc;display: inline-block;    padding-top: 20px;">'
                + '<label for="">Project Name(Type keyword e.g. Bamboo)</label>'
                + '<input type="text" name="projectId" id="input_project" class="form-control default_input input_project">'
                + '<label for="">Time Spent</label>'
                + '&nbsp;&nbsp;Hrs: <input type="number" maxlength="2" style="width: 50px;" class="form-control input_box hrs_mins_' + blockCount + ' hoursInput" name="hours" id="input_hrs_' + blockCount + '" placeholder="hrs">'
                + '&nbsp;&nbsp;Min: <input type="number" style="width: 50px;" maxlength="2" class="form-control input_box hrs_mins_' + blockCount + ' minutesInput" name="minutes" id="input_min" placeholder="mins">'
                + '<br/><label for="">Details</label>'
                + '<textarea rows="2" class="form-control default_input" name="activityDescription" placeholder="Comment"></textarea>'
                + '<div class="pull-right"><a href="#" class="but_remove_task_block" style="" id="but_add_task_block"><img src="images/delete.png" style="    margin-left: 10px;" class="img-responsive" /></a></div></div><div calss="clearfix"></div>';

        $("#div_add_block").before(block_html);

        $(".input_project").autocomplete({
            source: jsonProjectArr,
            minLength: 2
        });

    });



//--------------

    $("#but_add_activity").bind("click", function () {

        //get form data
        var isValid = validateForm();
        if (isValid === null) {
            return;
        }

//check time for each project
        var isTimeFound = true;
        var lastProject;
        var lastIndex;
        $("input[name='projectId']").each(function (index) {
            var time = 0;
            lastProject = $(this).val();
            $(".hrs_mins_" + index).each(function () {
                if (this.value !== undefined && this.value.length > 0) {
                    var tmpInt = parseInt($(this).val());
                    if ($(this).attr('name') === 'minutes' && tmpInt > 59) {
                        time = 0;
                        $(this).val('');
                    } else {
                        time += tmpInt;
                    }

                } else {
                    $(this).val(0);
                }

                lastIndex = index;
            });

            if (time <= 0) {
                isTimeFound = false;
                return false;
            }

        });

        if (!isTimeFound) {
            $("#input_hrs_" + lastIndex).focus();
            showMsgDialog("Invalid Time", "please enter time for " + lastProject)
            return;
        }
//check valid time, should not greater than 16 hrs.

        var hrs = 0;
        var mins = 0;

        $("input[name='hours']").each(function () {
            if (this.value !== undefined && this.value.length > 0) {
                hrs += parseInt($(this).val());
            }

        });

//

        $("textarea[name='activityDescription']").each(function () {
            if ($(this).val().trim().length <= 0) {
                $(this).val('NA');
            }
        });


        $("input[name='minutes']").each(function () {
            if (this.value !== undefined && this.value.length > 0) {
                mins += parseInt($(this).val());
            }

        });

        var seconds = hrs * 60 + mins;

        if (seconds <= 0) {
            alert("Time Spent, can not be zero.");
            return;
        } else if (seconds > 16 * 60) {
            alert("Time Spent, can not be greater than 16 hrs.");
            return;
        }

        var arrFormData = $("#" + frm_id).serializeArray();

        var tmpElement = null;
        var strProjectId = '';
        $("input[name='projectId']").each(function () {
            //get id
            if (project_map[this.value] !== undefined && parseInt(project_map[this.value]) > 0) {
                strProjectId += "&projectId=" + project_map[this.value];
            } else {
                tmpElement = $(this);
                return false;
            }

        });

        if (tmpElement !== null) {
            alert('please select project!');
            $(tmpElement).focus();
            return;
        }

        var form_data = $('input,textarea', '#frm_add_activity').not(":input[name=projectId]").serialize();


        var arrFormData = $('input,textarea', '#frm_add_activity').not(":input[name=projectId]").serializeArray();
//set default value for time, if not set
        $.each(arrFormData, function (key, obj) {

            //get id
            if (obj.value === undefined || obj.value === '' || obj.value.trim().length <= 0) {
                arrFormData[key] = {name: obj.name, value: null};
            }

        });

        form_data = $.param(arrFormData);
        form_data += strProjectId;

  //      console.log('from data: ' + form_data);
        $.ajax({
            url: WEB_OPTS_BASE_URL + WEB_OPTS_METHOD_ADD_ACTIVITY,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data) {
            attendance_json = data;
            processResponse(data);
        }).error(function (err) {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    });


//------------------

    var validateForm = function () {
        var inputCount = 0;
        $("#" + frm_id + " input").not(":input[type=number]").each(function () {
            var tmp = this.value;
            if (tmp !== 'undefined' && tmp.length > 0) {
                inputCount++;
                $(this).removeClass('validation_error');
            } else {
                $(this).addClass('validation_error');
            }
        });
        if (inputCount === $("#" + frm_id + " input").not(":input[type=number]").length) {
            return true;
        } else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
            return null;
        }

    };


    var processResponse = function (data) {

        if (data.message === 'success') {
            if (confirm("would you like to add more acitivity?")) {
                //reset fields for new entry
//                $("#" + frm_id + " textarea,select,input").each(function () {
//                    this.value = '';
//                });
                window.location = "timesheet_add_task.html";
            } else {
                window.location = "timesheet.html";
            }

        } else if (data.message === 'invalid_time_spent') {
            showMsgDialog(INVALID_REQUEST_MSG, "You can't add more than 16 hrs for the day");
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    };

}

function init_timesheet() {
    showTimeSheetHistory(0);

    //bind event

    $("#time_sheet_month").bind("change", function () {
       // console.log('Date: ' + this.value);
        var tmp = this.value.toString();
        tmp = tmp.split("-");
        localStorage.TIME_SHEET_YEAR = tmp[0];
        localStorage.TIME_SHEET_MONTH = tmp[1];
        
          showTimeSheetHistory(0);
    });

}

function showTimeSheetHistory(start) {

    var ws_url = WEB_OPTS_BASE_URL + WEB_OPTS_METHOD_TIMESHEET_HISTORY + "?start=" + start;
    // console.log(ws_url);

    var strURLPart = "";

    if (localStorage.TIME_SHEET_MONTH !== '') {
        strURLPart = "&month=" + localStorage.TIME_SHEET_MONTH;
    }

    if (localStorage.TIME_SHEET_YEAR !== '') {
        strURLPart += "&year=" + localStorage.TIME_SHEET_YEAR;
    }

    ws_url += strURLPart;

   // console.log('ws_url: ' + ws_url);
    
    $.ajax({
        url: ws_url,
        type: "GET"
    }).done(function (data) {
        attendance_json = data;
        init_timesheet_history_UI(data);
    }).error(function (err) {
        //sshowMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        alert('No logs found!');
    });

}



function init_timesheet_history_UI(json) {
    var counter = 0;

//  json = $.parseJSON(json);
    if (json === undefined && json.length <= 0) {
        alert('No logs found!');
    } else {
        var html = ''
        var tmpHtml = '';

        $.each(json, function (key, obj) {
            tmpHtml += '  <div class="date_divider">' + key + ' </div>'
            $.each(obj, function (key1, obj1) {

                tmpHtml += '<div class="task_box">'
                        + '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">  '
                        + '<div class="task_title">' + obj1.project + '</div>  '
                        + '</div>'
                        + '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">  '
                        + '<div class="task_time"><img src="images/clock-circular-outline.png" class=" img-responsive"/>' + obj1.hours + '.' + obj1.minutes + ' Hrs</div>'
                        + '</div>'
                        + '<div class=" clearfix"> </div>'
                        + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 task_content">'
                        + (obj1.activity === null ? 'NA' : obj1.activity)
                        + '<br/><br/><div class="sml_text">@ ' + obj1.strDateTime + '</div></div>'
                        + '<div class=" clearfix"></div> '
                        + '</div>';
                counter++;
            });
        });

        $("#icon_timesheet_prev").unbind("click");

        $("#icon_timesheet_next").unbind("click");

        $("#icon_timesheet_next").bind("click", function () {
            itemCounter += pageSize;
            showTimeSheetHistory(itemCounter, true);
        });

        if (pageCounter > 0) {
            $("#icon_timesheet_prev").bind("click", function () {
                if (itemCounter > pageSize) {
                    itemCounter -= pageSize;
                    showTimeSheetHistory(itemCounter, false);
                }

            });
        }

        $("#div_activity_list").html(tmpHtml);
        pageCounter++;
    }


}




