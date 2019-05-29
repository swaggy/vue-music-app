<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <!-- <transition name="filterR">
          <div class="filterR" v-show="currentShow === 'lyric'"></div>
          </transition>-->
          <div class="filter"></div>
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <!-- top -->
        <div class="top">
          <div class="back" @click="back">
            <i class="fa fa-angle-down"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- middle -->
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevet="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <transition name="middleL">
            <div class="middle-l" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <div class="cd" :class="adCls">
                  <img :src="currentSong.image" class="image">
                </div>
              </div>
              <!-- 小歌词 -->
              <div class="playing-lyric-warpper">
                <div class="playing-lyric" v-if="lyric">{{playingLyric}}</div>
              </div>
            </div>
          </transition>

          <!-- 歌词 -->
          <transition name="middleR">
            <scroll class="middle-r" ref="lyricList" :data="lyric && lyric.lines">
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="lyric">
                  <p
                    ref="lyricLine"
                    class="text"
                    v-for="(line, index) in lyric.lines"
                    :key="line.key"
                    :class="{'current':currentLineNum === index}"
                  >{{line.txt}}</p>
                </div>
                <p class="no-lyric" v-if="lyric === null">无歌词</p>
              </div>
            </scroll>
          </transition>
        </div>
        <!-- bottom -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <!-- 控制按钮 -->
          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left">
              <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="iconfont icon-prev" @click.stop="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="iconfont icon-test" @click.stop="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-dislike"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- miniplayer -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" :class="adCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i class="fa" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="iconfont icon-caidan1"></i>
        </div>
      </div>
    </transition>
    <audio :src="url" ref="audio" autoplay @canplay="ready" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getSong, getLyric } from "api/song";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/utl";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import { prefixStyle } from "common/js/dom";
