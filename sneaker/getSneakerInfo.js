var _ = require("lodash");
var request = require("request");
var cheerio = require("cheerio");
var querystring = require('querystring');

module.exports = {
    getInfo: function (NK,CB) {
        console.log(NK +" 로딩시작");
        var url =  "http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo="+NK;
        request({url:url},function(err,res,body){
            if(err){
                console.log("NK"+now+" 접속에러");
                CB.call(null,{result:"500"});
                return;
            };

            // NK값 구하기
            var json = {nk:NK,result:"500"};

            json.name = (body.match(/(<title>).*(<\/title>)/)[0]);

            // 단품정보없음 == 앞으로 들어올꺼란 이야기
            if(json.name=="<title></title>"){
                console.log(NK + " 단품정보없음");
                json.name = "단품정보없음";
                json.result = "nosale";
                CB.call(null,json);
                return;
            };

            // 상품명 구하기
            json.name = json.name.replace(/(<title>)(.+)(&nbsp;&nbsp;Nike 나이키닷컴<\/title>)/g,"$2");

            if(json.name=="<title>Nike 나이키닷컴</title>"){
                console.log(NK+" 상품없음");
                json.result = "null";
                CB.call(null,json);
                return;
            };

            var html = body.replace(/\r?\n|\r|\t|\s/g,"");

            // 코드값 구하기
            json.style = ((html.match(/(picture:"http).+(80\.png"})/))[0]).match(/[0-9A-Z]{6}/)[0];

            // 가격 구하기
            json.price = scripTag(html,(new RegExp('(<divid="zoomGoodsPrice"class="price">)([0-9,]{0,9}원)(<\/div>)','g')),"가격");

            // 카테고리 구하기 test
            json.category = scripTag(html,(new RegExp('(<divclass="loc">)(.+)(<\/div><divclass="price">)','g')),"카테고리");
            json.category = json.category.replace(/&nbsp;/g,">");

            // 스타일들 구하기
            var styelsReg = new RegExp(json.style+"\-[0-9]{3}","g");
            json.styles = (_.union(html.match(styelsReg))).join(",");

            json.result = "ok";
            CB.call(null,json);
            return json;

            function scripTag(code,reg,desc){
                var m = code.match(reg);
                if(m==null) return desc+"없음";
                return (m[0]).replace(reg,"$2");
            };
        });
    },
    writeSheet:function(json,CB){
        console.log(json.nk + " 저장시작 : "+json.name);
        var data = querystring.stringify({
            nk:json.nk,
            name:json.name,
            price:json.price,
            style:json.style,
            styles:json.styles,
            category:json.category,
            check:""
        });

        request({
            rejectUnauthorized: false,
            url:"https://script.google.com/macros/s/AKfycbxVPxSiiB_RUyPMdXP6P5rmjp-hIlfoQkVr6DNNPDw1C7Z8zAo/exec",
            method:"POST",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body :data
        },function(err,res,body){
            if(err){
                console.log(json.nk + " 저장실패 : "+json.name);
                CB.call(null,err);
            }else{
                console.log(json.nk + " 저장성공 : "+json.name);
                CB.call(null,body);
            };
        });
    }
};