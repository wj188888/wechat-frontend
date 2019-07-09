<template>
  <x-dialog :show="showPayDialog" :hide-on-blur="true" @on-hide="showPayDialog = false" class="pay-dialog">
    <h2>安全验证</h2>
    <p class="top-tips">正在使用虚拟资产，请输入您的安全密码进行安全验证</p>
    <div class="pad-lr-40">
      <password
        css-class="pay-dialog-password"
        :pay-password="password"
        @input="getPassword">
      </password>
      <input type="button" class="button button-primary" value="验证" :disabled="!(password !== '' && userAuthBtn)" @click="verifyPayPassword"/>
      <p class="forget-tips" @click="jumpToSetPayPasswordStep1">忘记密码？</p>
    </div>
  </x-dialog>
</template>
<script>
  import { XDialog } from 'vux'
  import Password from 'components/password/password'

  export default {
    props:['show'],
    components: {
      XDialog,
      Password
    },
    data () {
      return {
        password: '',
        userAuthBtn: true
      }
    },
    computed: {
      showPayDialog () {
        return this.show
      }
    },
    mounted () {

    },
    methods:{
      getPassword (value) {
        this.password = value
      },

      verifyPayPassword () {
        this.$emit('verifyPayPassword', this.password)
      },

      jumpToSetPayPasswordStep1 () {
        this.$router.push({
          name: 'setPayPasswordStep1',
          query: {
            type: 'payOrder'
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .pay-dialog{
    h2{
      padding:26px 0 28px;
      font-size:36px;
      color: @fc-121212;
      text-align:center;
    }
    .top-tips{
      padding: 30px 50px 50px;
      font-size:28px;
      line-height:1.4;
      color:#888;
      text-align:center;
    }
    .pad-lr-40{
      padding:0 40px;
    }
    .button{
      margin:65px auto 10px;
    }
    .forget-tips{
      padding-bottom:36px;
      font-size:24px;
      color: @fc-888;
      text-align:right;
    }
  }
</style>
