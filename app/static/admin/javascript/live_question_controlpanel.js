 $(document).ready(function(){

 $.getJSON(getroomroute , {
        r: room_code,   

      }, function(data) {

        $("#currentquestion").append('<div class="panel panel-default">'
          +'<div class="panel-heading"><h4>'+data.qname+''+"  "+'<span class="label label-info">Live!</span></h4></div>'
          +'<div class="panel-body"><h1><b>'
            +''+data.qtxt+''
          +'</b></h1></div>'
          +'<table class="table">'
          +'<tbody id="ans">'
          +'</tbody>'
          +'</table>'
          +'</div>');  

           var i =0;
           $.each(data.answers, function(){
            i+=1;
           $("#ans").append('<tr>'
           +'<td><h3><b>'+i+') </b>'+this+'</h3></td>'
           +'<tr>');    
           
        });



     });

  });