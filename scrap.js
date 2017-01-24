var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var scrap = require("./sneaker/scrap.js");


scrap.getScrap();