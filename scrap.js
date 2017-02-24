var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var scrap = require("./sneaker/scrap.js");

scrap.getScrap();
var starter = setInterval(function(){
    var now = new Date();
    console.log( now.getSeconds() );
    if(now.getSeconds()%15==6){
        clearInterval(starter);
        scrapStart();
    };
},1000);

function scrapStart(){
    setInterval(function(){
        console.log( getTimeStamp() );
        scrap.getScrap();
    },15000);
};
function getTimeStamp() {
    var now = new Date();
    return now.getFullYear()+(((now.getMonth()+1)<10) ? "0"+(now.getMonth()+1) : (now.getMonth()+1))+((now.getDate()<10) ? "0"+now.getDate() : now.getDate())+"_"+(now.getHours() + '' +((now.getMinutes() < 10)? ("0" + now.getMinutes()): (now.getMinutes())) + '' +((now.getSeconds() < 10)? ("0" + now.getSeconds()): (now.getSeconds())))+"";
}