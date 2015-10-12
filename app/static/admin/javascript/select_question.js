$(document).ready(function(){



  $.getJSON(getuserinfo_route, function(data) {

//append buttons for folders
  $.each(data.folders, function( key, value ){
    // var temp = $('<button type="button" class="btn btnSelect btn-default btn-lg">'
    //                   +'<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>'+value+''
    //                   +'</button>');

    var temp = '<li class ="btnSelect" ><a role="button">'+value+'</a></li>';
    $("#folderselect").append(temp);


              });
 

});


//display folder contents
$("#folderselect").on('click', '.btnSelect', function(){

   var textname = this.textContent;
  $("#foldertitle").text(textname);

  $(".panel").remove();
    foldername = this.textContent;

      $.getJSON(getquestions_route, {
        Folder: foldername,
       
      }, function(data) {
      
        $.each(data.questions, function(){

          $("#result").append('<div class="panel panel-default pull-left" style="width: 500px;">'
          +'<div class="panel-heading"><b>Question:</b><span>'+this.QuestionName+'</span></div>'
          +'<div class="panel-body">'
            +''+this.QuestionTXT+''
          +'</div>'
          +'<table class="table">'
         +'<tbody>'
           +'<tr>'
        +'<td><a href="'+controlpanel_route+'" class="btn btnSelect btn btn-Info">Ask Live!</a></td>'
           +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

     });


        });

       

        
      });

  });


