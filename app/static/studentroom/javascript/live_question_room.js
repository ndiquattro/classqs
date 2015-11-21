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
 $("#questioncloseH").remove();
  $("#currentquestion").append('<div class="panel panel-primary quespan">'
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
            $("#astart").append('<button type="button" class="btn btn-default btn-lg box-shadow--8dp btn-block ansbtn" id="'+i+'"><h3>'+this+'</h3></button>');
            i+=1;
                 });
           $("#substart").append('<button type="button" class="btn btn-success btn-block" id="submitbtn"><h3 id="submittxt">Submit Answer</h3></button>');
            $('.btn-block').css('margin','20px 0px');
            $('.anstable').css('background-color','#B8B8B8 ');
            $( ".btn-block" ).on( "click", function() {
            $('button.active').removeClass("active");
            $(this).addClass("active");
              });

}  //end append question

//function to show quesiton is closed
function closeq(){
  $(".quespan").remove();
  $("#currentquestion").append('<h1 text-center id="questioncloseH">Current Question is Closed</h1>')
  $('#currentquestion').css('text-align','center');
}


     });


