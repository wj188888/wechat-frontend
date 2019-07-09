<template>
    <div class="customer-box line line-x-b">
        <div class="add-customer mar-t-20 line line-x clearfix" @click="jumpToPassenger">
            <a class="button">{{type === 'passengers' ? '增加旅客' : '增加儿童'}}</a>
            <div v-if="type == 'passengers' &&　maxBuyNumber && (!carryKidSetting.canCarryKid || !carryKidSetting.maxNumber)">
                单笔订单限购{{maxBuyNumber}}张成人票
            </div>
            <div v-if="type == 'passengers' &&　maxBuyNumber && carryKidSetting.canCarryKid && carryKidSetting.maxNumber">
                <p>单笔订单限购{{maxBuyNumber}}张成人票</p>
                <p>如有携带1.2米以下儿童请选择“携童”</p>
            </div>
            <div v-if="type == 'children' && carryKidSetting.canCarryKid && carryKidSetting.maxNumber">
                <p>1.2米以上儿童请购买儿童票</p>
                <p>儿童票验证时请带上户口本</p>
            </div>
        </div>
        <div class="person-list line line-x-b" v-if="order[type].length > 0">
            <ul>
                <li class="line line-x-b" v-for="(passengers, index) in order[type]">
                    <div class="less" @click="deletPassenger(passengers)"></div>
                    <div class="info">
                        <p class="name" v-text="passengers.realName">代用名</p>
                        <p class="number" v-text="passengers.idCard">511xxxxxxxx</p>
                    </div>
                    <!--type：0成人1儿童-->
                    <div class="check-box" v-if="type != 'children' && order[type][index].type != 1 && carryKidSetting.canCarryKid && carryKidSetting.maxNumber" @click="checkCarryKid(index, passengers)">
                        携童
                        <input class="hide" type="checkbox" v-model="order[type][index].carryKid">
                        <i class="icon-check check-left"></i>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            type:{
                default: 'passengers'
            },
            carryKidSetting:null,
            maxBuyNumber:null,
            order:null,
        },
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            jumpToPassenger () {
                this.$emit('jumpToPassenger', this.type)
            },

            deletPassenger (passengers) {
                this.$emit('deletPassenger', passengers, this.type)
            },

            checkCarryKid (index, passengers) {
                this.$emit('checkCarryKid', index, passengers)
            },
        }
    }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  .add-customer {
    width: 100%;
    height: 100px;
    background-color: @c-fff;
    a {
      float: left;
      width: 150px;
      height: 60px;
      line-height: 60px;
      background-color: @bg-2290f9;
      font-size: 26px;
      margin:20px;
    }
    div{
      height: 100px;
      line-height: 100px;
      margin-left:5px;
      font-size: 24px;
      color: @fc-929292;
      float:left;
      p {
        &:first-child{
          margin-top:18px;
          margin-bottom:6px;
        }
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .person-list {
    background-color: @c-fff;
    width: 100%;
    ul {
      width: 100%;
      overflow:hidden;
      li {
        position:relative;
        display:flex;
        width: 100%;
        padding-left:100px;
        height: 100px;
        .less {
          position:absolute;
          left:0;
          top:0;
          width: 100px;
          height: 100px;
          background:url('../../../assets/delete.png') no-repeat center;
          background-size:50px 50px;
        }
        .info {
          flex:1;
          margin-top: 20px;
          p {
            height: 35px;
            line-height: 35px;
          }
          .name {
            font-size: 28px;
            color: @c-121212;
          }
          .number {
            font-size: 24px;
            color: @fc-929292;
          }
        }
        .check-box {
          width:140px;
          height:100px;
          line-height:100px;
          padding-left:50px;
          font-size: 28px;
          .icon-check {
            left: 0;
          }
        }
      }
    }
  }
</style>
