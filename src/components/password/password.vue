<template>
  <div class="pay-flex" :class="[cssClass]">
    <input class="rel-input" type="tel" maxlength="6" :value="payPassword" @input="updateValue($event.target.value)" @focus="displayMouse" @blur="hideMouse"/>
    <div class="pay-password-box" v-for="i in 6">
      <div class="pay-password" :class="{'pay-yellow': payPassword.length >= i}"></div>
      <div class="mouse" :ref="'mouse' + (i - 1)"></div>
      <div class="dot" :class="{'display-dot': payPassword.length >= i}"></div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['payPassword', 'cssClass'],
    watch: {
      payPassword (newVal) {
        let newValLength = newVal.length
        for(let i = 0; i < 6; i++){
          this.$refs['mouse' + i][0].style.display = 'none'
        }

        for(let i = 0; i < 6; i++){
          if(newValLength === i){
            this.$refs['mouse' + i][0].style.display = 'block'
          }else{
            this.$refs['mouse' + i][0].style.display = 'none'
          }
        }
      }
    },
    methods:{
      updateValue (value) {
        this.$emit('input', value)
      },

      displayMouse () {
        let len = this.payPassword.length
        for(let i = 0; i < 6; i++){
          if(i === len){
            this.$refs['mouse' + i][0].style.display = 'block'
          }
        }
      },

      hideMouse () {
        for(let i = 0; i < 6; i++){
          this.$refs['mouse' + i][0].style.display = 'none'
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  @import "../../styles/theme.less";
  .pay-flex{
    position: relative;
    display:flex;
    .rel-input{
      position: absolute;
      top:0;
      left:0;
      height:80px;
      line-height:80px;
      z-index:100;
      opacity: 0;
      margin-left: -100%;// 隐藏input光标
      width: 200%;
    }
    .pay-password-box{
      position: relative;
      flex:1;
      text-align: center;
      .pay-password{
        display:inline-block;
        width: 80px;
        height:80px;
        font-size:40px;
        text-align:center;
        color: @fc-ff6600;
        border:1PX solid @bc-e5e5e5;
        border-radius: 4PX;
      }
      .pay-yellow{
        border:1PX solid @bc-ff6600;
      }
      .mouse{
        position:absolute;
        left:50%;
        top:20px;
        width: 1PX;
        height:40px;
        background-color: @bg-ff6600;
        display: none;
      }
      .display-mouse{
        display: block;
      }
      .dot{
        position:absolute;
        left:50%;
        margin-left: -10px;
        top:30px;
        width: 20px;
        height:20px;
        border-radius:50%;
        background-color: @bg-ff6600;
        display: none;
      }
      .display-dot{
        display: block;
      }
    }
  }
  .pay-dialog-password{
    .rel-input{
      height:74px;
      line-height:74px;
    }
    .pay-password-box {
      position: relative;
      flex: 1;
      text-align: center;
      .pay-password {
        display: inline-block;
        width: 74px;
        height: 74px;
      }
    }
  }
</style>
