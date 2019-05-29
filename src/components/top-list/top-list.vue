<template>
  <transition name="slide">
    <MusicList :title="title" :bgImage="bgImage" :songs="songs"></MusicList>
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
  data () {
      return {
        songs:[]      
      }
  },
  computed: {
      title(){
          return this.topList.name
      },
      bgImage(){
          return this.topList.coverImgUrl
      },    
      ...mapGetters([
          "topList"
      ])
  },
  created () {
      this._getSongs()
  },
  methods: {
      _getSongs(){
          if(!this.topList.id){
              this.$router.push({
                  path:"/rank"
              })
              return
          }
          let list = this.topList.tracks
          this.songs = this._normalizeSongs(list)
      },
      _normalizeSongs(list){
          let ret = []
          list.forEach(item => {
              ret.push(createSong(item))
          })
          return ret
      }
  }
 

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

</style>