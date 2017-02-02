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
    if(now.getSeconds()==51){
        clearInterval(starter);
        scrapStart();
    };
},1000);

function scrapStart(){
    setInterval(function(){
        scrap.getScrap();
    },60000);
};