<template>
  <main-box :title="title" main-class="pad-20">
    <product-top-nav ctg="TRAIN_STATION_BUS" :active="1" :nav1router="jumpToTrainPickSearch"></product-top-nav>
    <search-box
            :start-place="searchKeys.startPlace"
            :end-place="searchKeys.endPlace"
            @changeStation="jumpToTrainPickSearch"
            @jumpToFrom="jumpToCitySearch('startPlace')"
            @jumpToTo="jumpToTrainStation">
      <group class="datetime-x line line-x-t">
        <calendar
                title="用车时间"
                :weeks-list="calendar.weeksList"
                :disable-past="calendar.disablePast"
                :replace-text-list="{'TODAY':'今'}"
                :display-format="formatDate"
                v-model="searchKeys.startTime">
        </calendar>
      </group>
    </search-box>
    <input type="button" class="button button-primary" @click="search" value="查询"/>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import ProductTopNav from 'appComponents/productTopNav/index.vue'
  import SearchBox from 'appComponents/searchBox/index.vue'
  import { Group, Calendar } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      ProductTopNav,
      SearchBox,
      Group,
      Calendar
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        calendar:{
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast:true
        },
        searchKeys: {
          startPlace: TOOL.placeHolder.startPlace,
          endPlace: TOOL.placeHolder.offTrainStation,
          startTime: 'TODAY'
        }
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch:{
      //定位城市初始化赋值
      appCity (newVal, val) {
        this.searchKeys.startPlace = newVal
      },
      $route () {
        this.initialize()
      }
    },
    mounted(){
      this.initialize()
    },
    methods:{
      initialize () {
        if(this.$route.query.pageName){
          this.title = this.$route.query.pageName
        }
        this.pageId = this.$route.query.pageId || 9
  
        if(this.$route.query.startPlace){
          this.searchKeys.startPlace = this.$route.query.startPlace
        }else{
          this.searchKeys.startPlace = this.appCity
        }
  
        if(this.$route.query.endPlace){
          this.searchKeys.endPlace = this.$route.query.endPlace
        }
  
        if(appStorage.get(this.pageRouter)){
          this.searchKeys = Object.assign(this.searchKeys, JSON.parse(appStorage.get(this.pageRouter)))
        }
  
        /**
         * 控制时间超过下午18点就时间默认显示第二天
         */
        let nowTime = TOOL.newGetDate({type: 'time'}),
          nowDate = TOOL.newGetDate({type: 'date'});
        if (TOOL.dateCompare(nowTime, TOOL.rangeTime, 'time') > 0) {
          nowDate = TOOL.changeDate(nowDate, 'd', 1)
          this.searchKeys.startTime = TOOL.newGetDate({date: nowDate, type: 'date'});
        }
      },
      
      formatDate (date) {
        return TOOL.newGetDate({date: date, type: 'formatStartupTime'})
      },
      
      /**
       * 存储查询数据
       */
      saveForm () {
        let localData = this.searchKeys
        delete localData.startupTime
        appStorage.set(this.pageRouter, JSON.stringify(localData))
      },

      /**
       * 删除本地查询数据
       */
      deleteForm () {
        appStorage.remove(this.pageRouter)
      },

      /**
       * 跳转接站页面
       */
      jumpToTrainPickSearch () {
        let startPlace, endPlace;
        if(this.searchKeys.endPlace != TOOL.placeHolder.offTrainStation){
          startPlace = this.searchKeys.endPlace
        }else{
          startPlace = ''
        }

        if(this.searchKeys.startPlace != TOOL.placeHolder.startPlace){
          endPlace = this.searchKeys.startPlace
        }else{
          endPlace = ''
        }

        this.deleteForm()
        this.$router.replace({
          name:'trainPickSearch',
          query: {
            pageId: this.pageId,
            pageName:this.pageName,
            startPlace: startPlace,
            endPlace: endPlace
          }
        })
      },

      /**
       * 跳到城市选择界面
       */
      jumpToCitySearch (place) {
        this.saveForm()
        this.$router.push({
          name:'pageCity',
          query: {
            pageId: this.pageId,
            fromPage: this.pageRouter,
            placeType: place,
            productTypeLevelOne: 'TRAIN_STATION_BUS'
          }
        })
      },

      /**
       * 跳到火车站选择界面
       */
      jumpToTrainStation () {
        this.saveForm()
        this.$router.push({
          name:'trainStation',
          query: {
            pageRouter: this.pageRouter,
            placeType: 'endPlace'
          }
        })
      },

      /**
       * 跳转接站专线列表页面
       */
      search () {
        let validata = TOOL.formValidate([
          {value:this.searchKeys.startPlace, emptyTips:'请选择出发地'},
          {value:this.searchKeys.endPlace, emptyTips:'请选择目的地'},
          {value:this.searchKeys.startTime, emptyTips:'请选择出行时间'}
        ]);

        if(!validata.valid){
          this.$store.dispatch('showError', validata.msg)
          return false
        }

        this.$router.push({
          name: 'trainSendList',
          query:{
            pageId: this.pageId,
            pageName:this.pageName,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime + ' 00:00:00'
          }
        })

      }
    }
  }
</script>
