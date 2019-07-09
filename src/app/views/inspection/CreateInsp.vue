<template>
  <main-box :title="title" main-class="scrollingBox has-abs-bottom">
    <div class="insp-box">
      <div class="insp-srv-type">
        <div class="insp-srv-item" :class="{'insp-srv-item-active':serveType == 'visit'}"
             @click="switchServeType('visit')"
        >
          上门服务
          <span class="insp-aLine"></span>
        </div>
        <div class="insp-srv-item" :class="{'insp-srv-item-active':serveType == 'appoint'}"
             @click="switchServeType('appoint')"
        >
          预约服务
          <span class="insp-aLine"></span>
        </div>
      </div>
      <!--上门服务填写-->
      <div v-show="serveType == 'visit'">
        <div class="insp-info-box">
          <div class="insp-info-l-icon start-dian"></div>
          <div class="insp-info-r-box" @click="jumpToSetPosition(`to`)">
            <p class="insp-info-r-filed">取/还车地点</p>
            <p class="insp-info-r-msg">
              {{localData.to.detailAddress}}
            </p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon time"></div>
          <div class="insp-info-r-box" v-mobidatetime:startConfig="inspection.pickUpTime">
            <p class="insp-info-r-filed">上门时间</p>
            <p class="insp-info-r-msg" v-show="inspection.pickUpTime">{{inspection.pickUpTime | formatInspectionTime}}</p>
            <p class="insp-info-r-msg c-f-ccc" v-show="!inspection.pickUpTime">请选择上门时间</p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon person"></div>
          <div class="insp-info-r-box" @click="showTelDialog = true">
            <p class="insp-info-r-filed">联系电话</p>
            <p class="insp-info-r-msg">{{inspection.carInspectionOwnerName}} - {{inspection.carInspectionOwnerPhone}}</p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon car"></div>
          <div class="insp-info-r-box">
            <p class="insp-info-r-filed">车辆型号</p>
            <div class="insp-info-r-msg" @click="openBigPickerVisit">
              <p v-show="!inspection.bigTypeNameVisit||inspection.bigTypeNameVisit=='请选择检测大类'" class="c-f-ccc">请选择车辆型号</p>
              <p v-show="inspection.bigTypeNameVisit&&inspection.bigTypeNameVisit!='请选择检测大类'">
                <span>{{inspection.bigTypeNameVisit}}</span> - <span >{{inspection.smallTypeNameVisit}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!--预约服务填写-->
      <div v-show="serveType == 'appoint'">
        <div class="insp-appoint-tip">
          <p class="insp-appoint-tip-p">“无须排队、即到即检、价格透明”</p>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon start-dian"></div>
          <div class="insp-info-r-box" @click="openPicker">
            <p class="insp-info-r-filed">预约场地选择</p>
            <p class="insp-info-r-msg">{{inspection.siteName}}</p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon time"></div>
          <div class="insp-info-r-box" @click="selectServeTime">
            <p class="insp-info-r-filed">预约时间</p>
            <p class="insp-info-r-msg" v-show="inspection.serveStartTime">
              {{inspection.serveStartTime | formatInspectionTime}}
              &nbsp;至&nbsp;
              {{inspection.serveStopTime | formatInspectionTime}}
            </p>
            <p class="insp-info-r-msg c-f-ccc" v-show="!inspection.serveStartTime">
              请选择服务时间
            </p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon person"></div>
          <div class="insp-info-r-box" @click="showTelDialog = true">
            <p class="insp-info-r-filed">联系电话</p>
            <p class="insp-info-r-msg">{{inspection.carInspectionOwnerName}} - {{inspection.carInspectionOwnerPhone}}</p>
          </div>
        </div>
        <div class="insp-info-box">
          <div class="insp-info-l-icon car"></div>
          <div class="insp-info-r-box">
            <p class="insp-info-r-filed">车辆型号</p>
            <div class="insp-info-r-msg" @click="openBigPickerAppoint">
              <p v-show="!inspection.bigTypeNameAppoint||inspection.bigTypeNameAppoint=='请选择检测大类'" class="c-f-ccc">请选择车辆型号</p>
              <p v-show="inspection.bigTypeNameAppoint&&inspection.bigTypeNameAppoint!='请选择检测大类'">
                <span>{{inspection.bigTypeNameAppoint}}</span> - <span >{{inspection.smallTypeNameAppoint}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="line line-x-t" v-show="inspection.totalPrice>0" @click="showPriceDialog = true">
        <p class="insp-price" :class="{'pad-b-32':inspection.couponPrice<=0}">合计&nbsp;<span class="f-s-40">{{inspection.totalPrice}}</span>&nbsp;元</p>
        <p class="insp-coupon-price" v-show="inspection.couponPrice>0">
          已优惠&nbsp;<span class="c-f-f60">{{inspection.couponPrice}}</span>&nbsp;元
          <span v-show="inspection.totalPrice>0">&nbsp;{{whetherAllowRefund==1?'不允许退款':'允许退款'}}</span>
        </p>
      </div>
    </div>



    <div class="mar-t-40 mar20" v-show="serveType == 'visit'"
         @click="createVisitOrder"
    >
      <input type="button" class="button button-primary" :value="btnText"/>
    </div>
    <div class="mar-t-40 mar20" v-show="serveType == 'appoint'"
         @click="createAppointOrder"
    >
      <input type="button" class="button button-primary" :value="btnText"/>
    </div>





    <div slot="footer">
      <div class="insp-fixed" @click="jumpHistoryOrder">
        查看年检记录
      </div>
      <div class="dialog-demo" v-show="showPriceDialog">
        <div class="company-quote">
          <h1 class="company-quote-tit">费用明细</h1>
          <p class="price-total">
            <em>{{inspection.totalPrice | formatPrice('normal')}}</em>
            <i> 元</i>
          </p>
          <div class="company-quote-table">
            <div class="company-text mar-t-10" v-for="(priceObj, index) of priceFields">
              <p>{{priceObj.name}}</p>
              <p><span v-if="priceObj.type==0">- </span>{{priceObj.value | formatPrice('normal')}}元</p>
            </div>
            <div class="company-text mar-t-10">
              <p>是否允许退款</p>
              <p>{{whetherAllowRefund==1?'不允许退款':'允许退款'}}</p>
            </div>
          </div>
        </div>
        <div class="close-icon" @click="showPriceDialog = false"></div>
      </div>
    </div>

    <x-dialog :show="showTelDialog" class="tel-dialog">
      <div class="tel-dialog-body line line-x-b">
        <a class="close" @click="showTelDialog = false"></a>
        <p class="tips">
          请输入联系电话和姓名
          <span class="error" v-show="errorPhoneText">{{errorPhoneText}}</span>
        </p>
        <div class="telephone line line-x-b">
          <input type="text" placeholder="请输入姓名"
                 maxlength="11" v-model="inspection.carInspectionOwnerName">
        </div>
        <div class="telephone line line-x-b">
          <input type="tel" placeholder="请输入手机号码"
                 maxlength="11" v-model="inspection.carInspectionOwnerPhone">
        </div>
      </div>
      <input type="button" value="确定" @click="setTelephone" class="button button-no-radius button-empty-white">
    </x-dialog>
  </main-box>
</template>

<script>
  import MainBox from 'components/mainBox/index.vue'
  import {XDialog} from 'vux'
  import Mobidatetime from 'directives/mobiDateTime'
  import { mapState } from 'vuex'

  const now = new Date();
  export default {
    components: {
      MainBox,
      XDialog
    },
    directives: {
      Mobidatetime,
    },
    data() {
      return {
        title:this.$route.meta.title,
        pageRouter: this.$route.name,
        serveType: 'visit', // 默认服务类型是上门，appoint预约服务 visit上门服务
        hasVisit: false,
        hasAppoint: false,
        errorPhoneText: '',
        showTelDialog: false,
        showPriceDialog: false,
        whetherAllowRefund: 0, // 是否支持退款
        startConfig: TOOL.getDateTimeConfig(),
        localData: {
          from:{},
          to:{
            county:'',
            city:'',
            province:'',
            detailAddress:'定位中...',
            lat:'',
            lng:''
          },
          getSite: {},
          returnSite: {},
          aAddress: {},
          bAddress: {}
        },
        // payForm+payType+serveType
        payNames: {
          '000': '支付并发布请求', // 检前付款线上 上门
          '100': '发布请求', // 检后付款线上 上门
          '110': '发布请求', // 检后付款线下 上门
          '001': '支付并发布请求', // 检前付款线上 预约
          '111': '发布请求', // 检后付款线下 预约
        },
        btnText: '发布请求',
        allSites: [], // 所有的检测点
        sitePicker: '',
        sitePickerData: [],
        sitePickerIndex: '',
        serveTimePicker: '',
        priceData: {},
        priceFields: [
          {filed:'couponAmount',name:'优惠券折扣',value:0,type:0}, // type=0表示折扣
          {filed:'activityAmount',name:'活动折扣',value:0,type:0},
        ],
        carTypeObjAppoint: {}, // 车辆大类型对象 预约
        carBigTypePickerAppoint: '', // 车辆大类型  预约
        carSmallTypePickerAppoint: '', // 车辆小类型  预约
        carBigTypeArrAppoint: [], // 车辆大类型数组  预约
        carSmallTypeArrAppoint: [], // 车辆小类型数组  预约
        carSmallTypeArrAppointSpe: [], // 车辆小类型数组  预约
        carBigTypePickerVisit: '', // 车辆大类型  上门
        carSmallTypePickerVisit: '', // 车辆小类型  上门
        carBigTypeArrVisit: [], // 车辆大类型数组  上门
        carSmallTypeArrVisit: [], // 车辆小类型数组  上门
        carSmallTypeArrVisitSpe: [], // 车辆小类型数组  上门
        visitIndexOne: 0, // 车辆选择预约服务 大类的索引
        appointIndexOne: 0, // 车辆选择上门服务 大类的索引
        pickUpTimeObj: {},
        serveStartTimeObj: {},
        serveStopTimeObj: {},
        inspection: {
          carInspectionOwnerPhone: '', // 联系电话
          carInspectionOwnerName: '隔壁老王', // 联系姓名
          pickUpAddress: {},
          pickUpTime: '', // 取车时间
          serveStartTime: '', // 预约开始时间
          serveStopTime: '', // 预约结束时间
          siteName: '', // 检测场地名字
          subStoreId: '', // 检测场地id
          subStoreIdAppoint: '', // 预约检测场地id
          subStoreIdVisit: '', // 上门检测场地id
          carInspectionProductIdAppoint: '', // 检测车型id
          carInspectionProductIdVisit: '', // 检测车型id
          totalPrice: 0,
          totalPriceVisit: 0,
          totalPriceAppoint: 0,
          couponPrice: 0,
          couponPriceVisit: 0,
          couponPriceAppoint: 0,
          payForm: 0,
          payType: 0,
          payFormVisit: 0,
          payTypeVisit: 0,
          payFormAppoint: 0,
          payTypeAppoint: 0,
          parentType: '',
          bigTypeNameAppoint: '请选择检测大类',
          smallTypeNameAppoint: '请选择检测小类',
          bigTypeNameVisit: '请选择检测大类',
          smallTypeNameVisit: '请选择检测小类',
        }
      }
    },
    mounted() {
        console.log(interfaceApi);
      if(this.appAddress && this.appAddress !== TOOL.locationFail){
        this.setStartPlace(this.appAddress);
        this.getParentTypesByStore();
      }
      if(appStorage.get(this.pageRouter)) {
        this.localData = JSON.parse(appStorage.get(this.pageRouter));
        if(this.localData.to.lat) {
          this.getParentTypesByStore();
        }
      }
      this.checkCarInsMode();
      this.getCarInspectionOwnerInfo();
      this.checkUserCanOrder();
      this.initServeTime();
    },
    computed: {
      ...mapState({
        appAddress: state => state.city.appAddress
      })
    },
    watch: {
      appAddress(newVal) {
        if(!this.localData.to.city && newVal !== TOOL.locationFail) {
          this.setStartPlace(newVal);
          this.getParentTypesByStore();
        }
      },
      'inspection.serveStartTime'(newVal) {
        let newDate = TOOL.changeDateStyle(newVal);
        let dateObj = new Date(newDate);
        let stopObj = new Date(dateObj.getTime() + 3600000);
        let stopDate = TOOL.getCurrentTime(stopObj);
        this.inspection.serveStopTime = stopDate;

        this.checkReserveTimeValid();
      },
    },
    methods: {
      setStartPlace(newVal) {
        this.localData.to.city = newVal.city;
        this.localData.to.lat = newVal.position.lat;
        this.localData.to.lng = newVal.position.lng;
        this.localData.to.county = newVal.district;
        this.localData.to.province = newVal.province;
        this.localData.to.detailAddress = newVal.detailAddress;
      },
      checkCarInsMode() {
        let that = this;
        api.checkCarInsMode().then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode == '0') {
                if(data.resultData&&data.resultData.length > 0) {
                    for(let x of data.resultData.values()) {
                        if(x == 0) {
                            this.hasVisit = true;
                        }
                        if(x == 1) {
                            this.hasAppoint = true;
                            that.findCarInspectionStore();
                        }
                    }
                }
                if(this.hasVisit) {
                    this.serveType = 'visit';
                } else {
                    this.serveType = 'appoint';
                }
            } else {
                this.$store.dispatch('showError', data.resultMsg);
            }
        })
      },
      // 查找所有的检测场地
      findCarInspectionStore() {
        api.findCarInspectionStore().then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              this.allSites = data.resultData;
              if(!(this.allSites&&this.allSites.length > 0)) {
                  return false;
              }
              this.inspection.subStoreIdAppoint = this.allSites[0].id;
              this.inspection.siteName = this.allSites[0].name;
              this.inspection.payFormAppoint = this.allSites[0].payForm;
              this.inspection.payTypeAppoint = this.allSites[0].payType;
              this.updateBtnText(this.allSites[0].payForm, this.allSites[0].payType, 'appoint');
              for (let site of this.allSites.values()){
                this.sitePickerData.push({
                  text: site.name,
                  value: site.id
                });
                this.sitePickerIndex = [0]
              }
              this.sitePicker = new Picker({
                data: [
                  this.sitePickerData
                ],
                selectedIndex: this.sitePickerIndex,
                title: '检测场地'
              });

              let that = this;
              this.sitePicker.on('picker.select', (selectedVal, index) => {
                that.inspection.subStoreIdAppoint = selectedVal[0];
                that.inspection.siteName = that.allSites[index[0]].name;
                that.inspection.payFormAppoint = that.allSites[index[0]].payForm;
                that.inspection.payTypeAppoint = that.allSites[index[0]].payType;
                that.updateBtnText(that.allSites[index[0]].payForm, that.allSites[index[0]].payType, 'appoint');
                that.inspection.bigTypeNameAppoint = '请选择检测大类';
                that.inspection.smallTypeNameAppoint = '请选择检测小类';
                that.inspection.totalPrice = 0;
                that.inspection.couponPrice = 0;
                that.carSmallTypeArrAppointSpe.length = 0;
                that.inspection.carInspectionProductIdAppoint = '';
                that.getOrderProductsByStore();
              });
              this.getOrderProductsByStore();
            } else {
                this.$store.dispatch('showError', data.resultMsg);
            }
        })
      },
      openPicker () {
        this.sitePicker.show()
      },
      /**
       * 查找预约服务的车型
       */
      getOrderProductsByStore() {
          if(!this.inspection.subStoreIdAppoint) {
            this.$store.dispatch('showError', '请先选择检测场地');
            return false;
          }
          api.getOrderProductsByStore({subStoreId: this.inspection.subStoreIdAppoint}).then(res => {
              const data = TOOL.toJson(res.data);
              if(data.resultCode === '0') {
                  if(TOOL.isEmptyObject(data.resultData)&&this.serveType=='appoint') {
                    this.inspection.bigTypeNameAppoint = '请选择检测大类';
                    this.inspection.smallTypeNameAppoint = '请选择检测小类';
                    this.inspection.totalPriceAppoint = 0;
                    this.inspection.totalPrice = 0;
                    this.inspection.couponPrice = 0;
                    this.inspection.couponPriceAppoint = 0;
                    this.inspection.carInspectionProductIdAppoint = '';
                    this.$store.dispatch('showError', '该检测场地没有可选车型，请重新选择！');
                    return false;
                  }
                  this.carTypeObjAppoint = Object.assign({}, data.resultData);
                  this.carBigTypeArrAppoint.length = 0;
                  this.carSmallTypeArrAppoint.length = 0;
                  for(let [key, val] of Object.entries(this.carTypeObjAppoint)) {
                      this.carBigTypeArrAppoint.push(TOOL.carInspectionName[key]);
                      this.carSmallTypeArrAppoint.push(val.slice(0));
                  }
                  let bigTypeData = [];
                  for (let [index, val] of this.carBigTypeArrAppoint.entries()){
                    bigTypeData.push({
                      text: val,
                      value: index
                    });
                  }
                  this.carSmallTypeArrAppointSpe = this.getCarSmallTypeArrAppoint(0);
                  this.carBigTypePickerAppoint = new Picker({
                    data: [
                      bigTypeData,
                      this.carSmallTypeArrAppointSpe
                    ],
                    selectedIndex: [0,0],
                    title: '车辆型号'
                  });

                  let that = this;
                  this.carBigTypePickerAppoint.on('picker.change', (index1, index2) => {
                    if(index1==0&&index2 != that.appointIndexOne) {
                      that.appointIndexOne = index2;
                      that.carSmallTypeArrAppointSpe = that.getCarSmallTypeArrAppoint(index2);
                      that.carBigTypePickerAppoint.refillColumn(1, that.carSmallTypeArrAppointSpe);
                    }
                  });
                this.carBigTypePickerAppoint.on('picker.select', (selectedVal, selectedIndex) => {
                  that.inspection.bigTypeNameAppoint = that.carBigTypeArrAppoint[selectedVal[0]];
                  that.inspection.smallTypeNameAppoint = that.carSmallTypeArrAppointSpe[selectedIndex[1]].text;
                  that.inspection.carInspectionProductIdAppoint = that.carSmallTypeArrAppointSpe[selectedIndex[1]].value;
                  this.getInspectionOrderPrice(that.inspection.carInspectionProductIdAppoint, 1);
                })
              } else {
                  this.$store.dispatch('showError', data.resultMsg);
              }
          })
      },
      // 获取构造picker的数据 index为数组索引
      getCarSmallTypeArrAppoint(index) {
          let temp = this.carSmallTypeArrAppoint.slice(index, index+1)[0];
          let arr = [];
          for(let [index, val] of temp.entries()) {
              arr.push({text:val.carSubType.name,value:val.id})
          }
          return arr;
      },
      openBigPickerAppoint () {
        if(this.carBigTypeArrAppoint.length == 0) {
            this.$store.dispatch('showError', '该检测场地没有可选车型，请重新选择！');
            return false;
        }
        this.carBigTypePickerAppoint.show()
      },
      openSmallPickerAppoint () {
        if(this.carSmallTypeArrAppointSpe.length == 0) {
          this.$store.dispatch('showError', '请先选择检测大类！');
          return false;
        }
        this.carSmallTypePickerAppoint.show()
      },
      // 报名预约
      createAppointOrder() {
          this.inspection.carInspectionOwnerName = $.trim(this.inspection.carInspectionOwnerName);
          this.inspection.carInspectionOwnerPhone = $.trim(this.inspection.carInspectionOwnerPhone);
        let validata = TOOL.formValidate([
          {value: this.inspection.subStoreIdAppoint, emptyTips: '请选择检测场地'},
          {value: this.inspection.serveStartTime, emptyTips: '请选择预约时间'},
          {value: this.inspection.carInspectionOwnerPhone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.inspection.carInspectionProductIdAppoint, emptyTips: '请选择车辆型号'},
        ]);

        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        let newData = Object.assign({}, this.inspection);
        newData.pickUpTime = null;
        newData.subStoreId = this.inspection.subStoreIdAppoint;
        newData.serveStartTime = this.inspection.serveStartTime.substring(0, 16) + ':00';
        newData.serveStopTime = this.inspection.serveStopTime.substring(0, 16) + ':00';
        newData.serveType = '1';
        newData.payForm = this.inspection.payFormAppoint;
        this.inspection.payForm = this.inspection.payFormAppoint;
        newData.payType = this.inspection.payTypeAppoint;
        this.inspection.payType = this.inspection.payTypeAppoint;
        newData.carInspectionProductId = this.inspection.carInspectionProductIdAppoint;
        newData.formId = new Date().getTime();
  
        newData.orderSource = TOOL.browserType()
        api.createInspectionOrder(newData).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              let orderMsg = data.resultData;
              // 检后付款
              if(this.inspection.payForm == '1') {
                this.$store.dispatch('showSuccess', '下单成功');
                setTimeout(() => {
                  this.$router.push({
                    name: 'appointSuccess',
                    query: {
                      orderId: orderMsg.id,
                      status: orderMsg.status,
                    }
                  })
                }, 1000);
              } else {
                let apiData = {
                    tradeNo: orderMsg.id,
                    productTypeLevelOne: 'CAR_INSPECTION',
                    routerName: 'waitAppoint',
                    wxPaySuccess: TOOL.wxPaySuccess,
                    wxPayFail: TOOL.wxPayFail,
                    price: orderMsg.actualPayment,
                };
                if(this.serveType == 'appoint') {
                    apiData.routerName = 'appointSuccess';
                }
                interfaceApi.wxPay(apiData);
//                this.wxPay(orderMsg);
              }
            } else {
              this.$store.dispatch('showError', data.resultMsg);
            }
        })
      },
      // 获取上门服务检测大类
      getParentTypesByStore() {
        let that = this;
        if(!this.localData.to.lng||!this.localData.to.lat) {
            this.$store.dispatch('showError', '请先选择取/还车地点');
            return false;
        }
        let apiData = {
          longitude: this.localData.to.lng,
          latitude: this.localData.to.lat
        };
        api.getParentTypesByStore(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.carBigTypeArrVisit = data.resultData || [];
            if(!this.carBigTypeArrVisit||this.carBigTypeArrVisit.length == 0) {
                return false;
            }
            let bigTypeData = [];
            for(let [index, val] of this.carBigTypeArrVisit.entries()) {
              bigTypeData.push({
                text: TOOL.carInspectionName[val],
                value: val
              });
            }
            this.inspection.parentType = this.carBigTypeArrVisit[0];
            api.getSiteProductByParent({
              parentType: this.inspection.parentType,
              latitude: this.localData.to.lat,
              longitude: this.localData.to.lng
            }).then(res => {
              const data = TOOL.toJson(res.data);
              if(data.resultCode === '0') {
                let resData = data.resultData;
                console.log(data);
                this.inspection.payFormVisit = resData.payForm;
                this.inspection.payTypeVisit = resData.payType;
                this.updateBtnText(resData.payForm, resData.payType, 'visit');
                this.inspection.subStoreIdVisit = resData.subStoreId;
                this.carSmallTypeArrVisit = resData.products.slice(0);
                this.carSmallTypeArrVisitSpe.length = 0;
                for(let [index, val] of this.carSmallTypeArrVisit.entries()) {
                  this.carSmallTypeArrVisitSpe.push({
                    text: val.carSubType.name,
                    value: val.id
                  })
                }
                this.carBigTypePickerVisit = new Picker({
                  data: [
                    bigTypeData,
                    this.carSmallTypeArrVisitSpe
                  ],
                  selectedIndex: [0, 0],
                  title: '车辆型号'
                });
                this.carBigTypePickerVisit.on('picker.change', (index1, index2) => {
                    if(index1 == 0&&index2 != that.visitIndexOne) {
                      that.visitIndexOne = index2;
                      that.inspection.parentType = that.carBigTypeArrVisit[index2];
                      that.getSiteProductByParent();
                    }
                });
                this.carBigTypePickerVisit.on('picker.select', (selectedVal,selectedIndex) => {
                  that.inspection.bigTypeNameVisit = TOOL.carInspectionName[that.carBigTypeArrVisit[selectedIndex[0]]];
                  that.inspection.carInspectionProductIdVisit = this.carSmallTypeArrVisitSpe[selectedIndex[1]].value;
                  that.inspection.smallTypeNameVisit = this.carSmallTypeArrVisitSpe[selectedIndex[1]].text;
                  that.getInspectionOrderPrice(that.inspection.carInspectionProductIdVisit, 0);
                })
              } else {
                this.$store.dispatch('showError', data.resultMsg);
              }
            });
          } else {
              this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      // 获取上门服务检测小类
      getSiteProductByParent() {
        let apiData = {
          parentType: this.inspection.parentType,
          latitude: this.localData.to.lat,
          longitude: this.localData.to.lng
        };
        api.getSiteProductByParent(apiData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            let resData = data.resultData;
            this.inspection.payFormVisit = resData.payForm;
            this.inspection.payTypeVisit = resData.payType;
            this.updateBtnText(resData.payForm, resData.payType, 'visit');
            this.inspection.subStoreIdVisit = resData.subStoreId;
            this.carSmallTypeArrVisit = resData.products.slice(0);
            this.carSmallTypeArrVisitSpe.length = 0;
            for(let [index, val] of this.carSmallTypeArrVisit.entries()) {
              this.carSmallTypeArrVisitSpe.push({
                text: val.carSubType.name,
                value: val.id
              })
            }
            this.carBigTypePickerVisit.refillColumn(1, this.carSmallTypeArrVisitSpe);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      openBigPickerVisit () {
        if(!this.localData.to.lat) {
          this.$store.dispatch('showError', '请先选择取/还车地点');
          return false;
        }
        if(this.carBigTypeArrVisit.length == 0) {
          this.$store.dispatch('showError', '该检测场地没有可选车型，请重新选择取/还车地点！');
          return false;
        }
        this.carBigTypePickerVisit.show()
      },
      openSmallPickerVisit () {
        if(!this.inspection.parentType) {
          this.$store.dispatch('showError', '请先选择检测大类');
          return false;
        }
        this.carSmallTypePickerVisit.show();
      },
      getPickUpAddress() {
        this.inspection.pickUpAddress.province = this.localData.to.province;
        this.inspection.pickUpAddress.city = this.localData.to.city;
        this.inspection.pickUpAddress.county = this.localData.to.county;
        this.inspection.pickUpAddress.latitude = this.localData.to.lat;
        this.inspection.pickUpAddress.longitude = this.localData.to.lng;
        this.inspection.pickUpAddress.detailAddress = this.localData.to.detailAddress;
      },
      createVisitOrder() {
        let that = this;
        this.inspection.carInspectionOwnerName = $.trim(this.inspection.carInspectionOwnerName);
        this.inspection.carInspectionOwnerPhone = $.trim(this.inspection.carInspectionOwnerPhone);
        let validata = TOOL.formValidate([
          {value: this.localData.to.detailAddress, emptyTips: '请选择检测场地'},
          {value: this.inspection.pickUpTime, emptyTips: '请选择上门时间'},
          {value: this.inspection.carInspectionOwnerPhone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
          {value: this.inspection.carInspectionProductIdVisit, emptyTips: '请选择车辆型号'},
        ]);
        if (!validata.valid) {
          this.$store.dispatch('showError', validata.msg);
          return false;
        }
        this.getPickUpAddress();
        let newData = Object.assign({}, this.inspection);
        newData.pickUpTime = this.inspection.pickUpTime.substring(0, 16) + ':00';
        newData.subStoreId = this.inspection.subStoreIdVisit;
        newData.serveStartTime = null;
        newData.serveStopTime = null;
        newData.serveType = '0';
        newData.carInspectionProductId = this.inspection.carInspectionProductIdVisit;
        newData.payForm = this.inspection.payFormVisit;
        this.inspection.payForm = this.inspection.payFormVisit;
        newData.payType = this.inspection.payTypeVisit;
        this.inspection.payType = this.inspection.payTypeVisit;
        newData.formId = new Date().getTime();
  
        newData.orderSource = TOOL.browserType()
        api.createInspectionOrder(newData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            let orderMsg = data.resultData;
            // 检后付款
            if(this.inspection.payForm == '1') {
              this.$store.dispatch('showSuccess', '下单成功');
              setTimeout(() => {
                this.$router.push({
                  name: 'waitAppoint',
                  query: {
                    orderId: orderMsg.id,
                    status: orderMsg.status,
                  }
                })
              }, 1000);
            } else { // 捡前付款
              let apiData = {
                  tradeNo: orderMsg.id,
                  productTypeLevelOne: 'CAR_INSPECTION',
                  routerName: 'waitAppoint',
                  wxPaySuccess: TOOL.wxPaySuccess,
                  wxPayFail: TOOL.wxPayFail,
                  price: orderMsg.actualPayment,
              };
              if(this.serveType == 'appoint') {
                  apiData.routerName = 'appointSuccess';
              }
              interfaceApi.wxPay(apiData);
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      wxPay(orderMsg) {
        let apiData = {
          openId: appStorage.get('payOpenId'),
          tradeNo: orderMsg.id,
          routerName: 'waitAppoint'
        };
        let routerName = 'waitAppoint';
        if(this.serveType == 'appoint') {
          routerName = 'appointSuccess';
          apiData.routerName = 'appointSuccess';
        }
        this.$store.commit('UPDATE_LOADING', true);
        // 查询订单多少钱
        api.unifiedCarInsOrder(apiData).then(res => {
          this.$store.commit('UPDATE_LOADING', false);
          const data = TOOL.toJson(res.data);
            console.log(data.resultData);
          if(data.resultCode === '0') {
            // 查询成功后付款
            this.wxPayBridge(data.resultData, routerName, orderMsg)
          } else {
            // 查询失败后取消订单
            this.cancelInspection(orderMsg.id);
            this.$store.dispatch('showError', '支付失败，已为你取消了订单，请从新创建订单');
//            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      wxPayBridge(data, routerName, orderMsg) {
        let that = this;
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          appId: data.appId,
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign
        }, function (weData) {
          if (weData.err_msg === 'get_brand_wcpay_request:ok') {
            that.$store.dispatch('showSuccess', '支付成功');
            that.getInspectionOrderById(routerName, orderMsg.id);
          }else{
            that.cancelInspection(orderMsg.id);
            that.$store.dispatch('showError', '支付失败，已为你取消了订单，请从新创建订单');
          }
        })
      },
      paySuccess(param) {
        this.$store.dispatch('showSuccess', '支付成功');
        this.getInspectionOrderById(param.routerName, param.tradeNo);
      },
      payFail(param) {
        this.cancelInspection(param.tradeNo);
        this.$store.dispatch('showError', '支付失败，已为你取消了订单，请从新创建订单');
      },
      getInspectionOrderById(routerName, id) {
        let that = this;
        api.getInspectionOrderById(id).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            let orderStatus = data.resultData.status;
            setTimeout(() => {
              that.$router.push({
                name: routerName,
                query: {
                  orderId: id,
                  status: orderStatus,
                }
              })
            }, 1000);
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      // 取消订单
      cancelInspection(orderId) {
        api.cancelInspection(orderId).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {

          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      getInspectionOrderPrice(id, serveType) {
        let apiData = {
          productId: id,
          serveType: serveType
        };
        api.getInspectionOrderPrice(apiData).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {
              this.priceData = data.resultData;
              if(serveType == 0) {
                this.inspection.totalPriceVisit = data.resultData.priceAfterDiscount;
                this.inspection.totalPrice = data.resultData.priceAfterDiscount;
                this.inspection.couponPrice = data.resultData.discount.discountAmount;
                this.inspection.couponPriceVisit = data.resultData.discount.discountAmount;
              } else {
                this.inspection.totalPriceAppoint = data.resultData.priceAfterDiscount;
                this.inspection.totalPrice = data.resultData.priceAfterDiscount;
                this.inspection.couponPrice = data.resultData.discount.discountAmount;
                this.inspection.couponPriceAppoint = data.resultData.discount.discountAmount;
              }
              this.whetherAllowRefund = data.resultData.discount.whetherAllowRefund;
//              priceFields
              this.priceFields[0].value = this.priceData.discount.couponAmount || 0;
              this.priceFields[1].value = this.priceData.discount.activityAmount || 0;
              this.priceFields = this.priceFields.slice(0,2);
              for(var [key, value] of Object.entries(this.priceData.priceDetail)) {
                let newObj = {filed:key,name:key,value:value,type:1};
                this.priceFields.push(newObj);
              }
            } else {
                this.$store.dispatch('showError', data.resultMsg);
            }
        })
      },
      updateBtnText(payForm, payType, type) {
          if(this.serveType != type) {
              return false;
          }
          let key = '' + payForm + payType;
          if(this.serveType == 'visit') {
            key += '0';
          } else {
            key += '1';
          }
          this.btnText = this.payNames[key] || '发布请求';
      },
      /**
       * 切换服务类型
       * @param type：要切换的服务类型 type = 'visit'或者'appoint'
       */
      switchServeType (type) {
        if(type == 'visit') {
            if(this.hasVisit) {
                this.serveType = 'visit';
                this.inspection.totalPrice = this.inspection.totalPriceVisit;
                this.inspection.couponPrice = this.inspection.couponPriceVisit;
                this.updateBtnText(this.inspection.payFormVisit,this.inspection.payTypeVisit, 'visit');
            } else {
              this.$store.dispatch('showError', '该企业不支持上门服务');
            }
        } else {
            if(this.hasAppoint) {
              this.serveType = 'appoint';
              this.inspection.totalPrice = this.inspection.totalPriceAppoint;
              this.inspection.couponPrice = this.inspection.couponPriceAppoint;
              this.updateBtnText(this.inspection.payFormAppoint,this.inspection.payTypeAppoint, 'appoint');
            } else {
                this.$store.dispatch('showError', '该企业不支持预约服务');
            }
        }
      },
      /**
       * 跳转到上门地址选择的页面
       * @param dataKey：'to'
       * @returns {boolean}
       */
      jumpToSetPosition(dataKey) {
        if(!this.localData.to.lat) {
            this.$store.dispatch('showError', `正在定位中，请稍后再试！`);
            return false;
        }
        this.saveForm();

        this.$router.push({
          name: 'setPosition',
          query: {
            pageRouter: this.pageRouter,
            dataKey: dataKey,
            searchText: '去哪儿取车'
          }
        })
      },
      initServeTime() {
        let that = this;
        let tempArr = ['今天', '明天', '后天'];
        let days = TOOL.getAfterCurrentDay(30);
        let hours = TOOL.carInspectionTime.slice(0);
        let daysPickerData = [];
        let hoursPickerData = [];
        for(let [index, val] of days.entries()) {
            if(index < 3) {
              daysPickerData.push({
                text: tempArr[index],
                value: val
              })
            } else {
              daysPickerData.push({
                text: val,
                value: val
              })
            }
        }
        for(let [index, val] of hours.entries()) {
          hoursPickerData.push({
            text: val.text,
            value: val.value
          })
        }
        this.serveTimePicker = new Picker({
          data: [
            daysPickerData,
            hoursPickerData
          ],
          selectedIndex: [0,0],
          title: '预约时间'
        });
        this.serveTimePicker.on('picker.select', (selectedVal, selectedIndex) => {
          that.inspection.serveStartTime = daysPickerData[selectedIndex[0]].value + ' ' + hoursPickerData[selectedIndex[1]].value;
        });

        let newDate = TOOL.getCurrentTime();
//        this.inspection.pickUpTime = newDate;
      },
      selectServeTime() {
        this.serveTimePicker.show();
      },
      checkReserveTimeValid() {
        if(!this.inspection.subStoreIdAppoint) {
          this.$store.dispatch('showError', '请先选择检测场地');
          return false;
        }
        if(!this.inspection.serveStartTime) {
          this.$store.dispatch('showError', '请先选择预约时间');
          return false;
        }
        let aipData = {
          subStoreId: this.inspection.subStoreIdAppoint,
          serveStartTime: this.inspection.serveStartTime,
          serveStopTime: this.inspection.serveStopTime
        };
        api.checkReserveTimeValid(aipData).then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {

          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      setTelephone () {
        let validata = TOOL.formValidate([
          {value: this.inspection.carInspectionOwnerPhone, emptyTips: '手机号码不能为空', regName: 'telephone',regTips: '手机号码格式不正确'},
        ]);

        if (!validata.valid) {
          this.errorPhoneText = validata.msg;
          return false;
        }
        api.setCarInspectionOwnerInfo({
          carInspectionOwnerPhone:this.inspection.carInspectionOwnerPhone,
          carInspectionOwnerName:this.inspection.carInspectionOwnerName
        }).then(res => {
            const data = TOOL.toJson(res.data);
            if(data.resultCode === '0') {

            } else {
                this.$store.dispatch('showError', data.resultMsg);
            }
        });
        this.errorPhoneText = '';
        this.showTelDialog = false
      },
      /**
       * 获取用户的联系信息
       */
      getCarInspectionOwnerInfo() {
        let userInfo = JSON.parse(appStorage.get('userInfo'));
        api.getCarInspectionOwnerInfo().then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            this.inspection.carInspectionOwnerPhone = data.resultData.carInspectionOwnerPhone || userInfo.phone;
            this.inspection.carInspectionOwnerName = data.resultData.carInspectionOwnerName;
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      /**
       * 判断用户是否有未完成的订单
       */
      checkUserCanOrder() {
        api.checkUserCanOrder().then(res => {
          const data = TOOL.toJson(res.data);
          if(data.resultCode === '0') {
            if(!data.resultData[0]) {
                this.$store.dispatch('showError', '您还有未完成的订单');
                setTimeout(() => {
                    this.$router.push({
                      name: 'historyOrder'
                    })
                }, 1000);
            }
          } else {
            this.$store.dispatch('showError', data.resultMsg);
          }
        })
      },
      jumpAppointSuccess() {
        this.$router.push({
          name: 'appointSuccess',
          query: {

          }
        })
      },
      jumpHistoryOrder() {
        this.$router.push({
          name: 'historyOrder',
          query: {

          }
        })
      },
      saveForm() {
        if(this.localData) {
          appStorage.set(this.pageRouter, JSON.stringify(this.localData));
        }
      },
      clearLocalStorage() {
        appStorage.remove(this.pageRouter);
      }
    }
  }
</script>
<style lang="less" scoped>

  @import '../../../styles/common.less';
  @import '../../../styles/theme.less';
  .insp-box {
    height: auto;
    margin: 20px;
    border: 1PX solid #e5e5e5;
    border-radius: 8px;

    background: #fff;
    overflow: hidden;
  }
  .insp-srv-type {
    width: 100%;
    height: 100px;

    display: flex;
  }
  .insp-srv-item {
    position: relative;

    width: 0;
    flex: 1;
    height: 100px;
    line-height: 100px;

    font-size: 28px;
    color: #888;
    text-align: center;
  }
  .insp-aLine {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    width: 32px;
    height: 4px;
    margin: 0 auto;

    background: #f60;
  }
  .insp-srv-item-active {
    color: #f60;

    .insp-aLine {
      display: inline-block;
    }
  }

  .insp-appoint-tip {
    width: 100%;
    padding: 25px 0;
    border-top: 1PX solid #e5e5e5;
  }
  .insp-appoint-tip-p {
    line-height: 32px;
    text-align: center;
    font-size: 24px;
    color: #888;
    word-break:break-all;
    word-wrap: break-word;
  }
  .insp-info-box {
    display: flex;

    width: 100%;
    height: 120px;
    border-top: 1PX solid #e5e5e5;
  }
  .insp-info-l-icon {
    width: 72px;
    height: 100%;
  }
  .insp-info-r-box {
    width: 0;
    flex: 1;
    height: 100%;
  }
  .insp-info-r-filed {
    width: 100%;
    padding: 20px 0 28px 0;

    font-size: 24px;
    color: #888;
  }
  .insp-info-r-msg {
    width: 100%;
    height: 30px;
    line-height: 30px;

    font-size: 28px;
    color: #121212;

    /*.overflow-ellipsis;*/
  }
  .insp-price {
    width: 100%;
    padding: 32px 0 20px 0;

    font-size: 28px;
    color: #f60;
    text-align: center;
  }
  .pad-b-32 {
    padding-bottom: 32px !important;
  }
  .insp-coupon-price {
    width: 100%;
    padding-bottom: 30px;

    font-size: 22px;
    color: #888;
    text-align: center;
  }
  .insp-fixed {
    display: inline-block;
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: 0 auto;

    width: 200px;

    font-size: 28px;
    color: #888;
    text-align: center;
  }

  .start-dian {
    background: url("../../../assets/order_start.png") no-repeat 20px center;
    background-size: 32px 32px;
  }
  .time {
    background: url("../../../assets/order_time.png") no-repeat 20px center;
    background-size: 32px 32px;
  }
  .person {
    background: url("../../../assets/inspection/person.png") no-repeat 20px center;
    background-size: 32px 32px;
  }
  .car {
    background: url("../../../assets/inspection/car.png") no-repeat 20px center;
    background-size: 32px 32px;
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
  .dialog-demo {
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 1000;
  }
  .close-icon {
    position: fixed;
    bottom: 30px;
    left: 50%;
    width: 95px;
    height: 95px;
    background: url("../../../assets/charter/close.png") no-repeat;
    background-size: 91px 91px;
    margin-left: -45px;
    z-index: 2000;
  }
  .company-quote {
    padding: 20px 30px;
    overflow: hidden;
    margin-top: 150px;
  }

  .company-quote-tit {
    display: block;
    height: 96px;
    line-height: 96px;
    text-align: center;
    color: #888;
    font-size: 36px;
  }

  .price-total{
    margin:80px 0 130px;
    text-align: center;
    font-size:70px;
    color:#4c4c4c;
  i{
    position: relative;
    top:-2px;
    font-size: 36px;
  }
  }

  .company-quote-table {
    padding: 0 40px;
    font-size: 28px;
    color: #4C4C4C;
  }

  .company-text {
    font-size:28px;
    color:#888;
    line-height: 50px;
    overflow: hidden;
  }

  .company-text p {
    float: left;
  }

  .company-text p:last-child {
    float: right;
  }

  .company-text.mar-t-10 {
    margin-top: 10px;
  }
</style>
