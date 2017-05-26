var fs = require('fs');
var _ = require("lodash");
var request = require("request");
/*
http://lecs.nike.co.kr/cart/createCart.lecs?goodsNo=NK31087402&itemSize=250&itemNo=NK31087402001&orderQuantity=1&connerNo=&deliveryHopeAdayMn=&deliveryExpensePolicyNo=503706&cartSectionCode=10&inflowDisposalNoSectionCode=10&inflowDisposalNo=NK1A49A01A04&masterDisposalNo=NK1A49A01A04&packageGoodsYN=N&packageGoodsNo=&packageGoodsCompulsoryQty=0
 */

module.exports = {
    getNK: function (type) {
        var url = "https://spreadsheets.google.com/feeds/list/1cK3kzT2hJ88shFvENpV_FIozpKMAHFL7FhuyyQlUEXE/1/public/values?alt=json";
        request({url:url},function(err,res,body){
            var DB = JSON.parse(body);
            var NK = [];
            _.each(DB.feed.entry,function(data){
                var o = {};
                for(key in data){
                    if(key.indexOf("gsx$") != -1){
                        var nkey = key.split("gsx$")[1];
                        o[nkey] = data[key].$t;
                    };
                };
                NK.push(o);
            });


            if(type=="ready"){
                var checks = _.filter(NK,function(o){
                    return o.check=="O";
                });


                function checkReady(idx){
                    var target = "http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo="+checks[idx].nk+"&itemColor="+checks[idx].style+"&goodsSalePrice=0&source=&orderNo=&orderDetailSn=";

                    request({url:target},function(err,res,body){
                        if(body==""){
                            console.log("[X]" + checks[idx].name);
                        }else{
                            console.log("[O]" + checks[idx].name);
                        };
                        checkReadyNext();
                    });
                };
                checkReady(0);


                var count = 0;
                function checkReadyNext(){
                    count = count+1;
                    if(count<checks.length){
                        checkReady(count);
                    }else{
                        console.log("끝");
                    };
                };
            }else{
                var soldReadys = _.filter(NK,function(o){
                    return o.name=="단품정보없음";
                });



                console.log(soldReadys.length);
            };

        });
    }
};