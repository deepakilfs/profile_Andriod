/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var current_list ='';
var recent_list ='';
var upcoming_list ='';
var birthdaydetails_json = '';
var sptodaydate ='';

var d = new Date();
var weekday=new Array(7);
weekday[0]="Sunday"; weekday[1]="Monday"; weekday[2]="Tuesday"; weekday[3]="Wednesday"; weekday[4]="Thursday"; weekday[5]="Friday"; weekday[6]="Saturday";
var n = weekday[d.getDay()];
var week = n;

var monthNames = ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"];
var m = monthNames[d.getMonth()];
var month = m.substring(0,3);


var strDate = week+" "+ month + ", " +d.getDate()+" "+ d.getFullYear();


$(document).ready(function() 
{

	localStorage.BirthdayFlag = 1;

	$('#sptodaydate').text(strDate);

	//todayBirthday();
	todaysbirthday_list();
	
	
	$("#currentBirthdayList").on('click', '.birthday_box', function () {
            console.log('got clicked!' + $(this).attr('userId'));
            localStorage.AB_USERID = $(this).attr('userId');
            window.location.href = 'birthdaywish_details.html';
        });
	
	$("#divRecentBirthday").on('click', '.icon_myprofile', function () {
            console.log('got clicked!' + $(this).attr('userId'));
            localStorage.AB_USERID = $(this).attr('userId');
            window.location.href = 'birthdaywish_details.html';
        });
});
	
	//init_user_details(localStorage.AB_USERID);
	
function todaysbirthday_list()
{
	var current_list ='';
	
	var ws_url=WEB_BASE_URL + WEB_METHOD_GET_BIRTHDAY_LIST;
	console.log('url:'+ws_url);
    $.ajax({
        url:ws_url ,
        type: "GET"
    }).done(function (data) {
        current_list = $.parseJSON(data);
		init_todaysBirthday_List_UI(current_list);
		init_RecentBirthday_list_UI(current_list);
		init_UpcomingBirthday_list_UI(current_list);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function  init_todaysBirthday_List_UI(jsonObj)
{
	var strHtml ='';
	if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 
	
		if(jsonObj.tbl_CurrentBirthday == 0)
		{
			$('#divtodaybirthday').hide();
		}
		else
		{
			$.each(jsonObj.tbl_CurrentBirthday, function key(key, obj) {
				strHtml +='	<div userId="' + obj.UserId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 birthday_box">'
				strHtml +=' <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">'
				strHtml +=' <div class="emp_photo"> '
				strHtml +=' <img src="' + obj.Profile_pic_url + '" class="img-responsive img-circle"> '
				strHtml +=' </div>'
				strHtml +=' </div>'
				strHtml +=' <div class="col-lg-7 col-md-7 col-sm-7 col-xs-7">'
				strHtml +=' <div class="emp_name" style="text-align:left">' + obj.Name + '<br>'
				strHtml +=' <span class="emp_comp_name">' + obj.Location +'</span> <br />'
				strHtml +=' <span class="emp_comp_name">' + obj.CompanyName +'</span>'
				strHtml +='	</div>'
				strHtml +=' </div>'
				strHtml +=' <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="margin-top:10px;">'
				strHtml +=' <button class="btn btn-default btn-sm" type="button" >Wish</button>'
				strHtml +='  </div>'
				strHtml +='  <div class=" clearfix"> </div>'
				strHtml +=' </div>';
	  
			});
		
		
		  
		$('#currentBirthdayList').html(strHtml);
		}
		
		 
	}
}

function init_RecentBirthday_list_UI(jsonObj)
{
	var strHtml ='';
	if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 
		 $.each(jsonObj.tbl_RecentBirthday, function key(key, obj) 
		  {
				strHtml+='<div class="item_user">'
				strHtml+='<div userId="' + obj.UserId + '"  class="col-lg-4 col-md-4 col-sm-4 col-xs-4 dashboard_item icon_myprofile">'
				strHtml+='<div class="feature_box">'
				strHtml+='<div class="feature"> '
				strHtml+='<img src="' + obj.Profile_pic_url + '" class="img-responsive img-circle"> '
				strHtml+='</div>'
				strHtml+='<div class="feature_text">' + obj.Name + '<br>'
				strHtml+='<span class="emp_comp_name">' + obj.BIRTHDAY +'</span> <br />'
				strHtml +=' <span class="emp_comp_name">' + obj.CompanyName +'</span>'
				strHtml+='</div>'
				strHtml+='</div>'
				strHtml+='</div>'	
				strHtml+='</div>'	
	
		  });
			$('#divRecentBirthday').html(strHtml);
	}
}


function init_UpcomingBirthday_list_UI(jsonObj)
{
	var strHtml ='';
	if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 
		 $.each(jsonObj.tbl_UpcomingBirthday, function key(key, obj) 
		  {
			strHtml+='<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 dashboard_item icon_myprofile">'
			strHtml+='<div class="feature_box">'
			strHtml+='<div class="feature"> '
			strHtml+='<img src="' + obj.Profile_pic_url + '" class="img-responsive img-circle"> '
			strHtml+='</div>'
			strHtml+='<div class="feature_text">' + obj.Name + '<br>'
			strHtml+='<span class="emp_comp_name">' + obj.BIRTHDAY +'</span> <br />'
			strHtml +=' <span class="emp_comp_name">' + obj.CompanyName +'</span>'
			strHtml +='</div>'
			strHtml+='</div>'
			strHtml+='</div>';
			  
		  });
			$('#divUpcomingBirthday').html(strHtml);
	}
}






