/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    var frm_id = 'frm_otp';
    
    var VALIDATION_INPUT_REQUIRED_MSG = 'please enter a valid OTP';

    
    function validateForm() {
        var otp = '';
        $("#" + frm_id + " input").each(function () {
            var tmp = this.value;
            if (tmp !== 'undefined' && tmp.length > 0) {
                otp += tmp;
                $(this).removeClass('validation_error');
            } else {
                $(this).addClass('validation_error');
            }
        });

        if (otp.length === 6) {
            return otp;
        } else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
            return null;
        }

    }
    $("#but_validate_otp").bind("click", function () {
        //get form data

        var otp = validateForm();

        if (otp !== null) {
            var form_data = '';

            form_data = "OTP=" + otp + "&userDeviceRegId=" + getUserDeviceRegId();

            console.log('form_data: ' + form_data);

            $.ajax({
                url: WEB_BASE_URL + WEB_METHOD_VALIDATE_OPT,
                type: "POST",               
                data: form_data
            }).done(function (data) {
                processResponseForValidateOTP(data);
            }).error(function (err) {
                showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
            });

        }


    });


    $("#but_resend_otp").bind("click", function () {      
      requestForNewOTP(null,null);
    });



    function processResponseForValidateOTP(data) {
        var jsonObj = $.parseJSON(data);
        console.log(jsonObj);
        console.log(jsonObj[0].message);
        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
        } else if (jsonObj[0].message === 'Success') {
            window.location = "create_mpin.html";
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }



});





