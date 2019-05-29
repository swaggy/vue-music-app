<template>
  <scroll class="suggest" :data="songs" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest">
    <div>
      <div class="search-suggest" v-show="suggest">
        <p class="title" v-show="showSinger && showList">最佳匹配</p>
        <div
          class="search-suggest-item"
          v-if="suggest.artists && showSinger"
          @click="selectSinger(suggest.artists[0])"
        >
          <img :src="suggest.artists[0].img1v1Url">
          <span>歌手：{{suggest.artists[0].name}}</span>
        </div>
        <!-- <div
          class="search-suggest-item"
          v-if="suggest.playlists && showList"
          @click="selectList(suggest.playlists[0])"
        >
          <img :src="suggest.playlists[0].coverImgUrl" width="50" height="50">
          <div class="text">
            <p>歌单：{{suggest.playlists[0].name}}</p>
            <p class="singer">{{suggest.albums[0].artist.name}}</p>
          </div>
        </div> -->
      </div>
      <!-- suggest -->
      <ul class="suggest-list" ref="suggestList">
        <li
          class="suggest-item"
          v-for="(item, index) in songs"
          :key="index"
          @click="selectSong(item)"
        >
          <div class="name">
            <p class="song">{{item.name}}</p>
            <p class="singer">{{item.singer}}</p>
          </div>
        </li>
        <loading v-show="hasMore" title class="loading"></loading>
      </ul>
    </div>
  </scroll>
</template>

<script>
import { getSearchSongs, getSearchSuggest, getSongDetail } from "api/search";
import { createSearchSong } from "common/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "common/js/singer";
import { mapMutations, mapActions } from "vuex";
export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    showList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 0,
      songs: [],
      singer: {},
      suggest: {},
      hasMore: true,
      searchShow: true,
      updata: true,
      pullup: true
    };
  },
  watch: {
    query() {
      this.search();
    }
  },
  methods: {
    // 搜索query
    search() {
      this.page = 0;
      this.searchShow = false;
      this.hasMore = true;
      if (!this.query) {
        return;
      }
      getSearchSongs(this.query, this.page).then(res => {
        if (res.status == 200) {
          // 判断还有没有更多数据待加载
          if (!res.data.result.songs) {
            this.hasMore = false;
            return;
          }
          this.songs = this._normalizeSongs(res.data.result.songs);
          //   this.$emit('refresh')
        }
      });
      getSearchSuggest(this.query).then(res => {
        this.suggest = res.data.result;
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSearchSong(item));
      });
      return ret;
    },
    // 加载更多
    searchMore() {
      //   console.log("searchMore");
      if (!this.searchMore || !this.query) {
        return;
      }
      this.page += 30;
      getSearchSongs(this.query, this.page).then(res => {
        let list = res.data.result.songs;
        if (!res.data.result.songs) {
          this.hasMore = false;
          return;
        }
        let ret = this._normalizeSongs(res.data.result.songs);
        this.songs = this.songs.concat(ret);
        // this.$emit('refresh')
      });
    },
    //歌手跳转
    selectSinger(item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        avatar: item.img1v1Url
      });
      this.$router.push({
        path: `/search/${singer.id}`
      });
      this.setSinger(singer);
    },
    //歌单跳转
    // selectList(item) {
    //   console.log(item);
    //   const list = {};
    //   list.name = item.name;
    //   list.id = item.id;
    //   list.picUrl = item.coverImgUrl;
    //   list.playCout = item.playCount;

    //   this.$router.push({
    //     path: `/search/list/${list.id}`
    //   });
    //   this.setMusicList(list);
    //   this.$emit("select")
    // },
    // 歌曲跳转
    selectSong(item) {
      console.log(item);
      getSongDetail(item.id).then(res => {
        if (res.status === 200) {
          item.image = res.data.songs[0].al.picUrl;
          this.insertSong(item);
          //   console.log(item);
        }
      });
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
      setMusicList: "SET_MUSIC_LIST"
    }),
    ...mapActions(["insertSong"])
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";

.suggest {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .search-go {
    font-size: $font-size-medium;
    margin-left: 20px;
    color: $color-theme;
  }
  .search-suggest {
    .title {
      padding-left: 20px;
      padding-bottom: 10px;
      color: $color-theme;
      font-size: 11px;
    }
    .search-suggest-item {
      display: flex;
      align-items: center;
      padding: 8px 20px;
      border-bottom: 1px solid rgb(228, 228, 228);
      font-size: $font-size-medium;
      img {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        padding-right: 15px;
      }
      .text {
        width: 100%;
        p {
          padding: 3px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .singer {
          font-size: 12px;
          color: $color-text;
        }
      }
    }
  }
  .suggest-list {
    padding-bottom: 30px;
    width: 100%;
    .suggest-item {
      display: flex;
      padding: 3px 20px;
      height: 50px;
      width: 100%;
      align-items: center;
      border-bottom: 1px solid rgb(228, 228, 228);
      p {
        padding: 3px 0;
      }
      .song {
        font-size: $font-size-medium-x;
        color: $color-text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // padding-bottom: 20px
      }
      .singer {
        font-size: 12px;
        color: $color-text-g;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .icon {
      // flex: 0 0 30px
      // width: 30px
      [class^="icon-"] {
        font-size: 14px;
        color: $color-text;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
}
.no-result-wrapper {
  position: fixed;
  overflow: hidden;
  left: 50%;
  top: 40vh;
  transform: translatex(-50%);
  color: $color-text;
}
</style>
