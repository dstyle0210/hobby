var RD = require("./sneaker/ready.js");
var NK = require("./sneaker/getSneakerInfo.js");

RD.getNK("nosale",function(sheetData){

    function getNK(idx){
        if(!sheetData[idx].nk){return;}
        NK.getInfo(sheetData[idx].nk,function(data){
            if(data.result=="null"){
                // 상품없음
                setTimeout(function(){
                    getNK(idx+1);
                },1000);
            }else if(data.result=="nosale"){
                // 단품정보없음
                setTimeout(function(){
                    getNK(idx+1);
                },1000);
            }else if(data.result=="ok"){
                // 상품정보있음
                NK.writeSheet(data,function(){
                    setTimeout(function(){
                        getNK(idx+1);
                    },1000);
                });
            }else{
                // 에러
            };
        });
    };

    getNK(0);
});

/*
http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo=NK31085964&itemColor=905614-100&goodsSalePrice=0&source=&orderNo=&orderDetailSn=

 */