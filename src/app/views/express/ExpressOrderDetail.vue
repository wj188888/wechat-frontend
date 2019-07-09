<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="order-status-box">

      <p class="order-status">
          <span v-if="detailData.status == 0 && (detailData.chargeMethod == 1 || (detailData.chargeMethod == 0&&!detailData.actualPayment))">已完成</span>
          <span v-else>{{detailData.status | pressStatusTxt}}</span>
      </p>
      <p class="order-status-tips" v-if="detailData.status == 0 && detailData.chargeMethod == 0 && detailData.actualPayment">
        请尽快完成付款，到期后订单将会自动取消
      </p>
    </div>

    <div class="ticket-info-order mar-b-0 line line-x-b">
      <p>
        <span class="left-span">订单编号</span>
        <span class="right-span" v-text="detailData.code"></span>
      </p>
      <p>
        <span class="left-span">订单日期</span>
        <span class="right-span" v-text="detailData.createdTime"></span>
      </p>
    </div>
    <div class="ticket-info-order">
      <p>
        <span class="left-span">寄件时间</span>
        <span class="right-span" v-text="detailData.pickUpDate"></span>
      </p>
      <p>
        <span class="left-span">寄件线路</span>
        <span class="right-span">{{detailData.aAddress.county || detailData.aAddress.city}} - {{detailData.bAddress.county || detailData.bAddress.city}}</span>
      </p>
      <p>
        <span class="left-span">物品名称</span>
        <span class="right-span" v-text="detailData.goods"></span>
      </p>
      <p>
        <span class="left-span">寄件人</span>
        <span class="right-span" v-text="detailData.contactName"></span>
      </p>
      <p>
        <span class="left-span">手机号</span>
        <span class="right-span" v-text="detailData.contactTelephone"></span>
      </p>
      <p>
        <span class="left-span">寄件地址</span>
        <span class="right-span" v-text="detailData.pickUpAddress"></span>
      </p>
      <p class="mar-b-50">
        <span class="left-span">备注</span>
        <span class="right-span" v-text="detailData.remark"></span>
      </p>

      <p class="text-larger text-price-total mar-b-0 line line-x-t">
        <span class="left-span">上门取件费</span>
        <span class="right-span" v-if="detailData.actualPayment">{{ detailData.actualPayment | formatPrice }}</span>
	    <span class="right-span" v-if="!detailData.actualPayment">免费</span>
      </p>
      <p class="text-larger orange" v-if="detailData.productTypeLevelOne == 'CUSTOM_BUS' && detailData.depositAmount > 0">
        <span class="left-span orange">已付订金</span>
        <span class="right-span orange">{{ detailData.depositAmount | formatPrice }}</span>
      </p>
      <p class="text-larger" v-if="detailData.payType == 2">
        <span class="left-span orange">预付金额</span>
        <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
      </p>
      <p class="text-larger" v-if="detailData.payType == 2">
        <span class="left-span" style="width: 20rem;">尾款<em class="gray">(由用户线下交给司机)</em></span>
        <span class="right-span orange">{{ ((detailData.accountPayable - detailData.actualPayment)) | formatPrice }}</span>
      </p>
      <p class="text-larger text-price-total line line-x-t" v-if="(detailData.chargeMethod == 0)&&(detailData.status == 1||detailData.status == 3||detailData.status == 4)">
        <span class="left-span">实付款</span>
        <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
      </p>
      <p class="text-larger text-price-total line line-x-t" v-if="(detailData.chargeMethod == 0)&&(detailData.status == 3)">
        <span class="left-span">已退款</span>
        <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
      </p>
    </div>
    <div class="online-service">
      <input type="button" class="button button-primary" value="联系客服" @click="callService('')">
    </div>
    <div slot="footer">
      <div class="abs-bottom-box line line-x-t" v-if="(detailData.status == 0 || detailData.status == 1)&&(detailData.chargeMethod == 0)&&detailData.actualPayment">
        <div class="buy-right buy-w100">
          <p class="order-tips price">共计 <span>{{ detailData.actualPayment | formatPrice }}</span></p>
          <input type="button" class="button button-empty-primary button-small radius-box" v-if="detailData.status == 0" @click="payMoney" value="立即支付"/>
          <input type="button" class="button button-empty-gray button-small radius-box" @click="cancleOrderAndTicket" value="取消订单"/>
        </div>
      </div>
      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import OrderBaseInfo from 'appComponents/orderBaseInfo/index.vue'
  import GroupStatus from 'appComponents/groupStatus/index.vue'
  import TicketNotice from 'components/ticketNotice/index.vue'
  import ShareModal from 'appComponents/shareModal/index.vue'
  import { Swiper, FlexboxItem, SwiperItem, XDialog } from 'vux'
  import phone from 'mixins/phone'

  export default {
    components: {
      MainBox,
      OrderBaseInfo,
      GroupStatus,
      TicketNotice,
      Swiper,
      SwiperItem,
      XDialog,
      ShareModal,
      FlexboxItem
    },
    mixins: [phone],
    data () {
      //        订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期
      return {
        title: this.$route.meta.title,
        orderId: '',
        detailData: {
          aAddress:{},
          bAddress:{},
          tickets:[]
        },
        dispatchVehicles: [],
        ticketList: [], //可用车票列表，拼车为未成团不展示车票
        insurePrice: 0, //保险金额
        insuranceNum: 0, //购买保险数
        adultNum: 0,
        childNum: 0,
        ticketTipsShow: false, //退票须知
        refundNotice: '', //购票须知
        countState: false,
        showDialog: false, // 控制弹窗
        dialogServiceCar: '',// 弹窗要显示的服务车辆信息
        showShare: false,
      }
    },
    computed: {

      /**
       * 退票按钮控制
       */
      isRefund () {
        let now = TOOL.newGetDate({type: 'holeDate'})
        let refund = true

        if(this.detailData.productTypeLevelOne == 'STATION_BUS' ||
          this.detailData.productTypeLevelTwo == 'LINE_CAR_POOL_BUS' ||
          this.detailData.productTypeLevelOne == 'CUSTOM_BUS'){
          refund = false
        }
//      && refund
        return TOOL.dateCompare(this.detailData.startupTime, now, 'datetime') > 0
      }
    },
    mounted () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.orderId = this.$route.query.orderId;
        this.orderDetailById();
      },
      /**
       * 查找订单详情
       */
      orderDetailById () {
        this.$store.commit('UPDATE_LOADING', true);
        api.expressOrderFindDetail(this.orderId).then(res => {
          const data = TOOL.toJson(res.data);
          this.$store.commit('UPDATE_LOADING', false)
          if (data.resultCode == '0') {
            this.detailData = data.resultData;
            let shareTitle = '【' + this.detailData.contactName + '】分享了快递订单';
            let shareUrl = TOOL.shareURL + 'expressOrderShare' + '?orderId=' + this.orderId;
            let shareImgUrl = this.detailData.customerHeadImgUrl;
            interfaceApi.share({
                share: true,
                shareUrl: shareUrl,
                shareTitle: shareTitle,
                shareDesc: '用小件快运，让快递从未如此便捷',
                shareImgUrl: shareImgUrl
            });
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },

      showCarDialog(carData) {
          this.dialogServiceCar = carData;
          this.showDialog = true;
      },

      hideCarDialog() {
        this.showDialog = false;
      },

      groupFinish () {
        this.orderDetailById();
      },

      /**
       *  订单支付
       */
      payMoney () {
        interfaceApi.wxPay({
          tradeNo: this.orderId,
          productTypeLevelOne: 'EXPRESS',
          wxPaySuccess: TOOL.wxPaySuccess,
          wxPayFail: TOOL.wxPayFail,
          price: this.detailData.actualPayment
        })
      },

      /**
       *  取消订单
       */
      cancleOrderAndTicket () {
        this.$store.dispatch('showConfirm', {
          title: '温馨提醒',
          content: '是否确定要取消订单？',
          onConfirm: () => {
            this.$store.commit('UPDATE_LOADING', true)
            api.expressOrderCancell(this.orderId).then(res => {
              const data = TOOL.toJson(res.data)
              this.$store.commit('UPDATE_LOADING', false)
              if (data.resultCode == '0') {
                this.$store.dispatch('showSuccess', '取消订单成功')
                this.orderDetailById();
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },
          onCancel: () => {
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  .order-status-box {
    height: 170px;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ff9900;
    color: #fff;
    position: relative;
    .order-status {
      margin: 22px 0 28px;
      font-size: 36px;
    }
    .order-status-tips {
      font-size: 24px;
      line-height: 1.414;
    }
  }

  .order-ticket {
    margin-bottom: 20px;
    overflow: hidden;
  }

  .ewm-pic-box {
    height: 520px;
    background-color: #fff;
    .ewm-pic {
      position: relative;
      width: 100%;
      height: 312px;
      margin-top: 140px;
      text-align: center;
      .ticket-status-tag {
        position: absolute;
        top: -20px;
        left: 50%;
        width: 168px;
        height: 135px;
        background: no-repeat center center;
        background-size: 168px 135px;
        z-index: 1;
      }
      .ticket-status-3 {
        background-image: url("../../../assets/ticket_3.png");
      }
      .ticket-status-456 {
        background-image: url("../../../assets/ticket_456.png");
      }
      img {
        width: 260px;
        height: 260px;
        &.opacity {
         opacity: 0.3;
       }
      }
    }

    .ticket-user {
      position: absolute;
      left: 0;
      bottom: 32px;
      width: 100%;
      display: flex;
      text-align: center;
      font-size: 26px;
      color: #b2b2b2;
      p {
        flex: 1;
        height: 34px;
        line-height: 34px;
      }
      i {
        display: inline-block;
        vertical-align: bottom;
      }
      .icon-username {
        width: 40px;
        height: 34px;
        background: url('../../../assets/user.png') no-repeat 0 center;
        background-size: 27px 31px;
      }
      .icon-userphone {
        width: 32px;
        height: 34px;
        background: url('../../../assets/phone.png') no-repeat 0 center;
        background-size: 19px 31px;
      }
    }
  }

  .btn-ewm-save {
    display: block;
    height: 80px;
    line-height: 80px;
    font-size: 28px;
    color: #272a35;
    text-align: center;
  }

  .ticket-info-box {
    margin-bottom: 20px;
    background-color: #fff;
  }

  .ticket-h2 {
    height: 86px;
    line-height: 86px;
    padding: 0 20px;
    font-size: 28px;
    color: #272a35;
    font-weight: normal;
    &.ticket-tips-tit {
       position: relative;
       padding-left: 77px;
       background: url('../../../assets/ticket_tips.png') no-repeat 20px center;
       background-size: 37px 37px;
      i:after {
        right: 20px;
      }
     }
    span {
      margin-left:5px;
      color: #999;
      font-size: 24px;
    }
  }

  .ticket-tips {
    padding: 0 20px 60px;
    overflow: hidden;
    h3 {
      margin: 30px 0 26px;
      font-size: 26px;
      color: #272a35;
    }
    .h-2 {
      margin-top: 60px;
    }
    p {
      position: relative;
      padding-left: 40px;
      margin-bottom: 20px;
      line-height: 1.414;
      font-size: 26px;
      color: #6b6c70;
    }
    span {
      position: absolute;
      left: 0;
      top: 0;
    }
    .warning-tips {
      padding-left: 0;
      color: #ff6600;
    }
  }

  .ticket-info-order {
    padding: 20px 0;
    margin-bottom: 20px;
    background-color: #fff;
    p {
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      margin-bottom: 30px;
      font-size: 28px;
      color: #888888;
      &:last-child {
         margin-bottom: 0;
       }
    }
    .left-span {
      float: left;
      width: 160px;
      height: 30px;
      color: #999;
    }
    .right-span {
      float: right;
      height: 30px;
      color: #999;
      em {
        color: #272a35;
      }
    }
    .name {
      display: inline-block;
      min-width: 140px;
    }
    .tel {
      display: inline-block;
      padding-left: 20px;
      margin-left: 16px;
      background: url('../../../assets/phone2.png') no-repeat 0 center;
      background-size: 15px 24px;
    }
    .text-larger .left-span,
    .text-larger .right-span {
      font-size: 30px;
      color: #272a35;
    }
    .text-larger .gray {
      color: #999;
    }
    .text-price-total {
      height: 100px;
      line-height: 100px;
      .left-span,
      .right-span {
        height: 100px;
        font-size: 28px;
        color: #888888;
      }
    }
    .abs-tit-box {
      position: relative;
      color: #999;
      .abs-tit {
        position: absolute;
        left: 0;
        top: 0;
        height: 30px;
        color: #999;
      }
      .right-text {
        height: 30px;
        color: #999;
        text-align: right;
      }
      .special-tips {
        margin-left: 180px;
        padding-left: 0;
        height: auto;
        text-align: left;
        color: #272a35;
      }
      .right-text span {
        display: inline-block;
      }
      .right-text em {
        height: 30px;
        color: #272a35;
      }
    }
  }

  .tag-age {
    display: inline-block;
    margin-left: 20px;
    line-height: 1;
    padding: 4px 8px;
    background-color: #FF9900;
    color: #fff;
    font-size: 20px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    vertical-align: top;
    &.tag-age-child {
     background-color: #2772CC;
   }
  }
  .orange {
    color: #ff6600 !important;
  }
  .abs-bottom-box{
    .order-tips{
      float:left;
      line-height:90px;
      padding-left:20px;
      font-size:24px;
      color:#4c4c4c;
    }
    .price{
      font-size:28px;
      span{
        font-size: 30px;
        color: #ff6600;
      }
    }
    .icon-tips{
      padding-left:60px;
      background:url("../../../assets/i.png") no-repeat 20px center;
      background-size:30px 30px;
    }
    .button-small{
      float:right;
      margin-right:20px;
      margin-top:15px;
      font-size: 28px;
      width: auto;
      padding:0 20px;
      height: 50px !important;
      line-height: 50px
    }
  }

  .swiper-dispatch {
    padding-top: 50px;
  }
  .dispatch-vehicles {
    span {
      text-align: left !important;
    }
  }
  .dispatch-car {
    position: absolute;
    right: 20px;
    top: 70px;

    font-size: 28px;
    padding-right: 28px;
    background: url("../../../assets/charter/gantan.png") no-repeat right top;
    background-size: 24px 24px;
  }
  .dispatch-hide {
    display: none;
  }
  .dispatch-title {
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding-left: 20px;

    text-align: left;
    font-size: 28px;
  }
  .dispatch-bottom {
    width: 100%;
    height: 80px;
    line-height: 80px;

    text-align: center;
    font-size: 28px;
  }
  .online-service {
    padding: 0 20px;
    input {
      height: 80px;
      background-color: #fff;
      font-size: 28px;
      color: #4c4c4c;
      border-color: #e5e5e5;
    }
  }
  .pad-0 {
    padding: 0 !important;
  }
  .pad-t-20 {
    padding-top: 20px !important;
  }
  .pad-b-50 {
    padding-bottom: 50px !important;
  }
  .mar-b-50 {
    margin-bottom: 50px !important;
  }
  .mar-b-0 {
    margin-bottom: 0 !important;
  }
  .black-color {
    color: #272a35 !important;
  }
  .txt-left {
    text-align: left !important;
  }
  .float-l {
    float: left !important;
  }
  .wd-220 {
    width: 220px !important;
  }

</style>
