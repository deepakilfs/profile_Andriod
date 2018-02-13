/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {

    var frm_id = 'frm_set_pin';

    function validateForm() {
        var mpin = '';
        var mpin2 = '';
        var mpinCount = 4;
        $("#" + frm_id + " input").each(function () {

            var tmp = this.value;
            if (tmp !== 'undefined' && tmp.length > 0) {
                if ($(this).attr('title') === '0') {
                    mpin += tmp;
                } else {
                    mpin2 += tmp;
                }

                $(this).removeClass('validation_error');
            } else {
                $(this).addClass('validation_error');
            }

        });


        if (mpin.length === mpin2.length && mpin2.length === mpinCount) {
            if (mpin === mpin2) {
                return mpin;
            } else {
                showMsgDialog("Mismatch MPIN", "MPIN and confirm pin does not match");
                return null;
            }
        } else {
            showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
            return null;
        }

    }

    $("#but_set_pin").bind("click", function () {
        //get form data
        var mpin = validateForm();

        if (mpin === null) {
            return;
        }
        var form_data = '';
        form_data = "Mpin=" + mpin + "&userDeviceRegId=" + getUserDeviceRegId();
        console.log('form_data: ' + form_data);

        $.ajax({
            url: WEB_BASE_URL + WEB_METHOD_SET_PIN,
            type: "POST",
            dataType: "json",
            data: form_data
                    //context: document.body                                        
        }).done(function (data) {
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
            window.location = "login.html";
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        }

    }


});
