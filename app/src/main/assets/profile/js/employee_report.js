/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tmp_json;
//var temp_json;

$(document).ready(function () {
							
							//
	
	var cur_date=new Date();						
	
	var strDate="04"+"/"+"01"+"/"+cur_date.getFullYear();
    var endDate="03"+"/"+"31"+"/"+(cur_date.getFullYear()+1);

	init_company_master();
	init_employee_report(strDate,endDate,'');

	$("#fromDate").val(strDate);
	$('#endDate').val(endDate);
});

	$("#selectCompany").on("change", function () 
										  { 
										  var strDate = $("#fromDate").val();
   										  var endDate=$('#endDate').val(); 
										  var companyId = $(this).val();
										  
										  init_employee_report(strDate,endDate, companyId);
										  


										  });

//Company List

function init_company_master(){
	 var ws_url = WEB_BASE_URL + WEB_METHOD_GET_GET_USER_COMPANYLIST ;
        $.ajax({
            url: ws_url,
            type: "get"
        }).done(function (data) {
            data = JSON.parse(data);
            init_company_master_UI(data);
	      }).error(function (err) {
            //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
        });
	}

function init_company_master_UI(json){
	var html='';
	  $.each(json.tbl_CompanyList, function (key, obj) {
				html+='<option value="'+obj.CompanyId +'">'+obj.CompanyName +'</option>'
            });
            $("#selectCompany").append(html);
	}
	
//Employee REport Count

function init_employee_report(startDate,endDate,companyId) {
	var ws_url=WEB_BASE_URL + WEB_METHOD_GET_GET_EMPLOYEE_REPORT_COUNT+"?StartDate="+ startDate +"&EndDate="+ endDate + "&CompanyId="+companyId;
	console.log('url:'+ws_url);
    $.ajax({
        url:ws_url ,
        type: "GET"
    }).done(function (data) {
        tmp_json = $.parseJSON(data);
        init_employee_report_UI(tmp_json);
		init_employee_designation_count_report_UI(tmp_json);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function init_employee_report_UI(jsonObj) {
	 if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') { //attendance_json.tbl_TodaysAttendance[0].Data  //GreetingMessage   
		var totalCount = 0;
		totalCount = tmp_json.tbl_EmployeeStatusCount[0].NewEmpCount+tmp_json.tbl_EmployeeStatusCount[0].InActiveEmpCount+tmp_json.tbl_EmployeeStatusCount[0].ActiveEmpCount;
		
		$('#activeEmployeeCount').html(jsonObj.tbl_EmployeeStatusCount[0].ActiveEmpCount);
		$('#resignedEmployeeCount').html(jsonObj.tbl_EmployeeStatusCount[0].InActiveEmpCount);
		$('#newJoineesCount').html(jsonObj.tbl_EmployeeStatusCount[0].NewEmpCount);
		
		$('#maleCount').html(jsonObj.tbl_EmployeeStatusCount[0].MaleEmployee);
		$('#femaleCount').html(jsonObj.tbl_EmployeeStatusCount[0].FemaleEmployee);
		
		
		$('#employeesCount').html(jsonObj.tbl_EmployeeStatusCount[0].ActiveEmployee);
		$('#associatesCount').html(jsonObj.tbl_EmployeeStatusCount[0].ActiveAssociates);
		
		$('#employeeTotalCount').html(totalCount);
	}
}


// Employee Designation Count

function init_employee_designation_count_report_UI(jsonObj) {
	 if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);
		
    } else if (jsonObj.message[0].message === 'Success') { 
		
			if(jsonObj.tbl_EmployeeDesignationCount.length == 0 || jsonObj.tbl_EmployeeDesignationCount.length == "undefined")
			{
				$('#SVPCount').html(0);
				$('#VPCount').html(0);
				$('#AVPCount').html(0);
				$('#srManagerCount').html(0);
	
				$('#managerCount').html(0);
				$('#asstManagerCount').html(0);
				$('#srOfficerCount').html(0);
				$('#officerCount').html(0);
			}else
			{
			
				$('#SVPCount').html(jsonObj.tbl_EmployeeDesignationCount[7].Count);
				$('#VPCount').html(jsonObj.tbl_EmployeeDesignationCount[8].Count);
				$('#AVPCount').html(jsonObj.tbl_EmployeeDesignationCount[9].Count);
				$('#srManagerCount').html(jsonObj.tbl_EmployeeDesignationCount[10].Count);
	
				$('#managerCount').html(jsonObj.tbl_EmployeeDesignationCount[11].Count);
				$('#asstManagerCount').html(jsonObj.tbl_EmployeeDesignationCount[12].Count);
				$('#srOfficerCount').html(jsonObj.tbl_EmployeeDesignationCount[13].Count);
				$('#officerCount').html(jsonObj.tbl_EmployeeDesignationCount[14].Count);
				
				
				var sum_val = 0;
				for(var i=0; i < tmp_json.tbl_EmployeeDesignationCount.length ; i++ )
				{
				if((i>=0 && i <=6) || (i>=15 && i <=tmp_json.tbl_EmployeeDesignationCount.length))
				 {
				sum_val =sum_val +  tmp_json.tbl_EmployeeDesignationCount[i].Count;
				 }
				}
				
				$('#otherCount').html(sum_val);
			}
	}
}