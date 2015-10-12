 $(document).ready(function(){

var QuestionName = "Question 1  ";
var QuestionTXT = "What is a Buffalo?";

 $("#currentquestion").append('<div class="panel panel-default">'
          +'<div class="panel-heading"><h4>'+QuestionName+'<span class="label label-info">Live!</span></h4></div>'
          +'<div class="panel-body"><h1><b>'
            +''+QuestionTXT+''
          +'</b></h1></div>'
          +'<table class="table">'
         +'<tbody>'
           +'<tr>'
        +'<td><h3><b>1) </b>An animal with hair</h3></td>'
           +'<tr>'
        +'<td><h3><b>2) </b>A whiskey</h3></td>'
          +'</tr>'
           +'<tr>'
        +'<td><h3><b>3) </b>An ugly human</h3></td>'
          +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

     });

