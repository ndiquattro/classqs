 $(document).ready(function(){

$("#rsltdrop").addClass('active')

//get results
$.getJSON(results_route , {
        r: room_code,   

      }, function(data) {
    
        var results = data['results'];
        for(i = 0; i<results.length; i++){
        
        percentage =  Math.floor((results[i]['numcorrect'])/(results[i]['totalresponse']) * 100)
        if(isNaN(percentage)){percentage=0}

			$("#resultbody").append('<tr>'
        +'<td><div>'+results[i]['dateasked']+' '+results[i]['timeasked']+'</div></td>'
        +'<td><div>'+results[i]['qtxt']+'</td>'
        +'<td><div>'+results[i]['totalresponse']+'</div></td>'
        +'<td><div>'+percentage+'%</div></td>'
        +'<td><div><button class="btn btn-default statbtn" id="s'+results[i]['archid']+'"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span>View Results</button></div></td>'
        +'<td><div><button class="btn btn-default deletebtn" id="d'+results[i]['archid']+'"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Delete</button></div></td>'
     	+'</div></tr>')
     	};

			$("td").css("max-width", "600px");

        //brings up chart of the results
  			$('.statbtn').on('click', function() {
  				var archid = ($(this).attr("id")).slice(1)
          var urlstring 
          urlstring = String(resulturl)
          urlstring = urlstring.substring(0, urlstring.length - 1) + archid;
  				window.open(urlstring, "", "width=1000, height=1000");

			});

        //deletes question from the archive
        $('.deletebtn').on('click', function() {
          var archid = ($(this).attr("id")).slice(1)
          var thisid = $(this).attr("id")

              var dataArray = {
             "quid" : archid
                };

                var dataJSON = JSON.stringify(dataArray);

                $.ajax({
                type: "POST",
                url: delete_route,
                data:  dataJSON,
                dataType: 'json',

                success: function(response){
                console.log('Success:', response['message'])
                

                $("#"+thisid).closest('tr').children('td').children('div').fadeOut(500, function(){
                  $("#"+thisid).closest('tr').children('td').slideUp(500, function(){

                })
                 })
               

                  },
                  error: function(error) {
                                
                                console.log('Error:', error);
                            }

                });//end add to db


      });

        });


});