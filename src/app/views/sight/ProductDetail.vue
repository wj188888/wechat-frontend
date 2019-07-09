<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="sight-box box-com-ui sig-bot">
      <div class="s-slide-box" style="margin:0;">
        <div class="slide-ul">
          <swiper dots-position="center" auto>
            <swiper-item v-for="(picData, index) in detailData.banners" :key="index">
              <a class="slide-item" :style="{backgroundImage: 'url(\'' + picData + '\')'}"></a>
            </swiper-item>
          </swiper>

        </div>
      </div>
      <div class="sight-desc">
        <div class="theme">{{ detailData.productTheme | strSplit('42') }}</div>
      </div>
      <div class="sight-box sig-bot">
        <div class="time-pany sub-cls clearfix" style="margin:0;">
          <i class="pany-icon"></i>
          <span style="margin-right:20px;" v-text="detailData.firmName"></span>
          <i class="time-icon" style="margin-top:0.1rem;"></i>
          <span>{{detailData.tourDays}}日行程</span>
        </div>
        <div class="sight-tags clearfix" v-if="detailData.tags.length > 0">
          <div class="tag-item clearfix" v-for="tag in detailData.tags">
            <i></i>
            <span>{{tag}}</span>
          </div>
        </div>
        <div class="tour-price sight-price">
          <span>¥</span>
          <span v-text="detailData.minPrice">239</span>
          <i>起</i>
        </div>
      </div>
    </div>

    <!--包含服务-->
    <div class="fee-include mar-b-20" v-if="detailData.includeServices && detailData.includeServices.length">
      <h3>包含服务</h3>
      <ul>
        <li v-for="service in detailData.includeServices">
          <i class="sig-fee-icon" v-if="service.name == '座位'"></i>
          <i class="sig-fee-icon sig-ht" v-if="service.name == '住宿'"></i>
          <i class="sig-fee-icon sig-meal" v-if="service.name == '餐饮'"></i>
          <i class="sig-fee-icon sig-jd" v-if="service.name == '景点'"></i>
          <i class="sig-fee-icon sig-jd" v-if="service.name == '景点服务'"></i>
          <span v-text="service.content"></span>
        </li>
      </ul>
    </div>
    <div class="form-box form-detail mar-b-20">
      <div class="input-inline"
           v-if="detailData.tourReferee.content "
           style="background:#fff;"
           :class="{'dd-text-active': showManDetail}"
           @click="showManDetail = !showManDetail">
        <img class="man-icon" :src="detailData.tourReferee.avatar">
        <label style="flex:1;">产品经理推荐</label>
        <span class="show-detail">详情</span>
        <i class="icon-r-jt"></i>
      </div>
      <ul class="man-list" v-if="detailData.tourReferee.content&&showManDetail">
        <li>
          <div class="clearfix" v-html="detailData.tourReferee.content"></div>
        </li>
      </ul>
    </div>

    <div class="inline-box mar-b-20 line line-x">
      <label>出发城市</label>
      <span class="text-right" v-text="detailData.aAddress.county || detailData.aAddress.city"></span>
    </div>

    <div class="inline-box mar-b-20 line line-x" @click="jumpToSkuSelect">
      <label v-if="showText">选择日期</label>
      <label class="num_price_box">{{ date | formatDate('monthDay') }}</label>
      <span class="f-s-28 mar-l-20 c-f-888" v-if="availableSeats && seats != 0x7FFFFFFF">剩余{{availableSeats}}座</span>
      <span class="sig-date-price" v-if="price" v-text="'¥'+price">¥328</span>
      <i class="icon-r-jt"></i>
    </div>

    <tour-notice :detail-data="detailData"></tour-notice>

    <div slot="footer">
      <input type="button" @click="jumpToWrite" class="button button-primary button-no-radius fix-bottom" value="下一步，填写订单"/>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import TourNotice from 'components/tourNotice/index.vue'
  import { Swiper, SwiperItem } from 'vux'
  import checkLogin from 'mixins/checkLogin.js'

  export default {
    components: {
      MainBox,
      Swiper,
      SwiperItem,
      TourNotice
    },
    mixins: [checkLogin],
    data () {
      return {
        title: this.$route.meta.title,
        detailData: {
          aAddress:{},
          bAddress:{},
          tourReferee:{},
          tags:[],
          tourTrips:[],
          tourPriceSetting:{}
        },
        id: '',
        showManDetail: false,
        date: '',
        price: '',
        availableSeats: 0,
        seats: 0,
        showText: true
      }
    },
    mounted(){
      this.id = this.$route.query.id
      this.findDetail()
      if (appStorage.get('porderWrite')) {
        let data = JSON.parse(appStorage.get('porderWrite'));
        this.availableSeats = data.availableSeats;
        this.seats = data.seats;
        if (data.startupTime) {
              this.date = data.startupTime
              this.showText = false
          }
          if (data.price) {
              this.price = data.price
          }
      }
    },
    methods: {
      /**
       * 查找产品详情
       */
      findDetail () {
        api.findProductDetail(this.id).then(res => {
          const data = TOOL.toJson(res.data)
          if (data.resultCode == '0') {
            this.detailData = data.resultData;
            if(data.resultData.shareThemes && data.resultData.shareThemes.length){
              let max = data.resultData.shareThemes.length - 1
              let random = Math.round(Math.random() * max);
              let shareTheme = data.resultData.shareThemes[random]
              interfaceApi.share({
                share: true,
                shareUrl: location.href,
                shareTitle: shareTheme.title,
                shareDesc: shareTheme.description,
                shareImgUrl: shareTheme.image
              });
            }else{
              interfaceApi.share({
                share: true,
                shareUrl: window.location.href
              });
            }

            //统计产品详情页面pvuv
            TOOL.saveVisitLogs({
              url: this.$route.name,
              productId: this.id,
              productTypeLevelOne: data.resultData.productTypeLevelOne,
              productTypeLevelTwo: data.resultData.productTypeLevelTwo
            })
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      /**
       * 跳转到日期界面选择车票
       */
      jumpToSkuSelect () {
        let startTime = TOOL.newGetDate({date: new Date(), type: 'date'})
        let endTime = TOOL.newGetDate({date: new Date(), type: 'futureTwoMonth'})
        this.$router.push({
          name: 'skuSelect',
          query: {
            pageRouter: 'porderWrite',
            flightId: this.id,
            startDate: startTime,
            endDate: endTime
          }
        })
      },
      jumpToWrite () {
        if(!this.checkIsLogin()) return
        if (!this.date) {
          this.$store.dispatch('showError', '请选择日期');
          return false;
        }
        this.$router.push({
          name: 'porderWrite',
          query: {
            id: this.id
          }
        })
      },
    }
  }
</script>
<style type="less" scoped>
  .num_price_box{
    width: 6rem;
  }
</style>