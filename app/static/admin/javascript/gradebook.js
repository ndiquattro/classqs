 $(document).ready(function(){

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
      	console.log(data['studentdata'])

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


			
			$("#overviewtable").append('<tr id="s'+s+'">'
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
			    +'<td><div class = "padded">'+numans+'</div></td>'
			     +'<td><div class = "padded">'+numcorr+'</div></td>'

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
	console.log($(this).closest('tr').attr("id"))
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
        // sort on the first column and third column, order asc 
        sortList: [[1,0]] 
    }) 


});//end get gradebook data


})

