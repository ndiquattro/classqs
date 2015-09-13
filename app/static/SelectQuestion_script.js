$(document).ready(function(){


      $.getJSON('/getQuestions', {
        Folder: "TestFolder",
       
      }, function(data) {

        $("#result").text(data.QuestionName);

        console.log(data);
      });



});