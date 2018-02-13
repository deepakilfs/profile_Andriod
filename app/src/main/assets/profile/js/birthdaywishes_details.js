/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var birthdaydetails_json = '';


var birthdaydetails_json = '';
var sptodaydate ='';
var	strHTML ="";

var d = new Date();
var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();

$(document).ready(function() 
{
	init_birthday_details(localStorage.AB_USERID);	
	
});


 $('#btnsubmit').click(function () {

		var ws_url = WEB_BASE_URL + WEB_METHOD_GET_BIRTHDAY_WISHES_INSERT;

        var comments = $('#input_comments').val();
		    comments = comments.trim();
		var hiddenvalue =$('#hid_BirthDayId').val()
        if (comments != '') {
            $.ajax({
  				url: ws_url,
                type: "POST",
               // contentType: "application/json; charset=utf-8",
                data: 'BirthDayId='+ hiddenvalue + '&BirthDayWish=' +comments,
                dataType: "json",
                success: function (data) {
					//alert(data);
					data = JSON.parse(data);
					
					init_Get_birthday_comments(localStorage.AB_USERID);
					//Birthday_Comments_UI(data);
					
                    var obj = data[0].message;
                    if (obj == 'Success') 
					{
                       $('#input_comments').val('');
                     }
					 else
					 {
						// alert("Error");
					 }
                },
                error: function (result) {
                    //alert("Error");
                }
            });
			//location.reload();
			
        }
        else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_BIRTHDAY_MSG);
			$( "#input_comments" ).focus();
            return false;
        }
    })

/*Get Comments of Birthday Wish */

function init_Get_birthday_comments(userId) 
{
    var ws_url = WEB_BASE_URL + WEB_METHOD_GET_BIRTHDAY_COMMENTS + "?CommentUserID=" + userId;
	console.log(ws_url);
    $.ajax({
        url: ws_url,
        type: "GET"
    }).done(function (data) {
        data = JSON.parse(data);
		Birthday_count_UI(data);
		Birthday_Comments_UI(data);
		//console.log(data);
 }).error(function (err) {
    });
}
/* End fo the Get Comments of BIrthday wish */


/* birthday Wishes and His details */
function init_birthday_details(userId) 
{
    var ws_url = WEB_BASE_URL + WEB_METHOD_GET_BIRTHDAY_COMMENTS + "?CommentUserID=" + userId;
	console.log(ws_url);
    $.ajax({
        url: ws_url,
        type: "GET"
    }).done(function (data) {
        data = JSON.parse(data);
        birthdaydetails_json = data; //for testing
		Birthday_count_UI(data);
        init_birthday_details_UI(data);
		Birthday_Comments_UI(data)
    }).error(function (err) {
    });
}

function init_birthday_details_UI(jsonObj) {

    if (jsonObj.message[0].message === 'Invalid')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
    } else if (jsonObj.message[0].message === 'Success') { 
		$('#hid_BirthDayId').val(jsonObj.tbl_CurrentBirthDayId[0].BirthDayId);
	
		var i = Math.floor(Math.random() * 10) + 1;
		$('#my_image').attr('src', 'images/birthday/' + i + '.png');
		
		strHTML+='<div class="emp_photo">'
		 strHTML+= '<img src="' + jsonObj.tbl_UserDetails[0].Profile_pic_url + '" class="img-responsive">'
		 strHTML+= '</div>'
		 strHTML+='</div>'
		 strHTML+='<div id="empname" class="emp_name">' + jsonObj.tbl_UserDetails[0].Name + '</div>'
		 strHTML+='<div id="emplocation"><i class="glyphicon glyphicon-map-marker"></i> &nbsp;' + jsonObj.tbl_UserDetails[0].Location + '</div>'
		
	}
	
	$("#birthdayboy").html(strHTML);
}

function Birthday_count_UI(jsonObj)
{
	 if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 
		$('#countComments').html(jsonObj.tbl_CommentCount[0].CommentCount);
		
	}
}


function Birthday_Comments_UI(jsonObj)
{
	var strHtml ='';
	if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 

		if(jsonObj.tbl_Comments == 0)
		{
			$('#divbirthcomments').hide();
		}
		else
		{
			for(var i=0; i<jsonObj.tbl_Comments.length; i++)
			{
				strHtml +='<li class="list-group-item list-group-item-action">'
				strHtml +='<img src="'+jsonObj.tbl_Comments[i].Profile_pic_url+'" width="36" height="36" alt="User" class=" img-circle" />'
				strHtml +='<span style="font-size: 10px; font-weight: 600; padding-left:10px;">'+jsonObj.tbl_Comments[i].Name +'&nbsp; &nbsp; &nbsp;' +jsonObj.tbl_Comments[i].CommentDate+ '</span>'
				strHtml +='<div style="padding-left: 40px; font-size: 12px; font-style: italic;">'+jsonObj.tbl_Comments[i].CommentDesc+'</div>'
				strHtml +='</li>'
			}
			 $('#commentsdetails').html('');
			 $('#commentsdetails').append(strHtml);
			/* $.each(jsonObj.tbl_Comments, function key(key, obj) 
			{	
				strHtml +='<li class="list-group-item list-group-item-action">'
				strHtml +='<img src="'+obj.Profile_pic_url+'" width="36" height="36" alt="User" class=" img-circle" />'
				strHtml +='<span style="font-size: 12px;     font-weight: 600; padding-left:10px;">'+obj.Name+'&nbsp; &nbsp; &nbsp;' +obj.CommentDate+ '</span>'
				strHtml +='<div style="padding-left: 50px; font-size: 10px; font-style: italic;">'+obj.CommentDesc+'</div>'
				strHtml +='</li>'
			});*/
			
		}
		
		
	}
}


