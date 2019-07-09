<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <ul class="top-flex-nav line line-x-b">
      <li @click="switchType('0')">
        <div class="check-item line-box radius-box">
          <div class="check-box">
            <label>
              <input class="hide" type="radio" :value="0"
                     v-model="invoiceData.type" name="invoiceType"/>
              <i class="icon-com"></i>
              <span class="mar-l-50">公司发票</span>
            </label>
          </div>
        </div>
      </li>
      <li @click="switchType('1')">
        <div class="check-item line-box radius-box">
          <div class="check-box">
            <label>
              <input class="hide" type="radio" :value="1"
                     v-model="invoiceData.type" name="invoiceType"/>
              <i class="icon-com"></i>
              <span class="mar-l-50">个人/非企业单位发票</span>
            </label>
          </div>
        </div>
      </li>
    </ul>

    <div class="form-field">
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
                 v-model="invoiceData.eleInvoiceHead"
                 placeholder="请填写发票抬头"
          >
        </div>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          纳税人识别号
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.taxpayerCode"
                 placeholder="请填写纳税人识别号"
          >
        </div>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          发票内容
        </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input" disabled
                 v-model="invoiceData.content"
                 placeholder="请填写发票内容"
          >
        </div>
      </div>
      <div class="form-field__item border-b-0">
        <div class="form-field__item-l">
          发票金额
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input c-f-f60"
                 v-model="totalMoney" disabled
                 placeholder="请填写发票金额">
        </div>
      </div>
      <div class="form-field__item border-b-0">
        <div class="form-field__item-l">
          更多信息
        </div>
        <div class="form-field__item-r relative" @click="moreMes">
          <input type="text" class="form-field__input text-right pad-r-20"
                 disabled
                 placeholder="填写购买人信息">
          <i class="icon-r-jt"></i>
        </div>
      </div>

      <div class="form-field__title">
        <p class="form-field__title-text">
          <span class="form-field__line"></span>
          收件信息
      </p>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          电子邮件
        </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.userEmail"
                 placeholder="用于接收电子行程单">
        </div>
      </div>
      <p class="form-field__tip">
        <span class="text-left line-height-30" v-if="invoiceData.pickupType==0">发票会以电子版的形式发到您的邮箱，电子发票与纸质发票具备同等法律效益，可支持报销入账。</span>
      </p>
    </div>

    <div class="mar20 mar-t-40">
      <input type="button" class="button button-primary" value="提交" @click="confirmSubmit"/>
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
        pageRouter: this.$route.name,
        orderList: [],
        invoicePicker: '',
        totalMoney:0,
        invoiceData: {
          orderIds:[],
          type: '0', //0 公司发票 1 个人发票
          content:'客运服务费'
        }
      }
    },
    mounted() {
      console.log(this.invoiceData.type);
      if(appStorage.get('totalMoney')) {
        this.totalMoney = JSON.parse(appStorage.get('totalMoney'));
      }
      if(appStorage.get('invoiceIds')) {
        this.invoiceData.orderIds = JSON.parse(appStorage.get('invoiceIds'));
      }
      if(appStorage.get('invoiceData')){
        this.invoiceData = JSON.parse(appStorage.get('invoiceData'));
        console.log(this.invoiceData);
      }
      if(appStorage.get('moreInvoice')) {
        this.invoiceMoreData = JSON.parse(appStorage.get('moreInvoice'));
        this.invoiceData.userPhone = this.invoiceMoreData.userPhone;
        this.invoiceData.userBankNo = this.invoiceMoreData.userBankNo;
      }
//      appStorage.remove('invoiceData')
      console.log(this.invoiceData.type);
    },
    computed: {

    },
    watch: {

    },
    methods: {
      moreMes() {
          appStorage.set('invoiceData',JSON.stringify(this.invoiceData));
          this.$router.push({
            name:'moreMessage'
          })
      },

      switchType(type) {
        this.invoiceData.type = type;
      },

      openPicker() {
        if(this.notAllowEdit) {
          return false;
        }
        this.invoicePicker.show();
      },

      submitData () {
        api.createEleInvoice(this.invoiceData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0'){
              this.$store.dispatch('showSuccess','操作成功');
              appStorage.remove('invoiceData');
              appStorage.remove('moreInvoice');
              this.$router.go(-1);
          }else{
             this.$store.dispatch('showError',data.resultMsg)
          }
        })
      },

      confirmSubmit() {
        if(!this.validateFun()) {
          return false;
        }
        this.$store.dispatch('showConfirm',{
          content:`<div class="modal_content text-left f-s-28 c-f-4c4c4c"><p><span class="c-f-888">发票类型：</span>电子发票</p><p class="mar-t-20"><span class="c-f-888">发票抬头：</span>${this.invoiceData.eleInvoiceHead}</p><p class="mar-t-20"><span class="c-f-888">纳税人识别号：</span>${this.invoiceData.taxpayerCode}</p><p class="mar-t-20"><span class="c-f-888">电子邮箱：</span>${this.invoiceData.userEmail}</p><p class="mar-t-30 line-height-30">*请确认邮箱无误，电子发票将在系统开具后发送至您的邮箱，请注意查收。</p></div>`,
          confirmText:'确认提交',
          onConfirm: () => {
            this.submitData();
          },
          onCancel: () => {

          }
        })

      },
      validateFun() {
        let validateData = [
          {value: this.invoiceData.eleInvoiceHead, emptyTips: '请填写发票抬头'},
          {value: this.invoiceData.taxpayerCode, emptyTips: '请填写纳税人识别号'},
          {value: this.invoiceData.userEmail, emptyTips: '请填写您的电子邮箱', regName: 'email',regTips: '邮箱格式不正确'}
        ];
        let validate = TOOL.formValidate(validateData);
        if (!validate.valid) {
          this.$store.dispatch('showError', validate.msg);
          return false;
        }
        return true;
      }
    }
  }
</script>
<style lang="less" scoped>
  .check-item{
    height:100%;
    margin-bottom: 0;
    border: 0;
  }
  .check-box{
    width: 100%;
    height:100%;
    padding-left: 0;
  }
  .top-flex-nav li {
    padding: 0;
  }
  .icon-com{
    right:auto !important;
  }
  .form-field__item-r{
    input{
      color: #888;
    }
  }
</style>
