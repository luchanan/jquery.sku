<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <ul>
        <li v-for="i in 100" :key="i">{{i}}</li>
      </ul>
      <div></div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'pull2Detail',
  props: {
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {})
    })
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
  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
</style>
