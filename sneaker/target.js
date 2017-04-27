var fs = require('fs');
var _ = require("lodash");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var ps = require("ps-node");
var browser = require('detect-browser');

// http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo=NK31085745&itemColor=899473-002&goodsSalePrice=0&source=&orderNo=&orderDetailSn=

module.exports = {
    getSize: function (nk,style,size) {
        var url = "http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo="+nk+"&itemColor="+style+"&goodsSalePrice=0&source=&orderNo=&orderDetailSn=";
        function getInfo(){
            var date = new Date();
            setTimeout(function(){
                request({url:url},function(err,res,body){
                    if(err){console.log(err);};
                    if(body==""){console.log(date+" 상품 없음"); getInfo(); return; };
                    var data = JSON.parse(body);

                    if(size=="all"){
                        var idx = 0;
                        size = data.sizeInfo[idx];
                        var itemNo = (data.etcInfo[idx]).match(/[NK0-9]{13}/)[0];
                        var win = open("http://lecs.nike.co.kr/cart/createCart.lecs?goodsNo="+nk+"&itemSize="+size+"&itemNo="+itemNo+"&orderQuantity=1&connerNo=&deliveryHopeAdayMn=&deliveryExpensePolicyNo=503706&cartSectionCode=10&inflowDisposalNoSectionCode=10&inflowDisposalNo=NK1A49A01A04&masterDisposalNo=NK1A49A01A04&packageGoodsYN=N&packageGoodsNo=&packageGoodsCompulsoryQty=0");
                        var interval = setInterval(function(){
                            if(interval && win.exitCode==0){
                                var cart = open("http://lecs.nike.co.kr/cart/list.lecs");
                                clearInterval(interval);
                            };
                        },500);
                    }else{
                        var idx = data.sizeInfo.indexOf(size);
                        if(-1 != idx){
                            var itemNo = (data.etcInfo[idx]).match(/[NK0-9]{13}/)[0];
                            var win = open("http://lecs.nike.co.kr/cart/createCart.lecs?goodsNo="+nk+"&itemSize="+size+"&itemNo="+itemNo+"&orderQuantity=1&connerNo=&deliveryHopeAdayMn=&deliveryExpensePolicyNo=503706&cartSectionCode=10&inflowDisposalNoSectionCode=10&inflowDisposalNo=NK1A49A01A04&masterDisposalNo=NK1A49A01A04&packageGoodsYN=N&packageGoodsNo=&packageGoodsCompulsoryQty=0");
                            var interval = setInterval(function(){
                                if(interval && win.exitCode==0){
                                    var cart = open("http://lecs.nike.co.kr/cart/list.lecs");
                                    clearInterval(interval);
                                };
                            },500);
                        }else{
                            console.log(date+" 사이즈 없음");
                            getInfo();
                            return;
                        }
                    }
                });
            },1000);
        };
        getInfo();
    }
}