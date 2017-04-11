var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var scrap = require("./sneaker/scrap.js");

// scrap.getScrap();

var starter = function(){
    scrap.getScrap();

    var url ="http://www.nike.co.kr/display/getMoreGoodsAjaxNewGrid.lecs?displayNo=NK1A49A01&autoPageIndex=1";
    var date;
    request({url:url},function(err,res,body){
        console.log(res.caseless.dict.date);
        date = new Date(res.caseless.dict.date);
        // console.log(date.getHours() + "," + (date.getHours()-9));
        // date.setHours(date.getHours()-9);
        date.setSeconds(date.getSeconds() + 27);
        var date2 = new Date();
        console.log("server "+ date);
        console.log("local "+ date2);

        var mcount = (60 - date.getSeconds());
        console.log("server:"+date.getSeconds() +" / 오차: "+mcount);
        fs.writeFileSync("./res_"+date.getMinutes()+"_"+date.getSeconds()+".json",JSON.stringify(res.headers));

        if(date>date2){
            starter();
            console.log("커요");
        }else{
            console.log("작아요");
            var counter = setInterval(function(){
                console.log(mcount);
                if(mcount==2){
                    console.log("시작");
                    clearInterval(counter);
                    scrapStart();
                };
                mcount = mcount-1;
            },1000);

        }

/*

        */
    });
};
starter();
function scrapStart(){
    scrap.getScrap();
    setInterval(function(){
        console.log( getTimeStamp() );
        scrap.getScrap();
    },15000);
};


/*

var starter = setInterval(function(){



    var now = new Date();
    console.log( now.getSeconds() );
    if(now.getSeconds()%15==6){
        clearInterval(starter);
        scrapStart();
    };
},1000);


*/

function getTimeStamp() {
    var now = new Date();
    return now.getFullYear()+(((now.getMonth()+1)<10) ? "0"+(now.getMonth()+1) : (now.getMonth()+1))+((now.getDate()<10) ? "0"+now.getDate() : now.getDate())+"_"+(now.getHours() + '' +((now.getMinutes() < 10)? ("0" + now.getMinutes()): (now.getMinutes())) + '' +((now.getSeconds() < 10)? ("0" + now.getSeconds()): (now.getSeconds())))+"";
}