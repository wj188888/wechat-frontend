<template>
  <div>
    <c-header :title="title"></c-header>
    <div class="app-container">
      <div class="app-main">
        <div class="mar20">
          <div class="quote-info">
            <p class="clearfix">
              <label>出发地：</label>
              <span>{{enquiryData.aAddress.detailAddress}}</span>
            </p>
            <p class="clearfix">
              <label>目的地：</label>
              <span>{{enquiryData.bAddress.detailAddress}}</span>
            </p>
          </div>
          <div class="quote-info">
            <p class="clearfix">
              <label>出发时间：</label>
              <span>{{ enquiryData.startupTime | formatDate('holeDate') }}</span>
            </p>
            <p class="clearfix">
              <label>返程时间：</label>
              <span>{{ enquiryData.returnTime | formatDate('holeDate') }}</span>
            </p>
            <p class="clearfix">
              <label>包车类型：</label>
              <span v-if="enquiryData.type==0">
        				往返
        			</span>
              <span v-if="enquiryData.type==1">
        				单程
        			</span>
            </p>
            <p class="clearfix">
              <label>出行天数：</label>
              <span>{{enquiryData.travelDays}}天</span>
            </p>
            <p class="clearfix">
              <label>乘车人数：</label>
              <span>{{enquiryData.passengerNumber}}人</span>
            </p>
          </div>
          <div class="quote-info">
            <p class="clearfix">
              <label>手机号码</label>
              <span>{{enquiryData.contactTelephone}}</span>
            </p>
          </div>
          <div class="quote-info" v-if="enquiryData.supplyInvoice||enquiryData.supplySleep||enquiryData.supplyFood">
            <ul>
              <li v-if="enquiryData.supplyInvoice">需要提供纸质发票</li>
              <li v-if="enquiryData.supplySleep">提供司机的住宿</li>
              <li v-if="enquiryData.supplyFood">提供司机的餐饮</li>
            </ul>
          </div>
          <div class="quote-info" v-if="enquiryData.remark">
            <p class="clearfix">
              <em>备注：</em>
              <span>{{enquiryData.remark}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CHeader from 'components/c-header/index.vue'

  export default {
    components: {
      CHeader
    },
    data () {
      return {
        title: this.$route.meta.title,
        enqueryId: '',
        enquiryData: {
          aAddress:{},
          bAddress:{},
        }
      }
    },
    mounted () {
      this.enqueryId = this.$route.query.enqueryId
      this.enquiryFindById()
    },
    methods: {
      /**
       * 定制包车询价查询
       */
      enquiryFindById () {
        api.enquiryFindById(this.enqueryId).then(res => {
          const result = TOOL.toJson(res.data)
          if (result.resultCode == '0') {
            this.enquiryData = result.resultData
          } else {
            this.$store.dispatch('showError', result.resultMsg);
          }
        })
      }
    }
  }
</script>
<style scoped>
  .quote-info {
    padding: 30px 30px 15px 30px;
    background: #fff;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .quote-info p {
    font-size: 28px;
    color: #4c4c4c;
    margin-bottom: 15px;
    display: flex;
  }

  .quote-info p label {
    display: block;
    float: left;
    width: 150px;
    text-align: left;
    line-height: 30px;
  }

  .quote-info p span {
    display: block;
    float: left;
    line-height: 30px;
    flex: 1;
  }

  .quote-info ul li {
    line-height: 25px;
    margin-bottom: 10px;
    font-size: 28px;
  }

  .quote-info ul li:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ff6600;
    border-radius: 50%;
    margin-right: 15px;
    margin-bottom: 10px;

  }
</style>
