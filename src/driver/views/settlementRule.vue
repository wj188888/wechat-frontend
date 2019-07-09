<template>
  <div class="container">
    <div class="headBox">收入分成规则</div>
    <div class="content">
      <ul>
        <li class="border_b_eee">
          <span class="txt">分成对象</span>
          <span class="txt-right">分成比例</span>
        </li>
        <li class="border_b_eee">
          <span class="rule_txt txt">企业</span>
          <span class="rule_txt txt-right">0%</span>
        </li>
        <li>
          <span class="rule_txt txt">司机</span>
          <span class="rule_txt txt-right">100%</span>
        </li>
      </ul>
      <p class="infoTxt">
        <span>*每单收入=(业务费用-银行手续费)*100%</span><br>
        <span>*银行手续费=业务费*0.6%</span><br>
        <span>*业务费用为旅客实际在线支付的费用，包括车费和路桥费</span><br>
        <span>*旅客线上支付完订单后，系统实时结算，将该笔订单、收入纳入至司机提现月中</span>
      </p>
    </div>

  </div>
</template>
<style lang="less" scoped>
  .container{
    width: 100%;
  }
  .headBox{
    width: 100%;
    height: 110px;
    line-height: 110px;
    background-color: #ffffff;
    padding-left: 30px;
    border: 1PX solid #eeeeee;
    color: #4c4c4c;
    font-size: 32px;
  }
  .content{
    margin-top: 30px;
    padding: 0 32px;
    ul{
      width: 100%;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1PX solid #eeeeee;
      li{
        padding:0 20px;
        height: 96px;
        line-height: 96px;
        font-size: 28px;
        color: #4c4c4c;
        overflow: hidden;
      }
    }
  }
  .txt{
    float: left;
  }
  .txt-right{
    float: right;
  }
  .rule_txt{
    color: #888888 !important;
  }
  .infoTxt{
    margin-top: 40px;
    line-height: 30px;
    font-size: 24px;
    color: #888888;
  }
  .border_b_eee{
    border-bottom: 1PX solid #eeeeee !important;
  }
</style>