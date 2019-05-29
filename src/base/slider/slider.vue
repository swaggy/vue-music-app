// 轮播
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";
export default {
  data(){
      return{
          dots:[],
          currentPageIndex:0
      }
  },
  props: {
    //   循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 播放间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    // 保障dom能成功渲染 浏览器的刷新通常是17ms一次
    setTimeout(() => {
      this._setSliderWidth();
      this._initSlider();
      this._initDots()
    }, 20);
    if(this.autoPlay){
        this._play()
    }

    // 优化 当窗口size变化时
    window.addEventListener("resize",()=>{
        if(!this.slider){
            return
        }
        this._setSliderWidth(true)
        // 重新计算
        this.slider.refresh()
         
    })
  },
  methods: {
    //  设置slider的宽度
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        // 给每个子元素添加class 确保渲染出的样式是正确的
        addClass(child, "slider-item");
        // 设置子元素的宽度等于slider
        child.style.width = sliderWidth + "px";
        // 计算slider总宽度
        width += sliderWidth;
        
      }
    // 如果循环播放 总宽度加两个slider的宽度
      if (this.loop && !isResize) {
        width += sliderWidth * 2;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    // 初始化slider
    _initSlider() {
        this.slider = new BScroll(this.$refs.slider, { 
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on("scrollEnd",()=>{
            let pageIndex = this.slider.getCurrentPage().pageX
            if(this.loop){
                pageIndex -= 1
            }
            this.currentPageIndex = pageIndex
            if(this.autoPlay){
                clearTimeout(this.timer)
                this._play()
            }
        })
    },
    // 初始化dots
    _initDots(){
        this.dots = new Array(this.children.length)
        if(this.loop){
            this.dots.length -= 2
        }
    },
    // 下一页
    _play(){
        let pageIndex = this.currentPageIndex + 1
        if(this.loop){
            pageIndex += 1
        }
        this.timer = setTimeout(() => {
            this.slider.goToPage(pageIndex,0,400)
        }, this.interval);
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable";
.slider {
  min-height: 1px;
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      img {
        display: block;
        width: 100%;
        height: 165px;
      }
    }
  }
  .dots{
      position: absolute;
      right: 0;
      left:0;
      bottom:12px;
      text-align:center;
      .dot {
          display: inline-block;
          width:8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          margin:0 5px;
          &.active{
              width:15px;
              margin:0;
              border-radius: 5px;
              background:$color-highlight-background;
          }
      }
  }

}
</style>

