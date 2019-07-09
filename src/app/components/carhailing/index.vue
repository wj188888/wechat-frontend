<template>
  <div class="mar-b-20 bg-fff radius-box">
    <div class="inline-box">
      <label class="icon-carhailing-phone"></label>
      <input type="tel" placeholder="请输入手机号码" v-model="localData.contactTelephone" readonly @click.prevent="inputTelphone"/>
      <!--<span class="change-passenger" @click="jumpToPassenger">更换乘车人</span>-->
    </div>
    <div class="inline-box">
      <label class="icon-carhailing-time"></label>
      <span id="date">{{timeText}}</span>
    </div>
    <div class="inline-box">
      <label class="icon-carhailing-start"></label>
      <input type="text" placeholder="您在哪上车" v-model="from" readonly @click.prevent="jumpToSetPosition('from')"/>
    </div>
    <div class="inline-box">
      <label class="icon-carhailing-end"></label>
      <input type="text" placeholder="您要去哪里" v-model="to" readonly @click.prevent="jumpToSetPosition('to')"/>
    </div>
    <x-dialog :show="showTelDialog" class="tel-dialog">
      <div class="tel-dialog-body line line-x-b">
        <a class="close" @click="showTelDialog = false"></a>
        <p class="tips">
          请输入乘车人联系电话
          <span class="error" v-show="errorPhoneText">{{errorPhoneText}}</span>
        </p>
        <div class="telephone line line-x-b">
          <input type="tel" placeholder="请输入手机号码" maxlength="11" v-model="telephone">
        </div>
      </div>
      <input type="button" value="确定" @click="setTelephone" class="button button-no-radius button-empty-white">
    </x-dialog>
  </div>
</template>
<script>
  import {XDialog} from 'vux'

  export default {
    components: {
      XDialog
    },
    props:['localData','from', 'to', 'pageRouter', 'saveForm', 'timeText'],
    data () {
      return {
        showTelDialog: false,
        errorPhoneText:'',
        telephone:'',
      }
    },
    methods:{
      inputTelphone () {
        this.showTelDialog = true
        if(this.localData.contactTelephone){
          this.telephone = this.localData.contactTelephone
        }
      },

      setTelephone () {
        let validata = TOOL.formValidate([
          {value: this.telephone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.errorPhoneText = validata.msg
          return false;
        }
        this.localData.contactTelephone = this.telephone
        this.showTelDialog = false
      },

      jumpToSetPosition (dataKey) {
//        if(!this.localData.from || (this.localData.from && this.localData.from.city === '') ){
//          return
//        }
        this.saveForm()
        this.$router.push({
          name: 'setPosition',
          query:{
            pageRouter: this.pageRouter,
            dataKey: dataKey
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  .inline-box {
    border-top:1PX solid #f2f2f2;
    label{
      width:86px;
      background-repeat:no-repeat;
      background-position:10px center;
      background-size:30px 30px;
    }

    .change-passenger{
      flex: 0 1 auto;
      padding-left:20px;
      text-align:right;
      color:#888;
    }
  }
  .icon-carhailing-phone{
    background-image:url("../../../assets/order_me.png")
  }
  .icon-carhailing-time{
    background-image:url("../../../assets/order_time.png")
  }
  .icon-carhailing-start{
    background-image:url("../../../assets/order_start.png")
  }
  .icon-carhailing-end{
    background-image:url("../../../assets/order_end.png")
  }
  .tel-dialog-body {
    text-align:center;
    padding:84px 0 52px;
    .close{
      position: absolute;
      top:20px;
      right:20px;
      width:50px;
      height:50px;
      background:url("../../../assets/close-dialog.png") no-repeat right top;
      background-size:30px 30px;
    }
    .tips{
      position: relative;
      margin-bottom:76px;
      font-size:32px;
      color:#4c4c4c;
      .error{
        position: absolute;
        top:40px;
        left:0;
        width: 100%;
        font-size:20px;
        color:#e4475c;
      }
    }
    .telephone{
      width:420px;
      margin:0 auto;
      input{
        padding:14px 10px;
        font-size:28px;
        text-align: center;
      }
    }
  }
</style>
