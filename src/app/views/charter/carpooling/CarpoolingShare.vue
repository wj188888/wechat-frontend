<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <follow-us :is-follow="false"></follow-us>

    <carpooling-info
            :info-data="lineSkuData"
            :price-type="2"
            :show-service="true"
            :show-tips="true"
            :min-member="lineSkuData.minTeamMember"
            :tips-type="pageRouter">
      <div class="carpooling-status" :class="{'carpooling-success': carpoolingSuccessClass, 'carpooling-fail': carpoolingFailClass}"></div>
    </carpooling-info>

    <div class="carpooling-detail-box">
      <ul class="carpooling-user-list" :class="{'one-row': lineSkuData.minTeamMember < 5 }">
        <li
                :class="{'ten-more': lineSkuData.minTeamMember > 10, 'active': i <= (lineSkuData.minTeamMember - lineSkuData.availableSeats)}"
                v-for="i in lineSkuData.minTeamMember">
          <span v-if="i == 1">团长</span>
        </li>
      </ul>
      <div class="mar-b-40" v-show="!carpoolingFailClass">
        <p class="tips" v-show="!carpoolingSuccessClass">
          <span v-if="lineSkuData.availableSeats != 0">还差<em v-text="lineSkuData.availableSeats">4</em>人就成团了</span>
          <span v-if="lineSkuData.availableSeats == 0">亲，还有人未付款哦，过5分钟再来看吧。</span>
        </p>
        <p class="tips" v-show="carpoolingSuccessClass">终于成团了，趁机会到朋友圈得瑟得瑟呗</p>
        <div class="carpooling-timer line line-x-t" v-show="!carpoolingSuccessClass">
          <div class="timer-box">
            <clocker :time="clocker.time" slot="value" @on-finish="finish">
              <span>剩余</span>
              <span class="time">%D</span>
              <span class="split">天</span>
              <span class="time">%H</span>
              <span class="split">时</span>
              <span class="time">%M</span>
              <span class="split">分</span>
              <span class="time">%S</span>
              <span class="split">秒</span>
              <span>结束</span>
            </clocker>
          </div>
        </div>
        <div class="more-carpolling" :class="{'more-up': showCarpooling}" @click="showCarpooling = !showCarpooling">
          <span v-show="!showCarpooling">查看拼车详情</span>
          <span v-show="showCarpooling">收起拼车详情</span>
        </div>
        <ul class="carpooling-detail" v-show="showCarpooling">
          <li v-for="joinPassenger in lineSkuData.joinPassengerDTOs">
            <div class="avator"></div>
            <div class="name pull-left">
              <span v-if="joinPassenger.promoter" v-text="'发起人 ' + joinPassenger.passengerName"></span>
              <span v-if="!joinPassenger.promoter" v-text="joinPassenger.passengerName"></span>
            </div>
            <P class="pull-right">
              <span v-if="joinPassenger.promoter" v-text="joinPassenger.createdTime + ' 发起'"></span>
              <span v-if="!joinPassenger.promoter" v-text="joinPassenger.createdTime + ' 参团'"></span>
            </P>
          </li>
        </ul>
      </div>
    </div>

    <div class="form-box form-detail mar-b-40">
      <div class="input-inline"
           v-if="lineSkuData.productContents"
           :class="{'dd-text-active': showDetails.productInfo}"
           @click="showDetail('productInfo')">
        <label>产品信息</label>
        <span class="show-detail">详情</span>
        <i class="icon-r-jt"></i>
      </div>
      <div v-if="lineSkuData.productContents  && showDetails.productInfo">
        <div class="route-detail">
          <div class="fee-clu-box" v-for="fee in lineSkuData.productContents">
            <h3>{{fee.title}}</h3>
            <div v-html="fee.content"></div>
          </div>
        </div>
      </div>

      <ticket-notice
              :custom-contents="lineSkuData.customContents"
              refund-notice-type="refundNotice2">
      </ticket-notice>

    </div>
    <div slot="footer">
      <div class="fix-bottom charter-btn-box">
        <input type="button" :to="{name:'lineCar'}" class="button button-gray-lighter" value="更多拼车"/>
        <input type="button" @click="jumpToCarpoolingJoin" class="button button-yellow" :value="capoolingBtnText"/>
      </div>

      <div class="share-box" v-show="showShare" @click="showShare = false">
        <div class="share-tips">
          <p>天哦、还差<em v-text="lineSkuData.availableSeats"></em>人， 人满才能发车</p>
          <p>快点击右上角，邀请更多好友一起参团吧~~</p>
        </div>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import FollowUs from 'components/followUs/index.vue'
  import CarpoolingInfo from 'appComponents/carpoolingInfo/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import { Clocker } from 'vux'
  let nowTime = TOOL.newGetDate({type: 'holeDate'})

  export default {
    components: {
      MainBox,
      FollowUs,
      CarpoolingInfo,
      TicketNotice,
      Clocker
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        clocker: {
          time: TOOL.newGetDate({date: new Date(), type: 'future'})
        },
        showCarpooling: true,
        showShare: false,
        showDialog: false,
        skuId: '',
        lineSkuData: {
          productContents:[],
          customContents:[],
        },
        carpoolingSuccessClass: false, //拼车成功图标
        carpoolingFailClass: false, //拼车失败图标
        capoolingBtnText: '我也要拼车', //拼车按钮文字
        showDetails: {
          productInfo: true,
          costDetails: false,
          serviceAssurance: false,
          preOrderNotice: false
        }
      }
    },
    watch: {
      $route () {
        this.initialize()
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.skuId = this.$route.query.skuId
        this.lineSkuFindShareLine(this.skuId)
      },

      /**
       * 查询分享的线路拼成信息
       *  @param skuId 产品skuId
       */
      lineSkuFindShareLine (skuId) {
        this.$store.commit('UPDATE_LOADING', true)
        api.lineSkuFindShareLine({
          skuId: skuId
        }).then(res => {
          const data = TOOL.toJson(res.data)
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.lineSkuData = data.resultData
            this.title = data.resultData.aAddress.city + ' — ' + data.resultData.bAddress.city
            if (this.clocker) {
              this.clocker.time = data.resultData.teamExpireTime
            }

            /**
             * 展示成功或失败标签
             * carPoolStatus(拼车状态)
             * teamExpireTime(拼车有效时间)
             * firmResponseEndTime(企业响应截止时间，包车或拼车成团后，企业未及时响应，需要全额退款)
             * 0.未付款
             * 1.未成团 teamExpireTime失效展示失败
             * 2.未安排 firmResponseEndTime失效展示失败，否则展示成功
             * 3.已安排 展示成功
             * 4.已失效 展示失败
             * 5.已取消 展示失败
             */
            let carPoolStatus = this.lineSkuData.carPoolStatus
            let teamExpireTime = this.lineSkuData.teamExpireTime
            let firmResponseEndTime = this.lineSkuData.firmResponseEndTime
            switch (carPoolStatus) {
              case 1:
                if (TOOL.dateCompare(nowTime, teamExpireTime, 'datetime') > 0) {
                  this.carpoolingFailClass = true
                }
                break;
              case 2:
                if (TOOL.dateCompare(nowTime, firmResponseEndTime, 'datetime') > 0) {
                  this.carpoolingFailClass = true
                } else {
                  this.carpoolingSuccessClass = true
                }
                break;
              case 3:
                this.carpoolingSuccessClass = true
                break;
              case 4:
              case 5:
                this.carpoolingFailClass = true
                break;
              default:
                this.carpoolingFailClass = false
                this.carpoolingSuccessClass = false
            }

            /**
             * 拼车按钮文字
             * carPoolStatus(拼车状态)
             * teamExpireTime(拼车有效时间)
             * hasJoin(是否已参团)
             * 0.未付款
             * 1.未成团 且 teamExpireTime未失效，hasJoin为已参团展示还差多少人，否则展示去拼车
             * 1.未成团 且 teamExpireTime失效，2.未安排  3.已安排  4.已失效  5.已取消 展示“我也要开团”
             */
            let hasJoin = this.lineSkuData.hasJoin
            if (carPoolStatus == 1 && TOOL.dateCompare(nowTime, teamExpireTime, 'datetime') <= 0 && this.lineSkuData.availableSeats !== 0) {
              if (hasJoin) {
                this.capoolingBtnText = '还差' + this.lineSkuData.availableSeats + '人拼团成功'
              } else {
                this.capoolingBtnText = '我也要拼车'
              }
            } else {
              this.capoolingBtnText = '我也要开团'
            }
  
            interfaceApi.share({
              share: true,
              shareUrl: location.href,
              shareTitle: data.resultData.shareTheme.title,
              shareDesc: data.resultData.shareTheme.description,
              shareImgUrl: data.resultData.shareTheme.image
            });

            //统计产品详情页面pvuv
            TOOL.saveVisitLogs({
              url: this.$route.name,
              skuId: this.skuId,
              productTypeLevelOne: data.resultData.productTypeLevelOne,
              productTypeLevelTwo: data.resultData.productTypeLevelTwo
            })
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
       * 点击拼车按钮事件
       */
      jumpToCarpoolingJoin () {
        if (!appStorage.get('X-Auth-Token')) {
          TOOL.login()
          return;
        }

        /**
         * carPoolStatus(拼车状态)
         * teamExpireTime(拼车有效时间)
         * hasJoin(是否已参团)
         * 0.未付款
         * 1.未成团 且 teamExpireTime未失效，hasJoin为已参团展示还差多少人，否则展示去拼车
         * 1.未成团 且 teamExpireTime失效，2.未安排  3.已安排  4.已失效  5.已取消 展示“我也要开团”
         */
        let carPoolStatus = this.lineSkuData.carPoolStatus
        let teamExpireTime = this.lineSkuData.teamExpireTime
        let hasJoin = this.lineSkuData.hasJoin
        if (carPoolStatus == 1 && TOOL.dateCompare(nowTime, teamExpireTime, 'datetime') <= 0 && this.lineSkuData.availableSeats !== 0) {
          if (hasJoin) {
            this.showShare = true
          } else {
            this.$store.commit('UPDATE_LOADING', true)
            api.lineSkuFindStatus(this.skuId).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode == '0') {
                appStorage.remove('carpoolingJoin')
                this.$router.push({
                  name: 'carpoolingJoin',
                  query: {
                    skuId: this.skuId
                  }
                })
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          }
        } else {
          this.$router.push({
            name: 'carpoolingList',
            query: {
              productId: this.lineSkuData.productId
            }
          })
        }
      },

      /**
       * 倒计时结束
       */
      finish () {
        this.$router.replace({
          name: 'carpoolingShare',
          query: {
            skuId: this.skuId
          }
        })
      }


    }
  }
</script>
<style scoped>
  .carpooling-status {
    position: absolute;
    top: 0;
    right: 30px;
    width: 300px;
    height: 160px;
    z-index: 10;
  }

  .carpooling-success {
    background: url('../../../../assets/charter/success.png') no-repeat right 10px;
    background-size: 153px 122px;
  }

  .carpooling-fail {
    background: url('../../../../assets/charter/fail.png') no-repeat right 10px;
    background-size: 153px 122px;
  }

  .charter-btn-box {
    display: flex;
    right: 0;
    height: 120px;
    padding: 25px 19px;
    background-color: #545454;
  }

  .charter-btn-box .button {
    flex: 1;
    height: 70px;
    line-height: 70px;
    margin: 0 23px;
    font-size: 28px;
  }

  .car-nav {
    margin-bottom: 0;
  }

  .share-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color:rgba(0, 0, 0, 0.7);
    z-index: 210;
  }

  .share-tips {
    position: relative;
    padding-top: 280px;
    background: url('../../../../assets/charter/share_jt.png') no-repeat right 0;
    background-size: 71px 312px;
    text-align: center;
    font-size: 28px;
    color: #fff;
    z-index: 200;
  }

  .share-tips p:first-child {
    margin-bottom: 30px;
  }

  .share-tips em {
    color: #ff6600;
    font-size: 36px;
  }
</style>
