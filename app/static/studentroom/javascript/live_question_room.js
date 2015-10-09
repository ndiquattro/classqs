$(document).ready(function(){

var questiontxt = "Who is the King of England?"

$("#currentquestion").append('<div class="panel panel-primary">'
          +'<div class="panel-heading"><h3 class ="text-center"><h3>'+questiontxt+'</h3></div>'
          +'<table class="table">'
         +'<tbody class="anstable" id="astart">'
          +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');


$("#astart").append('<button type="button" class="btn btn-default btn-lg btn-block"><h4>President Kenedy</h4></button>');
$("#astart").append('<button type="button" class="btn btn-default btn-lg btn-block"><h4>Fred Flintstone</h4></button>');
$("#astart").append('<button type="button" class="btn btn-default btn-lg btn-block"><h4>Jeff</h4></button>');

$('.btn-block').css('margin','15px 0px');
$('.anstable').css('background-color','WhiteSmoke');


     });


