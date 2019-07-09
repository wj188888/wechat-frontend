<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <carpooling-info
            :info-data="lineProductData"
            :price-type="1"
            :show-service="true">
    </carpooling-info>
    <div class="form-box form-detail mar-t-20 line line-x-b" v-if="lineProductData.lineManagerTel">
      <p class="firm-name-box mar-b-0 line line-x">
        <span v-text="lineProductData.firmName"></span>
        <i class="icon-v"></i>
      </p>
      <div class="input-inline" @click="callJingli(lineProductData.lineManagerTel)" v-if="lineProductData.lineManagerTel">
        <label class="line-manager">线路经理&nbsp;&nbsp;&nbsp;{{lineProductData.lineManagerFirstName}}经理</label>
        <span class="icon-phone"></span>
      </div>
    </div>
    <div class="carpooling-list line line-x-b" v-if="lineSkuList.length > 0">
      <p class="tips">支付开团并邀请要求人数参团，人数不足自动退款</p>
      <p class="tips tips2">以下小伙伴正在发起拼车，您可以直接参与</p>
      <ul>
        <li class="line line-x-b" v-for="lineSku in getLineSkuList"
            @click="jumpToCarpoolingJoin(lineSku.id, lineSku.customerId, lineSku.availableSeats)">
          <div class="carpooling-item">
            <div class="carpooling-owner-avatar"></div>
            <div class="carpooling-info">
              <p class="p1">
                <span class="pull-left span1">{{ lineSku.startupTime | formatDate('monthDay') }}出发</span>
                <span class="pull-right span2" v-text="'还差' + lineSku.availableSeats + '人发车'">还差1人发车</span>
              </p>
              <p class="p2">
                    <span
                            class="pull-left">{{ lineSku.carBrand | strSplit('4') }}&nbsp;&nbsp;{{lineSku.totalSeats}}座</span>
                <span class="pull-right">
                      <clocker :time="lineSku.teamExpireTime" slot="value">
                        <span class="red">%D
                        </span><span class="red">天
                        </span><span class="red">%H
                        </span><span class="red">时
                        </span><span class="red">%M
                        </span><span class="red">分
                        </span><span class="red">%S
                        </span><span class="red">秒
                        </span><span>后结束</span>
                      </clocker>
                    </span>
              </p>
            </div>
            <div class="carpooling-text">去拼车</div>
          </div>
        </li>
      </ul>
      <div class="more-carpolling"
           :class="{'more-up': showMoreSku}"
           v-if="this.lineSkuList.length > 3"
           @click="showMoreSku = !showMoreSku">
        <span v-show="!showMoreSku">查看更多拼车</span>
        <span v-show="showMoreSku">收起更多拼车</span>
      </div>
    </div>

    <div class="form-box form-detail mar-b-40">
      <div class="input-inline"
           v-if="lineProductData.productContents"
           :class="{'dd-text-active': showDetails.productInfo}"
           @click="showDetail('productInfo')">
        <label>产品信息</label>
        <span class="show-detail">详情</span>
        <i class="icon-r-jt"></i>
      </div>
      <div v-if="lineProductData.productContents  && showDetails.productInfo">
        <div class="route-detail">
          <div class="fee-clu-box" v-for="fee in lineProductData.productContents">
            <h3>{{fee.title}}</h3>
            <div v-html="fee.content"></div>
          </div>
        </div>
      </div>

      <ticket-notice
              :custom-contents="lineProductData.customContents"
              refund-notice-type="refundNotice2">
      </ticket-notice>

    </div>

    <div slot="footer">
      <div class="fix-bottom charter-btn-box">
        <a class="call-carpooling" @click="callKefu"></a>
        <input type="button" class="button button-yellow button-no-radius" @click="jumpToCarpoolingSelf" value="独立包车"/>
        <input type="button" class="button button-primary button-no-radius" @click="jumpToCarpooling" value="发起拼车"/>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import CarpoolingInfo from 'appComponents/carpoolingInfo/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import { Clocker } from 'vux'

  export default {
    components: {
      MainBox,
      CarpoolingInfo,
      TicketNotice,
      Clocker
    },
    data () {
      return {
        title: '',
        pageRouter: this.$route.name,
        productId: '',
        lineProductData: {
          sellPoints:[]
        },
        lineSkuList: [],
        showMoreSku: false,
        showDetails: {
          productInfo: true,
        },
      }
    },
    computed: {
      getLineSkuList () {
        if (!this.showMoreSku) {
          return this.lineSkuList.slice(0, 3)
        } else {
          return this.lineSkuList
        }
      }
    },
    mounted(){
      this.productId = this.$route.query.productId
      this.lineProductFindById(this.productId)
      this.lineSkuFind(this.productId)

    },
    methods: {
      /**
       * 根据id查找线路包车详情
       *  @param productId 产品id
       */
      lineProductFindById (productId) {
        this.$store.commit('UPDATE_LOADING', true)
        api.lineProductFindById(productId).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.lineProductData = data.resultData
            this.title = data.resultData.aAddress.city + ' — ' + data.resultData.bAddress.city

            //统计产品详情页面pvuv
            TOOL.saveVisitLogs({
              url: this.$route.name,
              productId: this.productId,
              productTypeLevelOne: data.resultData.productTypeLevelOne,
              productTypeLevelTwo: data.resultData.productTypeLevelTwo
            })
  
            interfaceApi.share({
              share: true,
              shareUrl: location.href,
              shareTitle: data.resultData.shareTheme.title,
              shareDesc: data.resultData.shareTheme.description,
              shareImgUrl: data.resultData.shareTheme.image
            });
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 根据id查找线路包车sku
       *  @param productId 产品id
       */
      lineSkuFind (productId) {
        this.$store.commit('UPDATE_LOADING', true)
        api.lineSkuFind({
          productId: productId,
          pageSize: 100,
          pageNo: 0
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            if (data.resultData.content.length > 0) {
              this.lineSkuList = data.resultData.content
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      /**
       * 显示隐藏详情
       */
      showDetail (key) {
        let temp = this.showDetails[key]
        for (let i in this.showDetails) {
          if (this.showDetails.hasOwnProperty(i)) {
            this.showDetails[i] = false
          }
        }
        this.showDetails[key] = !temp
      },

      /**
       * 跳转拼车
       * 注：需要登录，登录后如果是发起人则跳转拼团页面发起分享，否则跳转购买页面
       */
      jumpToCarpoolingJoin (skuId, customerId, availableSeats) {
        if (!appStorage.get('X-Auth-Token')) {
          TOOL.login()
        } else {
          if (availableSeats == 0) {
            this.$router.push({
              name: 'orderWait',
              query: {
                productTypeLevelOne: this.lineProductData.productTypeLevelOne,
                skuId: skuId
              }
            })
          } else {
            this.$router.push({
              name: 'carpoolingSuccess',
              query: {
                skuId: skuId
              }
            })
          }
        }
      },

      /**
       * 跳转独立包车
       */
      jumpToCarpoolingSelf () {
        appStorage.remove('carpoolingSelf')
        this.$router.push({
          name: 'carpoolingSelf',
          query: {
            productId: this.productId
          }
        })
      },

      /**
       * 跳转发起拼车
       */
      jumpToCarpooling () {
        appStorage.remove('carpooling')
        this.$router.push({
          name: 'carpooling',
          query: {
            productId: this.productId
          }
        })
      },

      /**
       * 拨打线路经理电话
       */
      callJingli (tel) {
        this.$store.dispatch('showConfirm', {
          content: '<p style="text-align:center;">线路经理电话：' + tel + '</p>',
          confirmText: '拨打',
          onConfirm: () => {
            location.href = 'tel:' + tel
          }
        })
      },


      /**
       * 拨打电话
       */
      callKefu () {
        this.$store.dispatch('showConfirm', {
          content: '<p style="text-align:center;">咨询电话：' + this.lineProductData.serviceTel + '</p>',
          confirmText: '拨打',
          onConfirm: () => {
            location.href = 'tel:' + this.lineProductData.serviceTel
          }
        })
      }
    }
  }
</script>
<style scoped>
  .charter-btn-box {
    display: flex;
    padding-left: 120px;
    right: 0;
    background-color: #fff;
  }

  .call-carpooling {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 120px;
    height: 100%;
    background: url('../../../../assets/charter/phone.png') no-repeat center center;
    background-size: 37px 37px;
  }

  .charter-btn-box .button {
    flex: 1;
  }

  .icon-phone{
    display:block;
    flex:1;
    background:url("../../../../assets/charter/phone-carpooling-manage.png") no-repeat right center;
    background-size:50px 50px;
  }
</style>
