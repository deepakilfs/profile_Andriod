/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function () 
{
	$('#dw-s2').hide();
	
	$("#chkAddress").on("change", function(){
		if (this.checked) {
		  $("[name='PermanentAddress']").val($("[name='CurrentAddress']").val());
		}
		else
		{
			$("[name='PermanentAddress']").val('');
		}
	  });
	
});

$("#but_submit_in").bind("click", function () 
{
		var updateaddress_url = WEB_BASE_URL + WEB_METHOD_POST_PROFILE_ADDRESS_UPDATE;
		
		var curAddr=$("#input_CurrentAddress").val();
		var perAdr=$("#input_PermanentAddress").val();
		
		if (curAddr === null || curAddr === undefined || curAddr.length <= 0) {
				//showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
				$('#input_CurrentAddress').addClass("validation_error");
				return;
			} else if (perAdr === null || perAdr === undefined || perAdr.length <= 0) {
				//showMsgDialog(VALIDATION_INPUT_REQUIRED_TITLE, VALIDATION_INPUT_REQUIRED_MSG);
				$('#input_PermanentAddress').addClass("validation_error");
				return;
			}
		
			
		  var form_data = 'userDeviceRegId=' + getUserDeviceRegId() + "&CurrentAddress="+encodeURIComponent(curAddr) + "&PermanentAddress=" +encodeURIComponent(perAdr);
		  console.log('form_data: ' + form_data);
		
		$.ajax({
            url: updateaddress_url,
            type: "POST",
            dataType: "json",
            data: form_data
        }).done(function (data) {
            return processResponse(data, true);
        }).error(function (err) {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
            return false;
        });
        return true;
});

    function processResponse(data) {
        var jsonObj = $.parseJSON(data);
        console.log(jsonObj);
        console.log(jsonObj[0].message);

        if (jsonObj[0].message === 'Invalid')
        {
            showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
            return false;
        } else if (jsonObj[0].message === 'Success') {
		    showMsgDialog(SUCCESS_TITLE, MSG_UPDATE_SUCCESS);
			window.location = "dashboard.html";
        } else {
            showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
            return false;
        }
    }
