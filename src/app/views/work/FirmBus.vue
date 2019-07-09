<template>
  <main-box :title="title" main-class="pad-20">
    <product-top-nav :show="pageId == 6" ctg="WORK_BUS" :active="1" :nav1router="goBuyTicket"></product-top-nav>
    <div class="search-box line line-box radius-box">
      <input type="text" placeholder="点击搜索企业名称" v-model="searchKeys.companyName"/>
    </div>
    <div class="ticket-scroller firm-school-scroller" :class="{'hide-nav-work': pageId != 6}">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="mar-lr-20">
          <normal-title css-class="pad-l-0" :show="workTicketLists.length" title="已为您搜索到该企业班车"></normal-title>
          <div class="collect-box" v-if="workTicketLists.length > 0">
            <div class="container-box line line-box radius-box" v-for="workTicketList in workTicketLists">
              <div class="order-box">
                <div class="start clearfix">
                  <span class="time" v-text="workTicketList.time">10:00</span>
                  <span class="circle circle-bg-start">始</span>
                  <span class="place" v-text="workTicketList.aAddress.detailAddress">青羊区</span>
                  <!--<div class="collect-icon"><i class="c-icon icon-c"></i><span>收藏</span></div>-->
                </div>
                <div class="end clearfix">
                  <span class="company" v-text="workTicketList.firmName">巴运集团</span>
                  <span class="circle circle-bg-end">终</span>
                  <span class="place" v-text="workTicketList.bAddress.detailAddress">成都国际节能大厦</span>
                </div>
              </div>
              <div class="desc line line-x-t">
                <!--<span class="detail">全称3.5km&nbsp;约30分钟</span>-->
                <span class="frequency">{{ workTicketList.operationRule.week | weekText }}</span>
              </div>
            </div>
          </div>
          <no-result :show="workTicketLists.length === 0" text="<p>很抱歉，没有耶</p><p>再试试别的吧~</p>">
            <img class="icon" src="../../../assets/no.png"/>
          </no-result>
        </div>
      </scroll>
    </div>
    <div class="charter-apply-btn">
      <a class="button button-primary" @click="jumpToFirmBus">申请企业班车服务</a>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import NormalTitle from 'appComponents/title/normalTitle'
  import NoResult from 'appComponents/noResult/index'

  export default {
    components: {
      MainBox,
      ProductTopNav,
      Scroll,
      NormalTitle,
      NoResult
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageId:'',
        onStation: '',
        offStation: '',
        searchKeys: {
          companyName: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        workTicketLists: []
      }
    },
    mounted () {
      if(this.$route.query.pageName){
        this.title = this.$route.query.pageName
      }
      this.pageId = +this.$route.query.pageId || 6

      this.onStation = this.$route.query.onStation
      this.offStation = this.$route.query.offStation
    },
    watch: {
      /**
       * 根据公司名称查找工作班车
       */
      'searchKeys.companyName' (newVal) {
        if (newVal) {
          this.onPullingUp()
        }
      },
      $route () {
        this.pageId = +this.$route.query.pageId || 6
      }
    },
    methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.workTicketLists = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
  
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.schoolWorkFlightFindCharterWork(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.workTicketLists = this.workTicketLists.concat(data.resultData.content)
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 跳转工作班车页面
       */
      goBuyTicket () {
        if (this.onStation && this.offStation) {
          this.$router.replace({
            name: 'workList',
            query: {
              onStation: this.onStation,
              offStation: this.offStation
            }
          });
        } else {
          this.$router.push({name: 'work'});
        }
      },

      /**
       * 跳转到企业班车申请页面
       */
      jumpToFirmBus () {
        this.$router.push({
          name: 'applyBus'
        })
      }
    }
  }
</script>
