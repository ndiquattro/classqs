$(document).ready(function(){


  $.getJSON('/_getuserinfo', function(data) {

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



$('.btn').click(function(){

      $.getJSON('/_getquestions', {
        Folder: "TestFolder",
       
      }, function(data) {

for(var i = 0; i <1 ; i++){
      	$("#result").append('<div class = "col-sm-6">'
      				+'<div class="panel panel-default">'
				 	 +'<div class="panel-heading">Panel heading without title</div>'
				 	 +'<div class="panel-body">'
				   	 +'Panel content'
				 	 +'</div>'
					 +'</div>'
					+'</div>'
          +'<div class = "col-sm-6">'
              +'<div class="panel panel-default">'
           +'<div class="panel-heading">Panel heading without title</div>'
           +'<div class="panel-body">'
             +'test'
           +'</div>'
           +'</div>'
          +'</div>');
};
       

        
      });

  });



});