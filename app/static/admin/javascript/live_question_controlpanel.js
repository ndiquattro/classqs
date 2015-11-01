 $(document).ready(function(){

var intervalfunct;
var paused;
var duration;
var timer;
var reset;

//get current question for room
 $.getJSON(getroomroute , {
        r: room_code,   

      }, function(data) {

        $("#currentquestion").append('<div class="panel panel-default">'
          +'<div class="panel-heading"><h4>'+data.qname+''+"  "+'<span class="label label-info">Live!</span></h4></div>'
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
        // $("#nextquestion").append('<div class = "col-md-8 text-center"><h2 id="foldertitle">'+textname+'</h2>');

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
          });

        });

//select next question
  $("#result").on('click','.quesbtn', function(){

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
      reset = true;
      clearInterval(intervalfunct);
      resettime();
      if(paused != true){
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

  }

  }); //end on document ready