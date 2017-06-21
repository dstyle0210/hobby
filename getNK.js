var _ = require("lodash");
var NK = require("./sneaker/getSneakerInfo.js");


function getNK(idx){
    if(!list[idx]){return;}
    NK.getInfo(list[idx],function(data){
        if(data.result=="null"){
            // 상품없음
            getNK(idx+1);
        }else if(data.result=="nosale"){
            // 단품정보없음
            getNK(idx+1);
        }else if(data.result=="ok"){
            // 상품정보있음
            NK.writeSheet(data,function(){
                getNK(idx+1);
            });
        }else{
            // 에러
        };
    });
};

var list = [
    "NK31085745"
];

getNK(0);