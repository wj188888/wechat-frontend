<template>
  <main-box :title="title" main-class="pad-20">
    <search-box
      :start-place="searchKeys.startPlace"
      :end-place="searchKeys.endPlace"
      @changeStation="changeStation"
      @jumpToFrom="jumpToCitySearch('startPlace')"
      @jumpToTo="jumpToCitySearch('endPlace')">
      <group class="datetime-x line line-x-t">
        <calendar
          title="出行时间"
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
  import SearchBox from 'appComponents/searchBox/index.vue'
  import { Group, Calendar } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox,
      SearchBox,
      Group,
      Calendar,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        pageId:'',
        calendar: {
          weeksList: ['日', '一', '二', '三', '四', '五', '六 '],
          disablePast: true
        },
        searchKeys: {
          startPlace: TOOL.placeHolder.startPlace,
          endPlace: TOOL.placeHolder.endPlace,
          startTime: 'TODAY'
        }
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch: {
      //定位城市初始化赋值
      appCity (newVal, val) {
        this.location = newVal
        this.searchKeys.startPlace = newVal
      },
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        if(this.$route.query.pageName){
          this.title = this.$route.query.pageName
        }
        this.pageId = this.$route.query.pageId || 1

        let localData = {}
        if (appStorage.get(this.pageRouter)) {
          localData = JSON.parse(appStorage.get(this.pageRouter))
        }
        this.searchKeys.startPlace = localData.startPlace || this.appCity
        this.searchKeys.endPlace = localData.endPlace || TOOL.placeHolder.endPlace
        this.location = appStorage.get('appCity') || this.appCity

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
       * 跳到定位城市选择界面
       */
      jumpToLocationSearch () {
        this.$router.push({
          name: 'pageLocation',
          query: {
            page: this.pageRouter,
            placeType: 'appCity'
          }
        })
      },

      /**
       * 跳到城市选择界面
       */
      jumpToCitySearch (place) {
        let query = {
          fromPage: this.pageRouter,
          placeType: place,
          pageId:this.pageId,
          productTypeLevelOne: 'SCENIC_BUS'
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
       *  跳转查询页面
       */
      search () {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择出发地'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择目的地'},
          {value: this.searchKeys.startTime, emptyTips: '请选择出行时间'}
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }

        this.$router.push({
          name: 'scenicList',
          query: {
            pageId: this.pageId,
            startPlace: this.searchKeys.startPlace,
            endPlace: this.searchKeys.endPlace,
            startTime: this.searchKeys.startTime + ' 00:00:00'
          }
        })
      }
    }
  }
</script>
