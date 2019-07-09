<template>
  <main-box :title="title" :show-more="false" main-class="scrollingBox has-abs-bottom">
    <router-link slot="title" class="hd-cancel" :to="{name: 'expressList'}">{{right_title}}</router-link>
    <div class="inline-box line">
      <label>寄件城市：</label>
      <input type="text" placeholder="请选择寄件城市" @click="jumpToCitySearch('startPlace')" readonly v-model="searchKeys.startPlace"/>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t">
      <label>收件城市：</label>
      <input type="text" placeholder="请选择收件城市" @click="jumpToCitySearch('endPlace')" readonly v-model="searchKeys.endPlace"/>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t mar-b-20">
      <label>寄件时间：</label>
      <input type="text" placeholder="请选择寄件时间" v-Mobidatetime:dateStart="ExpressOrderAddDTO.pickUpDate" readonly/>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t">
      <label>寄件人：</label>
      <input type="text" placeholder="请填写寄件人姓名" v-model="ExpressOrderAddDTO.contactName" maxlength="5"/>
    </div>
    <div class="inline-box line line-x-t">
      <label>手机号码：</label>
      <input type="tel" placeholder="请填写寄件人手机号码" v-model.number="ExpressOrderAddDTO.contactTelephone" maxlength="11"/>
    </div>
    <div class="inline-box line line-x-t">
      <label>寄件地址：</label>
      <input type="text" placeholder="请填写寄件地址" readonly v-model="ExpressOrderAddDTO.pickUpAddress" @click="jumpToStation"/>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t">
      <label>物品名称：</label>
      <input type="text" placeholder="请填写您的物品名称" v-model="ExpressOrderAddDTO.goods" maxlength="15"/>
    </div>
    <div class="inline-box line line-x-t mar-b-20">
      <label>备注：</label>
      <input type="text" placeholder="请填写您要填写的备注信息" v-model="ExpressOrderAddDTO.remark" maxlength="20"/>
    </div>
    <div class="inline-box line line-x-t">
      <label>寄件须知：</label>
      <input type="text" readonly @click="JumpToNotice"/>
      <i class="icon-r-jt"></i>
    </div>
    <div class="inline-box line line-x-t pick-up-tickets">
      <span class="pull-left">服务费：</span>
      <div class="pull-right">
        <p class="pickUpFee" v-show="chargeMethod == '0'&&ExpressOrderAddDTO.pickUpAddress" :class="{'mar-active' : chargeMethod == '1', 'line-height-100' : chargeMethod == '0'}">
          <span v-if="ExpressOrderAddDTO.pickUpFee">{{ExpressOrderAddDTO.pickUpFee}}元</span>
          <span v-if="!ExpressOrderAddDTO.pickUpFee">免费</span>
        </p>
        <div class="payPickUpFeeOnOrder mar-showTit-active line-height-30" v-show="chargeMethod == '1'&&ExpressOrderAddDTO.pickUpAddress" >
          上门取货
          <p v-if="ExpressOrderAddDTO.pickUpFee">{{ExpressOrderAddDTO.pickUpFee}}元</p>
          <p v-if="!ExpressOrderAddDTO.pickUpFee">免费</p>
        </div>
      </div>
    </div>
    <div slot="footer" class="abs-bottom-box">
      <div class="buy-left" v-show="chargeMethod == '0'&&ExpressOrderAddDTO.pickUpFee">
        <label>预付</label>
        <span v-show="ExpressOrderAddDTO.pickUpAddress" v-text="'¥' + ExpressOrderAddDTO.pickUpFee">¥0</span>
      </div>
      <div class="buy-right" :class="{'buy-w100': chargeMethod=='1'||chargeMethod == '0'&&!ExpressOrderAddDTO.pickUpFee}">
        <input type="button" class="button button-primary button-no-radius" @click="applyCharter" value="确认提交"/>
      </div>
    </div>
  </main-box>
