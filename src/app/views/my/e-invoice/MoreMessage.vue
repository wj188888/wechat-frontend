<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <div class="form-field">
      <div class="form-field__item">
        <div class="form-field__item-l">
          注册电话
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.userPhone"
                 placeholder="请填写注册电话"
          >
        </div>
      </div>
      <div class="form-field__item">
        <div class="form-field__item-l">
          开户银行
      </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="invoiceData.userBankNo"
                 placeholder="请填写开户账户"
          >
        </div>
      </div>
    </div>
    <div class="mar20 mar-t-60">
      <input type="button" class="button button-primary" value="确认" @click="saveData"/>
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
        invoiceData: {
        }
      }
    },
    mounted() {
      if(appStorage.get('moreInvoice')) {
        this.invoiceData = JSON.parse(appStorage.get('moreInvoice'));
      }
    },
    computed: {

    },
    watch: {

    },
    methods: {
      saveData() {
        appStorage.set('moreInvoice',JSON.stringify(this.invoiceData));
        this.$router.go(-1);
      },
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
  .form-field{
    margin-top: 5px;
  }
</style>
