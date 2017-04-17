var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var nk = require("./sneaker/nk.js");

// scrap.getScrap();

var getNK = function() {
    nk.getNK(31060264,31069999);
};
getNK();