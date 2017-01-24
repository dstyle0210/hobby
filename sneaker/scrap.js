var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");

module.exports = {
    getScrap: function() {

        function scrapPage(trg,page){
            var url = trg+page;
            return (new Promise(function(resolve,reject){
                request({url:url},function(err,res,body){
                    if(err){
                        reject( err );
                    }
                    resolve( body );
                });
            }));
        };

        function bodyToJson(html){
            var $ = cheerio.load(html);
            var sneaker = [];
            $("li").each(function(){
                var title = $(this).find(".gridwall_item_title").text();
                var price = ( s.clean($(this).find(".gridwall-item__price").text()) ).split(" ");
                var id = ( $(this).find(".global_gridwall_container>a>img").attr("id") ).split("_");
                var soldout = $(this).find(".sold_out").text();
                sneaker.push({"title":s.clean(title),"price":price[0],"sale":price[1],"NK":id[1],"style":id[2],"soldout":soldout});
            });
            return sneaker;
        };

        function htmlTemplate(json){
            var tmp = "<ul>\n";
            _.each(json,function(item,idx){
                tmp += "<li><a href='http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo="+item.NK+"&colorOptionValueCode="+item.style+"' target='_blank'>["+item.soldout+"]"+item.title+","+item.price+","+item.NK+","+item.style+"</a></li>";
            });
            tmp += "</ul>";
            return tmp;
        };

        // 리스트 호출
        var nike = (code) => "http://www.nike.co.kr/display/getMoreGoodsAjaxNewGrid.lecs?displayNo="+code+"&autoPageIndex=";
        var scrapPromises = [];
        function callScrapPromise(code,name){
            scrapPromises[name] = [];
            for(var i=0;i<15;i++){
                scrapPromises[name].push( scrapPage( nike(code) ,i) );
            };
            Promise.all(scrapPromises[name]).then(function(values){
                var json = bodyToJson( values.join("") );
                fs.writeFileSync("./item_"+name+".json",JSON.stringify(json));
                fs.writeFileSync("./item_"+name+".html",htmlTemplate(json));
            });
        };


        callScrapPromise("NK1A49A01","men");
        callScrapPromise("NK1A50A02","women");
        callScrapPromise("NK1A49A01&brndList=01","jordan");
        callScrapPromise("NK1A60A01A04","lab");

    }
};