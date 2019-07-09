<template>
  <main-box :title="title" :show-more="false">
      <div class="border line line-x-b" v-for="(reason, index) in cancelReason"
           @click="currentIndex = index"
      >
        <div class="inline-box">
          <span>{{reason}}</span>
          <div class="check-box">
            <input class="hide" type="radio" :value="true" :checked="currentIndex==index">
            <i class="icon-check"></i>
          </div>
        </div>
      </div>

      <textarea class="reason-box"
                v-model="otherReason"
                v-show="currentIndex==5"
                maxlength="50"
                placeholder="还有其它原因吗？悄悄告诉我们吧！（限50字内）"
      ></textarea>

      <div class="mar-t-40 mar20" @click="cancleOrderAndTicket">
        <input type="button" class="button button-primary"
               :disabled="currentIndex==5&&!otherReason"
               value="取消订单"/>
      </div>
  </main-box>
</template>

<script>
    import MainBox from 'components/mainBox/index.vue'

    export default{
        data(){
            return{
                title: this.$route.meta.title,
                orderId:this.$route.query.orderId,
                cancelReason: [
                    '行程变化，不需要用车了', // 0
                    '信息有误需要重新下单', // 1
                    '不是我想要的车型', // 2
                    '车况不满意', // 3
                    '送车员迟到', // 4
                    '其他原因' // 5
                ],
                otherReason: '',
                currentIndex: 0

            }
        },
        components:{
          MainBox,
        },
        methods: {
          cancleOrderAndTicket() {
            let cancelReason = '';
            if(this.currentIndex==5) {
              cancelReason = this.otherReason;
            } else {
              cancelReason = this.cancelReason[this.currentIndex];
            }
            this.$store.dispatch('showConfirm', {
              title: '温馨提醒',
              content: '是否确定要取消订单？',
              onConfirm: () => {
                this.$store.commit('UPDATE_LOADING', true)
                api.cancelRentOrder({
                  orderId:this.orderId,
                  cancelReason: cancelReason
                }).then(res => {
                  const data = TOOL.toJson(res.data)
                  this.$store.commit('UPDATE_LOADING', false)
                  if (data.resultCode == '0') {
                    this.$store.dispatch('showSuccess', '取消订单成功')
                    this.$router.push({
                        name:'rentOrderDetail',
                        query: {
                            orderId: this.orderId
                        }
                    })
                  } else {
                    this.$store.dispatch('showError', data.resultMsg);
                  }
                })
              },
              onCancel: () => {

              }
            })
          }
        }
    }
</script>
<style lang="less" scoped>
  .reason-box {
    width: 100%;
    height: 150px;
    padding: 20px;
    border-bottom: 1PX solid #e5e5e5;
  }
</style>
