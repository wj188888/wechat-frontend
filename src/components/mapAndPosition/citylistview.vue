<template>
    <div class="mf-listview" ref="view">
        <div class="mf-list-content" ref="content">
            <div ref="title"
                 @click="selectItem(currentCity)"
                 v-if="isFrom && currentCity.name && currentCity.name !=='定位中...'">
                <h1 class="list-title">当前城市：{{currentCity.name}}</h1>
            </div>
            <ul ref="groups" v-show="showList">
                <li class="list-group" v-for="items in data">
                    <h2 class="list-group-title">{{items.name}}</h2>
                    <ul>
                        <li class="list-group-item"
                            v-for="item in items.items"
                            @touchstart="addActiveCls"
                            @touchend="removeActiveCls"
                            @click="selectItem(item)">
                            {{item.name}}
                            <span class="pc" v-if="item.value.province">{{item.value.province}}</span>
                            <span class="pc mar-l-0" v-if="item.value.province !== item.value.city">{{' - ' + item.value.city}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="noresult" v-show="!showList">
            <div class="warning">
                <div class="warning-icon"><span class="mfic-important"></span></div>
            </div>
            <div class="desc">暂无结果</div>
        </div>
        <div class="mf-shortcut"
             v-if="dataLength > 20"
             @touchstart="onShortcutTouchStart"
             @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li :data-index="index" class="item" v-for="(item, index) in shortcutList">{{item}}</li>
            </ul>
        </div>
        <div class="mf-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
    </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import { mapState } from 'vuex'
  let h = window.innerHeight <= 480 ? 17 : 18;
  export default {
    props: {
      isFrom:true,
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        currentCity: {
          name: '定位中...',
          value:{
            lat: 0,
            lng:0,
            code:'',
          }
        },
        currentIndex: -1,
        scrollY: -1,
        diff: 0,
        showList: true,
      }
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      }),
      fixedTitle () {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].name : ""
      },
      shortcutList () {
        return this.data.map(function (t) {
          return t.name.substr(0, 1)
        })
      },
      dataLength () {
        let len = this.data.length;
        for (let i = 0; i < this.data.length; i ++){
          if(this.data[i].items && this.data[i].items.length){
            len += this.data[i].items.length
          }
        }
        return len
      },
    },
    watch: {
      //定位城市初始化赋值
      appAddress (newVal) {
        
        this.setCurrentPlace(newVal)
      },
      diff (t) {
        let e = t > 0 && t < 40 ? t - 40 : 0;
        if(this.fixedTop !== e){
          this.fixedTop = e
          this.$refs.fixed.style.transform = "translate3d(0," + e + "px,0)"
        }
      },
      scrollY (t) {
        for (let e = this.listHeight, n = 0; n < e.length; n++) {
          let r = e[n], i = e[n + 1];
          if (!i || t >= r && t < i)return this.diff = i - t, void(this.currentIndex = n)
        }
        this.currentIndex = -1
      },
      data (newVal) {
        this._refresh()
        this.showList = newVal.length
      }
    },
    created () {
      this.listHeight = []
      this.fixedTop = 0
      this.touch = {}
    },
    mounted () {
      if(this.appAddress){
        this.setCurrentPlace(this.appAddress)
      }
      this._refresh()
    },
    methods: {
      setCurrentPlace (address) {
        if(address === TOOL.locationFail) return
        let position = address.position
        this.currentCity = {
          name: address.city,
          value:{
            name: address.city,
            city: address.city,
            county: address.county,
            lat: position.lat,
            lng: position.lng,
            code: address.code,
          }
        }
      },

      _refresh () {
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      },

      _initScroll () {
        let t = this;
        this.scrollY = -1
        if(this.scroll){
          this.scroll.refresh()
          this.scroll.scrollTo(0, 0)
        }else{
          this.scroll = new BScroll(this.$refs.view, {
            click: true,
            probeType: 3
          })
          this.scroll.on("scroll", function (e) {
            t.scrollY = -Math.round(e.y)
          })
        }
      },

      _calculateHeight () {
        this.listHeight = [];
        let t = this.$refs.groups.getElementsByClassName("list-group"), e = 50;
        this.listHeight.push(e);
        for (let n = 0; n < t.length; n++) {
          let r = t[n];
          e += r.clientHeight
          this.listHeight.push(e)
        }
        this.maxScrollY = this.$refs.view.clientHeight - this.$refs.content.clientHeight
      },

      _scrollTo (t) {
        let e = Math.min(0, Math.max(this.maxScrollY, -this.listHeight[t]));
        "undefined" != typeof e && (this.scrollY = -e, this.scroll.scrollTo(0, e))
      },

      selectItem (item) {
        if(item.name === '定位中...'){
          this.$store.dispatch('showError', '定位中，请稍候...');
          return
        }
        this.$emit('select', item)
      },

      onShortcutTouchStart (t) {
        let e = t.target.getAttribute('data-index'), n = t.touches[0];
        this.touch.y1 = n.pageY
        this.touch.anchorIndex = e
        this._scrollTo(e)
      },

      onShortcutTouchMove (t) {
        let e = t.touches[0];
        this.touch.y2 = e.pageY;
        let n = (this.touch.y2 - this.touch.y1) / h | 0,
          r = parseInt(this.touch.anchorIndex) + n;
        this._scrollTo(r)
      },

      addActiveCls (t) {
        $(t.currentTarget).addClass('active')
      },

      removeActiveCls (t) {
        $(t.currentTarget).removeClass('active')
      }
    }
  }
</script>