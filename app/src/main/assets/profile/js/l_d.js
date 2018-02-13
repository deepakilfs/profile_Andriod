/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var tmp_json;
var	strHTML="";

$(document).ready(function () {

	init_PostRequest_Learn_Development();
});


	var user = {
				/*UserName: localStorage.PROFILE_EMAIL,
				FirstName: localStorage.PROFILE_FIRSTNAME,
				LastName: localStorage.PROFILE_LASTNAME,
				DepartmentId: localStorage.PROFILE_DEPARTMENTID*/
				
		    UserName: "anurag.mishra@stampindia.in",
            FirstName: "Anurag",
            LastName: "Mishra",
            DepartmentId: 84
				
				
			}
        var userJson = JSON.stringify(user);
       // POST Resquest
       function init_PostRequest_Learn_Development() {
            var apiResponse;
            var url = WEB_BASE_LD_POSTREPSONSE_URL;
            jQuery.ajax({
                crossDomain: true,
                async: false,
                type: "POST",
                url: url,
                data: userJson,
                dataType: "json",
                context: document.body,
                contentType: 'application/json; charset=utf-8'
            }).success(function (json) {
                apiResponse = JSON.stringify(json);
				apiPostResponse=JSON.parse(apiResponse)
				init_PostRequest_Learn_Development_UI(apiPostResponse);
            });
            console.log(apiResponse);
        }


function init_PostRequest_Learn_Development_UI(json)
{ 
		 $.each(json.Private, function(key, obj) 
		  {
				console.log(key + ": " + obj);
				//alert(setvalue);
					strHTML+='<div class="course-box1 clearfix">'
					strHTML +='<div class="details clearfix">'
					strHTML +='<a href="#" class="clearfix">'
					strHTML += obj.NodeName
					strHTML +='</a>'
					strHTML +='<p class="clearfix" style="height:40px; width:200px;">'
					strHTML += obj.NodeDescription
					strHTML +='</p>'
					strHTML +='<a href="#" class="btn btn-button red pull-right disable">Take a Course</a>'
					//strHTML +='<p class="clearfix">Status  : Completed</p>'
					strHTML +='</div>'
					strHTML +='</div>'
					strHTML +='<br>';
			});
			$('#divPrivate').html(strHTML);
		console.log(strHTML);
}
		



