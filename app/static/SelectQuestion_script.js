$(document).ready(function(){


  $.getJSON('/_getuserinfo', function(data) {

 console.log(data);

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
       

        console.log(data);
      });

  });



});