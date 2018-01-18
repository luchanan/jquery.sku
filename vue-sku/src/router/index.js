import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import pull2Detail from '@/components/pull2Detail'
import detail2List from '@/components/detail2list/list'
import detail2Listdetail from '@/components/detail2list/detail'

Vue.use(Router)

export default new Router({
  // mode: 'hash', // default
  // mode: 'history', // 需要服务器支持，否者刷新404
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/d',
      name: 'pull2Detail',
      component: pull2Detail
    },
    {
      path: '/detail2List',
      name: 'detail2List',
      component: detail2List,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail2Listdetail
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // scrollBehavior只在history模式下可用
    console.log(savedPosition)
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   if (from.meta.keepAlive) {
    //     from.meta.savedPosition = document.body.scrollTop
    //   }
    //   return { x: 0, y: to.meta.savedPosition || 0 }
    // }
  }
})
