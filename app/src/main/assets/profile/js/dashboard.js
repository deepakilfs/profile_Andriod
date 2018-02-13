/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




 $(document).ready(function() 
{
	    var today = new Date();

    CountNofitication();
		
		var  EmpManualDt;
		EmpManualDt = localStorage.getItem('EmpManualdate');
		if (EmpManualDt === null || EmpManualDt === '')
		{
			localStorage.setItem('EmpManualdate', new Date('2018', '0', '15'));
			EmpManualDt = localStorage.getItem('EmpManualdate');
		}
		EmpManualDt = new Date(EmpManualDt);
		 if (today <= EmpManualDt)
		 {
    		$('#updateinEmpManual').text("1");
		 }else
		 {
			 $('#updateinEmpManual').css('display', 'none');
		 }
		
		
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		
		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		
		var today = dd+'/'+mm+'/'+yyyy;
		
	if(localStorage.TodayDate == '')
	{
		
		localStorage.TodayDate = today;
		localStorage.BirthdayFlag = 0;
	}
	else
	{
		if(localStorage.TodayDate ==today)
		{
			
		}
		else
		{
			localStorage.TodayDate = today;
			localStorage.BirthdayFlag = 0;
		}
	}
	todayBirthday();
});

$('#linkbell').click(function (){

      $('#linkbellcount').css('display','none');
      window.JSInterface.callNotificationActivity();

    });
 
 function todayBirthday()
{
	//alert('Today Birthday!');
	
	var birthday_json ='';
	
	var ws_url=WEB_BASE_URL + WEB_METHOD_GET_BIRTHDAY_LIST;
	//var ws_url=WEB_BASE_TEST_URL + WEB_METHOD_GET_BIRTHDAY_LIST;
	
	console.log('url:'+ws_url);
    $.ajax({
        url:ws_url ,
        type: "GET"
    }).done(function (data) {
        birthday_json = $.parseJSON(data);
		init_todayBirthday_UI(birthday_json);	

    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function init_todayBirthday_UI(jsonObj)
{
	 if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { 
		
		
	if(localStorage.BirthdayFlag == 0 )	
	{
			if(jsonObj.tbl_CurrentBirthdayCount[0].Count > '0')
			{
				$('#todaybirthday').html(jsonObj.tbl_CurrentBirthdayCount[0].Count);
			}
			else
			{
				$('#todaybirthday').css('display','none');
				
			}
	}
	else
		{
			$('#todaybirthday').css('display','none');
			
		}
	}
}


function CountNofitication()
{
   //var numbcount;
    Notification();
    //$('#linkbellcount').html(localStorage.NOTIFICATION);
}