</template>
<script>
  import MainBox from 'components/mainBox/index.vue'
  import { mapState } from 'vuex'
  import Mobidatetime from 'directives/mobiDateTime'
  const now = new Date(new Date().getTime() + 40 * 60000);
  export default {
    directives: {
      Mobidatetime
    },
    components: {
      MainBox
    },
    data() {
      return {
        title: this.$route.meta.title,
        pageRouter: this.$route.name,
        right_title: '我的快递',
        chargeMethod: 1,
        ExpressOrderAddDTO: {
          pickUpDate: '',
          goods: '',
          remark: '',
          pickUpFee: '',
          contactName: '',
          contactTelephone: '',
          pickUpAddress: '',
          pickUpLatitude: '',
          pickUpLongitude: '',
          productId: ''
        },
        searchKeys: {
          startPlace: '',
          endPlace: '',
          startTime: ''
        },
        dateStart: {
          min: now,
          max: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
          yearSuffix: '年',
          daySuffix: '日',
          dateWheels: '|MM dd DD|',
          dateFormat: 'yy-mm-dd',
          timeWheels: 'HHii',
          steps: {
            minute: 10,
            zeroBased: true
          }
        }
      }
    },
    computed: {
      ...mapState({
        appCity: state => state.city.appCity,
      })
    },
    watch: {
      //定位城市初始化赋值
//			appCity (newVal, val) {
//				this.location = newVal
//				this.searchKeys.startPlace = newVal
//			}
    },
    mounted () {
      let localData = {};
      if (appStorage.get('EXPRESS')) {
        localData = JSON.parse(appStorage.get('EXPRESS'));
      }
      this.location = appStorage.get('appCity')
      
      if(appStorage.get('ExpressOrderAddDTO')) {
        this.ExpressOrderAddDTO = JSON.parse(appStorage.get('ExpressOrderAddDTO'));
      }
      
      if(appStorage.get(this.pageRouter)) {
        let pageRouterData = JSON.parse(appStorage.get(this.pageRouter));
        if(pageRouterData.bAddress) {
          if(pageRouterData.bAddress.county) {
            this.searchKeys.endPlace = pageRouterData.bAddress.county;
          } else {
            this.searchKeys.endPlace = pageRouterData.bAddress.city;
          }
        }
        this.ExpressOrderAddDTO.bAddress = pageRouterData.bAddress;
        if(!this.ExpressOrderAddDTO.aAddress) {
          this.ExpressOrderAddDTO.aAddress = {};
        }
        this.ExpressOrderAddDTO.aAddress.city = appStorage.get('startPlace');
        this.searchKeys.startPlace = appStorage.get('startPlace')
        if(appStorage.get(this.pageRouter + 'price')) {
          this.ExpressOrderAddDTO.pickUpFee = JSON.parse(appStorage.get(this.pageRouter + 'price'));
        }
        this.chargeMethod = pageRouterData.chargeMethod;
        this.ExpressOrderAddDTO.productId = pageRouterData.productId;
        if(pageRouterData.expressStation) {
          this.ExpressOrderAddDTO.pickUpAddress = pageRouterData.expressStation.name;
          this.ExpressOrderAddDTO.pickUpLatitude = pageRouterData.expressStation.latitude;
          this.ExpressOrderAddDTO.pickUpLongitude = pageRouterData.expressStation.longitude;
        }
      }
    },
    methods: {
      /**
       *  存储数据
       */
      saveFrom() {
        let localData = this.ExpressOrderAddDTO;
        appStorage.set('ExpressOrderAddDTO', JSON.stringify(localData));
      },
      /**
       * 清除本地订单数据
       */
      deleteForm () {
        appStorage.remove('ExpressOrderAddDTO');
        appStorage.remove(this.pageRouter);
        appStorage.remove(this.pageRouter + 'price');
      },
      /**
       * 跳到定位城市选择界面
       */
      jumpToLocationSearch () {
        this.saveFrom();
        this.$router.push({
          name: 'pageLocation',
          query: {
            page: 'city',
            placeType: 'appCity'
          }
        })
      },
      /**
       * 跳到城市选择界面
       */
      jumpToCitySearch (place) {
        this.saveFrom();
        let query = {page: this.pageRouter, placeType: place, productId: this.ExpressOrderAddDTO.productId}
        if (place == 'endPlace') {
          var validata = TOOL.formValidate([
            {value: this.searchKeys.startPlace, emptyTips: '请选择寄件城市'}
          ]);
          if (!validata.valid) {
            this.$store.dispatch('showError', validata.msg);
            return false;
          }
          
          query.source = this.searchKeys.startPlace
          
          this.$router.push({
            name: 'expressCity',
            query: query
          })
        } else {
          //如果重新选择出发地要清除目的地
          let localData = {};
          if (appStorage.get(this.pageRouter)) {
            localData = JSON.parse(appStorage.get(this.pageRouter));
          }
          localData.endPlace = '';
          localData.bAddress = '';
          if(localData.expressStation) {
            localData.expressStation = {};
          }
          appStorage.set(this.pageRouter, JSON.stringify(localData))
          
          this.searchKeys.endPlace = TOOL.placeHolder.endPlace;
          
          this.$router.push({
            name: 'expressCity',
            query: query
          })
        }
      },
      /**
       * 跳到接送站点选择界面
       */
      jumpToStation() {
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择寄件城市'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择收件城市'}
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.saveFrom();
        let query = {
          fromPage: this.pageRouter,
          dataKey: 'expressStation',
          productId: this.ExpressOrderAddDTO.productId,
          searchCity: this.searchKeys.startPlace
        }
        this.$router.push({
          name: 'appointStation',
          query: query
        })
      },
      /**
       * 跳转到寄件须知
       */
      JumpToNotice () {
        this.saveFrom();
        let validata = TOOL.formValidate([
          {value: this.searchKeys.startPlace, emptyTips: '请选择寄件城市'},
          {value: this.searchKeys.endPlace, emptyTips: '请选择收件城市'}
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.$router.push({
          name: 'expressNoticeDelivery',
          query: {
            page: this.pageRouter
          }
        })
      },
      /**
       * 提交
       */
      applyCharter () {
        if (!appStorage.get('X-Auth-Token')) {
          TOOL.login()
          return;
        }
        let validJson = this.ExpressOrderAddDTO;
        let validata = TOOL.formValidate([
          {value: validJson.pickUpDate, emptyTips: '寄件日期不能为空'},
          {value: validJson.contactTelephone, emptyTips: '手机号码不能为空', regName: 'telephone', regTips: '手机号码格式不正确'},
          {value: validJson.goods, emptyTips: '物品名称不能为空'},
          {value: validJson.pickUpFee, emptyTips: '请选择寄件城市'},
          {value: validJson.contactName, emptyTips: '联系人名称不能为空'},
          {value: validJson.pickUpAddress, emptyTips: '寄件地址不能为空'},
          {value: validJson.pickUpLatitude, emptyTips: '请选择寄件城市'},
          {value: validJson.pickUpLongitude, emptyTips: '请选择寄件城市'}
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        if(this.ExpressOrderAddDTO.pickUpDate.length == 16) {
          this.ExpressOrderAddDTO.pickUpDate = this.ExpressOrderAddDTO.pickUpDate + ":00";
        }
        
        this.ExpressOrderAddDTO.orderSource = TOOL.browserType()
        api.expressOrderCreate(this.ExpressOrderAddDTO).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode == '0') {
            this.deleteForm();
            this.$router.replace({
              name: 'expressOrderDetail',
              query: {
                orderId: data.resultData
              }
            })
          }else{
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .abs-bottom-box {
    .buy-left {
      label {
        font-size: 28px;
        color: #383A3E;
      }
      span {
        font-size: 28px;
        color: #ff6600;
      }
    }
  }
  .pick-up-tickets {
    .pull-right {
      .pickUpFee {
        font-size: 28px;
        color: #ff6600;
      }
      .payPickUpFeeOnOrder {
        font-size: 24px;
        color: #888888;
      }
    }
  }
  .line-height-100 {
    line-height: 100px;
  }
  .mar-active {
    margin: 10px 0 20px 0;
  }
  .mar-showTit-active {
    margin: 20px 0 20px 0;
  }
  .line-height-30 {
    line-height: 30px;
  }
  .inline-box {
    label {
      font-size: 28px;
      color: #4c4c4c;
      width: auto;
    }
    input {
      font-size: 28px;
      color: #121212;
    }
  }
  .hd-cancel {
    font-size: 32px;
    color: #4c4c4c;
  }
</style>