var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var querystring = require('querystring');

module.exports = {
    getNK: function (sn,en) {
        console.log(sn+","+en);
        var now = sn;
        function getPage(nk_code){
            console.log("NK"+now+" 로딩시작");
            var url =  "http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo=NK"+nk_code;
            request({url:url},function(err,res,body){
                if(err){
                    console.log("NK"+now+" 접속에러");
                };
                var m = body.replace(/\r?\n|\r|\t|\s/g,"");
                var s = m.match(/(FB.ui\().+(80\.png"})/);
                if(s!=null){
                    var ss = s[0].replace("FB.ui(","");
                    ss = ss.replace(/\r?\n|\r|\t|\s/g,"");
                    ss = ss.replace("{",'{"');
                    ss = ss.replace(/,/g,',"');
                    ss = ss.replace(/:/g,'":');
                    ss = ss.replace(/http":/g,'http:');
                    var json = JSON.parse(ss);
                    json.nk = "NK"+nk_code;
                    json.style = json.picture.match(/[0-9A]{6}/);

                    var p = m.match(/<divid="zoomGoodsPrice"class="price">[0-9,]{0,8}원<\/div>/);
                    pp = p[0].replace('<divid="zoomGoodsPrice"class="price">','');
                    json.price = pp.replace("</div>","");

                    setSpreadSheet(json);
                }else{
                    console.log("상품없음");
                    now = now+1;
                    if(now<=en){
                        setTimeout(function(){
                            getPage(now);
                        },1000);
                    }else{
                        console.log("종료");
                    };
                };
            });
        };

        function setSpreadSheet(json){
            console.log("NK"+now+" 저장시작");
            // var data = JSON.stringify();
            var data = querystring.stringify({
                nk:json.nk,
                name:json.name,
                price:json.price,
                style:json.style
            });
            request({
                url:"https://script.google.com/macros/s/AKfycbxVPxSiiB_RUyPMdXP6P5rmjp-hIlfoQkVr6DNNPDw1C7Z8zAo/exec",
                method:"POST",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body :data
            },function(err,res,body){
                if(err){
                    console.log("저장실패");
                }else{
                    console.log("저장성공 : "+json.nk);
                    now = now+1;
                    if(now<=en){
                        setTimeout(function(){
                            getPage(now);
                        },1000);
                    }else{
                        console.log("종료");
                    };
                };
            });
        };

        getPage(now);

    }
}