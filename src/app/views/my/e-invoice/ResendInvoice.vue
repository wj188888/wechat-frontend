<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <div class="form-field">
      <div class="form-field__item">
        <div class="form-field__item-l">
          电子邮件
        </div>
        <div class="form-field__item-r">
          <input type="text" class="form-field__input"
                 v-model="resentInvoice.email"
                 placeholder="用于接收电子行程单"
          >
        </div>
      </div>
    </div>
    <div class="mar20 mar-t-60">
      <input type="button" class="button button-primary" value="提交" @click="saveData"/>
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
        resentInvoice: {
          resentInvoice:this.$route.query.id
        },
      }
    },
    mounted() {

    },
    computed: {

    },
    watch: {

    },

    methods: {

      saveData() {
        if(!this.validateFun()) {
          return false;
        }
        api.resendEleInvoice(this.resentInvoice).then(res => {
            const data = JSON.parse(res.resultData);
            if(data.resultCode === '0'){
              this.$store.dispatch('showSuccess','操作成功');
              this.$router.go(-1);
            }else{
              this.$store.dispatch('showError',data.resultMsg)
            }
        })
      },

      validateFun() {
        let validateData = [
          {value: this.resentInvoice.email, emptyTips: '请填写您的电子邮箱', regName: 'email',regTips: '邮箱格式不正确'}
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
  .form-field{
    margin-top: 5px;
  }
</style>
