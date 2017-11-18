var sku_data;
$(function(){
   //此规格组合有3*3=12种情况
   $.getJSON('data_sku.json', function(data) {
        sku_data=data;
        var attr_wrap='';
        //format_list规格值循环
        $.each(data.format_list, function(index, val) {
            var attr_inner=''
            attr_wrap+='<div class="attr_wrap">\
                            <h1 class="title">'+val.name+'</h1>\
                        <div class="attr">';
            //format_val_list规格值循环
            $.each(val.format_val_list, function(index1, val1) {
                attr_inner+='<i class="sku" data-skuid='+val1.id+'>'+val1.name+'</i>';
            });
            attr_wrap+=attr_inner+'</div></div>';
        });
        $("#attr_collect").append(attr_wrap);
        setSku();//初始化sku状态
        console.log(SKUResult, 'SKUResult');
        $("#join").click(function(){
            var str=isSelectAll();
            if(str.length>0){
                alert("请选择："+str);
            }
            else{
                alert('成功加入购物车！');
            }
        });
    });
});
function setSku(){
    initSku();
    $('.sku').each(function() {
        var self = $(this);
        var attr_id = self.data('skuid');
        if(!SKUResult[attr_id]) {
            self.addClass('disabled');
        }
    }).click(function() {
        var self = $(this);
        //选中自己，兄弟节点取消选中
        self.toggleClass('selected').siblings().removeClass('selected');
        showInfo();
        //已经选择的节点
        var selectedObjs = $('#attr_collect .selected');
        if(selectedObjs.length) {
            //获得组合key价格
            var selectedIds = [];
            selectedObjs.each(function() {
                selectedIds.push($(this).data('skuid'));
            });
            selectedIds.sort(function(value1, value2) {
                //从小到大排序
                return parseInt(value1) - parseInt(value2);
            });
            var len = selectedIds.length;
            var prices = SKUResult[selectedIds.join(';')].prices;
            var num = SKUResult[selectedIds.join(';')].count;
            var maxPrice = Math.max.apply(Math, prices);
            var minPrice = Math.min.apply(Math, prices);
            // $('#price').text(maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice);
            // $('#count').text(num);
            //用已选中的节点验证待测试节点 underTestObjs
            console.log($(".sku").not(selectedObjs).not(self))
            $(".sku").not(selectedObjs).not(self).each(function() {
                var siblingsSelectedObj = $(this).siblings('.selected');
                console.log(siblingsSelectedObj)
                var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                if(siblingsSelectedObj.length) {
                    var siblingsSelectedObjId = siblingsSelectedObj.data('skuid');
                    for(var i = 0; i < len; i++) {
                        (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                    }
                } else {
                    testAttrIds = selectedIds.concat();
                }
                testAttrIds = testAttrIds.concat($(this).data('skuid'));
                testAttrIds.sort(function(value1, value2) {
                    return parseInt(value1) - parseInt(value2);
                });
                if(!SKUResult[testAttrIds.join(';')]) {
                    $(this).addClass('disabled').removeClass('selected');
                } else {
                    $(this).removeClass('disabled');
                }
            });
        } else {
            //设置默认价格
            $('#price').text('--');
            //设置属性状态
            $('.sku').each(function() {
                SKUResult[$(this).data('skuid')] ? $(this).removeClass('disabled') : $(this).addClass('disabled').removeClass('selected');
            })
        }
    });
}
//根据规格值id拼接，确定一个sku
function confimSku(){
    var attr_col=$("#sku_id").text();
    $("#confirm_id").val('');
    $.each(sku_data.sku_sale_list,function(key,val){
        if(val.format_val_id===attr_col){
            $("#confirm_id").val(val.sku_sale_id);
            console.log('sku_id:' + val.sku_sale_id)
        }
        return;
    })
}
function showInfo(){
    var flag=isSelectAll();
    if(flag.length===0){
        $("#showInfo").show();
    }
    else{
        $("#showInfo").hide();
    }
}
//判断规格是否全部选中
function isSelectAll(){
    var tip_str=[];
    $("#attr_collect .attr_wrap").each(function(key,val){
        var isSelected=$(this).find(".selected").size();
        if(isSelected===0){
            tip_str.push($(this).children('.title').text());
        }
    });
    var len=tip_str.length;
    $("#sku_id").text(pingSku());
    confimSku();
    return tip_str.join(',');
}
//规格值id拼接
function pingSku(){
    var str=[];
    $("#attr_collect .attr_wrap").each(function(key,val){
        var ele=$(this).find(".selected");
        if(ele.length>0){
            str.push($(ele).data('skuid'));
        }
    });
    str=str.join(';');
    return str;
}
function initSku(){
    var i,
        j,
        skuKeys = getObjKeys(sku_data.sku_sale_list);// 拿到数组的sku， 返回的是键数组["110;310", "110;311", "111;312", "112;311"]
        console.log(skuKeys, 'skuKeys')
    for(i = 0; i < skuKeys.length; i++) {
        var skuKey = skuKeys[i];// 一条SKU信息key， 如 110;210;311;414
        console.log(skuKey,'单个skuKey');
        let index = sku_data.sku_sale_list.findIndex(items => items.format_val_id == skuKey)
        var sku = index > -1 ? sku_data.sku_sale_list[index].stock_price_list : 0; // 一条SKU信息value,主要拿这个的price和库存
        console.log(sku, `第${i}条sku`)
        var skuKeyAttrs = skuKey.split(";"); //将sku 分割SKU key;
        console.log(skuKeyAttrs, '分割单个skuKey');
        //对分割SKU key 从小到大排序
        skuKeyAttrs.sort(function(value1, value2) {
            return parseInt(value1) - parseInt(value2);
        });
        //对每个SKU信息key属性值进行拆分组合,形成一个新的数组
        var combArr = combInArray(skuKeyAttrs);
        for(j = 0; j < combArr.length; j++) {
            add2SKUResult(combArr[j], sku);

        }
        //结果集接放入SKUResult
        console.log(sku, 'sku')
        SKUResult[skuKeyAttrs.join(";")] = sku
    }
}
//获得对象的key(键)
function getObjKeys(obj) {
    if (obj !== Object(obj)){
        throw new TypeError('Invalid object');
    }
    var keys = [];
    var len=obj.length;
    for(var i=0;i<len;i++){
        if(obj[i]['format_val_id']!=''){
            keys[keys.length] =obj[i]['format_val_id'];
        }
    }
    console.log(keys);
    return keys;
}

/**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
function combInArray(aData) {
    if(!aData || !aData.length) {
        return [];
    }

    var len = aData.length;
    var aResult = [];

    for(var n = 1; n < len; n++) {
        var aaFlags = getCombFlags(len, n);
        while(aaFlags.length) {
            var aFlag = aaFlags.shift();
            var aComb = [];
            for(var i = 0; i < len; i++) {
                aFlag[i] && aComb.push(aData[i]);
            }
            aResult.push(aComb);
        }
    }
    return aResult;
}

/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */
function getCombFlags(m, n) {
    if(!n || n < 1) {
        return [];
    }

    var aResult = [];
    var aFlag = [];
    var bNext = true;
    var i, j, iCnt1;

    for (i = 0; i < m; i++) {
        aFlag[i] = i < n ? 1 : 0;
    }

    aResult.push(aFlag.concat());

    while (bNext) {
        iCnt1 = 0;
        for (i = 0; i < m - 1; i++) {
            if (aFlag[i] == 1 && aFlag[i+1] == 0) {
                for(j = 0; j < i; j++) {
                    aFlag[j] = j < iCnt1 ? 1 : 0;
                }
                aFlag[i] = 0;
                aFlag[i+1] = 1;
                var aTmp = aFlag.concat();
                aResult.push(aTmp);
                if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                    bNext = false;
                }
                break;
            }
            aFlag[i] == 1 && iCnt1++;
        }
    }
    return aResult;
}

//把组合的key放入结果集SKUResult
function add2SKUResult(combArrItem, sku) {
    var key = combArrItem.join(";");
    if(SKUResult[key]) {//SKU信息key属性·
        /*SKUResult[key].count += sku.count;
        SKUResult[key].prices.push(sku.price);*/
    } else {
        SKUResult[key] = {
            /*count : sku.count,
            prices : [sku.price]*/
        };
    }
}
//保存最后的组合结果信息
var SKUResult = {};