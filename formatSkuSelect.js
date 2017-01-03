//规格组合选择，确定SKU(库存单位)
var SKUResult={},SKUUnionId;
(function($,window){
    var defaults={
        ele:'.sku',//规格点击元素,
        eleAttrFormatId:'skuid',//被点击元素的规格值ID
        formatSelected:'#guige .selected',
        sourceData:'',//数据源,
        formatId:'format_val_id',//sku信息中，规格组合ID[110;122;124]
        skuSaleList:'sku_sale_list',//sku信息相关信息
        split:";",//规格组合分割[110;122;124]
        eachAfterClick:null,//每次规格值选择后
    };
    var FormatSkuSelect=function(options){
        this.settings=$.extend({},defaults,options || {});
        this.init();
    }
    FormatSkuSelect.prototype={
        init:function(){
            var i,
                j,
                skuKeys = this.getObjKeys(this.settings.sourceData[this.settings.skuSaleList]);
            for(i = 0; i < skuKeys.length; i++) {
                var skuKey = skuKeys[i];//一条SKU信息key
                //console.log(skuKey);
                var sku = this.settings.sourceData[this.settings.skuSaleList][skuKey]; //一条SKU信息value
                //console.log(sku);
                var skuKeyAttrs = skuKey.split(this.settings.split); //分割SKU key;
                //对分割SKU key 从小到大排序
                skuKeyAttrs.sort(function(value1, value2) {
                    return parseInt(value1) - parseInt(value2);
                });
                //对每个SKU信息key属性值进行拆分组合,形成一个新的数组
                var combArr = this.combInArray(skuKeyAttrs);
                for(j = 0; j < combArr.length; j++) {
                    this.add2SKUResult(combArr[j], sku);

                }
                //结果集接放入SKUResult
                SKUResult[skuKeyAttrs.join(";")] = {
                    /*count:sku.count,
                    prices:[sku.price]*/
                }
            }
            this.bindEvent();
        },
        getObjKeys:function(obj) {
            if (obj !== Object(obj)){
                console.log('没有可选的规格值');
                $(this.settings.ele).addClass('disabled');
                return false;
                //throw new TypeError('Invalid object');
            }
            var keys = [];
            var len=obj.length;
            for(var i=0;i<len;i++){
                if(obj[i][this.settings.formatId]!=''){
                    keys[keys.length] =obj[i][this.settings.formatId];
                }
            }
            return keys;
        },
        bindEvent:function(){
            var _this=this;
            $(_this.settings.ele).each(function() {
                var self = $(this);
                var attr_id = self.data(_this.settings.eleAttrFormatId);
                if(!SKUResult[attr_id]) {
                    self.addClass('disabled');
                }
            });
            $(document).off("click",_this.settings.ele).on("click",_this.settings.ele,function(e) {
                var self = $(this);
                //选中自己，兄弟节点取消选中
                self.toggleClass('selected').siblings().removeClass('selected');
                //showInfo();
                //已经选择的节点
                var selectedObjs = $(_this.settings.formatSelected);
                if(selectedObjs.length) {
                    //获得组合key价格
                    var selectedIds = [];
                    selectedObjs.each(function() {
                        selectedIds.push($(this).data(_this.settings.eleAttrFormatId));
                    });
                    selectedIds.sort(function(value1, value2) {
                        //从小到大排序
                        return parseInt(value1) - parseInt(value2);
                    });
                    var len = selectedIds.length;
                    //var prices = SKUResult[selectedIds.join(';')].prices;
                    //var num = SKUResult[selectedIds.join(';')].count;
                    //var maxPrice = Math.max.apply(Math, prices);
                    //var minPrice = Math.min.apply(Math, prices);
                    //$('#price').text(maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice);
                    //$('#count').text(num);
                    //用已选中的节点验证待测试节点 underTestObjs
                    $(".sku").not(selectedObjs).not(self).each(function() {
                        var siblingsSelectedObj = $(this).siblings('.selected');
                        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
                        if(siblingsSelectedObj.length) {
                            var siblingsSelectedObjId = siblingsSelectedObj.data(_this.settings.eleAttrFormatId);
                            for(var i = 0; i < len; i++) {
                                (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                            }
                        } else {
                            testAttrIds = selectedIds.concat();
                        }
                        testAttrIds = testAttrIds.concat($(this).data(_this.settings.eleAttrFormatId));
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
                    //$('#price').text('--');
                    //设置属性状态
                    $(_this.settings.ele).each(function() {
                        SKUResult[$(this).data(_this.settings.eleAttrFormatId)] ? $(this).removeClass('disabled') : $(this).addClass('disabled').removeClass('selected');
                    })
                }
                if($.isFunction(_this.settings.eachAfterClick)){
                    _this.settings.eachAfterClick();
                }
            });
        },
        combInArray:function(aData) {
            if(!aData || !aData.length) {
                return [];
            }

            var len = aData.length;
            var aResult = [];

            for(var n = 1; n < len; n++) {
                var aaFlags = this.getCombFlags(len, n);
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
        },
        getCombFlags:function(m, n) {
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
        },
        add2SKUResult:function(combArrItem, sku) {
            var key = combArrItem.join(";");
            if(SKUResult[key]) {
            } else {
                SKUResult[key] = {
                };
            }
        },
        destroy:function(){
            $(document).off("click",this.settings.ele);
        }
    }
    var formatSkuSelect=function(options){
        return new FormatSkuSelect(options);
    }
    window.formatSkuSelect=$.formatSkuSelect=formatSkuSelect;
})(window.jQuery||window.Zepto,window);