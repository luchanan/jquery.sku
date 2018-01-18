<template>
  <div class="detail" ref="detail">
    <div class="wrapper" ref="wrapper">
      <div class="content1"><!--这里是滚动位置-->
        <ul>
          <li v-for="i in 50" :key="i">{{i}}</li>
        </ul>
        <div class="scrolltips">
          <div class="pull-notice-down mui-flex align-center"><i class="loading"></i>
          <div class="cell"><hr></div>
            <span class="txt fixed" v-if="params.content1.status == 0">继续拖动，查看详情</span>
            <span class="txt fixed" v-else-if="params.content1.status == 1">上拉切换到下一屏</span>
            <span class="txt fixed" v-else-if="params.content1.status == 2">释放切换到下一屏</span>
          <div class="cell"><hr></div>
          </div>
        </div>
        <div class="wrapper1" ref="wrapper1" v-if="showDetail">
          <div class="content2">
            <ul>
              <li v-for="i in 50" :key="i">{{'详情:' + i}}</li>
            </ul>
          </div>
        </div>
      </div>
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
      showDetail: false,
      params: {
        bottom: 30,
        wrapper: {},
        content1: {
          status: 0
        } // 摘要
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let options = {
        probeType: 3,
        disableMouse: true
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)
      Object.assign(this.params.content1, this.getRect(this.$refs.wrapper.querySelector('.content1')))
      Object.assign(this.params.wrapper, this.getRect(this.$refs.wrapper))
      console.log(this.params.content1, 'content1')
      console.log(this.params.wrapper, 'wrapper')
      this.scroll.on('scroll', (pos) => {
        console.log(pos)
        // pos.y 滚动条滚动的位置, 拉到底部，并且继续上拉30
        let dist = Math.abs(pos.y) + this.params.wrapper.height - this.params.content1.height
        if (dist <= this.params.bottom && dist > 0) {
          this.params.content1.status = 1
        } else if (dist > this.params.bottom) {
          this.params.content1.status = 2
        }
        if (this.params.content1.height + pos.y > 30) {
          console.log('to top')
        }
      })
      this.scroll.on('touchEnd', (pos) => {
        this.params.content1.status = 0
        let dist = Math.abs(pos.y) + this.params.wrapper.height - this.params.content1.height
        if (dist > this.params.bottom) {
          // 滚到下一屏
          this.showDetail = true
          this.$nextTick(() => {
            this.scroll.refresh()
            this.scroll.scrollToElement(this.$refs.wrapper1, 1000)
            this.initDetail()
          })
          console.log('dist')
        }
      })
      this.scroll.on('scrollEnd', (pos) => {
        this.params.content1.status = 0
      })
    })
  },
  methods: {
    initDetail () {
      this.$nextTick(() => {
        // let options = {
        //   probeType: 3,
        //   disableMouse: true
        // }
        // this.scroll2 = new BScroll(this.$refs.wrapper1, {})
      })
    },
    getRect (el) {
      if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect()
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        }
      } else {
        return {
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight
        }
      }
    }
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
    background: #f5f5f5;
    // min-height: 100vh;
    ul {
      background: #fff;
    }
  }
  .wrapper1 {
    position: relative;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    // min-height: 100vh;
    ul {
      background: #fff;
    }
  }
  /* tm ui */
  .scrolltips {
    .mui-flex {
      display: flex;
      flex-wrap: wrap;
      &.align-center{
        align-items: center;
      }
    }
    .pull-notice, .pull-notice-down {
      text-align: center;
      padding: 0 10px;
      height: 40px;
    }
    .pull-notice .txt, .pull-notice-down .txt {
      width: 140px;
      color: #999;
      font-size: 12px;
    }
    .mui-flex>.cell {
      flex: 1;
      width: 0;
      -webkit-flex-basis: 0;
      -ms-flex-preferred-size: 0;
      flex-basis: 0;
      max-width: 100%;
      display: block;
      padding: 0!important;
      position: relative;
    }
    .pull-notice div hr, .pull-notice-down div hr {
      background: #000;
      opacity: .1;
    }
  }
  /* tm ui */
</style>
