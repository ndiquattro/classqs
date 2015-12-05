$(document).ready(function(){

$.getJSON(results_route , {
        r: room_code,   

      }, function(data) {

        var results = data['results'];

        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWUYZ".split("");

var letterlabels = []
var correctbar = parseInt(results['qtxtdata']['cora'])
//start here and make a for loop using numans as length
for (i=0; i<results['qtxtdata']['answers'].length; i++) {
    letterlabels[i] = alphabet[i]
    if(i == correctbar){var ansstr = "<div class='options' id='cora'><b>" +alphabet[i]+") " + results['qtxtdata']['answers'][i] + "</b></div>"
     }else{var ansstr = "<div class='options'>" + ""+alphabet[i]+") " + results['qtxtdata']['answers'][i] + "</div>"}
     
     $("#options").append(ansstr);   
}
$('.options').css('font-size','24px');
$('.options').css('margin','10px 5px');
$('#cora').css('border-style','solid');
$('#cora').css('border-color','rgba(103, 0, 179, 0.3)');
$('#cora').css('border-radius','15px');
// make chart
var ctx = $("#myChart").get(0).getContext("2d");
var data = {
    labels: letterlabels,

    datasets: [
        {
            label: "Results",
            fillColor: "rgba(50, 93, 129, 0.6)",
            strokeColor: "rgba(50, 93, 129,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: results['resultarray']
            
        }
    ]
};

//set options

var options = {
responsive : false,
            showTooltips : false,
            showInlineValues : true,
            centeredInllineValues : true,
            tooltipCaretSize : 0,
            tooltipTemplate : "<%= value %>"
};
var myBarChart = new Chart(ctx).Bar(data, options);

//set chartname
$("#questext").text(results['qtxtdata']['qtxt']);

if (isNaN(correctbar) != true){
    console.log("yes")
myBarChart.datasets[0].bars[correctbar].fillColor = "rgba(103, 0, 179, 0.6)"; 
}

  });



 });

