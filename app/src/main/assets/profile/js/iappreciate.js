/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var attendance_json = '';
var q_addr_search = null;
function showAddressBook(start, end) {

    var ws_url = WEB_BASE_URL + WEB_METHOD_GET_ADDRESSBOOK + "?StartRowNum=" + start + "&EndRowNum=" + end;

    var url_part = '';

    if (q_addr_search !== null) {
        url_part = "&SearchText=" + encodeURIComponent(q_addr_search);
    }

    if (localStorage.q_addr_companies !== undefined && localStorage.q_addr_companies.length > 0) {
        url_part += "&CompanyId=" + encodeURIComponent(localStorage.q_addr_companies);
    }
    if (localStorage.q_addr_locations !== undefined && localStorage.q_addr_locations.length > 0) {
        url_part += "&LocationId=" + encodeURIComponent(localStorage.q_addr_locations);
    }
    if (localStorage.q_addr_grades !== undefined && localStorage.q_addr_grades.length > 0) {
        url_part += "&GradeID=" + encodeURIComponent(localStorage.q_addr_grades);
    }
    if (localStorage.q_addr_blood_group !== undefined && localStorage.q_addr_blood_group.length > 0) {
        url_part += "&BloodGroup=" + encodeURIComponent(localStorage.q_addr_blood_group);
    }


    ws_url += url_part;

    //  console.log(ws_url);

    $.ajax({
        url: ws_url,
        type: "GET"
    }).done(function (data) {
        attendance_json = data;
        init_addressbook_UI(data);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });


}
function init_addressbook_UI(json) {
    var jsonObj = $.parseJSON(json);

    if (jsonObj.tbl_AddressBook.length <= 0)
    {
        showMsgDialog("", "Data not found!");
    } else { //attendance_json.tbl_TodaysAttendance[0].Data           
        var html = '';
        var first = 0;
        var last = 0;
        $.each(jsonObj.tbl_AddressBook, function key(key, obj) {

            if (key === 0) {
                first = obj.R;
            }

            if (key === jsonObj.tbl_AddressBook.length - 1) {
                last = obj.R;
            }

            //data.Name
            html += '<div userId="' + obj.UserId + '" class="addressbook_box">'
                    + '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'
                    + '<div class="emp_photo">'
                    + '<img src="' + obj.Profile_pic_url + '" class="img-responsive">'
                    + '</div>'
                    + '</div>'
                    + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pad_left_0">'
                    + '<div class="emp_name">'
					+ (obj.Name === null ? 'NA' : obj.Name)
                    + '<br>'
                    + '<span class="emp_comp_name">' + obj.Location + '</span>'
                    + '</div>'
                    + '</div>'
                    + '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">'					
					+ '<span class="iappreciate">'
					+ '<img id="iappreciation_add" src="images/appreciation_add.png" alt="" /></span>'
					+ '</div>'
                    + '<div class=" clearfix">'
                    + '</div>'
                    + '</div>';

        });

        $("#icon_addr_prev").unbind("click");

        $("#icon_addr_next").unbind("click");

        $("#icon_addr_prev").bind("click", function () {

            if (first - 10 >= 1) {
                showAddressBook(first - 10, first - 1);
            }

        });


		$('#iappreciation_add').bind("click", function(){
			
		});


        $("#icon_addr_next").bind("click", function () {
            showAddressBook(last + 1, last + 10);
        });

        $("#addressbook_main").html(html);

    }
}


