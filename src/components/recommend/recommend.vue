<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data="songList" ref="scroll">
      <div>
        <!-- banner -->
        <div v-show="banners.length" class="decorate"></div>
        <div class="slider-wrapper" v-if="banners.length">
          <Slider>
            <div v-for="item in banners">
              <a href="javascript:;">
                <img :src="item.pic" @load="loadImage">
              </a>
            </div>
          </Slider>
        </div>

        <!-- 歌单列表 -->
        <div class="songList">
          <h2 class="title">推荐歌单</h2>
          <ul>
            <li v-for="item in songList" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.picUrl">
              </div>
              <div class="text">
                <h3 class="name">{{item.name}}</h3>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <Loading></Loading>
      </div>
    </Scroll>
     <router-view></router-view>
  </div>
</template>

<script>
import { getBanner, personalized } from "api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import {mapMutations} from "vuex"
import { playlistMixin } from "common/js/mixin";

export default {
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    Loading,
  
  },
  data() {
    return {
      banners: [],
      songList: []
    };
  },
  created() {
    this._getBanners();
    this._getSongList();
  },
  mounted() {},
  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? "50px" : ""
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 获取轮播图
    _getBanners() {
      getBanner().then(res => {
        if (res.status === 200) {
          this.banners = res.data.banners;
        } else {
          console.error("banner图获取失败");
        }
      });
    },
    // 获取推荐歌单
    _getSongList() {
      personalized().then(res => {
        if (res.status === 200) {
          this.songList = res.data.result;
        } else {
          console.error("推荐歌单获取失败");
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      // console.log(item)
      this.setDisc(item)
    },
    ...mapMutations({
      setDisc: "SET_DISC",
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;
  overflow: hidden;
  .recommend-content {
    width: 100%;
    height: 100%;
    // overflow: hidden;

    .decorate {
      position: absolute;
      top: -30vh;
      z-index: -10;
      background: $color-theme;
      width: 100%;
      height: 46vh;
      vertical-align: inherit;
    }
    .slider-wrapper {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .songList {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    .title {
      height: 65px;
      line-height: 65px;
      padding-left: 1.5%;
      text-align: left;
      font-size: $font-size-medium;
      font-weight: bold;
      color: $color-text;
    }
    .item {
      display: inline-block;
      position: relative;
      box-sizing: border-box;
      width: 33%;
      padding: 0 1%;
      .icon {
        position: relative;
        display: inline-block;
        width: 100%;
        margin-bottom: 5px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
      }
      .text {
        float: left;
        line-height: 16px;
        text-align: left;
        height: 40px;
        overflow: hidden;
        margin-bottom: 10px;
        font-size: $font-size-small;
      }
    }
  }
}
</style>
