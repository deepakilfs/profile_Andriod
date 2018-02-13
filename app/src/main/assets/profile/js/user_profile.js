/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    var frm_id = 'frm_reg';
	
	
	var jsonBloodGroupArr = new Array('A +ve', 'O +ve', 'B +ve', 'AB +ve', 'A -ve', 'O -ve', 'B -ve', 'AB -ve');
	init_profile();
  
  $('#input_OriginalBirthDate').datepicker({ 
	      formatDate : 'mm/dd/yyyy' ,
          changeMonth: true,
          changeYear: true
          //yearRange: "1950:+ new Date().getFullYear()" 

		});
  

  
	
$('#Input_IsActiveBirthDay').click(function(){
   	 var chkVal;
			console.log('chkVal:::'+chkVal);
			if ($(this).is(':checked')) {
				chkVal=1;
				//showMsgDialog("Sucessfully unsubscribe your birthday wish");
				 showMsgDialog(SUCCESS_TITLE, MSG_BIRTHDAY_UNSCBSCRIBE_TITLE);
				}else{
				 chkVal=0;
				showMsgDialog(SUCCESS_TITLE, MSG_BIRTHDAY_SCBSCRIBE_TITLE);
				}
			
			console.log('chkVal:::'+chkVal);  
			
			updateUserProfile('IsActiveBirthDay',chkVal);

});





    function init_profile() {
        //INPUT DATA GLOBALY SENT THROGH HEADER
        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_GET_USER_DETAILS + "?userDeviceRegId=" + getUserDeviceRegId(),
            type: "GET"
        }).done(function (data) {
            attendance_json = data;
            init_profile_UI(data);
        }).error(function (err) {
            //  showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });

    }

    function init_profile_UI(data) {
        var jsonObj = $.parseJSON(data);
        if (jsonObj.message[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
        } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data           
            $.each(jsonObj.tbl_FullUserDetails[0], function key(key, data) {
                $("#input_" + key).val(data);
				
				console.log(key, data);
            });

            $('<img/>', {
                src: jsonObj.tbl_FullUserDetails[0].Profile_pic_url,
                alt: 'profile pic',
                class: 'img-responsive title_icon'
            }).appendTo('#div_profile_pic');

            var tr_pramotion = '';
            var tr_prp = '';
    		

            $.each(jsonObj.tbl_UserPerformanceDetails, function key(key, data) {
                tr_pramotion += '<tr> <td scope="row">' + data["Promotions"] + '</td> <td>' + data["LastGrade"] + '</td> <td>' + data["PerformanceYear"] + '</td> </tr>';
                tr_prp += '<tr> <td scope="row">' + data["PerformanceYear"] + '</td> <td>' + data["PRP"] + '</td> <td>' + data["PerformanceRating"] + '</td> </tr>';
            });

            $("#tbl_pramotion").append(tr_pramotion);
            $("#tbl_prp").append(tr_prp);
            //init blood group autocomplete

            $("#input_BloodGroup").autocomplete({
                source: jsonBloodGroupArr,
                minLength: 1
            });

			if(jsonObj.tbl_FullUserDetails[0].IsActiveBirthDay ==1)
				{	
					$("#Input_IsActiveBirthDay").attr('checked', true);
					
					
				}else
				{
					$("#Input_IsActiveBirthDay").attr('checked', false);
						console.log("InFalse");
				}
        } else {
            //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }


    }
	

    $("#iconProfilePicEdit").bind("click", function () {
        $("#file_profilePic").trigger("click");
    });

    $("#file_profilePic").bind("change", function () {
        uploadProfilePic();
    });

    function uploadProfilePic() {
        var data = new FormData();
        $.each(jQuery('#file_profilePic')[0].files, function (i, file) {
            data.append('file-' + i, file);
        });
		
		

        // console.log('data: '+data);
        //var data = jQuery('#file_profilePic')[0].files[0];
        // console.log('data: ' + data);
        jQuery.ajax({
            url: WEB_BASE_URL + WEB_METHOD_POST_PROFILE_PIC,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (data) {
                processUploadProfilePic(data);
            },
            error: function () {
                //   console.log('error!');
            }
        });

    }

    function processUploadProfilePic(json) {
        json = jQuery.parseJSON(json);
        //attendance_json = json;
        if (json[0].message === 'Success') {

            jQuery('#file_profilePic').val('');

            $("#div_profile_pic img").remove();
            //    var alt_num = Math.floor(Math.random() * 20);
            localStorage.PROFILE_PIC = json[0].Profile_pic_url;
            $('<img/>', {
                src: json[0].Profile_pic_url,
                alt: 'Profile PIC',
                class: 'img-responsive title_icon'
            }).appendTo('#div_profile_pic');
        }
    }


	


    var editFieldHandler = function (element) {
        if (element.currentTarget !== undefined) {
            element = element.currentTarget;
        }
        console.log('in edit block');
        $(element).unbind("click");
//		$(element).is(':checked');
        var inputTex = $(element).prev("input");
        if (inputTex.attr("id") == "input_OriginalBirthDate"){
			var b_date= $('#input_OriginalBirthDate').val();
			b_date=b_date.split("/");
			b_date=b_date[1]+"/"+b_date[0]+"/"+b_date[2];
			$('#input_OriginalBirthDate').val(b_date);
			}
			
		$('.curaddress').css('display', 'none');
		$('.inputCurrAddres').css('display','block');

		var txtArea = $('.curaddress').val();
	    console.log(txtArea);
	    $('.inputCurrAddres').val(txtArea);
		
		
		$(element).removeClass('edit_field');
        $(element).addClass('save_field');
        $(inputTex).addClass('modify');
        $(inputTex).removeAttr('disabled');

        scrollToElement(inputTex);
		//$('#input_BirthDate').css('display','none');
        $(inputTex).focus();
        $(element).find("img").attr('src', "images/save_field.png");
        $(element).bind("click", saveFieldHandler);
		

    };
		

    var saveFieldHandler = function (element) {

        if (element.currentTarget !== undefined) {
            element = element.currentTarget;
        }
        var inputTex = $(element).prev("input");

        if (updateUserProfile($(inputTex).attr('name'), $(inputTex).val())) {
            console.log('in save block');
            $(element).unbind("click");
            $(element).find("img").attr('src', "images/edit_field.png");
            $(element).removeClass('save_field');
            $(element).addClass('edit_field');
			$(element).is(':checked');
            $(inputTex).removeClass('modify');
            $(inputTex).attr("disabled", "disabled");
			$(element).bind("click", editFieldHandler);
			//$(element).bind("click", checkFieldHandler);
        }
    };

    $(".edit_field").bind("click", function (event) {
        editFieldHandler(event.currentTarget);
    });
	
	function updateUserProfile(field, value) {
       if (value === null || value === undefined || value.length <= 0) {
            //showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        } else if (field === 'EmergencyContactNo' && value.length !== 10) {
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        } else if (field === 'ExtNo' && value.length > 4){
	    	$("input[name='" + field + "']").addClass("validation_error");
		    return;
        } else if (field === 'BloodGroup' && jsonBloodGroupArr.indexOf(value) < 0) {
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        }  else if (field === 'IsActiveBirthDay' && value.length < 0) {
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        } else if (field === 'OriginalBirthDate' && value.length < 0) {
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        } else if (field === 'CurrentAddress' && value.length <= 0) {
            $("input[name='" + field + "']").addClass("validation_error");
            return;
        } 
		
		
		
        $("input[name='" + field + "']").removeClass("validation_error");
		
		value = encodeURIComponent(value);
		
		
		console.log(value);
		

        var form_data = 'userDeviceRegId=' + getUserDeviceRegId() + "&" + field + "=" + value;

        console.log('form_data: ' + form_data);

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_POST_PROFILE_UPDATE,
            type: "POST",
            //dataType: "json",
            data: form_data
        }).done(function (data) {
            return processResponse(data, true);
        }).error(function (err) {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
            return false;
        });
		$('.curaddress').css('display', 'block');
		$('.inputCurrAddres').css('display','none');
        return true;
    }

    function processResponse(data) {
        var jsonObj = $.parseJSON(data);
        console.log(jsonObj);
        console.log(jsonObj[0].message);

        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
            return false;
        } else if (jsonObj[0].message === 'Success') {
	
			var b_date= $('#input_OriginalBirthDate').val();
			b_date=b_date.split("/");
			b_date=b_date[1]+"/"+b_date[0]+"/"+b_date[2];
			$('#input_OriginalBirthDate').val(b_date);
			return true;

        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
            return false;
        }
		

    }


});


function scrollToElement(myElement) {
    var container = $('.tab-content');
    var scrollTo = myElement;
    container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
    });
}



function isValidateDate(txtDate)
{
    var currVal = txtDate;
    if(currVal == '')
        return false;

    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null) 
        return false;

    //Checks for mm/dd/yyyy format.
    dtDay  = dtArray[1];
    dtMonth = dtArray[3];
    dtYear = dtArray[5];        
    var date = dtMonth + '/' + dtDay + '/' + dtYear;
    var mydate = new Date(date);
    if (dtMonth < 1 || dtMonth > 12) 
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31) 
        return false;
    else if (dtMonth == 2) 
    {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
            return false;
    } else if (dtYear > new Date().getFullYear()) { return false; } else if (mydate > new Date()) { return false; }
        
    return true;
}