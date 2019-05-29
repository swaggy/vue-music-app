<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const PROGRESSBTNWIDTH = 16;
import { prefixStyle } from "common/js/dom";
const transform = prefixStyle("transform");
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH/2;
        const offsetWidth = newVal * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
    },
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH/2,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
        this.touch.initiated = false;
        this._changePercent()
    },
    _changePercent(){
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH/2;
        const percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit("percentChange",percent)
    },
    progressClick(e){
        this._offset(e.offsetX - PROGRESSBTNWIDTH/2)
        this._changePercent()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 5px solid $color-theme-l;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
