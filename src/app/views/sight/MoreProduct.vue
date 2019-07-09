<template>
  <main-box :title="title">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div class="pad-20 pad-b-0">
        <router-link tag="div"
                     class="com-list-box"
                     v-for="(item, index) in prcData"
                     :key="index" @click="jumpToPrcDetail(item.id)"
                     :to="{name:'productDetail',query:{id:item.id}}">
          <div class="com-list-left" :style="{backgroundImage: 'url(\'' + item.primaryImage + '\')'}"></div>
          <div class="com-list-right">
            <div class="sight-desc" style="padding-top:0;">
              <div class="theme">{{ item.productTheme | strSplit('42') }}</div>
              <div class="list-tags clearfix">
                <span v-for="tag in item.tags">{{tag}}</span>
              </div>
              <div class="time-pany clearfix">
                <i class="pany-icon"></i>
                <span style="margin-right:10px;" v-text="item.firmName"></span>
                <i class="time-icon"></i>
                <span class="week">{{ item.week | weekText }}</span>
              </div>
              <div class="sig-price-score clearfix">
                <div class="sig-price-box">
                  <em class="og-word">¥</em>
                  <span class="og-word" v-text="item.minPrice">338</span>
                  <em>起</em>
                </div>
                <!--<div class="score-box">
                  评价4.3分
                </div>-->
                <div class="people-box">
                  已出行{{item.sales}}人
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  
  export default {
    components: {
      MainBox,
      Scroll
    },
    data () {
      return {
        title: this.$route.meta.title,
        searchKeys: {
          productType: 1, //产品类型 0:班线信息 1：景点信息
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        prcData: '',
        totalPage: '',
      }
    },
    mounted () {
      this.onPullingUp()
    },
    methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.prcData = []
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
        api.findAllProduct(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.prcData = this.prcData.concat(data.resultData.content)
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
       * 清除本地订单数据
       */
      deletePrcForm () {
        appStorage.remove('porderWrite')
      },

      jumpToPrcDetail (id) {
        this.deletePrcForm()
        this.$router.push({
          name: 'productDetail',
          query: {
            id: id
          }
        })
      },
    }
  }
</script>
