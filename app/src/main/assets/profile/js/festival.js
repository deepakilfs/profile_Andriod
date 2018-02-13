/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var current_list ='';

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
	festival_display();
});


function festival_display()
{
	var ws_url=WEB_BASE_URL + WEB_METHOD_GET_FESTIVAL_DETAILS;
	
	console.log('url:'+ws_url);
    
	$.ajax({
        url:ws_url ,
        type: "GET"
    }).done(function (data) {
		current_list = $.parseJSON(data);
       init_festival_display_UI(current_list);
    }).error(function (err) {
        //showMsgDialog(SERVER_ERROR_TILTLE, SERVER_ERROR_MSG);
    });
}

function init_festival_display_UI(jsonObj)
{
	var strHTML ='';
	var img = document.createElement("IMG");
	//var n= Math.floor(Math.random() * 10) + 1
	
	
	if (jsonObj.message[0].message !== 'Success')
    {
        showMsgDialog(INVALID_INPUT_TITLE, INVALID_INPUT_MSG);	
    } else if (jsonObj.message[0].message === 'Success') {
		
	
		   $.each(jsonObj.tbl_CurrentFestival, function (key, obj) {
			
				/*img.alt = jsonObj.tbl_CurrentFestival[0].FestivalDesc;
				img.setAttribute('class', 'img-responsive');
				img.src = jsonObj.tbl_CurrentFestival[0].Festival_pic_url;
				console.log(img);			
				$('#festive_display').html(img); 	*/			
				
				
				for(var i=0 ; i< jsonObj.tbl_CurrentFestival.length ; i++) 
				{
					$('<div class="item"><img class="img-responsive" src="'+jsonObj.tbl_CurrentFestival[i].Festival_pic_url+'"></div>').appendTo('.carousel-inner');
				  }
			  $('.item').first().addClass('active');
			  $('#myCarousel').carousel();
				
				
		
	});  
 }
}

