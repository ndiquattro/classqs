 $(document).ready(function(){

    

if(islogged){

$.getJSON(getroomlink_route, function(data) {
        $("#roomhref").remove();

        
             if(data.islive == 1){
            $("#roomlink").append('<a href="'+data.room_url+'" id="roomhref"><span class="glyphicon glyphicon-stats" '
              +'aria-hidden="true"></span>Question Room <span class="label livehead label-primary">Live!</span></a>') 
        }
             if(data.islive == 0){
              $("#roomlink").append('<a href="'+data.room_url+'" id="roomhref"><span class="glyphicon glyphicon-stats" '
              +'aria-hidden="true"></span>Question Room <span class="label livehead label-danger">Question Ended</span></a>')
             }

              var url = window.location.pathname;
             if(url == data.room_url){
              $("#roomlink").addClass('active')
             }

        });

      }
       var url = window.location;
    // Will only work if string in href matches with location
    $('ul.nav a[href="'+ url +'"]').parent().addClass('active');

    // Will also work for relative and absolute hrefs
    $('ul.nav a').filter(function() {

        return this.href == url;
    }).parent().addClass('active'); 

 })
