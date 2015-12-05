 $(document).ready(function(){

var intervalfunct;
var duration;
var timer;
var reset;
var live;
var nextquestid;
var nextquestionselected = false;
var countdown = false;
var paused = true;
var currqjson;
var timer_reset_enabled = false;
//get current question for room
 $.getJSON(getroomroute , {
        r: room_code,   

      }, function(data) {
        $(".currquespan").remove();
        $("#currentquestion").append('<div class="panel panel-default currquespan" id='+data.quid+'>'
          +'<div class="panel-heading"><h4>Title: '+data.qname+''+"&nbsp &nbsp &nbsp &nbsp"+'<span class="livelabel" id="statuslabel">Question is Live!</span></h4></div>'
          +'<div class="panel-body"><h1><b>'
            +''+data.qtxt+''
          +'</b></h1></div>'
          +'<table class="table">'
          +'<tbody id="ans">'
          +'</tbody>'
          +'</table>'
          +'</div>');  

           var i =0;
           $.each(data.answers, function(){
            i+=1;
           $("#ans").append('<tr>'
           +'<td><h3><b>'+i+') </b>'+this+'</h3></td>'
           +'<tr>');    
           
        });

           if(data.islive==0){
            
            closequestion(false);
           
           }else { 
        
            storeq(data);
          }

     });



//Display folder names
  $.getJSON(getuserinfo_route, function(data) {

//append list for folders
  $.each(data.folders, function( key, value ){
 
    var temp = '<li class ="btnSelect" ><a role="button">'+value+'</a></li>';
    $("#folderselect").append(temp);


              });
 

  });

//display folder contents
  $("#folderselect").on('click', '.btnSelect', function(){

   var textname = this.textContent;
  $(".quespanel").remove();
    foldername = this.textContent;

      $.getJSON(getquestions_route, {
        Folder: foldername,
       
      }, function(data) {

        $.each(data.questions, function(){

          $("#result").append('<div class="panel quespanel panel-default pull-left" style="width: 350px; margin:10px">'
          +'<div class="panel-heading"><b>Question:</b><span>'+this.QuestionName+'</span></div>'
          +'<div class="panel-body">'
            +''+this.QuestionTXT+''
          +'</div>'
          +'<table class="table">'
         +'<tbody>'
           +'<tr>'
        +'<td><a href="#" class="btn btnSelect quesbtn btn-Info" id="'+this.QuestionID+'">Select</a></td>'
           +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

               });
                //store info for current quesiton
                storeq(data);
          });

        });

//select next question
  $("#result").on('click','.quesbtn', function(){
  nextquestid = this.id;
  nextquestionselected = true;
$("#nextbtn").text('Start Next Question'); 

if(live==false){
 $("#nextbtn").toggleClass("btn-primary btn-success")
}
$(".quespanel").remove();
$(".nextqueshead").remove();
$.getJSON(getquesbyid_route, {
        quesid: this.id,   

      }, function(data) {

        $("#nextquestion").append('<div class = "col-md-8">'
          +'<div class="panel quespanel panel-default">'
          +'<div class="panel-heading"><h3>Next Question:</h3></div>'
          +'<div class="panel-body"><h2><b>'
            +''+data.qtxt+''
          +'</b></h2></div>'
          +'<table class="table">'
          +'<tbody id="ansnext">'
          +'</tbody>'
          +'</table>'
          +'</div>'
          +'</div>'
          +'</div>');  

           var i =0;
           $.each(data.answers, function(){
            i+=1;
           $("#ansnext").append('<tr>'
           +'<td><h4><b>'+i+') </b>'+this+'</h4></td>'
           +'<tr>');    
           
        });


     });
        
      }); //select next question

// Toggle start/pause on timer
$(document).on('click','button.start', startime);
$(document).on('click','button.pause', pausetime);

// Function for starting Countdown timer
 function startime(){
    timer_reset_enabled = true;
    countdown = true;

    $("#strbtn").text('Pause');
    $(this).toggleClass("btn-info start pause");

    function startTimer(duration, display) {
      timer = duration, minutes, seconds;
    }

        intervalfunct = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
            closequestion(true);
            reset = true;
            clearInterval(intervalfunct);
            countdown = false;
        }
    }, 1000);


  if(paused !=true && reset !=true){
    var min = parseInt($("#minutes").val(), 10); 
    var sec = parseInt($("#seconds").val(), 10); 
    min = min || 0
    sec = sec || 0
    timedur = (min*60)+sec;
         }else{timedur = timer}

          display = $('#time');
          startTimer(timedur, display);
    paused = false;
    reset = false;
    }; //Timer function


 //Function for pausing countdown
 function pausetime(){
   countdown = false;
    paused = true;
   $("#strbtn").text('Resume');
   $(this).toggleClass("btn-info start pause");
     clearInterval(intervalfunct);
}; //Pause function


  //change timer based on input
  $('.timeinput').on('input', function() {
     resettime();

    }); //input change function

  //reset timer button
  $('#resetbtn').on('click', function() {
     countdown = false;

      reset = true;
      $('#strbtn').show();
      clearInterval(intervalfunct);
      resettime();
      if(paused != true && timer_reset_enabled == true){
        $('#strbtn').toggleClass("btn-info");
        $('#strbtn').toggleClass("start pause");
      }

      $("#strbtn").text('Start');
      });//end reset

