var twitch = {
    is_streaming: false,        // If a twitch channel is currently streaming
    user_data_complete: false,  // If getjson has returned all data.
    users: ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","OgamingSC2","ESL_SC2"],     // Twitch TV Channels
    online: [],     // Online Channel
    all: [],        // All Channel
    offline: [],    // Offline Channel
    not_exit: [],   // Non existent Channel
    count: 1,       // counter for current streamer
    
    user_data: function(){ 
        /**************************************
        Return json object of all twitch channel         
        *************************************/
        var that = this;
        for(var i = 0; i < this.users.length; i++){
           $.getJSON('https://api.twitch.tv/kraken/channels/'+this.users[i], function(data){
               that.all.push(data);
//               console.log(data);
               if(that.count == that.users.length){
//                   console.log('All users data complete');
                   that.user_data_complete = true;
               }
               that.count++;
               if(that.user_data_complete === true){
                   that.streaming();
               }
           });
       } 
    },
    streaming: function(){
        /**************************************
        Check if a channel is currently streaming         
        *************************************/
        var that = this;
        this.count = 1;
//        console.log(this.all);
        this.user_data_complete = false;
        for(var i = 0; i < this.users.length; i++){
           $.getJSON('https://api.twitch.tv/kraken/streams?channel='+this.users[i],function(json){
               if(json.streams.length > 0){
                    that.online.push(json.streams[0].channel);
//                    console.log(json.streams[0].channel);
               }
               if(that.count === that.users.length){
                   that.user_data_complete = true;
               }
               that.count++;
               if(that.user_data_complete === true){
//                   console.log("streaming data complete");
                   that.not_streaming();
               }
           });
       }
    },
    not_streaming: function(){
        /**************************************
        Check twitch channel that is currently not streaming         
        *************************************/
        var that = this; var count = 0;
        for(var i = 0; i < this.all.length; i++){
            $.getJSON('https://api.twitch.tv/kraken/streams?channel='+this.all[i].name)
            .done(function(data){
//                console.log(data);
//                console.log(count);
                if(data.streams.length <= 0){
                   that.offline.push(that.all[count]);
                }
                count++;
                if(count == that.all.length){
                    that.print_info();
                }
            });
        }
    },
    
    print_info: function(){
        /**************************************
        Print Generated information for both offline and online twitch channel         
        *************************************/
        for(var m = 0; m < this.online.length; m++){
            $("#every").append("<div class='container' id='main'><div class=row><div class='col-xs-3' id='img'><img src="+this.online[m].logo+" class='img-responsive'/></div><div class=col-xs-4 id=link><a href="+this.online[m].url+" >"+this.online[m].display_name+"</a></div><div class=col-xs-5 id=content><span>"+this.online[m].game+": "+this.online[m].status+"</span></div></div></div>"
                              );
        }
        for(var i = 0; i < this.offline.length; i++){
            $("#every").append("<div class='container' id='main'><div class=row><div class='col-xs-3' id='img'><img src="+this.offline[i].logo+" class='img-responsive'/></div><div class=col-xs-4 id=link><a href="+this.offline[i].url+" >"+this.offline[i].display_name+"</a></div><div class=col-xs-5 id=content><span>Channel currently offline</span></div></div></div>"
                              );
        }
    }
};

$(document).ready(function(){
    twitch.user_data(); 
});

function all_streamers(){
    /**************************************
    Function is called when all streamers button is clicked
    *************************************/
    var all = twitch.all;
    var online = twitch.online;
    var offline = twitch.offline;
    $("#every").html("");
    twitch.print_info();
}

function online(){
    /**************************************
    Function is called when online button is clicked
    *************************************/
    var online = twitch.online;
    $("#every").html("");
    for(var m = 0; m < online.length; m++){
            $("#every").append("<div class='container' id='main'><div class=row><div class='col-xs-3' id='img'><img src="+online[m].logo+" class='img-responsive'/></div><div class=col-xs-4 id=link><a href="+online[m].url+" >"+online[m].display_name+"</a></div><div class=col-xs-5 id=content><span>"+online[m].game+": "+online[m].status+"</span></div></div></div>"
                              );
        }
    
}
function offline(){
    /**************************************
        Function is called when offline button is clicked         
    *************************************/
    var offline = twitch.offline;
    $("#every").html("");
    for(var i = 0; i < offline.length; i++){
            $("#every").append("<div class='container' id='main'><div class=row><div class='col-xs-3' id='img'><img src="+offline[i].logo+" class='img-responsive'/></div><div class=col-xs-4 id=link><a href="+offline[i].url+" >"+offline[i].display_name+"</a></div><div class=col-xs-5 id=content><span>Channel currently offline</span></div></div></div>"
                              );
        }
    
}

