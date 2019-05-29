import Vue from "vue"
import Router from "vue-router"
import Recommend from "../components/recommend/recommend"
import Singer from "../components/singer/singer"
import Rank from "../components/rank/rank"
import Search from "../components/search/search"
import SingerDetail from "../components/singer-detail/singer-detail.vue"
import Disc from "../components/disc/disc.vue"
import TopList from "../components/top-list/top-list.vue"
import MusicList from "../components/music-list/music-list.vue"
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      // component: Recommend,
      component:() => import("../components/recommend/recommend.vue"),
      children: [
        {
          path: ":id",
          // component: Disc
          component:() => import("../components/disc/disc.vue")
          
        }
      ]
    },
    {
      path: "/singer",
      // component: Singer,
      component:() => import("../components/singer/singer.vue"),
      children: [
        {
          path: ":id",
          component: SingerDetail
        }
      ]
    }
    ,
    {
      path: "/rank",
      // component: Rank,
      component:() => import("../components/rank/rank.vue"),
      children: [
        {
          path: ":id",
          component: TopList
        }
      ]
    }
    ,
    {
      path: "/search",
      // component: Search,
      component:() => import("../components/search/search.vue"),
      children: [
        {
          path: ":id",
          component: SingerDetail
        },
      ]
    }
  ]
})



