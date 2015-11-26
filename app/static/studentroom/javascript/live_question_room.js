$(document).ready(function(){



//stream new updates to room
 sse = new EventSource(eventsource_route);
 sse.onmessage = function(message) {
            $(".quespan").remove();
            parsedmsg = jQuery.parseJSON(message.data)

            if( parsedmsg['islive']==0){
                      closeq();

            }
            if(parsedmsg['islive']==1){
                  appendq(parsedmsg['qdata']);

            }

                          }

//get's intital quesiton on page load if it is live
 $.getJSON(getroomroute , {
        r: room_code,   

      }, function(data) {
        
        //check if question is live
        if (data.islive == 1){
            appendq(data);
                } else{ closeq(); }

      });//end get initial question

//function to append curren question
function appendq(data){

$(".quespan").remove();
$(".endmsg").fadeOut(100);

$("#checkimg").fadeOut(100);
$(".successmsg").fadeOut(100);

  $("#currentquestion").append('<div class="panel panel-primary quespan" id="'+data.archid+'">'
          +'<div class="panel-heading" align="center"><h3 class ="text-center"><h3>'+data.qtxt+'</h3>'
          +'</div>'
          +'<div class="panel-body anstable">'
         +'<div class="row">'
         +'<div class="col-xs-12" id="astart">'
         +'</div>'
         +'</div>'
         +'<div class="row">'
         +'<div class="col-xs-12" id="substart">'
         +'</div>'
         +'</div>'
          +'</div>');
          
           var i =0;
           $.each(data.answers, function(){
            $("#astart").append('<button type="button" class="btn btn-default btn-lg box-shadow--8dp btn-block ansbtn" style="white-space: normal;" id="'+i+'"><h3>'+this+'</h3></button>');
            i+=1;
                 });
           $("#substart").append('<button type="button" class="btn btn-success btn-block" id="submitbtn"><h3 id="submittxt">Submit Answer</h3></button>');
            btnstylefunc(); 


}  //end append question





//function to add style and button functions
function btnstylefunc(){

            $('.quespan').css('max-width','1000px');
            $('.quespan').css('margin','0 auto');
             $('.btn-block').css('margin','20px 0px');
            $('.anstable').css('background-color','#B8B8B8');
            $( ".ansbtn" ).on( "click", function() {
            $('button.active').removeClass("active");
            $(this).addClass("active");
            });

            //submit answer to server
            $( "#submitbtn" ).on( "click", function() {
        
               submitanswer($('button.active').attr('id'), $('.quespan').attr('id'))


              }); // end submit answer to server

}// end function to add style and button functions


//function to show quesiton is closed
function closeq(){

  $(".quespan").fadeOut(100, function(){
$('.endmsg').css('display','block');
    $('.endmsg').css('opacity','0');
      $(".endmsg").animate({
        opacity: "1"
  }, 800);

  });



  $(".smsg").fadeOut(200, function(){
$('.endmsg').css('display','block');
    $('.endmsg').css('opacity','0');
      $(".endmsg").animate({

        opacity: "1"
  }, 800);

  });

}//end close quesiton

//function to show quesiton is submitted
function submitted(){
$(".quespan").fadeOut(500, function(){
  $('.successmsg').css('display','block');
  $('#checkimg').css('display','block');
  $('.smsg').css('opacity','0');

  $(".successmsg").animate({
        opacity: "1"
  }, 500, function(){

$("#checkimg").animate({
       
        opacity: "1"
  }, 400);

   });

    });
 
}


// //loading animation
// $body = $("body");
// $(document).on({
//     ajaxStart: function() {  $("#spinnerid").toggleClass( "sk-circle");},
//      ajaxStop: function() {  $("#spinnerid").toggleClass( "sk-circle")}    
// });

//function to submit student answer
function submitanswer(answer, archiveid){
$('#ansselctmsg').text(parseInt(answer)+1)
$('.btn-block').prop('disabled', true)

console.log(archiveid)

var dataArray = {
  "roomcode" : room_code,
  "passcode" : pass_code,
  "answer" : answer,
  "archid" : archiveid
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: studentans_route,
data:  dataJSON,
dataType: 'json',
success: function(response){
 
  submitted();
   
}, error: function(error) {
                
                console.log('Error:', error);
            }
      });
}//end function to submit student answer


     });