//function to reset the timer to the input field
  function resettime(){
    reset = true;
    var minutes = parseInt($("#minutes").val(), 10); 
    var seconds = parseInt($("#seconds").val(), 10); 
    minutes = minutes || 0;
    seconds = seconds || 0;
    timer = (minutes*60)+seconds;
    duration = timer;
    min = minutes < 10 ? "0" + minutes : minutes;
    sec = seconds < 10 ? "0" + seconds : seconds;
    $('#time').text(min + ":" + sec);

  } //end reset

  //btn to end question
  $('#endbtn').on('click', function() {
        resettime();
        if( countdown == false || paused ==true){
        $('#strbtn').toggleClass("btn-info");
        $('#strbtn').toggleClass("start pause");
         $("#strbtn").text('Start');
       }
       paused = false;
    closequestion(true);
    countdown = false;
  });

//function to end quesion
function closequestion(sendtoroom) {
   timer_reset_enabled = false;
   
  //tell student room to close
  if (sendtoroom == true){
  sendstudentroom(0, null);
}
  if(live !=false){
    $('#endbtn').prop('disabled', true);
    $("#statuslabel").text('Question has Ended');
    $('#statuslabel').toggleClass("livelabel closedlabel");
    clearInterval(intervalfunct);
      $("#endpanel").slideDown("slow");

         if(nextquestid == null || nextquestionselected == false){
       $("#nextbtn").text('Select Next Question');  
        $("#nextbtn").toggleClass("btn-primary btn-success")
     }
   
              $('#strbtn').slideUp();
              $('#resetbtn').slideUp();
             


  }
    clearInterval(intervalfunct);
    //store in room db that question is ended (islive = 0)
    start_end_db(0);
    updateroomlabel(false);
    live = false;
}

//restart question btn
$('#restartbtn').on('click', function() {
  
  restartquestion();

});

//function to restart question
function restartquestion() {

  //send current question to student room
  sendstudentroom(1, currqjson);

 if(live !=true){

  $('#strbtn').slideDown();
  $('#resetbtn').slideDown();
   resettime();
   if(paused != true){
        $('#strbtn').toggleClass("btn-info");
        $('#strbtn').toggleClass("start pause");
      }

      $("#strbtn").text('Start');
  $('#endbtn').prop('disabled', false);
   $("#statuslabel").text('Question is Live!');
    $('#statuslabel').toggleClass("livelabel closedlabel");
    $("#endpanel").slideUp("slow");
     start_end_db(1);
     live = true;
 }

  updateroomlabel(true);
}

//click button to change to next question or select new question
$('#nextbtn').on('click', function() {
if(nextquestid==null || nextquestionselected==false){
 $('.nav-tabs > .selectab').find('a').trigger('click');   
    } 
    //if the next question is selected send the current ques to the db 
    //also change and start current question
  else{

    changecurrentques();
  }


});

//function to change the current room question in the db and on the control page, also starts the question
function changecurrentques(){

//enable the endquestionbutton
$('#endbtn').prop('disabled', false);

$('#strbtn').slideDown();
$('#resetbtn').slideDown();
 resettime();
 if(paused != true){
        $('#strbtn').toggleClass("btn-info");
        $('#strbtn').toggleClass("start pause");
      }

      $("#strbtn").text('Start');
//there is now no next question selected
nextquestionselected = false;

//add next question to db
var dataArray = {
  "quesid" : nextquestid
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: add_room_currques_route,
data:  dataJSON,
dataType: 'json',

success: function(response){
console.log('Success:', response)
  },
  error: function(error) {
                
                console.log('Error:', error);
            }

});//end add to db

