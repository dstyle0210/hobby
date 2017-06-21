var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var nk = require("./sneaker/nk.js");

// scrap.getScrap();

var getNK = function() {
    nk.getNK(31090880,31099999);
};
// http://lecs.nike.co.kr/cart/createCart.lecs?goodsNo=NK31085745&itemSize=275&itemNo=NK31085745007&orderQuantity=1&connerNo=&deliveryHopeAdayMn=&deliveryExpensePolicyNo=503706&cartSectionCode=10&inflowDisposalNoSectionCode=10&inflowDisposalNo=NK1A49A01A04&masterDisposalNo=NK1A49A01A04&packageGoodsYN=N&packageGoodsNo=&packageGoodsCompulsoryQty=0
getNK();