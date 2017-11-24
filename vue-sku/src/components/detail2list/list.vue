<template>
  <div class="detail2List">
    <ul>
      <li v-for="i in 1000" :key="i"><router-link :to="{name: 'detail'}">{{i}}</router-link></li>
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
    }
  },
  mounted () {
    console.log('mounted')
  },
  activated () {
    console.log('activated')
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
