<template>
  <main-box :title="title">
    <div class="search-list" v-show="!showNoData">
      <scroll ref="scroll"
              :pullUpLoad="true"
              @pullingUp="onPullingUp">
        <div class="pad-t-20">
          <tour-ticket :list-data="listData" @jumpToDetail="jumpToProductDetail"></tour-ticket>
        </div>
      </scroll>
    </div>
    <div class="city-no-bus" v-show="showNoData">
      <p>没有找到符合条件的结果</p>
      <p>请修改条件重新查询</p>
    </div>
    <div slot="footer">
      <div class="sight-search">
        <ul>
          <li :class="{
              'active': searchPop.showSumPop,
              'has-dot': (suitablePersons.length > 0 &&
                suitablePersons[0] != '不限') ||
                searchKeys.minPrice || searchKeys.minPrice }" @click="openSearchPop(1)">
            <p class="icon-s icon-s-sum"></p>
            <p>综合筛选</p>
          </li>
          <li :class="{'active': searchPop.showDayPop,  'has-dot': days.length > 0 && days[0] != '不限'}"
              @click="openSearchPop(2)">
            <p class="icon-s icon-s-day"></p>
            <p>行程天数</p>
          </li>
          <li :class="{'active': searchPop.showCityPop, 'has-dot': sources.length > 0 && sources[0] != '不限'}"
              @click="openSearchPop(3)">
            <p class="icon-s icon-s-city"></p>
            <p>出发城市</p>
          </li>
          <li :class="{'active': searchPop.showPricePop, 'has-dot': order}" @click="openSearchPop(4)">
            <p class="icon-s icon-s-price"></p>
            <p>综合排序</p>
          </li>
        </ul>
      </div>
      <!-- 综合筛选 -->
      <group>
        <popup v-model="searchPop.showSumPop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showSumPop = false">取消</a>
              <!--<a class="mid-but" @click="clearOne">清空筛选</a>-->
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="sum-condition">
              <div class="sum-con-left">
                <ul>
                  <li @click="sumSearchType(1)" class="clearfix"
                      :class="{'active': showPeopleType, 'has-dot': suitablePersons.length > 0 && suitablePersons[0] != '不限'}">
                    适合人群
                  </li>
                  <li @click="sumSearchType(2)" class="clearfix"
                      :class="{'active': !showPeopleType, 'has-dot': searchKeys.minPrice || searchKeys.minPrice }">价格区间
                  </li>
                </ul>
              </div>
              <div class="sum-con-right">
                <ul v-if="showPeopleType">
                  <li class="li-item" @click="checkPersonAll">
                    不限
                    <input class="hide" type="checkbox" v-model="suitablePersons" value="不限"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item js-item" v-for="list in suitPerson"
                      @click="checkPersonOne(list.name, suitPerson.length)">
                    {{list.name}}
                    <input class="hide" type="checkbox" v-model="suitablePersons" :value="list.name"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
                <ul v-if="showPriceType" class="price-inp-box">
                  <li class="clearfix">
                    <label>价格范围：</label>
                  </li>
                  <li class="clearfix">
                    <input type="text" v-model="searchKeys.minPrice" number/>
                    <span class="border">&nbsp;&nbsp;元&nbsp;&nbsp;-&nbsp;&nbsp;</span>
                    <input type="text" v-model="searchKeys.maxPrice" number/>
                    <span class="border">&nbsp;&nbsp;元</span>
                  </li>
                  <li><p class="error-tips" v-text="errorPrice"></p></li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>

      <!-- 行程天数筛选 -->
      <group>
        <popup v-model="searchPop.showDayPop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showDayPop = false">取消</a>
              <!--<a class="mid-but" @click="clearTwo">清空筛选</a>-->
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="day-condition">
              <div class="sum-con-right">
                <ul>
                  <li class="li-item" @click="checkDayAll">
                    不限
                    <input class="hide" type="checkbox" v-model="days" value="不限"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" v-for="i in 10" @click="checkDayOne( i, 10 )">
                    {{i}}天
                    <input class="hide" type="checkbox" v-model="days" :value="i"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>

      <!-- 出发城市筛选 -->
      <group>
        <popup v-model="searchPop.showCityPop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showCityPop = false">取消</a>
              <!--<a class="mid-but" @click="clearThree">清空筛选</a>-->
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="day-condition">
              <div class="sum-con-right">
                <ul>
                  <li class="li-item" @click="checkCityAll">
                    <label>
                      不限
                      <input class="hide" type="checkbox" v-model="sources" value="不限"/>
                      <i class="choose-type"></i>
                    </label>
                  </li>
                  <li class="li-item"
                      @click="checkCityOne(source, sourcesList.length)"
                      v-for="(source, index) in sourcesList"
                      :key="index">
                    {{source}}
                    <input class="hide" type="checkbox" v-model="sources" :value="source"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>

      <!-- 综合排序筛选 -->
      <group>
        <popup v-model="searchPop.showPricePop">
          <div class="sum-content">
            <div class="sum-operation clearfix">
              <a class="pull-left" @click="searchPop.showPricePop = false">取消</a>
              <!--<a class="mid-but" @click="clearFour">清空筛选</a>-->
              <a class="pull-right" @click="searchBykeyWords">确定</a>
            </div>
            <div class="day-condition">
              <div class="sum-con-right">
                <ul>
                  <li class="li-item" @click="order = ''">
                    不限
                    <input class="hide" type="radio" v-model="order" value=""/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 1">
                    销量由低到高
                    <input class="hide" type="radio" v-model="order" value="1"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 2">
                    销量由高到低
                    <input class="hide" type="radio" v-model="order" value="2"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 3">
                    价格由低到高
                    <input class="hide" type="radio" v-model="order" value="3"/>
                    <i class="choose-type"></i>
                  </li>
                  <li class="li-item" @click="order = 4">
                    价格由高到低
                    <input class="hide" type="radio" v-model="order" value="4"/>
                    <i class="choose-type"></i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </popup>
      </group>
    </div>
  </main-box>

