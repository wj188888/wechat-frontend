<template>
    <main-box :title="title" main-class="scrollingBox has-abs-bottom">
        <div class="rent-item line line-x-b">
            <div class="start-dian"></div>
            <div class="rent-content" v-show="crOrder.getModel == 2">
                <span class="rent-title">取车地点</span>
                <div class="rent-choose" v-show="!localData.to.detailAddress"
                     @click="jumpToSetPosition('to')">请选择取车地点</div>
                <div class="rent-choose c-f-4c4c4c" v-show="localData.to.detailAddress"
                     @click="jumpToSetPosition('to')"
                >
                  {{localData.to.detailAddress}}
                </div>
            </div>
            <div class="rent-content" v-show="crOrder.getModel == 1">
                <span class="rent-title">取车门店</span>
                <div class="rent-choose" v-show="!localData.getSite.id"
                     @click="jumpToStore('to','getSite')">请选择取车门店</div>
                <div class="rent-choose c-f-4c4c4c" v-show="localData.getSite.id"
                     @click="jumpToStore('from', 'getSite')"
                >
                  {{localData.getSite.name}}
                </div>
            </div>
            <div class="rent-operation">
                <div class="rent-switch"
                     :class="{'rent-switch-right': crOrder.getModel == 2,'rent-switch-left': crOrder.getModel == 1}"
                     @click="changeModel('getModel')"
                ></div>
            </div>
        </div>

        <div class="rent-item line line-x-b">
            <div class="end-dian"></div>
            <div class="rent-content" v-show="crOrder.returnModel == 2">
              <span class="rent-title">还车地点</span>
              <div class="rent-choose" v-show="!localData.from.detailAddress"
                   @click="jumpToSetPosition('from')">请选择还车地点</div>
              <div class="rent-choose c-f-4c4c4c" v-show="localData.from.detailAddress"
                   @click="jumpToSetPosition('from')"
              >
                {{localData.from.detailAddress}}
              </div>
            </div>
            <div class="rent-content" v-show="crOrder.returnModel == 1">
                <span class="rent-title">还车门店</span>
                <div class="rent-choose" v-show="!localData.returnSite.id"
                     @click="jumpToStore('from','returnSite')">请选择还车门店</div>
                <div class="rent-choose c-f-4c4c4c" v-show="localData.returnSite.id"
                     @click="jumpToStore('from', 'returnSite')"
                >
                    {{localData.returnSite.name}}
                </div>
            </div>
            <div class="rent-operation">
              <div class="rent-switch"
                   :class="{'rent-switch-right': crOrder.returnModel == 2,'rent-switch-left': crOrder.returnModel == 1}"
                   @click="changeModel('returnModel')"
              ></div>
            </div>
        </div>
        <div class="rent-item line line-x-b">
            <div class="time"></div>
            <div class="rent-content">
                <div class="date-item pull-left text-left mar-r-65"
                     v-mobidatetime:startConfig="startTime">
                    <span class="date-day">{{getDate(crOrder.startTime)}}</span>
                    <span class="date-time">
                      {{getWeek(crOrder.startTime)}} {{getTime(crOrder.startTime)}}
                    </span>
                </div>
                <div class="all-time pull-left text-center mar-r-65">
                    <span class="text-center">{{dateCompare(crOrder.startTime,crOrder.endTime)['day']}}天{{dateCompare(crOrder.startTime,crOrder.endTime)['hour']}}小时</span>
                    <div class="allow-right"></div>
                </div>
                <div class="date-item pull-left text-right"
                     v-mobidatetime:startConfig="endTime"
                >
                  <span class="date-day">{{getDate(crOrder.endTime)}}</span>
                  <span class="date-time">
                      {{getWeek(crOrder.endTime)}} {{getTime(crOrder.endTime)}}
                    </span>
                </div>
            </div>

        </div>

        <div class="mar-t-40 mar20" @click="selectCar">
            <input type="button" class="button button-primary" value="前去选车"/>
        </div>
    </main-box>
</template>

