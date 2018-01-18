<template>
  <div class="detail2List">
    <ul>
      <li v-for="i in list" :key="i"><router-link :to="{name: 'detail'}">{{i}}</router-link></li>
    </ul>
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
      list: []
    }
  },
  mounted () {
    console.log('mounted')
  },
  activated () {
    setTimeout(() => {
      for (let i = 0; i < 1000; i++) {
        this.list.push(i)
      }
      console.log('activated')
    }, 2000)
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
