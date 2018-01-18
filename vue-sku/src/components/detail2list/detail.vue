<template>
  <div class="detail2List">
    <ul>
      <li v-for="i in 2" :key="i">{{i}}</li>
    </ul>
    <span @click="$router.go(-1)">返回</span>
  </div>
</template>

<script>
export default {
  name: 'detail2List',
  props: {
  },
  watch: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }
</style>