</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
  import TourTicket from 'appComponents/tourTicket/index.vue'
  import { Group, Popup } from 'vux'

  export default {
    components: {
      MainBox,
      Scroll,
      TourTicket,
      Group,
      Popup,
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        totalPage: '',
        showNoSearch: false,
        showNoData: false,
        listData: [],

        searchKeys: {
          productType: 1, //景点信息
          keyword: '', //目的城市
          sources: [], //出发城市
          currentCity: '', //定位城市,
          tourType: -1,//行程方式，-1不限，0往返，1单程
          days: [], //行程天数
          suitablePersons: [],//适合人群
          minPrice: '',
          maxPrice: '',
          sort: '',
          order: '',
          pageNo: 0,
          pageSize: TOOL.pageSize
        },
        searchPop: {
          showSumPop: false,
          showDayPop: false,
          showCityPop: false,
          showPricePop: false
        },

        showPeopleType: true, //综合搜索的人群
        showPriceType: false,
        suitPerson: '',
        suitablePersons: ['不限'],
        errorPrice: '',
        days: ['不限'],
        sourcesList: [],
        sources: ['不限'],
        order: ''
      }
    },
    mounted () {
      if (appStorage.get(this.pageRouter)) {
        let localData = JSON.parse(appStorage.get(this.pageRouter))
        this.suitablePersons = localData.suitablePersons
        this.searchKeys.minPrice = localData.minPrice
        this.searchKeys.maxPrice = localData.maxPrice
        this.days = localData.days
        this.sources = localData.sources
        this.order = localData.order
      }
      this.title = this.$route.query.keyword
      this.searchKeys.keyword = this.$route.query.keyword
      this.searchKeys.currentCity = this.$route.query.currentCity
      if (this.$route.query.source) {
        this.sources = [this.$route.query.source]
      }
      this.findSuitablePersons()
      this.findSources()
      this.searchBykeyWords()
    },
    methods: {

      /**
       * 搜索条件：适合人群数据
       */
      findSuitablePersons () {
        this.$store.commit('UPDATE_LOADING', true)
        api.findSuitablePersons().then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.suitPerson = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 搜索条件：根据目的地搜索出发地数据
       */
      findSources () {
        this.$store.commit('UPDATE_LOADING', true)
        api.findSources({destination: this.searchKeys.keyword}).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode === '0') {
            this.sourcesList = data.resultData
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      saveSearchForm () {
        let saveData = {}
        saveData.suitablePersons = this.suitablePersons
        saveData.minPrice = this.searchKeys.minPrice
        saveData.maxPrice = this.searchKeys.maxPrice
        saveData.days = this.days
        saveData.sources = this.sources
        saveData.order = this.order
        appStorage.set(this.pageRouter, JSON.stringify(saveData))
      },

      /**
       * 跳转产品详情页面
       */
      jumpToProductDetail (productId) {
        this.saveSearchForm()
        appStorage.remove('porderWrite')
        this.$router.push({
          name: 'productDetail',
          query: {
            id: productId
          }
        })
      },

      /**
       * 选择不限
       */
      checkAll (key) {
        this[key] = ['不限']
      },

      /**
       * 选择单个
       */
      checkOne (key, item, len) {
        if ($.inArray(item, this[key]) > -1) {
          let index = this[key].indexOf(item)
          this[key].splice(index, 1)
        } else {
          this[key].push(item)
        }

        //一个都没选默认勾选不限，勾选了选项则去掉勾选不限
        if (this[key].length == 0) {
          this[key] = ['不限']
        } else {
          if ($.inArray('不限', this[key]) > -1) {
            let index = this[key].indexOf('不限')
            this[key].splice(index, 1)
          }
        }
      },

      /**
       * 适合人群不限
       */
      checkPersonAll () {
        this.checkAll('suitablePersons')
      },

      /**
       * 适合人群单选
       */
      checkPersonOne (item, len) {
        this.checkOne('suitablePersons', item, len)
      },

      /**
       * 行程不限
       */
      checkDayAll () {
        this.checkAll('days')
      },

      /**
       * 行程单选
       */
      checkDayOne (item, len) {
        this.checkOne('days', item, len)
      },

      /**
       * 城市不限
       */
      checkCityAll () {
        this.checkAll('sources')
      },

      /**
       * 城市单选
       */
      checkCityOne (item, len) {
        this.checkOne('sources', item, len)
      },

      /**
       * 清除综合筛选
       */
      clearOne () {
        this.suitablePersons = ['不限']
        this.errorPrice = ''
        this.searchKeys.minPrice = ''
        this.searchKeys.maxPrice = ''
      },

      /**
       * 清除行程天数
       */
      clearTwo () {
        this.days = ['不限']
      },

      /**
       * 清除出发城市
       */
      clearThree () {
        this.sources = ['不限']
      },

      /**
       * 清除综合排序
       */
      clearFour () {
        this.order = ''
      },

      /**
       * 搜索弹窗控制
       * @param type 1为综合筛选，2为行程天数，3为出发城市，4为价格排序
       */
      openSearchPop (type) {
        switch (type) {
          case 1:
            this.searchPop = {
              showSumPop: true,
              showDayPop: false,
              showCityPop: false,
              showPricePop: false
            }
            break
          case 2:
            this.searchPop = {
              showSumPop: false,
              showDayPop: true,
              showCityPop: false,
              showPricePop: false
            }
            break
          case 3:
            this.searchPop = {
              showSumPop: false,
              showDayPop: false,
              showCityPop: true,
              showPricePop: false
            }
            break
          case 4:
            this.searchPop = {
              showSumPop: false,
              showDayPop: false,
              showCityPop: false,
              showPricePop: true
            }
            break
        }
      },

      /**
       * 综合搜索
       * @param type
       */
      sumSearchType (type) {
        if (type == 1) {
          this.showPeopleType = true
          this.showPriceType = false
        } else if (type == 2) {
          this.showPeopleType = false
          this.showPriceType = true
        }
      },

      /**
       * 搜索事件
       */
      loadPageList () {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
        api.tourProductFind(this.searchKeys).then(res => {
          const data = TOOL.toJson(res.data)
          this.showNoData = false
          if (data.resultCode === '0') {
            this.showNoData = !data.resultData.content.length
            this.listData = this.listData.concat(data.resultData.content)
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
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.listData = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      /**
       * 按查询条件搜索
       */
      searchBykeyWords () {
        if ($.inArray('不限', this.suitablePersons) > -1) {
          this.searchKeys.suitablePersons = []
        } else {
          this.searchKeys.suitablePersons = this.suitablePersons
        }

        if (this.searchKeys.minPrice && !TOOL.regExp.floatNumber.test(this.searchKeys.minPrice)) {
          this.searchKeys.minPrice = ''
          this.errorPrice = '最小价格需为最多两位小数的正数'
          return
        }
        if (this.searchKeys.maxPrice && !TOOL.regExp.floatNumber.test(this.searchKeys.maxPrice)) {
          this.searchKeys.maxPrice = ''
          this.errorPrice = '最大价格需为最多两位小数的正数'
          return
        }

        if (this.searchKeys.minPrice && this.searchKeys.maxPrice && this.searchKeys.minPrice > this.searchKeys.maxPrice) {
          this.searchKeys.maxPrice = ''
          this.errorPrice = '最小价格不能大于最大价格'
          return
        }

        if ($.inArray('不限', this.days) > -1) {
          this.searchKeys.days = []
        } else {
          this.searchKeys.days = this.days
        }

        if ($.inArray('不限', this.sources) > -1) {
          this.searchKeys.sources = []
        } else {
          this.searchKeys.sources = this.sources
        }

        if (this.order == '') {
          this.searchKeys.sort = ''
          this.searchKeys.order = ''
        } else {
          /**
           * 排序字段
           */
          if (this.order == 1 || this.order == 2) {
            this.searchKeys.sort = 'sales'
          } else {
            this.searchKeys.sort = 'minPrice'
          }

          /**
           * 排序顺序 0升序，1降序
           */
          if (this.order == 1 || this.order == 3) {
            this.searchKeys.order = 0
          } else {
            this.searchKeys.order = 1
          }
        }
        this.saveSearchForm()
        this.searchPop = {
          showSumPop: false,
          showDayPop: false,
          showCityPop: false,
          showPricePop: false
        }

        //重置翻页页数
        this.searchKeys.pageNo = 0
        this.onPullingUp()
      }

    }
  }
</script>
