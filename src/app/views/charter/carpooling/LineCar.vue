<template>
  <main-box :title="title">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
      <div class="mar20">
        <product-top-nav :show="pageId == 7" ctg="LINE_BUS" :active="0" :nav2router="jumpToCharter"></product-top-nav>
        <search-box
          :start-place="searchKeys.startPlace"
          :end-place="searchKeys.endPlace"
          @changeStation="changeStation"
          @jumpToFrom="jumpToCitySearch('startPlace')"
          @jumpToTo="jumpToCitySearch('endPlace')">
        </search-box>
        <input type="button" class="button button-primary" @click="search" value="查询"/>
        <line-car-ticket :show-hot="true" :datas="lineProductList"></line-car-ticket>
      </div>
    </scroll>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import SearchBox from 'appComponents/searchBox/index.vue'
  import LineCarTicket from 'appComponents/lineCarTicket/index.vue'

  export default {
    components: {
      MainBox,
      ProductTopNav,
      Scroll,
      SearchBox,
      LineCarTicket,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        lineProductList: [],
        recommendKeys: {
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        totalPage: '',
        searchKeys: {
          startPlace: TOOL.placeHolder.startPlace,
          endPlace: TOOL.placeHolder.endPlace
        }
      }
    },
    watch: {
      $route () {
        this.pageId = +this.$route.query.pageId || 7
      }
    },
    mounted () {
      if(this.$route.query.pageName){
        this.title = this.$route.query.pageName
      }
      this.pageId = +this.$route.query.pageId || 7

      let localData = {}
      if (appStorage.get(this.pageRouter)) {
        localData = JSON.parse(appStorage.get(this.pageRouter))
      }
      this.searchKeys.startPlace = localData.startPlace || TOOL.placeHolder.startPlace
      this.searchKeys.endPlace = localData.endPlace || TOOL.placeHolder.endPlace
      
      this.recommendKeys.pageNo = 0
      this.onPullingUp()
    },
    methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.recommendKeys.pageNo === 0){
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
       * 查询推荐线路包车
       */
      loadPageList () {
        if(this.recommendKeys.pageNo && this.recommendKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.lineCommendFind(this.recommendKeys).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode === '0') {
            this.lineProductList = this.lineProductList.concat(data.resultData.content)
            this.totalPage = data.resultData.totalPages
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.recommendKeys.pageNo === 0 || this.recommendKeys.pageNo < this.totalPage){
              this.recommendKeys.pageNo++
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 往返切换
       */
      changeStation () {
        let startPlace = this.searchKeys.startPlace
        if (this.searchKeys.endPlace !== TOOL.placeHolder.endPlace) {
          this.searchKeys.startPlace = this.searchKeys.endPlace
        } else {
          this.searchKeys.startPlace = TOOL.placeHolder.startPlace
        }

        if (startPlace !== TOOL.placeHolder.startPlace) {
          this.searchKeys.endPlace = startPlace
        } else {
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }
      },

      /**
       * 本地存储机场查询数据
       */
      saveForm () {
        appStorage.set(this.pageRouter, JSON.stringify(this.searchKeys))
      },

      /**
       * 删除本地机场数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 跳转定制包车页面
       */
      jumpToCharter () {
        this.saveForm()
        this.$router.push({name: 'charterList'})
      },

      /**
       * 跳转城市选择界面
       */
      jumpToCitySearch (place) {
        let query = {
          fromPage: this.pageRouter,
          placeType: place,
          pageId: this.pageId,
          productTypeLevelOne: 'LINE_BUS'
        }
        if (place === 'endPlace') {
          let validata = TOOL.formValidate([
            {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'}
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', validata.msg);
            return false;
          }

          query.source = this.searchKeys.startPlace
        } else {
          //如果重新选择出发地要清除目的地
          let localData = {}
          if (appStorage.get(this.pageRouter)) {
            localData = JSON.parse(appStorage.get(this.pageRouter))
          }
          localData.endPlace = ''
          appStorage.set(this.pageRouter, JSON.stringify(localData))

          this.searchKeys.endPlace = TOOL.placeHolder.endPlace
        }

        this.$router.push({
          name: 'pageCity',
          query: query
        })
      },

      /**
       * 跳转线路包车列表页面
       */
      search () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择目的地'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$router.push({
          name: 'lineCarList',
          query: {
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace
          }
        });
      }
    }
  }
</script>
