<template>
  <div @click="showShareUrl">
    <div class="fix-tool"
         :style="[
           {'opacity':opacity},
           {'webkitTransform':'translate3d(' + offx +',' + offy + ',0)'},
           {'webkitTransition':transition}
           ]"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)"
         ref="fixTool">
      <div class="round">全民<br/>营销</div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  
  export default {
    data() {
      return {
        dx: 0,
        dy: 0,
        offx: "0px",
        offy: "0px",
        times: {},
        clientW: document.documentElement.clientWidth,
        clientH: document.documentElement.clientHeight,
        opacity: 0.7,
        transition: '',
        pointerEvents: '',
        fixToolWidth: 0,
      }
    },
    computed: {
      ...mapState({
        isShowShareUrl: state => state.marketSetting.showShareUrl,
      }),
    },
    mounted() {
      this.fixToolWidth = this.$refs.fixTool.offsetWidth;
      this.$root.$children[0].showf = true;
      this.init();
    },
    methods: {
      showShareUrl () {
        this.$store.commit('UPDATE_SHAREURL', !this.isShowShareUrl)
      },
      
      init() {
        let l = this.clientW - this.fixToolWidth;
        let t = (this.clientH - this.fixToolWidth) * 0.8;
        this.dx = l;
        this.dy = t;
        this.offx = l + "px";
        this.offy = t + "px";
      },
      
      touchStart(e) {
        e.preventDefault();
        this.dx -= e.changedTouches[0].pageX;
        this.dy -= e.changedTouches[0].pageY;
        this.transition = "";
      },
      
      touchMove(e) {
        e.preventDefault();
        this.opacity = 1;
        clearInterval(this.times);
        this.dx = this.dx || 0;
        this.dy = this.dy || 0;
        let x = e.changedTouches[0].pageX;
        let y = e.changedTouches[0].pageY;
        this.offx = this.dx + x + "px";
        this.offy = this.dy + y + "px";
      },
      
      touchEnd(e) {
        e.preventDefault();
        this.transition = "0.2s all linear";
        this.dx += e.changedTouches[0].pageX;
        this.dy += e.changedTouches[0].pageY;
        let isTop = false,
            l = ~~this.offx.substring(0, this.offx.length - 2),
            t = ~~this.offy.substring(0, this.offy.length - 2)
        if(t < this.fixToolWidth) {
          this.dy -= (this.dy - 0);
          let newL = this.offx;
          if(l <= 0) {
            newL = "0px";
            this.dx -= (this.dx - 0);
          }
          if((this.clientW - this.fixToolWidth) < l) {
            newL = (this.clientW - this.fixToolWidth) + "px";
            this.dx -= (this.dx - (this.clientW - this.fixToolWidth))
          }
          this.offx = newL;
          this.offy = "0px";
          isTop = true;
        }
        if((this.clientH - (t + this.fixToolWidth)) < this.fixToolWidth) {
          this.dy -= (this.dy - (this.clientH - this.fixToolWidth));
          let newL = this.offx;
          if(l <= 0) {
            newL = "0px";
            this.dx -= (this.dx - 0);
          }
          if((this.clientW - this.fixToolWidth) < l) {
            newL = (this.clientW - this.fixToolWidth) + "px";
            this.dx -= (this.dx - (this.clientW - this.fixToolWidth))
          }
          this.offx = newL;
          this.offy = (this.clientH - this.fixToolWidth) + "px";
          isTop = true;
        }
        if((this.clientW / 2) > (l + 30) && !isTop) {
          this.dx -= (this.dx - 0)
          this.offx = "0px";
        } else if((this.clientW / 2) < (l + 30) && !isTop) {
          this.dx -= (this.dx - (this.clientW - 60))
          this.offx = (this.clientW - 60) + "px";
        }
        let i = 0;
        this.times = setInterval(() => {
          i += 1;
          if(i === 3) {
            clearInterval(this.times);
            this.opacity = "0.7";
          }
        }, 1000)
      }
    }
  }
</script>
<style lang="less" scoped>
  .fix-tool {
    top: 0;
    left: 0;
    position: fixed;
    z-index: 9999;
    height: 60PX;
    width: 60PX;
    border-radius: 50%;
    background-color: #ff9900;
    display: block;
    opacity: 0.7;
    pointer-events: auto;
    box-shadow: 0 0 10px #ff9900;
    .round {
      padding-top:12PX;
      text-align: center;
      font-size:14PX;
      color:#fff;
      line-height:1.4;
    }
  }
</style>