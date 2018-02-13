/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    var frm_id = 'frm_reg';
    
    function validateForm() {
        var inputCount = 0;
        $("#" + frm_id + " input").each(function () {
            var tmp = this.value;
            tmp = tmp.toString().trim();
            if (tmp !== 'undefined' && tmp.length > 0) {
                if ($(this).hasClass("email") && !validateEmail(tmp)) {
                    $(this).addClass('validation_error');
                } else if ($(this).hasClass("mobile") && tmp.length !== 10) {
                    $(this).addClass('validation_error');
                } else {
                    inputCount++;
                    $(this).removeClass('validation_error');
                }
            }else{
                 $(this).addClass('validation_error'); 
            }
        });

        if (inputCount === $("#" + frm_id + " input").length) {
            return true;
        } else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
            return null;
        }

    }


    $("#but_emp_register").bind("click", function () {
        //get form data
        var isValid = validateForm();
        if (isValid === null) {
            return;
        }

        var form_data = $("#" + frm_id).serialize();
        //append deviceInfo     
        //form_data = form_data + "&deviceId=" + encodeURI(getHardwareId()) + "&deviceDetails=" + encodeURI(getDeviceInfo())+ "&FCMRegToken=" + getFcmid();
        form_data = form_data + "&deviceId=" + encodeURI(getHardwareId()) + "&deviceDetails=" + encodeURI(getDeviceInfo());

        console.log('form_data: ' + form_data);

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_REGISTER,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data) {
            //$(this).addClass("done");
            console.log('done!' + data);
            $("#ajax_load").html(data);
            processResponse(data);
        }).error(function (err) {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });
    });


    function processResponse(data) {
        var jsonObj = $.parseJSON(data);
       

        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
        } else if (jsonObj[0].message === 'Success') {

            if (saveUserDeviceRegId(jsonObj[0].userDeviceRegId)) {
                window.location = "vertification.html";
            } else {
                showMsgDialog(DEVICE_ERROR_TILTLE, DEVICE_ERROR_MSG);
            }
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }

});


