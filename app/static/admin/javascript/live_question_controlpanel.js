 $(document).ready(function(){

var QuestionName = "Question 1  ";
var QuestionTXT = "What is a Buffalo?";

 $("#currentquestion").append('<div class="panel panel-default">'
          +'<div class="panel-heading"><b><h4>'+QuestionName+'</b><span class="label label-info">Live!</span></h4></div>'
          +'<div class="panel-body"><h3>'
            +''+QuestionTXT+''
          +'</h3></div>'
          +'<table class="table">'
         +'<tbody>'
           +'<tr>'
        +'<td><b>Answer 1: </b>An animal with hair</td>'
           +'<tr>'
        +'<td><b>Answer 2: </b>A whiskey</td>'
          +'</tr>'
           +'<tr>'
        +'<td><b>Answer 3: </b>An ugly human</td>'
          +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

     });

