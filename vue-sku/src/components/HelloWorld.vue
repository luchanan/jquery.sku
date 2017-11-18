<template>
  <div class="hello">
    <vue-sku :skuData="skuData" ref="sku"></vue-sku>
    <p style="padding:20px"></p>
    <input type="button" value="去支付" @click="pay">
    <input type="button" value="console SKU数据格式" @click="format">
  </div>
</template>

<script>
import vueSku from './vueSku'
import skuDataResult from './skuData'
export default {
  name: 'HelloWorld',
  data () {
    return {
      skuData: {}
    }
  },
  components: {vueSku},
  mounted () {
    this.getSku()
  },
  methods: {
    getSku () {
      // 模拟异步
      setTimeout(() => {
        // 父组件传递数据
        this.skuData = {
          format_list: skuDataResult.format_list,
          sku_sale_list: skuDataResult.sku_sale_list
        }
      }, 2000)
    },
    pay () {
      if (!this.$refs.sku.isSelectAll()) {
        alert('请选择商品')
      }
    },
    format () {
      console.dir(this.skuData)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
