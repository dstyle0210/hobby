var fs = require('fs');
var _ = require("underscore");
var s = require("underscore.string");
var request = require("request");
var cheerio = require("cheerio");
var open = require("open");
var trg = require("./sneaker/target.js");

// scrap.getScrap();

var getSize = function() {
    trg.getSize("NK31081532","852395-009","275");

    // trg.getSize("NK31081697","844562-800","all");
};
// http://lecs.nike.co.kr/cart/createCart.lecs?goodsNo=NK31007901&itemSize=275&itemNo=NK31007901007&orderQuantity=1&connerNo=&deliveryHopeAdayMn=&deliveryExpensePolicyNo=503706&cartSectionCode=10&inflowDisposalNoSectionCode=10&inflowDisposalNo=NK1A49A01A04&masterDisposalNo=NK1A49A01A04&packageGoodsYN=N&packageGoodsNo=&packageGoodsCompulsoryQty=0
// http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo=NK31089053&itemColor=902776-201&goodsSalePrice=0&source=&orderNo=&orderDetailSn=
// http://www.nike.co.kr/goods/showGoodsDetail.lecs?goodsNo=NK31089053&colorOptionValueCode=902776-401&displayNo=NK1A60A01A04
// 업템포 트리플화이트 : http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo=NK31085980&itemColor=921948-100&goodsSalePrice=0&source=&orderNo=&orderDetailSn=
// 조던11 바론스 : http://lecs.nike.co.kr/cart/getGoodsOptionInfo.lecs?goodsNo=NK31007901&itemColor=528895-010&goodsSalePrice=0&source=&orderNo=&orderDetailSn=
getSize();
