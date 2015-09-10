$(document).ready(function(){
var showalert;
var questionTotal = 0;
var alertvisable = false;
var savetxt = [];
var SavLoca = $("#dropdownMenu1").text();
var CorrectLocTxt = $("#CorrectdropdownMenu").text();

$('#SaveBtn').popover({content: "Blabla", trigger: "manual", html: true});

//Get correct Answer and populate dropdown
$("#CorrectdropdownMenu").click(function(){


 $('.CorrAns').remove();
var questionTotal = 0;



$('.AnsClass').each(function(index, value){
var fullMessage = '<li class ="CorrAns" id ="Answer '+(questionTotal +1)+' "><a role="button">Answer '+(questionTotal +1)+'</a></li>';
$("#correctdrop").append(fullMessage);

questionTotal += 1;
});

noAnwertxt = '<li class ="CorrAns" id ="NoneCorrect"><a role="button">None</a></li>';
$("#correctdrop").append('<li class="divider CorrAns"></li>');
$("#correctdrop").append(noAnwertxt);

});

$("#correctdrop").on('click', '.CorrAns', function(){
		var textname = this.textContent;

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


  $('.PAnsClass').remove();

	//Create Answers
	for (var i = 0; i < QuesNum; i++) {
		var QuesHeader = 'Answer ' + (i+1) + ':';
		var QuesTag = 'Answer' + (i+1);
		var fullHtml = '<div class="form-group PAnsClass"> <label for='+QuesTag+'>'+QuesHeader+'</label><input type="text" class="form-control AnsClass" id='+QuesTag+'></div>';
		$("#startQues").append(fullHtml);
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

$("#OldLoc1").click(function(){
		var textname = $("#OldLoc1").text();
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



//Returns successful data submission message when the entered information is stored in database.


var dataString = 'TableName='+ SaveLocation + '&QuesName='+ QuestionName + '&NAns='+ NumAns + '&QuesTxt='+ QuesText + '&CorrAns='+ CorrectAnsTXT;

$.each(AnswerString, function( index, value ) {
		var AnSt = "&Ans"+ (index+1) +"=" + value;
		dataString += AnSt;
});

// AJAX Code To Submit Form.
	$.ajax({
type: "POST",
url: "/CreateQuestion",
data: dataString,
cache: false,
success: function(response){
alert(response);
	},
	error: function(error) {
                alert(error);
            }

});

return false;






}







});






});

