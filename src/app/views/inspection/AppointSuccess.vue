<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="b-g-c-5eaaf8 pull-left">
      <div class="appS-box">
        <div class="appS-box-top mar-t-30">
            <p class="appS-f-s-32 appS-f-c pad-t-30" v-if="status==30||status==31||status==32">预约报名成功，请前往预约检测场地</p>
            <p class="appS-f-s-32 appS-f-c pad-t-30" v-if="status==33||status==34">预约服务已取消</p>
            <p class="appS-line-hei-36" v-if="status==33||status==34">可通过预约页面重新预约</p>
            <p class="appS-f-s-32 appS-f-c pad-t-30" v-if="status==35">已完成预约服务</p>
            <p class="appS-line-hei-36" v-if="status==35">如果未完成预约，请及时联系工作人员</p>
            <p class="appS-f-s-50 appS-f-c mar-t-28">{{orderData.callNumber}}</p>
        </div>
        <div class="appS-dash">
          <div class="appS-circle-left"></div>
          <div class="appS-circle-right"></div>
          <div class="appS-dash-center"></div>
        </div>
        <div class="appS-box-bottom">
          <div class="appS-content-title relative">
            <div class="appS-orange-circle"></div>
            <p class="appS-title-one mar-t-35">检测场地</p>
            <p class="appS-p">{{orderData.subStoreDto.name}}</p>
            <!--<div class="appS-map-icon">

            </div>-->
          </div>
          <div class="appS-content-title relative">
            <div class="appS-orange-circle"></div>
            <p class="appS-title-one">预约时间</p>
            <p class="appS-p">{{orderData.serveStartTime.substring(5,7)}}月{{orderData.serveStartTime.substring(8,10)}}日&nbsp;&nbsp;{{orderData.serveStartTime.substring(11,16)}}-{{orderData.serveStopTime.substring(11,16)}}&nbsp;&nbsp;（超时将自动作废）</p>
          </div>
          <div class="appS-content-title relative">
            <div class="appS-orange-circle"></div>
            <p class="appS-title-one">预约车型</p>
            <p class="appS-p">{{orderData.carSubTypeDto.name}}</p>
          </div>
          <div class="appS-content-title relative">
            <div class="appS-orange-circle"></div>
            <p class="appS-title-one">所需材料</p>
            <p class="appS-p" v-html="carMaterial"></p>
            <!--<p class="appS-p">1、机动车行驶证原件</p>-->
            <!--<p class="appS-p">2、机动车交通事故责任强制保险副本</p>-->
            <!--<p class="appS-p">3、车主本人身份证复印件</p>-->
          </div>
          <div class="appS-cancle-btn" @click="handCancel" v-show="status==30||status==32">
            <span>取消预约报名</span>
          </div>
        </div>
      </div>
     <!-- <div class="mar-t-40 mar20">
        <input type="button" class="button button-primary" value="前去选车"/>
      </div>-->
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
        orderId: this.$route.query.orderId,
        status: this.$route.query.status,
        carMaterial: '',
        orderData: {
          carSubTypeDto: {},
          subStoreDto: {},
          serveStartTime: '',
          serveStopTime: ''
        }
      }
    },
    mounted() {
      $('.app-container').css('background', '#5eaaf8');
      this.getInspectionOrderById();
    },
    computed: {

    },
    watch: {

    },
    methods: {
      getInspectionOrderById() {
        api.getInspectionOrderById(this.orderId).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.orderData = data.resultData.order;
            this.status = this.orderData.status;
            this.carInspectionGetMaterial();
            console.log(this.orderData);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      // 查找具体车型的车检材料
      carInspectionGetMaterial() {
        let apiData = {
          subStoreId: this.orderData.subStoreDto.id,
          carTypeUniqueCode: this.orderData.carSubTypeDto.parentType
        };
        api.carInspectionGetMaterial(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.carMaterial = data.resultData;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      handCancel() {
        this.$store.dispatch('showConfirm', {
          content: '是否取消订单！',
          cancelText:'放弃',
          confirmText: '是的',
          onConfirm: () => {
            this.cancelInspection();
          },
          onCancel: () => {

          }
        });
      },
      cancelInspection() {
        this.$store.commit('UPDATE_LOADING', true);
        api.cancelInspection(this.orderId).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.$store.dispatch('showSuccess', '订单已成功取消！');
            setTimeout(() => {
              this.$router.replace({
                name: 'historyOrder'
              })
            }, 1000);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../styles/common.less';
  @import '../../../styles/theme.less';

  .b-g-c-5eaaf8{
    width: 100%;
    background: #5eaaf8;
  }
  .appS-box {
    height: auto;
    margin: 30px 20px 20px 20px;
    border: 1PX solid #e5e5e5;
    border-radius: 8px;
    background: #fff;
  }
  .appS-box-top{
    height:210px;
    text-align: center;
  }
  .appS-f-s-32{
    font-size: 32px;

  }
  .appS-line-hei-36{
    line-height: 36px;
    font-size: 22px;
    color: #888;
  }
  .appS-f-c{
    color: #4c4c4c;
  }
  .appS-title-one {
    color: #4c4c4c;
    font-size: 28px;
  }
  .appS-f-s-50{
    font-size: 50px;
  }
  .appS-dash{
    width:100%;
    height:30px;
    position: relative;
    padding-top: 15px;
  }
  .appS-dash-center{
    width: 640px;
    height:1px;
    margin: 0 auto;
    background: url("../../../assets/dash.png") no-repeat center;
  }
  .appS-circle-left{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #5eaaf8;
    position: absolute;
    top:0;
    left:-15px;
    z-index: 100;
  }
  .appS-circle-right{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #5eaaf8;
    position: absolute;
    top:0;
    right:-15px;
    z-index: 100;
  }
  .appS-f-s-28{
    font-size:28px;
  }
  .appS-f-c-8{
    color: #888;
  }
  .appS-p {
    font-size: 28px;
    color: #888;
    margin-top: 15px;

    line-height: 34px;
  }
  .appS-content-title{
    padding: 0 20px 40px 62px;
  }
  .appS-orange-circle{
    width: 12px;
    height:12px;
    position: absolute;
    left: 30px;
    top:8px;
    background: url("../../../assets/circle-down.png") no-repeat center;
    background-size:cover;
  }
  .appS-map-icon{
    position: absolute;
    right:30px;
    top:0;
    width: 70px;
    height:70px;
    background: url("../../../assets/map-icon.png") no-repeat center;
    background-size:cover;
  }
  .appS-wid-460{
    width: 460px;
  }
  .appS-cancle-btn{
    width: 100%;
    text-align: center;
    height:100px;
    line-height: 100px;
    font-size: 32px;
    color: #888;
    border-top:1PX solid #e5e5e5;
  }
</style>
