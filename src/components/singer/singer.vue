<template>
  <div class="singer" ref="singer">
    <Listview :data="singers" @select="selectSinger" ref="list"></Listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingers } from "api/singer";
const HOT_NAME = "热门歌手";
const HOT_SOMGER_LEN = "10";
var pinyin = require("pinyin");
import Listview from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";
export default {
  mixins: [playlistMixin],
  components: {
    Listview
  },
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingers();
  },
  methods: {
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? "50px" : ""
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 获取歌手信息
    _getSingers() {
      getSingers().then(res => {
        if (res.status === 200) {
          var singers = res.data.artists;

          //  给每一个歌手添加initial（首字母）属性和值
          singers.map(item => {
            // console.log(item);
            let py = pinyin(item.name[0], {
              style: pinyin.STYLE_FIRST_LETTER
            });
            item.initial = py[0][0].toUpperCase();
          });

          this.singers = this._normalizeSinger(singers);
          //   console.log(this.singers)
        }
      });
    },
    // 规范得到的数据 变成我们可利用的
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((items, index) => {
        if (index < HOT_SOMGER_LEN) {
          // 前十条添加到map.hot.items
          map.hot.items.push({
            id: items.id,
            name: items.name,
            avatar: items.img1v1Url
          });
        }
        const key = items.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push({
          id: items.id,
          name: items.name,
          avatar: items.img1v1Url
        });
      });
      // 处理map 得到有序列表
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title === HOT_NAME) {
          hot.push(val);
        } else if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        }
      }
      //   对ret进行排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(ret);
    },
    selectSinger(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      });
      this.setSinger(item);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
