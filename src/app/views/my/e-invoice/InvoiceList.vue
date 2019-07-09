<template>
    <main-box :title="title" :show-more="false">
      <router-link class="hd-cancel" slot="title" :to="{name: 'invoiceHistory'}">开票记录</router-link>
      <div class="scroll-box">
      <div class="invoice-tip">
        目前企业暂不支持开具发票，已申请的发票会按流程完成
      </div>
      <div class="order-list-box flex-1">
        <scroll ref="scroll"
                :pullUpLoad="true"
                @pullingUp="onPullingUp">
          <div>
            <div class="ticket-order">
              <ul class="order-list">
                <li class="line line-x" :class="{'mar-t-0':data.dataShow}"
                    v-for="data in invoiceLists">
                  <p class="c-f-4c4c4c f-s-28  pad-l-20 pad-tb-20"
                     v-if="data.dataShow"
                     style="background: #f6f6f6">{{data.dataShow}}月</p>
                  <div class="flex-li">
                    <div class="mes-left">
                      <div class="check-item line-box radius-box">
                        <div class="check-box">
                          <label>
                            <input class="hide" type="checkbox" :value="22"
                                   @change="selectOne(data)" v-model="data.checked"/>
                            <i class="icon-com"></i>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="mes-center">
                      <div class="hd clearfix mar-t-25 mar-b-25 f-s-26 pad-0" style="height: auto">
                        <span class="text-gray">{{data.productTypeLevelTwo | getProductTwoName}}&nbsp;&nbsp;{{data.startupTime.substring(0,16)}}</span>
                      </div>
                      <div class="bd pad-0">
                        <div class="order-station f-s-28 mar-b-15">
                          <i class="start-dian mar-r-10"></i>
                          <span>{{data.aAddress.city}}&nbsp;</span>
                          <em class="dian" v-if="data.aAddress.detailAddress"></em>
                          <span class="rental-address-limit" v-if="data.aAddress.detailAddress">&nbsp;{{data.aAddress.detailAddress}}</span>
                        </div>
                        <div class="order-station f-s-28 off-station">
                          <i class="end-dian mar-r-10"></i>
                          <span>{{data.bAddress.city}}&nbsp;</span>
                          <em class="dian" v-if="data.bAddress.detailAddress"></em>
                          <span class="rental-address-limit" v-if="data.bAddress.detailAddress">&nbsp;{{data.bAddress.detailAddress}}</span>
                          <!--<span class="rental-address-limit" v-if="data.bAddress.stationName">&nbsp;{{data.bAddress.stationName}}{{data.bAddress.name}}</span>
                          <span class="rental-address-limit" v-else>&nbsp;{{data.bAddress.name}}</span>-->
                        </div>
                      </div>
                    </div>
                    <div class="mes-right text-right f-s-32 relative">
                      <P class="money-position yuan"><em class="money">{{data.actualPayment | formatPrice('normal')}}</em>元</P>
                    </div>
                  </div>

                </li>
              </ul>
            </div>
          </div>

        </scroll>
      </div>
      </div>
      <div slot="footer">
        <div class="abs-bottom-box line line-x-t">
          <div class="buy-left clearfix">
            <div class="check-item line-box radius-box ">
              <div class="check-box">
                <label class="f-s-32">
                  <input class="hide" type="checkbox" :value="22" v-model="checkedAll" @change="selectAll"/>
                  <i class="icon-com"></i>
                  全选
                </label>
              </div>
            </div>
            <span class="f-s-28 c-f-888 mar-l-30 total">
              <em class="c-f-f60">{{totalTrip}}&nbsp;</em>个行程，共<em class="c-f-f60">&nbsp;{{totalMoney | formatPrice('normal')}}&nbsp;</em>元
            </span>
          </div>
          <div class="buy-right">
            <input type="button" class="button button-primary"
                   @click="jumpToNext('11111111')" value="下一步"/>
          </div>
        </div>
      </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import Scroll from 'components/betterScroll/scroll/scroll'
    import { XDialog } from 'vux'

    let date = '';
    export default {
        components: {
            MainBox,
            Scroll,
            XDialog
        },
        watch: {
          invoiceLists: {
            handler: function(newVal) {
                console.log(newVal);
            },
            deep: true
          }
        },
        data () {
            return {
                title: this.$route.meta.title,
                searchKeys: {
                  pageNo: 0,
                  pageSize: 20
                },
                invoiceLists:[],
                checkedAll:false,
                invoiceIds:[],
                invoiceDatas:[],
                totalTrip:0,
                totalMoney:0
            }
        },
        mounted () {
            this.initialize();
            this.storeId = appStorage.get('StoreId');
        },
        methods: {
            initialize () {
              this.searchKeys.pageNo = 0
              this.onPullingUp()
              if(!appStorage.get('isKnowInvoice')){
                this.firstConfirm();
              }
            },

          /**
           * 下拉刷新
           */
          onPullingUp () {
            if(this.searchKeys.pageNo === 0){
              this.invoiceLists = []
              this.loadPageList()
              this.$refs.scroll.scrollTo(0, 0)
            }else{
              setTimeout(()=>{
                this.loadPageList()
              }, 1000)
            }
          },
          loadPageList () {
            if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
              this.$refs.scroll.forceUpdate()
              return
            }
            console.log(this.searchKeys.pageSize);
            api.findUninvoicedOrder(this.searchKeys).then(res=>{
              const data = TOOL.toJson(res.data)
              if (data.resultCode === '0') {
                this.totalPage = data.resultData.totalPages
                this.invoiceLists = this.invoiceLists.concat(data.resultData.content);
                for(let value of this.invoiceLists.values()){
                    if(date !== value.startupTime.substring(0,7)){
                      value.dataShow =  value.startupTime.split(' ')[0].split('-')[1];
                      date = value.startupTime.substring(0,7);
                    }
                  value.checked = false;
                }
                console.log(this.invoiceLists);
                setTimeout(() => {
                  if(this.$refs.scroll){
                    this.$refs.scroll.forceUpdate(true)
                  }
                }, 20)
                if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
                  this.searchKeys.pageNo++
                }
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            })
          },

          isRepeat (id) {
            for(var x in this.invoiceIds) {
              if(id == this.invoiceIds[x]) {
                return x;
              }
            }
            return -1;
          },

          selectAll () {
            this.totalMoney = 0;
            if(this.checkedAll) {
              for (let [index,val] of this.invoiceLists.entries()){
                val.checked = true;
                if(this.isRepeat(val.id) == -1) {
                  this.invoiceIds.push(val.id);
                  this.invoiceDatas.push(val);
                }
              }
            } else {
              for (let [index,val] of this.invoiceLists.entries()){
                val.checked = false;
                var x = this.isRepeat(val.id);
                if(x > -1) {
                  this.invoiceIds.splice(x, 1);
                  this.invoiceDatas.splice(x, 1);
                }
              }
            }
            this.totalTrip = this.invoiceIds.length;
            for(let [index,val] of this.invoiceDatas.entries()){
              this.totalMoney += Number(val.actualPayment)
            }
          },

          selectOne (data) {
            this.totalMoney = 0;
            if(data.checked && this.isRepeat(data.id) == -1) {
              this.invoiceIds.push(data.id);
              this.invoiceDatas.push(data);
            }
            if(!data.checked) {
              var x = this.isRepeat(data.id);
              if(x > -1) {
                this.invoiceIds.splice(x, 1);
                this.invoiceDatas.splice(x, 1);
              }
              this.checkedAll = false;
            }
            this.totalTrip = this.invoiceIds.length;
            for(let [index,val] of this.invoiceDatas.entries()){
              this.totalMoney += Number(val.actualPayment)
            }
          },

          /*
           * 首次弹窗提醒
           * */
          firstConfirm() {
            this.$store.dispatch('showAlert',{
              title:'开票说明',
              content:'行程消费中包含的代金券、过路过桥费、高速费、停车费不支持开具发票，企业支付的行程也不支持开票。',
              buttonText:'我知道了',
              onHide: () => {
                  appStorage.set('isKnowInvoice', JSON.stringify('true'))
              }
            })
          },

          jumpToNext (orderIds) {
              if(this.invoiceIds.length === 0){
                  this.$store.dispatch('showError', '请选择至少一个开票订单');
                  return;
              }
              appStorage.set('invoiceIds',JSON.stringify(this.invoiceIds));
              appStorage.set('totalMoney',JSON.stringify(this.totalMoney));
              this.$router.push({
                  name: 'writeInvoice',
                  query: {
                    orderIds: orderIds
                  }
              })
          }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../../styles/theme.less";


    .order-list-box {
      position: relative;
    }
    .scroll-box {
      display: flex;
      flex-direction: column;

      height: 100%;
    }
    .flex-1 {
      height: 0;
      flex: 1;
      margin-bottom: 160px;
    }
    .flex-li{
       display: flex;
      flex-wrap: nowrap;
      height: 170px;
      align-items: center;
      padding: 0 30px;
      .mes-left{
        width: 50px;
        height:100%;
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
      }
      .mes-center{
        flex:1;
        height:100%;
      }
      .mes-right{
        width: 150px;
        height:100%;
      }
      .icon-com{
        left: 0 ;
        top:70px ;
      }
    }
    .start-dian {
      width: 30px;
      height:30px;
      background-color: transparent !important;
      background: url("../../../../assets/order_start.png") no-repeat left center;
      background-size: 100% 100%;
    }
    .end-dian {
      width: 30px;
      height:30px;
      background-color: transparent !important;
      background: url("../../../../assets/order_end.png") no-repeat left center;
      background-size: 100% 100%;
    }
  .dian{
    display: inline-block;
    width: 5px;
    height:5px;
    background: #121212;
    border-radius: 50%;
    vertical-align: middle;
  }
  .money{
    font-size:28px;
    color: #ff6600;
  }
  .yuan{
    font-size:28px;
    color: #4c4c4c;
  }
  .money-position{
    position: absolute;
    bottom:0;
    right:0;
    margin-bottom: 20px;
  }
  .invoice-tip{
    font-size:26px;
    color: #f60;
    height:100px;
    width: 100%;
    padding: 0 40px;
    line-height: 100px;
    background: #fff;
  }
  .abs-bottom-box{
    height:130px;
  }
  .buy-left{
    height:100%;
    .check-item{
      padding-left: 30px;
      margin-bottom: 0;
    }
    .icon-com{
      left: 0;
      top:30px;
    }
    .check-box{
      padding-left: 50px;
      height:auto;
      line-height: normal;
    }
    label{
      margin-left: 0;
      margin-top: 30px;
    }
    .total{
      line-height: normal;
      margin-top: 15px;
    }
  }
  .buy-right{
    height:100%;
    line-height: 130px;
    input{
      height:100% !important;
    }
  }

</style>
