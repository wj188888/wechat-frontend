<template>
  <div v-if="scoreRule.id">
    <div class="inline-box line line-x-t mar-t-20">
      <label class="auto-width label-score">
        <p class="p1" @click="showScoreDialogHandle">积分使用<i>?</i></p>
        <p class="p2">有 <em>{{myScore}}</em> 可用积分</p>
        <!--<p class="p2" v-if="myScore >= scoreRule.exchangeIntegral">有 <em>{{myScore}}</em> 可用积分</p>-->
        <!--<p class="p3" v-else>积分满{{scoreRule.exchangeIntegral}}才可使用，当前{{myScore}}积分</p>-->
      </label>
      <!--:disabled="myScore < scoreRule.exchangeIntegral || salePrice <= scoreRule.orderAmountLimit || pickerData.length === 0"-->
      <div v-if="scoreRule.canUseDiscount || (!scoreRule.canUseDiscount && !userCouponId && !activityId)"
      >
        <input class="unui-switch feeder-switch"
               type="checkbox"
               v-if="!(myScore < scoreRule.exchangeIntegral || salePrice <= scoreRule.orderAmountLimit || pickerData.length === 0)"
               :disabled="myScore < scoreRule.exchangeIntegral || salePrice <= scoreRule.orderAmountLimit || pickerData.length === 0"
               :checked="useScore"
               :value="useScore"
               @change="checkScore($event.target.value, pickerIndex[0]+1)"/>
        <div class="unui-switch feeder-switch"
             v-if="myScore < scoreRule.exchangeIntegral || salePrice <= scoreRule.orderAmountLimit || pickerData.length === 0"
             @click="limitTip"></div>
      </div>

      <div class="unui-switch feeder-switch"
             v-if="!(scoreRule.canUseDiscount || (!scoreRule.canUseDiscount && !userCouponId && !activityId))"
             @click="showDisableTips"></div>
    </div>
    <div class="inline-box" v-show="useScore">
      <label class="auto-width label-score">使用{{integralPrice}}积分抵扣 <em>{{scoreRule.exchangeAmount * integralPrice / scoreRule.exchangeIntegral}}</em> 元</label>
      <span class="text-right fc-2390f9" @click="showScorePicker">修改</span>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      scoreRule: {
          default: {}
      },
      userCouponId: '',
      activityId: '',
      useScore: '',
      integralPrice: 0,
      salePrice: 0,
    },
    computed: {

    },
    data () {
      return {
        myScore: 0,
        pickerData: [],
        pickerIndex: [0],
      }
    },
    watch: {
      scoreRule (newVal) {
        if(appStorage.get('userInfo')){
          let usrInfo = JSON.parse(appStorage.get('userInfo'));
          this.myScore = usrInfo.points || 0
        }
        if(newVal && this.myScore){
          let level = Math.floor(this.myScore / newVal.exchangeIntegral)
          this.pickerData = [];
          for (let i = 1; i <= level; i++ ){
            if(newVal.exchangeAmount * i > (this.salePrice * newVal.orderExchangeRate / 100 )) continue
            this.pickerData.push({
              text: newVal.exchangeIntegral * i + '积分',
              value: newVal.exchangeIntegral * i
            });
            this.pickerIndex = [i - 1];
            /*if(newVal.exchangeIntegral * i === this.integralPrice){

            }*/
          }
          this.$emit('changeScore', newVal.exchangeIntegral*(this.pickerIndex[0]+1));
          this.picker = new Picker({
            data: [
              this.pickerData
            ],
            selectedIndex: this.pickerIndex,
            title: '选择积分'
          });

          this.picker.on('picker.select', (selectedVal, selectedIndex) => {
            this.$emit('changeScore', selectedVal[0])
          })
        }
      }
    },
    mounted () {

    },
    methods:{
      showDisableTips () {
        this.$store.dispatch('showError', '积分兑换无法与优惠活动或优惠券同时使用');
      },

      limitTip() {
          if(this.myScore < this.scoreRule.exchangeIntegral) {
              this.$store.dispatch('showError', `积分满${this.scoreRule.exchangeIntegral}才可使用，当前${this.myScore}积分`);
              return false;
          }
          if(this.salePrice <= this.scoreRule.orderAmountLimit) {
              this.$store.dispatch('showError', `订单金额低于${this.scoreRule.orderAmountLimit}元（不含服务费）不能使用积分`);
              return false;
          }
      },

      checkScore (value, length) {
        if(this.myScore < this.scoreRule.exchangeIntegral || this.salePrice <= this.scoreRule.orderAmountLimit || this.pickerData.length === 0) {
            this.useScore = !this.useScore;
            return false;
        }
        this.$emit('change', value, length)
      },

      showScorePicker () {
        this.picker.show()
      },

      showScoreDialogHandle () {
        this.$emit('showScoreDialogHandle')
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../styles/theme.less";
  @import "../../../styles/switch.less";
  .label-score{
    .p1 i{
      display: inline-block;
      margin-left:10px;
      width:26px;
      height:26px;
      line-height:26px;
      text-align:center;
      color: @fc-fff;
      background-color: @bg-ccc;
      font-size:20px;
      border-radius: 50%;
      vertical-align: text-bottom;
    }
    .p2{
      font-size:24px;
      color: @fc-888;
      em{
        color: @fc-ff6600;
      }
    }
    .p3{
      font-size:24px;
      color: @fc-ff6600;
    }
    em{
      color: @fc-ff6600;
    }
  }
  .fc-2390f9{
    color: @fc-2290f9;
  }
  .integral-limit {
    height: 140px;
    line-height: 140px;
    padding: 0;
    text-align: right;
  }
  .empty-span {
    width: 55PX;
  }
</style>
