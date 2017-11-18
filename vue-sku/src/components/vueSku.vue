<template>
  <div class="vue-sku">
    <div class="attrWrap" v-for="(row, pIndex) in attrListValue" :key="row.key">
      <h1 class="attrTitle">{{row[attrListKeyName]}}</h1>
      <div class="attrValue">
        <input type="button" @click="selectClick(attr, pIndex, aIndex)" :data-attrid="attr[attrListValueId]" :class="attrStatus(attr)" :disabled="attr.disabled" :value="attr[attrListValueName]" v-for="(attr, aIndex) in row[attrListValueEachKey]" :key="attr.key">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'vueSku',
  props: {
    skuData: {
      type: Object, // 后端返回的sku列表相关信息， 包含属性， sku
      required: true
    },
    options: {
      type: Object
    }
  },
  watch: {
    skuData () {
      this.updateValue()
      this.initSku()
      this.initStatus()
      console.log(this.skuData, 'skuData update')
      console.log(this.attrListValue, 'attrListName')
      console.log(this.skuListValue, 'skuListValue')
    }
  },
  data () {
    return {
      attrListName: 'format_list', // skuData 规格值key
      skuListName: 'sku_sale_list', // skuData sku key
      attrListKeyName: 'name', // 规格值key显示名字label， 属性所属类名字
      attrListKeyId: 'id', // 规格值key显示名字对应的value， 属性所属类ID
      attrListValueName: 'name', // 遍历规格值value显示名字label， 单个属性名字
      attrListValueId: 'id', // 遍历规格值value显示名字对应的value， 单个属性id
      attrListValueEachKey: 'format_val_list', // 遍历规格值key
      attrListValue: [], // 规格值array
      skuListValue: [], // sku array
      skuListValueName: 'format_val_name', // sku 规格组合name
      skuListValueId: 'format_val_id', // sku 规格组合id
      splitStr: ';', // sku id分割标志
      selectedSkuInfo: {
        id: '', // sku id
        attrs: '' // 属性组合的sku
      },
      SKUResult: {} // 保存最后的组合结果信息
    }
  },
  methods: {
    attrStatus (row) {
      return {
        'status': !row.disabled,
        'status disabled': row.disabled,
        'selected': row.selected && !row.disabled
      }
    },
    updateValue () {
      // 更新sku相关信息值
      this.attrListValue = this.skuData[this.attrListName].map(items => {
        // 默认设定不可选择
        items.format_val_list.map(fitems => {
          fitems.disabled = false
          fitems.selected = false
        })
        return items
      })
      console.log(this.attrListValue, 'new')
      this.skuListValue = this.skuData[this.skuListName]
    },
    initSku () {
      let skuKeys = this.getObjKeys(this.skuListValue)
      console.log(skuKeys, 'skuKeys')
      for (let i = 0; i < skuKeys.length; i++) {
        let skuKey = skuKeys[i] // 一个sku信息
        let index = this.skuListValue.findIndex(items => items[this.skuListValueId] === skuKey)
        let sku = index > -1 ? this.skuListValue[index].stock_price_list : {} // 一个sku信息对应的库存，价格， 这个可能要改，因为字段stock_price_list ！！！
        let skuKeyAttrs = skuKey.split(this.splitStr) // 将一个sku分割数组
        skuKeyAttrs.sort(function (value1, value2) {
          return parseInt(value1) - parseInt(value2) // 数组排序，从小到大
        })
        console.log(sku, '单个sku price')
        // 对每个SKU信息key属性值进行拆分组合,形成一个新的数组
        var combArr = this.combInArray(skuKeyAttrs)
        for (let j = 0; j < combArr.length; j++) {
          this.add2SKUResult(combArr[j], sku)
        }
        console.log(this.SKUResult, 'SKUResult')
        this.SKUResult[skuKeyAttrs.join(this.splitStr)] = {
          // 待处理
        }
      }
    },
    initStatus () {
      // 初始化选择状态
      this.attrListValue.forEach((items, i) => {
        items[this.attrListValueEachKey].map((fitems, j) => {
          if (!this.SKUResult[fitems[this.attrListValueId]]) {
            this.attrListValue[i][this.attrListValueEachKey][j].disabled = true
          }
        })
      })
    },
    getObjKeys (obj) {
      if (obj !== Object(obj)) {
        throw new TypeError('Invalid object')
      }
      var keys = []
      for (let key in obj) {
        if (obj[key][this.skuListValueId]) {
          keys[keys.length] = obj[key][this.skuListValueId]
        }
      }
      return keys
    },
    combInArray (aData) {
      /**
       * 从数组中生成指定长度的组合
       * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
       */
      if (!aData || !aData.length) {
        return []
      }
      var len = aData.length
      var aResult = []
      for (var n = 1; n < len; n++) {
        var aaFlags = this.getCombFlags(len, n)
        while (aaFlags.length) {
          var aFlag = aaFlags.shift()
          var aComb = []
          for (var i = 0; i < len; i++) {
            aFlag[i] && aComb.push(aData[i])
          }
          aResult.push(aComb)
        }
      }
      return aResult
    },
    getCombFlags (m, n) {
      /**
       * 得到从 m 元素中取 n 元素的所有组合
       * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
       */
      if (!n || n < 1) {
        return []
      }
      var aResult = []
      var aFlag = []
      var bNext = true
      var iCnt1
      for (let i = 0; i < m; i++) {
        aFlag[i] = i < n ? 1 : 0
      }
      aResult.push(aFlag.concat())
      while (bNext) {
        iCnt1 = 0
        for (let i = 0; i < m - 1; i++) {
          if (aFlag[i] === 1 && aFlag[i + 1] === 0) {
            for (let j = 0; j < i; j++) {
              aFlag[j] = j < iCnt1 ? 1 : 0
            }
            aFlag[i] = 0
            aFlag[i + 1] = 1
            var aTmp = aFlag.concat()
            aResult.push(aTmp)
            if (aTmp.slice(-n).join('').indexOf('0') === -1) {
              bNext = false
            }
            break
          }
          aFlag[i] === 1 && iCnt1++
        }
      }
      return aResult
    },
    add2SKUResult (combArrItem, sku) {
      let key = combArrItem.join(this.splitStr)
      if (this.SKUResult[key]) { // SKU信息key属性
        // sku组合可能存在的价格 库存等, 供范围选择展示
        // this.SKUResult[key].count += sku.count
        // this.SKUResult[key].prices.push(sku.price)
      } else {
        this.SKUResult[key] = {
          // sku组合可能存在的价格 库存等, 供范围选择展示
          // count : sku.count,
          // prices : [sku.price]
        }
      }
    },
    selectClick (attr, pIndex, aIndex) {
      if (attr.disabled) {
        // 已经禁用不做任何处理
        return false
      }
      this.attrListValue[pIndex][this.attrListValueEachKey][aIndex].selected = !attr.selected // 自身外，其他不选
      this.attrListValue[pIndex][this.attrListValueEachKey] = this.attrListValue[pIndex][this.attrListValueEachKey].map(items => {
        if (attr[this.attrListValueId] !== items[this.attrListValueId]) {
          items.selected = false
        }
        return items
      })
      console.log(this.attrListValue, 'this.attrListValue')
      let selectedObjs = this.getSelected()
      if (selectedObjs.length) {
        let selectedIds = []
        selectedObjs.forEach(items => {
          selectedIds.push(+items[this.attrListKeyId])
        })
        console.log(selectedIds, 'selectedIds')
        selectedIds.sort((value1, value2) => {
          // 从小到大排序
          return parseInt(value1) - parseInt(value2)
        })
        this.attrListValue.forEach((items, ipIndex) => {
          items[this.attrListValueEachKey].forEach((aitems, iaIndex) => {
            if (!aitems.selected) { // 未被选中的
              var siblingsSelectedObj = [] // 选取所属类同级被选中的数据
              items[this.attrListValueEachKey].forEach(siblingSelected => {
                if (siblingSelected.selected) {
                  siblingsSelectedObj.push(siblingSelected)
                }
              })
              var testAttrIds = []
              if (siblingsSelectedObj.length) {
                var siblingsSelectedObjId = +siblingsSelectedObj[0][this.attrListKeyId] // 一个所属类只有一个选择
                for (var i = 0; i < selectedIds.length; i++) {
                  console.log(selectedIds[i])
                  console.log(siblingsSelectedObjId)
                  if (selectedIds[i] !== siblingsSelectedObjId) {
                    testAttrIds.push(selectedIds[i])
                  }
                }
              } else {
                testAttrIds = selectedIds.concat()
              }
              testAttrIds = testAttrIds.concat(+aitems[this.attrListKeyId])
              testAttrIds.sort((value1, value2) => {
                return parseInt(value1) - parseInt(value2)
              })
              console.log(!this.SKUResult[testAttrIds.join(this.splitStr)], '!this.SKUResult[testAttrIds.join(this.splitStr)]')
              if (!this.SKUResult[testAttrIds.join(this.splitStr)]) {
                this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].disabled = true
                this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].selected = false
                console.log(this.attrListValue, 'this.SKUResult')
              } else {
                this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].disabled = false
              }
            }
          })
        })
      } else {
        // 设置属性状态
        this.attrListValue.forEach((items, ipIndex) => {
          items[this.attrListValueEachKey].forEach((aitems, iaIndex) => {
            if (this.SKUResult[attr[this.attrListValueId]]) {
              this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].disabled = false
            } else {
              this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].disabled = true
              this.attrListValue[ipIndex][this.attrListValueEachKey][iaIndex].selected = false
            }
          })
        })
      }
    },
    getSelected () {
      // 获取被选择的数据
      let selectedObjs = []
      this.attrListValue.forEach(items => {
        let existSelected = items[this.attrListValueEachKey].filter(aitems => aitems.selected === true)
        if (existSelected.length) {
          selectedObjs.push(existSelected[0]) // 所属大类只有一个被选中
        }
      })
      return selectedObjs
    }
  }
}
</script>

<style lang="scss" scoped>
  .vue-sku {
    .selected {
      background: red
    }
    .disabled {
      background: gray
    }
  }
</style>