<script>
    import MainBox from 'components/mainBox/index.vue'
    import Mobidatetime from 'directives/mobiDateTime'
    import { mapState } from 'vuex'

    const now = new Date()
    export default {
        components: {
          MainBox
        },
        directives: {
          Mobidatetime,
        },
        data() {
            return {
                title:this.$route.meta.title,
                pageRouter: this.$route.name,
                localData: {
                  from:{},
                  to:{},
                  getSite: {},
                  returnSite: {},
                  aAddress: {},
                  bAddress: {}
                },
                type: false,
                startTime: TOOL.getCurrentTime(),
                endTime: TOOL.getCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate()+5)),
                posiData: {},
                productList: [],
                isInRange: false,
                isFirstToRent: true, // 是否是第一次进入rent这个页面，防止页面重复判断定位是否在范围内
                isAllowJumpSite: false,
                isAllowJumpMap: false,
                preOrderMinute: 0,
                workTimeList: [],
                crOrder: {
                  startTime: TOOL.getCurrentTime(),
                  endTime: TOOL.getCurrentTime(new Date(now.getFullYear(), now.getMonth(), now.getDate()+5)),
                  returnModel: 1, // 1-到店 2-上门
                  getModel: 1,
                  aAddress: {},
                  bAddress: {}
                }
            }
        },
        created() {
            if(appStorage.get('isFirstToRent')) {
              this.isFirstToRent = JSON.parse(appStorage.get('isFirstToRent'));
            }
            if(this.isFirstToRent) {
              appStorage.remove('crOrder');
              appStorage.remove('rent');
              appStorage.remove('fillOrder');
            }
            if(appStorage.get(this.pageRouter)) {
                this.localData = JSON.parse(appStorage.get(this.pageRouter));
            }
            if(appStorage.get('crOrder')) {
              this.crOrder = JSON.parse(appStorage.get('crOrder'));
              this.startTime = this.crOrder.startTime;
              this.endTime = this.crOrder.endTime;
            }

            if(appStorage.get('cityMsg') || this.appAddress) {
              let newVal = this.appAddress;
              if(!this.posiData.city && newVal && newVal !== TOOL.locationFail) {
                this.posiData.city = newVal.city;
                this.posiData.latitude = newVal.position.lat;
                this.posiData.longitude = newVal.position.lng;
                this.posiData.county = newVal.district;
                this.posiData.detailAddress = newVal.detailAddress;
                this.posiData.detail = newVal.city + ' ' + newVal.district + ' ' + newVal.street + ' ' + newVal.streetNumber + ' ' + newVal.detailAddress;
  
                appStorage.set('cityMsg', JSON.stringify(this.posiData))
              }
              this.posiData = JSON.parse(appStorage.get('cityMsg'));
              if(!this.localData.to.city) {
                this.localData.to.city = this.posiData.city;
                this.localData.to.lat = this.posiData.latitude;
                this.localData.to.lng = this.posiData.longitude;
                this.localData.to.county = this.posiData.county;
                this.localData.to.detailAddress = this.posiData.detailAddress;
              }
              if(!this.localData.from.city) {
                this.localData.from.city = this.posiData.city;
                this.localData.from.lat = this.posiData.latitude;
                this.localData.from.lng = this.posiData.longitude;
                this.localData.from.county = this.posiData.county;
                this.localData.from.detailAddress = this.posiData.detailAddress;
              }
              this.isAllowJumpMap = true;
              this.isAllowJumpSite = true;
              this.carRentalFindByCity();
            }
        },
        computed: {
            ...mapState({
              appAddress: state => state.city.appAddress
            }),
            startConfig () {
              return {
                min: TOOL.getTimePreMinute(this.preOrderMinute),
                max: new Date(now.getFullYear()+1, now.getMonth(), now.getDate()),
                dateWheels: '|MM dd DD|',
                dateFormat: 'yy-mm-dd',
                timeWheels: 'HHii',
                steps: {
                  minute: 1,
                  zeroBased: true
                }
              }
            }
        },
        watch: {
            startTime(newVal, oldVal) {
                this.crOrder.startTime = newVal;
                /*let startTimeValidate = this.checkTimeRange(this.crOrder.startTime);
                if(!startTimeValidate) {
                  this.$store.dispatch('showError', '当前选择的取车时间不在工作时间范围内，请重新选择');
                }*/
            },
            endTime(newVal) {
                this.crOrder.endTime = newVal;
                /*let startTimeValidate = this.checkTimeRange(this.crOrder.endTime);
                if(!startTimeValidate) {
                  this.$store.dispatch('showError', '当前选择的还车时间不在工作时间范围内，请重新选择');
                }*/
            },
            //定位城市初始化赋值
            appAddress (newVal) {
                if(!this.posiData.city && newVal !== TOOL.locationFail) {
                  this.posiData.city = newVal.city;
                  this.posiData.latitude = newVal.position.lat;
                  this.posiData.longitude = newVal.position.lng;
                  this.posiData.county = newVal.district;
                  this.posiData.detailAddress = newVal.detailAddress;
                  this.posiData.detail = newVal.city + ' ' + newVal.district + ' ' + newVal.street + ' ' + newVal.streetNumber + ' ' + newVal.detailAddress;
  
  
                  appStorage.set('cityMsg', JSON.stringify(this.posiData))
                  this.carRentalFindByCity();
                }
                if(!this.localData.to.city) {
                  this.localData.to.city = newVal.city;
                  this.localData.to.lat = newVal.point.lat;
                  this.localData.to.lng = newVal.point.lng;
                  this.localData.to.county = newVal.district;
                  this.localData.to.detailAddress = newVal.street;
                }
                if(!this.localData.from.city) {
                  this.localData.from.city = newVal.city;
                  this.localData.from.lat = newVal.point.lat;
                  this.localData.from.lng = newVal.point.lng;
                  this.localData.from.county = newVal.district;
                  this.localData.from.detailAddress = newVal.street;
                }

                this.isAllowJumpSite = true;
                this.isAllowJumpMap = true;
            }
        },
        methods: {
            checkTimeRange(time) {
                let nowTime = TOOL.changeDateStyle(time);
                let nowMin = TOOL.changeHourToMin(nowTime.split(' ')[1]);
                let nowWeek = new Date(nowTime).getDay();
                if(nowWeek == 0) {
                  nowWeek = 7;
                }
                for(let weekItem of this.workTimeList.values()) {
                    let startMin = TOOL.changeHourToMin(weekItem.startTime);
                    let endMin = TOOL.changeHourToMin(weekItem.endTime);
                    if(nowWeek >=weekItem.weekDayStart&&nowWeek<=weekItem.weekDayEnd&&nowMin>=startMin&&nowMin<=endMin) {
                        return true;
                    }
                }
                return false;
            },
            checkValidateTime() {
                let startTimeValidate = this.checkTimeRange(this.crOrder.startTime);
                if(!startTimeValidate) {
                    this.$store.dispatch('showError', '当前选择的取车时间不在工作时间范围内，请重新选择');
                    return false;
                }
                let endTimeValidate = this.checkTimeRange(this.crOrder.endTime);
                if(!endTimeValidate) {
                  this.$store.dispatch('showError', '当前选择的还车时间不在工作时间范围内，请重新选择');
                  return false;
                }
                var timeDistance = this.dateCompare(this.crOrder.startTime,this.crOrder.endTime);
                if((timeDistance.day*24+timeDistance.hour) < this.productList.minRentalHour) {
                  this.$store.dispatch('showError', '最短租车时间是'+this.productList.minRentalHour+'小时');
                  return false;
                }
                return true;
            },
            rangeTip() {
                this.$store.dispatch('showAlert', {
                  content: '当前位置超出上门送取范围，已为你推荐附近最近门店',
                  buttonText: '知道了'
                })
            },
            changeModel(type) {
                if(type == 'getModel') {
                  if(this.productList.model != 3&&this.crOrder.getModel==1) {
                    this.$store.dispatch('showError', '该企业仅支持用户到店进行租车和还车的业务模式');
                    return false;
                  }
                  this.crOrder.getModel=this.crOrder.getModel==1?2:1
                } else {
                  if(this.productList.model != 3&&this.crOrder.returnModel==1) {
                    this.$store.dispatch('showError', '该企业仅支持用户到店进行租车和还车的业务模式');
                    return false;
                  }
                  this.crOrder.returnModel=this.crOrder.returnModel==1?2:1
                }
            },
            getDate(date) {
                return TOOL.getDateName(date);
            },
            getTime(date) {
                return TOOL.getTimeName(date);
            },
            getWeek(date) {
                return TOOL.getWeekName(date);
            },
            dateCompare(startTime, endTime) {
                let startTimeTemp = TOOL.changeDateStyle(startTime);
                let endTimeTemp = TOOL.changeDateStyle(endTime);
                let compareMsTemp = new Date(endTimeTemp).getTime() - new Date(startTimeTemp).getTime();
                let compareMs = Math.abs(compareMsTemp);
                let days = Math.floor(compareMs/(3600000*24));
                let hours = Math.ceil((compareMs%(3600000*24))/3600000);
                if(compareMsTemp < 0) {
                    if(days === 0) {
                        days = '-0';
                    } else {
                      days = -days;
                    }
                }
                this.crOrder.allTime = {day: days, hour: hours};
                return {day: days, hour: hours}
            },
            jumpToSetPosition(dataKey) {
                if(!this.isAllowJumpMap) {
                  this.$store.dispatch('showError', '正在定位中，请稍后再试!');
                  return false;
                }
                this.saveForm();
                this.saveOrder();

                this.$router.push({
                    name: 'setPosition',
                    query: {
                        pageRouter: this.pageRouter,
                        dataKey: dataKey,
                        productId: this.productList.id,
                        productTypeLevelOne: 'CAR_RENTAL'
                    }
                })
            },
            jumpToStore(dataKey, siteType) {
                if(!this.isAllowJumpSite) {
                    this.$store.dispatch('showError', '正在定位中，请稍后再试!')
                    return false;
                }
                this.saveForm();
                this.saveOrder();

                this.$router.push({
                  name: 'rentStore',
                  query: {
                    pageRouter: this.pageRouter,
                    dataKey: dataKey,
                    siteType: siteType,
                    posiData: JSON.stringify(this.posiData)
                  }
                })
            },
            carRentalFindByCity() {
                let findData = {
                  city: this.posiData.city.replace('市', ''),
                  pageNo: 0,
                  pageSize: 100
                };
                this.$store.commit('UPDATE_LOADING', true);
                api.carRentalFindByCity(findData).then(res => {
                  this.$store.commit('UPDATE_LOADING', false);
                  let data = TOOL.toJson(res.data);
                  if(data.resultCode == 0) {
                      this.productList = data.resultData.content[0];
                      this.preOrderMinute = this.productList.preOrderMinute;
                      this.workTimeList = this.productList.workTimeList;
                      this.startConfig.min = TOOL.getTimePreMinute(this.preOrderMinute);
                      if(this.isFirstToRent) {
                        this.startTime = TOOL.getCurrentTimePreMin(this.preOrderMinute);
                      }
                      this.rentInRange();
                  } else {
                    this.$store.dispatch('showError', data.resultMsg);
                  }
                })
            },
            rentInRange() {
                if(!this.isFirstToRent) {
                    return false;
                }
                api.rentInRange({
                  id:this.productList.id,
                  point: {
                    latitude: this.posiData.latitude,
                    longitude: this.posiData.longitude
                  }
                }).then(res => {
                    const data = TOOL.toJson(res.data);
                    if(data.resultCode == 0) {
                        this.isInRange = data.resultData;
                        this.isFirstToRent = false;
                      appStorage.set('isFirstToRent', JSON.stringify(this.isFirstToRent));
                        if(!this.isInRange) {
                            this.rangeTip();
                            this.rentStoreFind();
                        }
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
            inRange(address, type, resolve, reject) {
              api.rentInRange({
                id:this.productList.id,
                point: {
                  latitude: address.lat,
                  longitude: address.lng
                }
              }).then(res => {
                const data = TOOL.toJson(res.data);
                if(data.resultCode == 0) {
                  if(data.resultData) {
                    resolve(true)
                  } else {
                      if(type == 1) {
                        this.$store.dispatch('showError', '当前选择的取车地点不在服务范围内,请重新选择');
                      } else {
                        this.$store.dispatch('showError', '当前选择的还车地点不在服务范围内,请重新选择');
                      }
                    resolve(false)
                  }

                } else {
                  this.$store.dispatch('showError', data.resultMsg);
                  resolve(false)
                }
              })
            },

            async posiInRange() {
                if(this.crOrder.getModel == 2) {
                    let getModel = await new Promise((resolve, reject) => {
                      this.inRange(this.localData.to,1,resolve, reject)
                    });
                    if(!getModel) {
                        return false;
                    }
                }
                if(this.crOrder.returnModel == 2) {
                  let returnModel = await new Promise((resolve, reject) => {
                    this.inRange(this.localData.from,2,resolve, reject)
                  });
                  if(!returnModel) {
                    return false;
                  }
                }
                return true;
            },
            rentStoreFind() {
                if(!this.posiData.city) {
                  return false;
                }
                this.$store.commit('UPDATE_LOADING', true);
                api.rentStoreFind(this.posiData).then(res => {
                  const data = TOOL.toJson(res.data);
                  this.$store.commit('UPDATE_LOADING', false);
                  if(data.resultCode == 0) {
                    this.storeList = data.resultData;
                    this.localData.getSite = Object.assign(this.storeList[0]);
                    this.crOrder.getModel = 1;
                    this.localData.returnSite = Object.assign(this.storeList[0]);
                    this.crOrder.returnModel = 1;
                  } else {
                    this.$store.dispatch('showError',data.resultMsg);
                  }
                })
            },
            async selectCar() {
                if(!this.validate()) {
                   return false;
                }
                if(!this.checkValidateTime()) {
                    return false;
                }
                let inRangeValidate = await this.posiInRange();
                if(!inRangeValidate) {
                    return false;
                }
                this.crOrder.getSite = this.localData.getSite;
                this.crOrder.returnSite = this.localData.returnSite;
                this.crOrder.aAddress = this.localData.to;
                this.crOrder.aAddress.latitude = this.localData.to.lat;
                this.crOrder.aAddress.longitude = this.localData.to.lng;
                this.crOrder.bAddress = this.localData.from;
                this.crOrder.bAddress.latitude = this.localData.from.lat;
                this.crOrder.bAddress.longitude = this.localData.from.lng;
                this.crOrder.startTime = this.startTime;
                this.crOrder.endTime = this.endTime;
                this.saveForm();
                this.saveOrder();

                this.$router.push({
                  name:'selectRentCar'
                })
            },
            validate() {
                if(this.crOrder.getModel == 1 && !this.localData.getSite.name) {
                    this.$store.dispatch('showError', '请选择取车门店');
                    return false;
                }
                if(this.crOrder.getModel == 2 && !this.localData.to.city) {
                  this.$store.dispatch('showError', '请选择取车地点');
                  return false;
                }
                if(this.crOrder.returnModel == 1 && !this.localData.getSite.name) {
                  this.$store.dispatch('showError', '请选择还车门店');
                  return false;
                }
                if(this.crOrder.returnModel == 2 && !this.localData.to.city) {
                  this.$store.dispatch('showError', '请选择还车地点');
                  return false;
                }
                let startTimeTemp = TOOL.changeDateStyle(this.crOrder.startTime);
                let endTimeTemp = TOOL.changeDateStyle(this.crOrder.endTime);
                if(startTimeTemp >= endTimeTemp) {
                    this.$store.dispatch('showError', '取车时间应该小于还车时间');
                    return false;
                }
                return true;
            },
            saveForm() {
                if(this.localData) {
                  appStorage.set(this.pageRouter, JSON.stringify(this.localData));
                }
            },
            saveOrder() {
              appStorage.set('crOrder', JSON.stringify(this.crOrder));
            }
        }
    }
</script>
<style lang="less" scoped>
  .rent-item {
    display: -webkit-flex;
    display: flex;

    width: 100%;
    height: 150px;
    padding: 0 20px;

    background: #fff;
  }
  .rent-content {
    flex: 1;
    height: 100%;

    overflow:hidden;
    .rent-title {
      display: inline-block;
      padding: 30px 0 20px 0;
      vertical-align: middle;

      color: #4c4c4c;
      font-size: 24px;
    }
    .rent-choose {
      width: 100%;
      height: 52px;
      line-height: 52px;

      font-size: 32px;
      color: #ccc;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .date-item {
      display: inline-block;
      height: 100%;
      padding-top: 30px;

      .date-day {
        display: block;
        font-size: 32px;
        color: #121212;
      }
      .date-time {
        display: block;
        font-size: 28px;
        color: #888;
        margin-top: 32px;
      }
    }
    .all-time {
      display: inline-block;
      width: 160px;
      height: 100%;
      padding-top: 44px;

      color: #4c4c4c;
      font-size: 24px;
    }
    .allow-right {
      width: 100%;
      height: 6px;

      background: url("../../../assets/rent/allow-right.png") no-repeat center center;
      background-size: 160px 6px;
    }
  }

  .rent-operation {
    width: 110px;
    height: 100%;

    padding-top: 24px;
  }
  .start-dian,.time,.end-dian {
    width: 56px;
    height: 100%;
  }
  .start-dian {
    background: url("../../../assets/order_start.png") no-repeat left center;
    background-size: 32px 32px;
  }
  .time {
    background: url("../../../assets/order_time.png") no-repeat left center;
    background-size: 32px 32px;
  }
  .end-dian {
    background: url("../../../assets/order_end.png") no-repeat left center;
    background-size: 32px 32px;
  }

  .mar-r-65 {
    margin-right: 65px;
  }
</style>
