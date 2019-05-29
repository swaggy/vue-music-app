<template>
  <transition name="slide">
    <MusicList :songs="songs" :title="title" :bgImage="bgImage" ></MusicList>
  </transition>
</template>


<script>
import { mapGetters } from "vuex";
import { songListDetail } from "api/recommend";
// import {getSong} from "api/song"
import {createSong} from "common/js/song"
import MusicList from "components/music-list/music-list";
export default {
  components: {
    MusicList
  },
    data() {
      return {
        songs: []
      };
    },
  computed: {
    title() {
      return this.disc.name;
    },
    bgImage() {
      return this.disc.picUrl;
    },
    ...mapGetters(["disc"])
  },
  created() {
    this._getSongList();
  },
  methods: {
    //   获取歌单详情
    _getSongList() {
        if(!this.disc.id){
            this.$router.push({
                path:"/recommend"
            })
            return
        }
      songListDetail(this.disc.id).then(res => {
        if(res.status === 200){
            // console.log(res.data.playlist.tracks)
            this.songs = this._normalizeSongs(res.data.playlist.tracks)
        }
      });
    },
    _normalizeSongs(list){
        let ret = []
        list.forEach((item) => {
           ret.push(createSong(item))
        });
        return ret
    }
  }
  //   methods: {
  //     _getDetail() {
  //       if (!this.singer.id) {
  //         this.$router.push("/singer");
  //         return;
  //       }
  //       getSingerDetail(this.singer.id).then(res => {
  //         if (res.status == 200) {
  //           this.songs = this._normalizeSongs(res.data.hotSongs)
  //           // console.log(this.songs)
  //         }
  //       });
  //     },
  //     // 对获取的数据进行处理
  //     _normalizeSongs(list){
  //       let ret = []
  //       list.forEach((item) => {
  //         // console.log(item)
  //         // getSong(item.id)
  //         // .then(res => {
  //           // 歌曲链接
  //           // item.url = res.data.data[0].url;
  //           ret.push(createSong(item))
  //         })
  //       // });
  //       return ret

  //     }
  //   }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(30%, 0, 0);
}
// .singer-detail {
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
//   background: $color-background;
// }
</style>


  