//get rid of current question
$(".currquespan").remove();

//remove the next question and swith the tabs
$(".quespanel").remove();
$(".nextqueshead").remove();
$('.nav-tabs > .currtab').find('a').trigger('click'); 

//append new question
$.getJSON(getquesbyid_route, {
        quesid: nextquestid,   

      }, function(data) {

        $("#currentquestion").append('<div class="panel panel-default currquespan" id='+data.quid+'>'
          +'<div class="panel-heading"><h4>Title: '+data.qname+''+"&nbsp &nbsp &nbsp &nbsp"+'<span class="livelabel" id="statuslabel">Question is Live!</span></h4></div>'
          +'<div class="panel-body"><h1><b>'
            +''+data.qtxt+''
          +'</b></h1></div>'
          +'<table class="table">'
          +'<tbody id="ans">'
          +'</tbody>'
          +'</table>'
          +'</div>');  

           var i =0;
           $.each(data.answers, function(){
            i+=1;
           $("#ans").append('<tr>'
           +'<td><h3><b>'+i+') </b>'+this+'</h3></td>'
           +'<tr>');       
           
                });

            //update the student room with new quesiton
            sendstudentroom(1, data);
            //store info for current quesiton
            storeq(data);
         
            });

//make question live
 $("#endpanel").slideUp("slow");
 updateroomlabel(true);
  live = true;

}//end starting next question

//tell database to end/start current question
function start_end_db(islive){

var dataArray = {
            "islive" : islive
                  };
      var dataJSON = JSON.stringify(dataArray);
      $.ajax({
      type: "POST",
      url: togglelive_route,
      data:  dataJSON,
      dataType: 'json',
      success: function(response){
     
                },
      error: function(error) {          
                console.log('Error:', error);
            }
      });


}//end start_end_db

//update the live label
function updateroomlabel(is_live){
  $("#roomhref").remove();

      if(is_live == true){
    $("#roomlink").append('<a href=# id="roomhref"><span class="glyphicon glyphicon-stats" '
              +'aria-hidden="true"></span>Question Room <span class="label livehead label-primary">Live!</span></a>')
    }else{
      $("#roomlink").append('<a href=# id="roomhref"><span class="glyphicon glyphicon-stats" '
              +'aria-hidden="true"></span>Question Room <span class="label livehead label-danger">Question Ended</span></a>')
    }
}//end live label


//function that updates the student room
function sendstudentroom(islive, qjson){

//check if live, if qjson is null look it up
if(islive == 1 && qjson == null ){

 $.getJSON(getroomroute , {
        r: room_code,   

      }, function(data) {
      
        var dataArray = {
            "data" : data,
            "roomcode" : room_code
                  };
      var dataJSON = JSON.stringify(dataArray);
      $.ajax({
      type: "POST",
      url: archiveq_route,
      data:  dataJSON,
      dataType: 'json',
      success: function(response){
          
           sendtoroom(1 , response['qdata'])
     
                },
      error: function(error) {          
                console.log('Error:', error);
            }
      });

      
      });

} else if(islive == 1 && qjson != null){
  
var dataArray = {
            "data" : qjson,
            "roomcode" : room_code
                  };
      var dataJSON = JSON.stringify(dataArray);
      $.ajax({
      type: "POST",
      url: archiveq_route,
      data:  dataJSON,
      dataType: 'json',
      success: function(response){
      
              sendtoroom(1, response['qdata'])
                },
      error: function(error) {          
                console.log('Error:', error);
            }
      });

} else if (islive == 0 && qjson == null){
sendtoroom(0, null)
}

//send to student room
function sendtoroom(islive, qjson){



var dataArray = {
            "islive" : islive,
            "qjson" : qjson
                  };
      var dataJSON = JSON.stringify(dataArray);
      $.ajax({
      type: "POST",
      url: sroompost_route,
      data:  dataJSON,
      dataType: 'json',
      success: function(response){
     
                },
      error: function(error) {          
                console.log('Error:', error);
            }
      });
}

}//end send to student room

//button to get the results of the question
$('#resultbtn').on('click', function() {

window.open(result_route+room_code, "", "width=1000, height=1000");

  }); 


//store current quesiton
function storeq(q){currqjson = q}

  }); //end on document ready