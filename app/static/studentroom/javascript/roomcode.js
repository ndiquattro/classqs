$(document).ready(function(){

$(".form-control").on('input', function(){
	$("#codealert").slideUp("fast");
  $("#passalert").slideUp("fast");
});

//click to check rooom
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
     $("#logonpan").slideDown("slow");
      $("#submitcol").slideUp("fast");
      $("#codelabel").slideUp("fast");
}else{

 $("#codealert").slideDown("slow");

}


  },
  error: function(error) {
                
                console.log('Error:', error);
            }

			});

		});//end check room function



//to get a passcode
$("#passbtn").on('click', function(){
      $(".logrow").slideUp("fast");
      $("#regpan").slideDown("fast");


});//end get pass 

    //click to register and go to room
$("#submitbtnnewuser").on('click', function(){
console.log("clicked");
var roomcode = $("#roominput").val().toUpperCase();
var firstname = $("#firstnameinput").val();
var lastname = $("#lastnameinput").val();
var passcode = $("#passcreate").val().toUpperCase();

var dataArray = {
  "firstname" : firstname,
  "lastname" : lastname,
  "roomcode" : roomcode,
  "passcode" : passcode
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: addstudent_route,
data:  dataJSON,
dataType: 'json',
success: function(response){
   
   if(response.urlr == "none"){
    $("#codealert").slideDown("slow");
    console.log("code already taken")
}else{
 
    window.location = response.urlr;
}


  },
  error: function(error) {
                
                console.log('Error:', error);
            }

      });

    }); //end click to register and go to room


//click to log in with passcode
$("#submitpassbtn").on('click', function(){

var roomcode = $("#roominput").val().toUpperCase();
var passcode = $("#passinput").val().toUpperCase();

var dataArray = {
  "roomcode" : roomcode,
  "passcode" : passcode
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: checkpasscode_route,
data:  dataJSON,
dataType: 'json',
success: function(response){
   
   if(response.urlr == "none"){
    $("#passalert").slideDown("slow");

}else{
 
    window.location = response.urlr;
}


  },
  error: function(error) {
                
                console.log('Error:', error);
            }

      });

    });



});