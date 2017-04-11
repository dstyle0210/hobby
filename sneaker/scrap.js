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
                var src = $(this).find(".global_gridwall_img img").attr("src");
                sneaker.push({"title":s.clean(title),"price":price[0],"sale":((price[1])?price[1]:"null"),"NK":id[1],"style":id[2],"soldout":soldout,"src":src});
            });
            return sneaker;
        };

        function htmlTemplate(json){
            var tmp = "<html><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8' /><link rel='stylesheet' href='./sneaker/style.css'/></head><body><ul>\n";
            _.each(json,function(item,idx){
                tmp += "<li><a href='http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo="+item.NK+"&colorOptionValueCode="+item.style+"' target='_blank'>" +
                    "<div><img src='"+item.src+"' /></div>" +
                    "["+item.soldout+"]"+item.title+"<br />"+item.price+"<br />"+item.NK+"<br />"+item.style+"</a></li>";
            });
            tmp += "</ul></body></html>";
            return tmp;
        };

        // 리스트 호출
        var nike = function(code){return "http://www.nike.co.kr/display/getMoreGoodsAjaxNewGrid.lecs?displayNo="+code+"&autoPageIndex=";};
        var scrapPromises = [];
        function callScrapPromise(code,name){
            scrapPromises[name] = [];
            for(var i=0;i<15;i++){
                scrapPromises[name].push( scrapPage( nike(code) ,i) );
            };
            Promise.all(scrapPromises[name]).then(function(values){
                var json = bodyToJson( values.join("") );
                console.log(name+" 총갯수 : "+json.length);
                if(json.length){
                    // fs.writeFileSync("./item_"+name+".json",JSON.stringify(json));
                    fs.readFile("./item_"+name+"_oldList.json","utf8",function(err,data){
                        if(err){
                            console.log(name+" 올드 없음");
                            makeOldList(json,name);
                            return;
                        };
                        var oldList = [];
                        var newList = [];

                        _.each(JSON.parse(data),function(item){
                            oldList.push(item.style+"__"+item.soldout);
                        });
                        _.each(json,function(item2){
                            newList.push(item2.style+"__"+item2.soldout);
                        });

                        var diffTempList = _.difference(newList,oldList);
                        var diffList = [];
                        console.log(name+" 달라진 갯수 : "+diffTempList.length);
                        if(diffTempList.length){
                            _.each(diffTempList,function(diffitem){
                                diffList.push( _.find(json,function(item){
                                    return (item.style+"__"+item.soldout)==diffitem;
                                }) );
                            });
                            fs.writeFileSync("./diff_"+name+".html",htmlTemplate(diffList) );
                            makeOldList(json,name);
                            open("./diff_"+name+".html");
                        };
                    })
                }
            });
        };

        function makeOldList(json,name){
            fs.writeFileSync("./item_"+name+"_oldList.json",JSON.stringify(json));
        };


        setTimeout(function(){
            callScrapPromise("NK1A49A01","men");
        },1000);
        setTimeout(function(){
            callScrapPromise("NK1A50A02","women");
        },2000);
        setTimeout(function(){
            callScrapPromise("NK1A49A01&brndList=01","jordan");
        },3000);
        setTimeout(function(){
            callScrapPromise("NK1A60A01A04","lab");
        },4000);
    }
};