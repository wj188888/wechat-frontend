<template>
  <main-box :title="title" main-class="scrollingBox">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div class="pad-20 pad-b-0">
        <line-car-ticket :datas="lineProductList"></line-car-ticket>
        <no-result :show="!lineProductList.length" text="抱歉，暂无当前线路信息<br/>试试别的线路吧"></no-result>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import LineCarTicket from 'appComponents/lineCarTicket/index.vue'
  import NoResult from 'appComponents/noResult/index.vue'

  export default {
    components: {
      MainBox,
      Scroll,
      LineCarTicket,
      NoResult,
    },
    data () {
      return {
        title: this.$route.meta.title,
        searchKeys: {
          startPlace: '',
          endPlace: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        lineProductList: [],
        totalPage: ''
      }
    },
    mounted () {
      this.searchKeys.startPlace = this.$route.query.startPlace
      this.searchKeys.endPlace = this.$route.query.endPlace
      this.searchKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
  
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.lineProductList = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       * 查询线路包车
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.lineProductFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.lineProductList = this.lineProductList.concat(data.resultData.content)
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
       * 跳转线路包车产品详情
       * @param productId
       */
      jumpToCarpoolingList (productId) {
        appStorage.remove('carpoolingSelfStation')
        this.$router.push({
          name: 'carpoolingList',
          query: {
            productId: productId
          }
        })
      },
    }
  }
</script>