function init_filter() {

    var master_arr = new Array();

    master_arr[0] = {TableName: 'CompanyMaster', ColumnId: 'CompanyId', ColumnName: 'CompanyName'};
    master_arr[1] = {TableName: 'LocationMaster ', ColumnId: 'LocationId', ColumnName: 'Location'};
    master_arr[2] = {TableName: 'GradeMaster', ColumnId: 'GradeId', ColumnName: 'Grade'};


    $.each(master_arr, function (key, obj) {
        //fetch company
        var ws_url = WEB_BASE_URL + WEB_METHOD_GET_MASTER_GET_MASTER + "?TableName=" + obj.TableName + "&ColumnId=" + obj.ColumnId + "&ColumnName=" + obj.ColumnName;

        $.ajax({
            url: ws_url,
            type: "get"
        }).done(function (data) {
            data = JSON.parse(data);
            init_filter_UI(data, key);
        }).error(function (err) {
            //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    });

    var bloodGroupJson = new Array();

    bloodGroupJson = {0: "O -ve", 1: "A +ve", 2: "A -ve", 3: "B +ve", 4: "B -ve", 5: "AB +ve", 6: "AB -ve", 7: "O +ve"};

    //call non ajax
    init_filter_UI(bloodGroupJson, 3);

}

function init_filter_UI(json, type) {


    var html = '';
    switch (type) {
        case 0:
            $.each(json.tbl_CommonTable, function (key, obj) {
                var regex = new RegExp('\\b' + obj.CompanyId + '\\b');
                if (localStorage.q_addr_companies !== undefined && localStorage.q_addr_companies.length > 0 && localStorage.q_addr_companies.search(regex) >= 0) {
                    html += '<li><label><input type="checkbox" name="q_company" checked value="' + obj.CompanyId + '">' + obj.CompanyName + '</label></li>';
                } else {
                    html += '<li><label><input type="checkbox" name="q_company" value="' + obj.CompanyId + '">' + obj.CompanyName + '</label></li>';
                }

            });

            $("#ul_company_list").html(html);
            break;
        case 1:
            $.each(json.tbl_CommonTable, function (key, obj) {

                var regex = new RegExp('\\b' + obj.LocationId + '\\b');
                if (localStorage.q_addr_locations !== undefined && localStorage.q_addr_locations.length > 0 && localStorage.q_addr_locations.search(regex) >= 0) {
                    html += '<li><label><input type="checkbox" name="q_location" checked value="' + obj.LocationId + '">' + obj.Location + '</label></li>';
                } else {
                    html += '<li><label><input type="checkbox" name="q_location" value="' + obj.LocationId + '">' + obj.Location + '</label></li>';
                }

            });

            $("#ul_location_list").html(html);
            break;
        case 2:
            $.each(json.tbl_CommonTable, function (key, obj) {

                var regex = new RegExp('\\b' + obj.GradeId + '\\b');

                if (localStorage.q_addr_grades !== undefined && localStorage.q_addr_grades.length > 0 && localStorage.q_addr_grades.search(regex) >= 0) {
                    html += '<li><label><input type="checkbox" name="q_grade" checked value="' + obj.GradeId + '">' + obj.Grade + '</label></li>';
                } else {
                    html += '<li><label><input type="checkbox" name="q_grade" value="' + obj.GradeId + '">' + obj.Grade + '</label></li>';
                }

            });

            if (html !== '' && html.length > 0) {
                $("#ul_grade_list").html(html);
            } else {
                $(".opt_grade").hide();
            }

            break;

        case 3:
            //<li><label><input type="checkbox" name="q_blood_group" value="O +">  O +</label></li>
            $.each(json, function (key, obj) {
                //var regex = new RegExp('\\b' + obj + '\\b');
                if (localStorage.q_addr_blood_group !== undefined && localStorage.q_addr_blood_group.length > 0 && localStorage.q_addr_blood_group.indexOf(obj) >= 0) {
                    html += '<li><label><input type="checkbox" name="q_blood_group" checked value="' + obj + '">' + obj + '</label></li>';
                } else {
                    html += '<li><label><input type="checkbox" name="q_blood_group" value="' + obj + '">' + obj + '</label></li>';
                }
            });

            $("#ul_blood_group").html(html);
            break;
    }

}


function init_user_details(userId) {

    //ajax call
    var ws_url = WEB_BASE_URL + WEB_METHOD_GET_USER_ADDRESS_BOOK_DETAILS + "?AddBookUserID=" + userId;

    //console.log(ws_url);

    $.ajax({
        url: ws_url,
        type: "GET"
    }).done(function (data) {
        data = JSON.parse(data);
        attendance_json = data; //for testing
        init_user_details_UI(data);
    }).error(function (err) {
    });


}

function init_user_details_UI(jsonObj) {

    if (jsonObj.message[0].message === 'Invalid')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
    } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data           
        /*$.each(jsonObj.Table[0], function key(key, data) {
            if (data !== null && data.length > 0) {
                //input_Mobile
                if (key === 'Mobile' || key==='EmergencyContactNo') {
                    $("#input_" + key).text(data);
                    $("#input_" + key).attr('href', 'tel:+91' + data);
					$("#call_" + key).attr('href', 'tel:+91' + data);
                } else if (key === 'OfficialEmailId') {
                    $("#input_" + key).text(data);
                    $("#input_" + key).attr('href', 'mailto:' + data);
                    $("#mail_" + key).attr('href', 'mailto:' + data);					
                } else {
                    $("#input_" + key).val(data);
                }
            }
        });
*/
        $('<img/>', {
            src: jsonObj.Table[0].Profile_pic_url,
            alt: 'profile pic',
            class: 'img-responsive title_icon'
        }).appendTo('#div_profile_pic');

		$('#spn_name').text(jsonObj.Table[0].Name);
        //hide blank fields

        $(".form-group input").each(function () {
            if (this.value === null || this.value === undefined || this.value.length <= 0) {
                $(this).closest(".form-group").hide();
            }
        });

    } else {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    }
}


$(document).ready(function () {

    if (window.location.href.indexOf('addressbook_filter') > 0) {

        init_filter();

        $("#con_addr_apply_filter").bind('click', function () {

            var q_companies = '';
            var q_locations = '';
            var q_grades = '';
            var q_blood_group = '';
            //get company data
            var totalFilter = 0;
            $('input[name=q_company]:checked').each(function () {
                q_companies += this.value + ",";
                totalFilter++;
            });

            $('input[name=q_location]:checked').each(function () {
                q_locations += this.value + ",";
                totalFilter++;
            });

            $('input[name=q_grade]:checked').each(function () {
                q_grades += this.value + ",";
                totalFilter++;
            });

            $('input[name=q_blood_group]:checked').each(function () {
                q_blood_group += this.value + ",";
                totalFilter++;
            });

            if (q_companies.length > 0) {
                q_companies = q_companies.substring(0, q_companies.length - 1);
            }
            if (q_locations.length > 0) {
                q_locations = q_locations.substring(0, q_locations.length - 1);
            }
            if (q_grades.length > 0) {
                q_grades = q_grades.substring(0, q_grades.length - 1);
            }

            if (q_blood_group.length > 0) {
                q_blood_group = q_blood_group.substring(0, q_blood_group.length - 1);
            }
            console.log(q_companies);
            console.log(q_locations);
            console.log(q_grades);
            console.log(q_blood_group);
            //now save in local storage to use on another page

            localStorage.q_addr_companies = q_companies;
            localStorage.q_addr_locations = q_locations;
            localStorage.q_addr_grades = q_grades;
            localStorage.q_addr_blood_group = q_blood_group;
            localStorage.totalFilter = totalFilter;
            window.location = "addressbook.html";
        });

        $("#icon_addr_clear_filter").bind('click', function () {
            localStorage.removeItem('q_addr_companies');
            localStorage.removeItem('q_addr_locations');
            localStorage.removeItem('q_addr_grades');
            localStorage.removeItem('q_addr_blood_group');
            localStorage.removeItem('totalFilter');
            window.location = "addressbook.html";

        });

    } else if (window.location.href.indexOf('employee_iAppreciate_wish') > 0) {

        init_user_details(localStorage.AB_USERID);

    } else {

        $("#spn_filter_count").html(localStorage.totalFilter);
        showAddressBook(1, 10);

        $("#but_addr_search").bind("click", function () {
            q_addr_search = $("#txt_addr_search").val();
            showAddressBook(1, 10);
        });


        $("#addressbook_main").on('click', '.addressbook_box', function () {
            console.log('got clicked!' + $(this).attr('userId'));
            localStorage.AB_USERID = $(this).attr('userId');
            window.location.href = 'employee_iAppreciate_wish.html';
        });

    }


});


