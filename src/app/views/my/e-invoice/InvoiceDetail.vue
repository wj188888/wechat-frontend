<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <div class="invoice_mes_title">
      <span class="c-f-ea5449" v-if="invoiceData.invoiceStatus === 1">待开票</span>
      <span class="c-f-56ab71" v-if="invoiceData.invoiceStatus === 2">已开票</span>
      <span class="c-f-ea5449" v-if="invoiceData.invoiceStatus === 3">开票失败</span>
    </div>
    <div class="detail_title" v-if="invoiceData.invoiceStatus === 2">
      <div class="detail_title_left">
        <p>电子票已开具</p>
        <span>{{invoiceData.applyTime.substring(0,10)}}</span>
      </div>
      <div class="detail_title_right" @click="showBigImgBack">
        <span>查看</span>
        <em class="right-arrow"></em>
      </div>
      <div class="bigImg" @click="hideBigImgBack"
           :class="{'display-block': bigImgBack}">
        <img :src="invoiceData.invoicePath" alt=""/>
        <span></span>
      </div>
    </div>
    <div class="form-field mar-t-20">
      <div class="form-field__title">
        <p class="form-field__title-text">
          <span class="form-field__line"></span>
          发票信息
      </p>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          发票抬头
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 :disabled = "true"
                 v-model="invoiceData.eleInvoiceHead">
        </div>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          纳税人识别号
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.taxpayerCode"
                 :disabled = "true">
        </div>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          发票内容
        </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.content"
                 :disabled = "true">
        </div>
      </div>
      <div class="form-field__item border-b-0">
        <div class="form-field__item-l">
          发票金额
      </div>
        <div class="form-field__item-r">
          <span class="form-field__input">
            <span class="c-f-ea5449">{{invoiceData.eleInvoiceAmount}}</span>元
          </span>
        </div>
      </div>
      <div class="form-field__item border-b-0">
        <div class="form-field__item-l">
          申请时间
      </div>
        <div class="form-field__item-r">
          <span class="form-field__input">
           {{invoiceData.applyTime.substring(0,16)}}
          </span>
        </div>
      </div>
      <div class="form-field__item border-b-0" v-if="invoiceData.userPhone">
        <div class="form-field__item-l">
          注册电话
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.userPhone"
                 :disabled = "true">
        </div>
      </div>
      <div class="form-field__item border-b-0" v-if="invoiceData.userBankNo">
        <div class="form-field__item-l">
          开户银行
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.userBankNo"
                 :disabled = "true">
        </div>
      </div>

      <div class="form-field__title mar-t-20">
        <p class="form-field__title-text">
          <span class="form-field__line"></span>
          所含行程
      </p>
      </div>
      <div class="detail_foot form-field__item">
        <div class="detail_title_left">
          <p class="c-f-4c4c4c">1张发票，含{{invoiceData.orders.length}}个行程</p>
          <span>{{invoiceData.startDate.split(' ')[0]}} ~ {{invoiceData.endDate.split(' ')[0]}}</span>
        </div>
        <div class="detail_title_right" @click="toIncludeTrip(invoiceData.orders)">
          <em class="right-arrow"></em>
        </div>
      </div>
    </div>
    <div class="mar20 mar-t-40">
      <input type="button" class="button button-primary"
             value="重新发送电子发票" @click="toResendInvoice"/>
    </div>

  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      MainBox
    },
    data() {
      return {
        title:this.$route.meta.title,
        orderId:this.$route.query.id,
        invoiceData:{
          orders:[],
          startDate:'',
          endDate:'',
          applyTime:'',
        },
        bigImgBack:false,
      }
    },
    mounted() {
      this.findEleInvoiceById(this.orderId);
    },
    computed: {

    },
    watch: {

    },
    methods: {
      /*
      * 查询订单详情
      * */
      findEleInvoiceById(id){
        api.findEleInvoiceById(id).then(res => {
          const data = TOOL.toJson(res.data)
          if(data.resultCode === '0'){
            this.invoiceData = data.resultData;
            this.invoiceData.eleInvoiceAmount = this.invoiceData.eleInvoiceAmount.toFixed(2);
            console.log(this.invoiceData);
          }else{
            this.$store.dispatch('showError',data.resultMsg);
          }
        })
      },

      moreMes() {
          this.$router.push({
            name:'moreMessage'
          })
      },
      toIncludeTrip(orders) {
          appStorage.set('invoiceOrders',JSON.stringify(orders));
          this.$router.push({
            name:'includeTrip'
          })
      },
      toResendInvoice() {
          this.$router.push({
            name:'resendInvoice',
            query:{
                id:this.orderId
            }
          })
      },

      showBigImgBack () {
        this.bigImgBack = true;
      },
      hideBigImgBack () {
        this.bigImgBack = false;
      },

    }
  }
</script>
<style lang="less" scoped>
  .invoice_mes_title{
    height:80px;
    background: #fff;
    text-align: center;
    font-size:28px;
    line-height: 80px;
  }
  .form-field__title{
    background: #fff;
    border-bottom: 1PX solid #e5e5e5;
  }
  .detail_title{
    display: flex;
    flex-wrap: nowrap;
    height:120px;
    margin: 40px 0 0 0;
    background: #fff;
    padding-left: 20px;
  }
  .detail_foot{
    display: flex;
    flex-wrap: nowrap;
    height:120px;
    background: #fff;
    padding-left: 20px;
  }
  .detail_title_left{
    p{
      font-size:28px;
      color: #56ab71;
      margin: 20px 0 27px 0;
    }
    span{
      font-size:26px;
      color: #888;
    }
    flex:1;
  }
  .detail_title_right{
    padding-right: 20px;
    font-size:28px;
    color: #888;
    width: 140px;
    line-height: 120px;
    text-align: right;
  }
  .right-arrow{
    display: inline-block;
    width: 13px;
    height:23px;
    background-image:url('../../../../assets/month_right.png');
    background-size: 100% 100%;
    margin-left: 10px;
    vertical-align: middle;
  }
  .bigImg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    left: 0;
    top: 0;
    z-index: 10000;
    text-align: center;
    display: none;
    vertical-align: baseline;
    img{
      vertical-align: middle;
      width: 100%;
      position: absolute;
      top:50%;
      left:0;
      margin-top: -210px;
    }
  }
  .display-block{
    display: block !important;
  }
</style>
