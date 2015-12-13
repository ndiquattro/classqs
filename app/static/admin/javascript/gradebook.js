 $(document).ready(function(){
$("#rsltdrop").addClass('active')

$(".clickable").on("click", function(){
	var txtval = $(this).text() 
	var trwidth = $(this).parent().width();
	$(this).parent().append('<input type="text"  style="text-align:center; font-size:18px" class="form-control namefield text-centered" id="'+txtval+'" placeholder=""></div>')
	$('#'+txtval).val(txtval)
	var len = $('#'+txtval).val().length
	

	atext = ('<div class="warningmsg"><div style="display: none; padding-top:15px" class="warning">'
		+'This will permanently change this students name, is that ok?</div>'
		+'<button class="btn btn-success yesbtn" style="margin:10px" type="button">Yes</button>'
		+'<button class="btn btn-primary nobtn" style="margin:10px" type="button">No</button></div>')
	
	$(this).parent().append(atext)
	$(this).parent().find(".warning:last").slideDown("fast");
	$(this).parent().css('width', trwidth);
	$(this).remove();
	
$(".nobtn").on("click", function(){
 // $(this).parent().parent().append('<div class = "clickable padded">Adam</div>')
	console.log($(this).parent().parent().find(".namefield").val())

  	 $(this).parent().parent().append('<div style="text-align:center" class = "clickable padded">Adam</div>')
  	 $(this).parent().parent().find(".namefield").remove()
  	 $(this).parent().remove()
	// $(this).closest(".warningmsg").slideUp("fast");
	
	

})

})



})

