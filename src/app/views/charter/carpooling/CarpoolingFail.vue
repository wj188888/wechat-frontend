<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <carpooling-info
            :info-data="lineSkuData"
            :price-type="2"
            :show-service="true"
            :tips-type="pageRouter">
      <div class="carpooling-fail"></div>
    </carpooling-info>

    <div class="carpooling-detail-box">
      <ul class="carpooling-user-list" :class="{'one-row': lineSkuData.minTeamMember < 5 }">
        <li
                :class="{'ten-more': lineSkuData.minTeamMember > 10, 'active': i <= (lineSkuData.minTeamMember - lineSkuData.availableSeats)}"
                v-for="i in lineSkuData.minTeamMember">
          <span v-if="i == 1">团长</span>
        </li>
      </ul>
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
      <div v-if="lineSkuData.productContents && showDetails.productInfo">
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
        <router-link tag="input" type="button" :to="{name:'lineCar'}" class="button button-gray-lighter" value="更多拼车"></router-link>
        <input type="button" @click="jumpToCarpoolingList" class="button button-yellow" value="再去拼一个"/>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import CarpoolingInfo from 'appComponents/carpoolingInfo/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'

  export default {
    components: {
      MainBox,
      CarpoolingInfo,
      TicketNotice
    },
    data () {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        showCarpooling: true,
        skuId: '',
        productId: '',
        lineSkuData: {
          sellPoints:[],
          includeServices:{},
          productContents:{},
          customContents:{},
        },
        showDetails: {
          productInfo: true
        }
      }
    },
    mounted () {
      this.skuId = this.$route.query.skuId
      this.lineSkuFindShareLine(this.skuId)
    },
    methods: {
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
            this.productId = this.lineSkuData.productId
  
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
       * 跳转产品页面
       */
      jumpToCarpoolingList () {
        this.$router.push({
          name: 'carpoolingList',
          query: {
            productId: this.productId
          }
        })
      }
    }
  }
</script>
<style scoped>
  .carpooling-fail {
    position: absolute;
    top: 0;
    right: 30px;
    width: 300px;
    height: 160px;
    background: url('../../../../assets/charter/fail.png') no-repeat right 10px;
    background-size: 153px 122px;
    z-index: 10;
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
</style>
