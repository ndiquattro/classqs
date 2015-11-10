$(document).ready(function(){

$("#roominput").on('input', function(){
	$("#codealert").slideUp("slow");

});

$("#roomsubmit").on('click', function(){

var roomcode = $("#roominput").val().toUpperCase();

var dataArray = {
  "roomcode" : roomcode
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: lookuproom_route,
data:  dataJSON,
dataType: 'json',
success: function(response){
   
   if(response.roomcheck == "yes"){
    window.location = response.urlr;
}else{

 $("#codealert").slideDown("slow");

}


  },
  error: function(error) {
                
                console.log('Error:', error);
            }

			});

		});

});