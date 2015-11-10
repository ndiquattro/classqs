$(document).ready(function(){

var questiontxt = "Who is the King of England?"

$("#currentquestion").append('<div class="panel panel-primary">'
          +'<div class="panel-heading" align="center"><h3 class ="text-center"><h3>'+questiontxt+'</h3>'
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


$("#astart").append('<button type="button" class="btn btn-default btn-lg box-shadow--8dp btn-block ansbtn"><h3>President Kenedy</h3></button>');
$("#astart").append('<button type="button" class="btn btn-default btn-lg box-shadow--8dp btn-block ansbtn"><h3>Fred Flintstone</h3></button>');
$("#astart").append('<button type="button" class="btn btn-default btn-lg box-shadow--8dp btn-block ansbtn"><h3>Jeff</h3></button>');
$("#substart").append('<button type="button" class="btn btn-success btn-block" id="submitbtn"><h3 id="submittxt">Submit Answer</h3></button>');

$('.btn-block').css('margin','20px 0px');
$('.anstable').css('background-color','#B8B8B8 ');


$( ".btn-block" ).on( "click", function() {
$('button.active').removeClass("active");
 $(this).addClass("active");

});



     });


