var fs = require('fs');
var _ = require("lodash");
var request = require("request");

module.exports = {
    get: function () {
        var url =  "http://video.eastbay.com/feeds/release_watch.cfm?variable=products&months=1&cd=1m&_="+(new Date().getTime());
        request({url:url},function(err,res,body){
            var body = body.replace("var products = ","");
            body = body.replace(";","");
            var DB = JSON.parse(body);
            _.each(DB.RECORDS,function(item){
                console.log( item.PROPERTIES.P_ModelName );
            });
            fs.writeFileSync("./eastbay.json",JSON.stringify(DB.RECORDS));
        });
    }
};