$(document).ready(function(){

var showalert;
var questionTotal = 0;
var alertvisable = false;
var savetxt = [];
var SavLoca = $("#dropdownMenu1").text();
var CorrectLocTxt = $("#CorrectdropdownMenu").text();
var corrNum;
$('#SaveBtn').popover({content: "Blabla", trigger: "manual", html: true});

//populate save folder dropdown
  $.getJSON(getuserinfo_route, function(data) {

  $.each(data.folders, function( key, value ){
var fullMessage1 = '<li class ="SaveFolder"><a role="button">'+value+'</li>'
$("#folddrop").append(fullMessage1);

			});
  	 });


//Get correct Answer and populate dropdown
$("#CorrectdropdownMenu").click(function(){


 $('.CorrAns').remove();
var questionTotal = 0;



$('.AnsClass').each(function(index, value){
var fullMessage = '<li class ="CorrAns" id ="'+(questionTotal)+' "><a role="button">Answer '+(questionTotal +1)+'</a></li>';
$("#correctdrop").append(fullMessage);

questionTotal += 1;
});

noAnwertxt = '<li class ="CorrAns" id ="NoneCorrect"><a role="button">None</a></li>';
$("#correctdrop").append('<li class="divider CorrAns"></li>');
$("#correctdrop").append(noAnwertxt);

});

$("#correctdrop").on('click', '.CorrAns', function(){
		var textname = this.textContent;
			corrNum = this.id;
	$("#CorrectdropdownMenu").text(textname);

});

//input number of answer choices
$('#Num').on('input', function() {

//get current inputs
var answerObj = [];
 $('.AnsClass').each(function(){

	answerObj.push($(this).val());
 })

var QuesNum = $('#Num').val();

NumDiff = answerObj.length - QuesNum;


if(NumDiff>0){
	
	var pclass = $('.PAnsClass').get().reverse();



	$.each (pclass, function(){

		if($(this).index() > (QuesNum-1)){
		$(this).slideUp("fast", function(){

			$(this).remove();
		});
		
	}

	});


}

	//Create Answers
	for (var i = answerObj.length; i < QuesNum; i++) {
		var QuesHeader = 'Answer ' + (i+1) + ':';
		var QuesTag = 'Answer' + (i+1);
		var fullHtml = '<div style="display: none;" class="form-group PAnsClass"> <label for='+QuesTag+'>'+QuesHeader+'</label><input type="text" class="form-control AnsClass" id='+QuesTag+'></div>';
		$("#startQues").append(fullHtml);
		$('#startQues').find(".PAnsClass:last").slideDown("fast");
		$('#' + QuesTag).val(answerObj[i]);
	}


});

//Change or modify save location
$("#NewLoc").click(function(){

  $("#SLocPanel").slideDown("slow");

	if (savetxt == ""){

	$("#dropdownMenu1").text("(please type new location)");
  	}else{
	$("#dropdownMenu1").text(savetxt);

	}
});

$("#folddrop").on('click', '.SaveFolder', function(){
		var textname = this.textContent;
		$("#dropdownMenu1").text(textname);
  $("#SLocPanel").slideUp("slow");


});

//UpdateSaveName
$("#LocName").on('input', function() {
savetxt = $(this).val();
$("#dropdownMenu1").text(savetxt);
if(savetxt == ""){
	$("#dropdownMenu1").text("(please type new location)");
}

});

//hide popups when input is clicked
$(":input").on('input', function() {
	$('#SaveBtn').popover('hide');
	showalert = false;
});

$(document).on('input','.AnsClass', function() {
	$('#SaveBtn').popover('hide');
	showalert = false;
});

//hide popups when certain buttons are clicked
$(".btn").not("#SaveBtn").click(function() {
	$('#SaveBtn').popover('hide');
	showalert = false;
});

//Submit form
$("#SaveBtn").click(function(){
	
var alertstring =[];
var AnswerString = [];
var QuestionName = $("#Qname").val();
var SaveLocation = $("#dropdownMenu1").text();
var QuesText = $("#Question").val();
var NumAns = $("#Num").val();
var CorrectAns = $("#CorrectdropdownMenu").text();
CorrectAns = CorrectAns.replace(/\s+/g, '');
var CorrectAnsTXT =$("#"+CorrectAns).val();


$('.AnsClass').each(function(){
	if($(this).val() != ""){
	AnswerString.push($(this).val());
	}else{
		alertstring.push("<li>Can Not Have Blank Answers</li>")
		showalert = true;

		return false;

	}
});


if(QuestionName===""){
alertstring.push("<li>Please Enter Question Name </li>")
showalert = true;
}

if(SaveLocation=="(please type new location)" || SaveLocation=="New Location" || SavLoca  == SaveLocation ){
alertstring.push("<li>Please Complete Save Location </li>")
showalert = true;
}

if(QuesText===""){
alertstring.push("<li>Please Fill-Out Question</li>")
showalert = true;
}

if(NumAns<1){
alertstring.push("<li>Need At Least 1 Answer</li>")
showalert = true;
}

if(CorrectAns== CorrectLocTxt){
	alertstring.push("<li>Choose Correct Answer (or Select 'None')</li>")
	showalert = true;
}

if(showalert){
	var popover = $('#SaveBtn').data('bs.popover');
	if(alertstring != ""){
	popover.options.content = alertstring;
	popover.setContent();
	popover.$tip.addClass(popover.options.placement);
	$('#SaveBtn').popover('show');
	showalert = false;
		}
}else{

//Check if there is no correct answer
 if(typeof CorrectAnsTXT === 'undefined'){
   CorrectAnsTXT = "none";
 };


//Construct answer array
Answers = [];


 for (var i = 0; i<NumAns; i++){
 	var key = AnswerString[i];
	Answers.push(key);		
		

};




//Returns successful data submission message when the entered information is stored in database.

var dataArray = {
	"FolderName" : SaveLocation,
	"QuesName" : QuestionName,
	"NAns" : NumAns,
	"QuesTxt" : QuesText,
	"CorrAns" : corrNum,
	"Answers" : Answers
};

var dataJSON = JSON.stringify(dataArray);

//AJAX Code To Submit Form.
	$.ajax({

type: "POST",
url: createq_route,
data:  dataJSON,
dataType: 'json',

success: function(response){


window.location= response.urlr;
	},
	error: function(error) {
                
                console.log('Error:', error);
            }

});

return false;


}



});




});

