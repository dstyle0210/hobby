var fs = require('fs');
var _ = require("lodash");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var querystring = require('querystring');

module.exports = {
    getNK: function (sn,en) {
        console.log(sn+","+en);
        var now = sn;
        var end = en;
        function getPage(nk_code){
            console.log("NK"+now+" 로딩시작");
            var url =  "http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo=NK"+nk_code;
            request({url:url},function(err,res,body){
                if(err){
                    console.log("NK"+now+" 접속에러");
                };

                var json = {nk:"NK"+nk_code};

                json.name = (body.match(/(<title>).+(<\/title>)/)[0]);
                json.name = json.name.replace(/(<title>)(.+)(&nbsp;&nbsp;Nike 나이키닷컴<\/title>)/g,"$2");
                if(json.name=="<title>Nike 나이키닷컴</title>"){
                    console.log("NK"+now+" 상품없음");
                    nextPage();
                }else{
                    var html = body.replace(/\r?\n|\r|\t|\s/g,"");

                    // 코드값 구하기
                    json.style = ((html.match(/(picture:"http).+(80\.png"})/))[0]).match(/[0-9A-Z]{6}/)[0];

                    // 가격 구하기
                    json.price = (html.match(/<divid="zoomGoodsPrice"class="price">[0-9,]{0,8}원<\/div>/)[0]).match(/[0-9,]{0,8}원/)[0];

                    // 스타일들 구하기
                    var styelsReg = new RegExp(json.style+"\-[0-9]{3}","g");
                    json.styles = (_.union(html.match(styelsReg))).join(",");

                    setSpreadSheet(json);
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
                style:json.style,
                styles:json.styles,
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
                };
                nextPage();
            });
        };

        function nextPage(){
            now = now+1;
            if(now<=end){
                setTimeout(function(){
                    getPage(now);
                },1000);
            }else{
                console.log("종료");
            };
        };

        getPage(now);

    }
}