<template>
  <div class="hello">
    <vue-sku :skuData="skuData"></vue-sku>
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
      setTimeout(() => {
        this.skuData = {
          format_list: skuDataResult.format_list,
          sku_sale_list: skuDataResult.sku_sale_list
        }
      }, 2000)
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
