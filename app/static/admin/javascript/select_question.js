$(document).ready(function(){



  $.getJSON(getuserinfo_route, function(data) {

//append buttons for folders
  $.each(data.folders, function( key, value ){
    var temp = $('<button type="button" class="btn btnSelect btn-default btn-lg">'
                      +'<span class="glyphicon glyphicon-folder-open" aria-hidden="true"></span>'+value+''
                      +'</button>');

    $("#btns").append(temp);
    var temp2 = '<style type="text/css" id="styles">'
        +'.btnSelect {'
          +'margin: 5px;} </style>'
            
      $("#btns").append(temp2);

              });
 

});


//display folder contents
$("#btns").on('click', '.btnSelect', function(){
  $(".panel").remove();
    foldername = this.textContent;

      $.getJSON(getquestions_route, {
        Folder: foldername,
       
      }, function(data) {
      
        $.each(data.questions, function(){

          $("#result").append('<div class="panel panel-default pull-left">'
          +'<div class="panel-heading"><b>Question:</b><span>'+this.QuestionName+'</span></div>'
          +'<div class="panel-body">'
            +''+this.QuestionTXT+''
          +'</div>'
          +'<table class="table">'
         +'<tbody>'
           +'<tr>'
        +'<td><button type="button" class="btn btnSelect btn btn-Info">Ask Live!</button></td>'
        // +'<td>John</td>'
           +'</tr>'
        //    +'<tr>'
        // +'<td>John</td>'
        //   +'</tr>'
        //    +'<tr>'
        // +'<td>John</td>'
        //   +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

     });


        });

       

        
      });

  });