const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");
export default {
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  data() {
    return {
      url: "",
      songReady: false,
      currentTime: 0,
      duration: 0,
      radius: 32,
      lyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  created() {
    this.touch = {};
  },
  computed: {
    // 控制normal播放按钮的样式
    playIcon() {
      return this.playing ? "icon-stop" : "icon-bofangicon";
    },
    // 控制mini播放按钮的样式
    miniIcon() {
      return this.playing ? "fa-stop" : "fa-play";
    },
    // 控制播放模式按钮的样式
    iconMode() {
      return this.mode === playMode.sequence
        ? "icon-next"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    // 控制cd旋转
    adCls() {
      return this.playing ? "play" : "play pause";
    },
    // 在歌曲未准备好时添加disable样式
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    // 计算当前播放的百分比
    percent() {
      return this.currentTime / this.duration;
    },

    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  watch: {
    // 当前歌曲信息
    currentSong(newVal, oldVal) {
      if (!newVal) {
        return;
      }
      if (newVal.id === oldVal.id) {
        return;
      }
      if (newVal === oldVal) {
        return;
      }
      // this.$refs.audio.pause();
      // this.$refs.audio.currentTime = 0;
      setTimeout(() => {
        this._getSong(newVal.id);
      }, 1000);
      // if (this.url.length) {
      //   this.$nextTick(() => {
      //     this.$refs.audio.play();
      //   });
      // }
      // 停止上一次的歌词播放
      if (this.lyric) {
        this.lyric.stop();
      }
      this.getLyricData(newVal.id);
    },
    // 播放状态
    playing(newVal) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause();
      });
    },
    url(newVal) {
      // 没版权
      if (!newVal) {
        this.setPlayingState(false);
        this.setFullScreen(false);
      }
      // 获取durati 歌曲总时长
      let getDuration = setInterval(() => {
        this.duration = this.$refs.audio.duration;
        if (this.duration) {
          clearInterval(getDuration);
        }
      }, 150);
    },
    songReady(newVal) {
      if (newVal === true && this.lyric) {
        this.lyric.seek(0);
        console.log("seek");
      }
    }
  },
  methods: {
    // 返回上一个界面 切换mini播放模式
    back() {
      this.setFullScreen(false);
    },
    // 打开全屏播放
    open() {
      this.setFullScreen(true);
    },
    // 获取当前歌曲链接
    _getSong(id) {
      getSong(id).then(res => {
        if (res.status == 200) {
          // console.log(res.data.data[0].url);
          this.url = res.data.data[0].url;
        }
      });
    },
    // 切换palying 播放暂停
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.lyric) {
        this.lyric.togglePlay();
      }
    },
    // 切换上一首
    prev() {
      if (this.mode === playMode.loop) {
        this.loop();
        return;
      }
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    // 切换下一首
    next() {
      if (!this.songReady) {
        return;
      }
      if (this.mode === playMode.loop) {
        this.loop();
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.songReady = false;
      }
    },
    // 判断歌曲是否准备完毕 限制上、下一曲
    ready() {
      this.songReady = true;
    },
    // 歌曲没准备好的回调
    error() {
      this.songReady = true;
    },
    // 播放时间
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    // 格式化时间
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60;
      if (second < 10) {
        second = "0" + second;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      return `${minute}:${second}`;
    },
    // 进度条变化时的操作
    onProgressBarChange(percent) {
      this.$refs.audio.currentTime = this.duration * percent;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.lyric) {
        this.lyric.seek(this.duration * percent * 1000);
      }
    },
    // 改变播放模式
    changeMode() {
      let mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    // 切换到随机播放时 确保当前歌曲不变
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    // 当前歌曲播放完毕时的操作
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    // 循环播放
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.lyric) {
        this.lyric.seek(0);
      }
    },
    // 获取歌词
    getLyricData(id) {
      getLyric(id)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data.lrc.lyric);
            let newLyric = new Lyric(res.data.lrc.lyric, this.handleLyric);
            this.lyric = newLyric;
            if (this.lyric !== newLyric) {
              return;
            }
            if (this.playing) {
              this.lyric.play();
              // console.log(1);
            }

            console.log(this.lyric);
          }
        })
        .catch(() => {
          this.lyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    // lyric的回调函数
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];

        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = "0ms";

      // 修改middlel的透明度
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = "0ms";
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      // 从右向左滑
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        //从左向右滑
        if (this.touch.percent < 0.8) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = "300ms";

      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = "300ms";
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlaylist: "SET_PLAYLIST"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
@import "~common/scss/mixin";
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 200%;
      height: 200%;
      z-index: -1;
      opacity: 0.8;
      filter: blur(20px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
      .filterR {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.4;
        &.filterR-enter-active,
        &.filterR-leave-active {
          transition: all 0.3s;
        }
        &.filterR-leave-to,
        &.filterR-enter {
          opacity: 0;
        }
        &.filterR-leave {
          opacity: 0.4;
        }
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .fa-angle-down {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          color: $color-theme-l;
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-text-l;
      }
      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-small-x;
        color: $color-text-l;
      }
    }
    .middle {
      // display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      // font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middleL-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0%;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 15px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-warpper {
          // display: inline-block;
          width: 80%;
          height: auto;
          // position: relative;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            line-height: 40px;
            color: #fff;
            font-size: $font-size-medium;
            word-break: normal;
            word-wrap: break-word;
            white-space: pre-wrap;
          }
        }
      }
    }

    .middle-r {
      display: inline-block;
      // position: absolute;
      // top: 0;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      &.middleR-enter-active,
      &.middleR-leave-active {
        transition: all 0.2s;
      }
      &.middleR-enter,
      &.middleR-leave-to {
        opacity: 0;
      }
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 40px;
          color: $color-text-ggg;
          font-size: $font-size-medium;
          word-break: normal;
          word-wrap: break-word;
          white-space: pre-wrap;

          &.current {
            color: #fff;
          }
        }
        .no-lyric {
          line-height: 40px;
          margin-top: 60%;
          color: $color-text-ggg;
          font-size: $font-size-medium;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .dot-wrapper {
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-sub-theme;
        }
      }
    }
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;
      .time {
        color: $color-text-l;
        font-size: $font-size-small;
        flex: 0 0 30px;
        line-height: 30px;

        width: 30px;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
          color: $color-text-gg;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
        margin: 0 5px;
      }
    }
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: $color-theme-l;

        &.disable {
          color: $color-text-gg;
        }
        i {
          font-size: 30px;
        }
        .mode {
          font-size: 25px;
        }
        &.i-left {
          text-align: right;
        }
        &.i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        &.i-right {
          text-align: left;
        }
        .icon-like {
          color: $color-sub-theme;
        }
      }
    }
  }
  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  &.normal-enter,
  &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: -2px;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.85);
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.4s;
  }
  &.mini-enter,
  &.mini-leave-to {
    opacity: 0;
  }
  .icon {
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      &.play {
        animation: rotate 10s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    .name {
      margin-bottom: 2px;
      line-height: 14px;
      @include no-wrap();
      font-size: $font-size-medium;
      color: $color-text;
    }
    .desc {
      @include no-wrap();
      font-size: $font-size-small;
      color: $color-text;
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-play-mini,
    .icon-pause-mini,
    .icon-playlist,
    .iconfont {
      font-size: 30px;
      color: $color-theme-d;
    }
    .iconfont {
      position: relative;
      left: -5px;
      top: -3px;
    }

    .fa-play {
      color: $color-theme-d;
      font-size: 14px;
      position: absolute;
      left: 12px;
      top: 8.5px;
    }
    .fa-stop {
      color: $color-theme-d;
      font-size: 12px;
      position: absolute;
      left: 11px;
      top: 10px;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
