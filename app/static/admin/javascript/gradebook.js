 $(document).ready(function(){


$('#partinput').on('focus', function(){
            // Get the value when input gains focus
            $(this).data('oldVal', $(this).val()  );

       });

$('#partinput').on('input', function() { 
	var oldval =  $(this).data('oldVal')
   var newval = $(this).val() // get the current value of the input field.
   updateparticipation(oldval, newval)
 	$(this).data('oldVal', newval  );
});

//make navbar active 
$("#rsltdrop").addClass('active')

$("#overviewtable").find("th").css("width", "150px")
 $(".sortable").mouseenter(function(){
        $(this).css('background-color', 'rgba(233, 233, 233, 0.5)')
         $(this).css("cursor", "pointer")
          $(this).find("span").css("display", "inline-block") 

    });
  $(".sortable").mouseleave(function(){
        $(this).css('background-color', 'rgb(255, 255, 255)')
         $(this).find("span").css("display", "none")  
    });


//get gradebook data
$.getJSON(gradebookscores_route, {
        r: room_code,   

      }, function(data) {
      	

    //fill in overview  	
      	test =[]
		//fill the overview tab
		for (var s in data['studentdata']){

			var numans = Object.keys(data['studentdata'][s]['answers']).length 
			var numcorr = 0
			//get number of correct answers
			for (var ac in data['studentdata'][s]['answers']){
					if(data['studentdata'][s]['answers'][ac]['answered_correctly'] == 1){
						numcorr += 1
					}
			}

			var nameappendstring = '<tr class="s'+s+'">'
			    +'<td><div class="ifield">'
			    +'<input type="text"  style="text-align:center; font-size:18px; display:none" class="form-control namefield text-centered">' 
			    +'<div class = "clickable padded textdisplay">'+data['studentdata'][s]['firstname']+'</div>'
			    +'<div class="warningmsg padded" style="display:none"><div class="warning padded"><h4>'
			    +'This will permanently change the name, is that ok?</h4></div>'
			    +'<div class="row"><div class="col-sm-6"><button class="btn btn-block btn-success yesbtn padded"  type="button">Yes</button></div>'
			    +'<div class="col-sm-6"><button class="btn btn-block btn-primary nobtn padded" type="button">No</button></div></div>'
			   +'</div>'
			    +'</div>'
			    +'</td>'
			    +'<td><div class="ifield">'
			    +'<input type="text"  style="text-align:center; font-size:18px; display:none" class="form-control namefield text-centered">'
			    +'<div class = "clickable padded textdisplay">'+data['studentdata'][s]['lastname']+'</div>'
			    +'<div class="warningmsg padded" style="display:none"><div class="warning padded"><h4>'
			    +'This will permanently change the name, is that ok?</h4></div>'
			    +'<div class="row"><div class="col-sm-6"><button class="btn btn-block btn-success yesbtn padded"  type="button">Yes</button></div>'
			    +'<div class="col-sm-6"><button class="btn btn-block btn-primary nobtn padded"  type="button">No</button></div></div>'
			   	+'</div>'
			    +'</div>'
			    +'</td>'
	
			$("#overviewbody").append(nameappendstring
			    +'<td><div class = "padded stotalpart">'+numans+'</div></td>'
			     +'<td><div class = "padded stotalcorr">'+numcorr+'</div></td>'
			   	+'</tr>')


		}


//change name
$(".clickable").on("click", function(){ 
	
	var txtval = $(this).text() 
	$(this).parent().find(".textdisplay").css("display", "none")
	$(this).parent().find(":input").css("display", "block")
	$(this).parent().find(":input").val(txtval)
	$(this).toggleClass("clickable")
	h = $(this).parent().find(".warningmsg").height();
	$(this).parent().find(".warningmsg").css("height", "200px")
	$(this).parent().find(".warningmsg").slideDown(400);
	w = $(this).closest('td').find(".ifield").width()
	$(this).closest('td').css('width', "150px" );
	
})	

$(".yesbtn").on("click", function(){
	td = $(this).closest("td")
	$(this).closest(".warningmsg").slideUp("fast");
	txt = td.find(":input").val();
	td.find(".textdisplay").text(txt)
	td.find(".textdisplay").css("display", "block")
	td.find(".textdisplay").css("padding", "6px 5px")
	td.find(".textdisplay").toggleClass("clickable")
	td.find(".form-control").css("display", "none")
	
})


$(".nobtn").on("click", function(){

	$(this).closest(".warningmsg").slideUp("fast");
	td = $(this).closest("td")
	td.find(":input").text()
	td.find(".textdisplay").css("display", "block")
	td.find(".textdisplay").css("padding", "6px 5px")
	td.find(".textdisplay").toggleClass("clickable")
	td.find(".form-control").css("display", "none")
	
})//end change name
	//bring in table sorter
 $("#overviewtable").tablesorter({ 
        // sort on the first column  order asc 
        sortList: [[1,0]] 
    }) 

 //end fill in overview 


 //fill in Participation Points tab
	
		// create table
		// fill in head
		var nameheaderstring = '<tr>'
		      +'<th ></th>'
		      +'<th  ></th>'
		var dataheaderstring1 = '<tr>'
		var dataheaderstring2= '<tr>'
		$('#participationnamesheader').append(nameheaderstring+'</tr>')

			 for (var q in data['questiondata']){

			 	dataheaderstring1 += ('<th class="qinfo" >' 							
					+'</th>')

			 	dataheaderstring2 += ('<th class="qinfo" style="height:100px">' 		
					+'<span class="datetime">'+data['questiondata'][q]['date']+'<br >'+data['questiondata'][q]['time']+'</span><br><a id = "p'+q+'" class="btn popoverData" href="#" data-content="'+data['questiondata'][q]['qtxt']+'" rel="popover" data-html="true" data-placement="bottom" data-original-title="Title: <b>'+data['questiondata'][q]['qname']+'</b>" data-trigger="hover">'+data['questiondata'][q]['qname']+'</a>'
					+'</th>')							

			}


for  (var s in data['studentdata']){
				
				var namebodystring = null
				var databodystring = null
				namebodystring +='<tr style="height:50px;"><td>' 
			    +'<div class = " padded ">'+data['studentdata'][s]['firstname']+'</div>' 
			    +'</td>'
			    +'<td class="headcol">'
			    +'<div class = "padded ">'+data['studentdata'][s]['lastname']+'</div>'
			    +'</td>'

			    $('#participationnamesbody').append(namebodystring+'</tr>')
			     $('#participationnamesbody').append(namebodystring+'</tr>')

							for  (var a in  data['questiondata']){

								if (data['studentdata'][s]['answers'][a] != null){
									databodystring += '<td class="partscore" style="text-align:center; font-size:16px; padding:14px">1</td>' 
									
								} else {databodystring += '<td class="partscore" style="text-align:center; font-size:16px; padding:14px">0</td>' }
							}


					
					$('#participationbody').append('<tr style="height:50px">'+databodystring+'</tr>')
					$('#participationbody').append('<tr style="height:50px">'+databodystring+'</tr>')
					}

					

			    dataheaderstring1 += +'</tr>'
			    dataheaderstring2 += +'</tr>'
			$('#participationheader').append(dataheaderstring1)
			$('#participationheader2').append(dataheaderstring2)

$(".popoverData").css('margin', '0px')
$(".popoverData").css('padding', '0px')
$(".datetime").css('font-size', '14px')
$(".datetime").css('font-weight', 'normal')
$(".overflowtable").css('overflow', 'auto')
$(".rowoverflow").css('overflow', 'auto')
$("#nameoverflow").css('overflow', 'hidden')
$("#headeroverflow").css('overflow', 'hidden')

$("#participationtable td, th").css('width', '150px')
$("#participationtable2 td, th").css('width', '150px')
$("#participationtable2 a").css('text-overflow', 'ellipsis')
$("#participationtable2 a ").css('overflow', 'hidden')
$("#participationtable2 a").css('white-space', 'nowrap')

  $(".sortable").mouseenter(function(){
		        $(this).css('background-color', 'rgba(233, 233, 233, 0.5)')
		         $(this).css("cursor", "pointer")
		          $(this).find("span").css("display", "inline-block") 
		    })
		  $(".sortable").mouseleave(function(){
		        $(this).css('background-color', 'rgb(255, 255, 255)')
		         $(this).find("span").css("display", "none")  
		    });


$('.popoverData').popover();
$('.popoverData').on('click', function() {
  		
  			var archid = ($(this).attr("id")).slice(1)		
          var urlstring 
          urlstring = String(resulturl)
          urlstring = urlstring.substring(0, urlstring.length - 1) + archid;
  				window.open(urlstring, "", "width=1000, height=1000");

			});


  var target1 = $("#nameoverflow");
   var target2 = $("#headeroverflow");
  $("#partoverflow").scroll(function() {
    target1.prop("scrollTop", this.scrollTop)
          target2.prop("scrollLeft", this.scrollLeft);
  });

getpartsettings();

});//end get gradebook data


//get room settings
function getpartsettings() {
$.getJSON(getroomopts_route, {
        r: room_code

      }, function(data) {
      	//update participanttab
		var partmult = data['roomdata']['pointpart']
		$("#partinput").val(partmult)
		//store the value of the participation and corr ans input
		$('#partinput').data('oldVal',  partmult );

		$('.partscore').each(function(){
				
			var oldscore = parseInt($(this).text())
			var updatedscore = oldscore/oldscore * partmult
			if (isNaN(updatedscore)){updatedscore=0}
			$(this).text(updatedscore)


      	})

      		//update summary tab
      	$('.stotalpart').each(function(){	
      	
			var oldscore = parseInt($(this).text())
			var updatedscore = oldscore * partmult
	
			if (isNaN(updatedscore)){updatedscore=0}
			$(this).text(updatedscore)

	})

		

      	});
}

//update participation points
function updateparticipation(oldmult, newmult){

	if (newmult>0){

$.getJSON(setroomopts_route, {
        r: room_code,
        ppart: newmult

      }, function(data) {
	var partmult = data['pdata']
		//update participation tab
		$('.partscore').each(function(){

			var updatedscore = parseInt($(this).text())/oldmult * partmult
			if (isNaN(updatedscore)){updatedscore=0}
			$(this).text(updatedscore)
		
      	})
      	//update summary tab
      	$('.stotalpart').each(function(){	
    
			var updatedscore = parseInt($(this).text())/oldmult * partmult
			if (isNaN(updatedscore)){updatedscore=0}
			$(this).text(updatedscore)
      	})

		});
	}



}//end update score

})

