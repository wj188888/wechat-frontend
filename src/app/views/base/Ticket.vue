<template>
  <div>
    <div class="normal-box line line-x-t">
      <h2 class="tit-shu line line-x-b">
        <i class="icon-shu"></i>我的车票
      </h2>
      <ul class="my-ticket">
        <router-link tag="li" v-for="(ticketMenu, index) in ticketMenus" :key="index" :to="{name:'ticketList', query:{productTypeLevelOne: ticketMenu.productTypeLevelOne}}">
          <div class="ticket-type">
            <i class="icon-tt icon-tt-cj" :class="ticketMenu.icon"></i>
            <span v-text="ticketMenu.name">城际</span>
          </div>
        </router-link>
      </ul>
    </div>
    <div class="padding-box vux-1px-tb">
      <h2 class="tit-shu line line-x-b">
        <i class="icon-shu"></i>提醒信息
      </h2>
      <div class="ticket-warning-tips">
        <scroll ref="scroll"
                :pullUpLoad="true"
                @pullingUp="onPullingUp">
          <div>
            <ul class="warning-list" v-if="infoData.length">
              <li v-for="data in infoData">
                <i class="icon-warning">!</i>
                <span>{{data.title}}</span>
              </li>
            </ul>
            <p v-if="!infoData.length">暂无车次信息</p>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroll from 'components/betterScroll/scroll/scroll'
  
  export default {
    components: {
      Scroll,
    },
    data () {
      return {
        ticketMenus: [
          {productTypeLevelOne: 'CITY_BUS', icon: 'icon-tt-cj', name: '城际'},
          {productTypeLevelOne: 'AIRPORT_BUS', icon: 'icon-tt-jc', name: '机场'},
          {productTypeLevelOne: 'TRAIN_STATION_BUS', icon: 'icon-tt-jz', name: '接站'},
          {productTypeLevelOne: 'TOUR_BUS', icon: 'icon-tt-jd', name: '景点'},
          {productTypeLevelOne: 'SCHOOL_BUS', icon: 'icon-tt-xx', name: '校园'},
          {productTypeLevelOne: 'CUSTOM_BUS', icon: 'icon-tt-bc', name: '包车'},
          {productTypeLevelOne: 'WORK_BUS', icon: 'icon-tt-gz', name: '工作'}
        ],
        infoData: [],
        totalPage: '',
        searchKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        }
      }
    },
    mounted () {
      if (appStorage.get('X-Auth-Token')) {
        this.onPullingUp()
      }
    },
    methods: {
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.infoData = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },

      /**
       * 车次提醒
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.findTimesInfo(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.totalPage = data.resultData.totalPages
            this.infoData = this.infoData.concat(data.resultData.content)
            setTimeout(() => {
              this.$refs.scroll.forceUpdate(true)
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      }
      
    }
  }
</script>
<style>
  .ticket-warning-tips {
    position: absolute;
    top: 80px;
    right: 20px;
    bottom: 0;
    left: 20px;
    background-color: #fff;
  }
</style>