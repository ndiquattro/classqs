$(document).ready(function(){

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
        +'<td><a href="#" class="btn btnSelect quesbtn btn-Info" id="'+this.QuestionID+'">Ask Live!</a></td>'
           +'</tr>'
           +'</tbody>'
           +'</table>'
          +'</div>');

               });
          });

        });

$("#result").on('click','.quesbtn', function(){

var dataArray = {
  "quesid" : this.id
};

var dataJSON = JSON.stringify(dataArray);

$.ajax({
type: "POST",
url: add_room_currques_route,
data:  dataJSON,
dataType: 'json',
success: function(response){
    console.log(response.urlr);
    window.location = response.urlr;
  },
  error: function(error) {
                
                console.log('Error:', error);
            }

});
        
      });




  });


