<template>
    <main-box :title="title" :show-more="false">
        <router-link class="hd-cancel fc-4c4c4c" slot="title" :to="{name: 'rentNotice'}">租车须知</router-link>
        <div class="data-box line line-x-b">
            <div class="data-box-item text-left">
                <p class="p-t">取车时间</p>
                <p class="p-b">{{getDate(crOrder.startTime)}} {{getTime(crOrder.startTime)}}</p>
            </div>
            <div class="data-box-item text-center">
                <p class="text-center p-t total-day">
                  {{crOrder.allTime.day}}天{{crOrder.allTime.hour}}小时
                </p>
                <div class="allow-right"></div>
            </div>
            <div class="data-box-item text-right">
                <p class="p-t">还车时间</p>
                <p class="p-b">{{getDate(crOrder.endTime)}} {{getTime(crOrder.endTime)}}</p>
            </div>
        </div>
        <div class="data-box line line-x-b">
            <div class="data-box-item text-left"
                 v-if="crOrder.getModel == 2"
            >
              <p class="p-t">取车地点</p>
              <p class="p-b">{{crOrder.aAddress.detailAddress}}</p>
            </div>
            <div class="data-box-item text-left"
                 v-if="crOrder.getModel == 1"
            >
              <p class="p-t">取车门店</p>
              <p class="p-b">{{crOrder.getSite.name}}</p>
            </div>

            <div class="data-box-item text-right"
                 v-if="crOrder.returnModel == 2"
            >
              <p class="p-t">还车地点</p>
              <p class="p-b">{{crOrder.bAddress.detailAddress}}</p>
            </div>
            <div class="data-box-item text-right"
                 v-if="crOrder.returnModel == 1"
            >
              <p class="p-t">还车门店</p>
              <p class="p-b">{{crOrder.returnSite.name}}</p>
            </div>
        </div>


        <!--<div v-for="(rentCarData, index) in productList.rentalList">

        </div>-->
      <div class="car-box-outer" v-for="(rentCarData, index) in productList.rentalList">
        <rent-car :car="rentCarData"
                  :aboveHourToDay="productList.aboveHourToDay"
        ></rent-car>
      </div>


    </main-box>
</template>

<script>
    import MainBox from 'components/mainBox/index.vue'
    import RentCalendar from 'appComponents/rentCalendar/index.vue'
    import RentCar from 'appComponents/rentCar/index.vue'

    export default{
        data(){
            return{
                title: this.$route.meta.title,
                crOrder: {},
                posiData: {},
                productList: {
                  rentalList:[]
                }
            }
        },
        components:{
            MainBox,
            RentCalendar,
            RentCar
        },
        created() {
            if(appStorage.get('crOrder')) {
              this.crOrder = JSON.parse(appStorage.get('crOrder'));
            }
            if(appStorage.get('cityMsg')) {
              this.posiData = JSON.parse(appStorage.get('cityMsg'));
            }
            this.carRentalFindByCity();
        },
        methods: {
            goFillOrder() {
                this.$router.push({
                  name:'fillOrder',
                  query: {
                      id: '123'
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
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
            getDate(date) {
              return TOOL.getDateName(date);
            },
            getTime(date) {
              return TOOL.getTimeName(date);
            },
            getWeek(date) {
              return TOOL.getWeekName(date);
            }
        },

    }
</script>
<style lang="less" scoped>
  @import '../../../styles/theme.less';

  .car-box-outer {
    width: 100%;
    height: auto;
    padding: 10px 20px;
  }
  .data-box {
    display: flex;
    justify-content: space-between;

    width: 100%;
    height: 100px;
    padding: 0 20px;

    background: #fff;

    .p-t {
      font-size: 24px;
      color: #888;
      margin: 20px 0;
    }
    .p-b {
      font-size: 24px;
      color: #4c4c4c;
    }
  }
  .data-box-item {
    flex: 1;
  }
  .total-day {
    margin: 35px 0 0 0 !important;
  }
  .allow-right {
    width: 100%;
    height: 6px;

    background: url("../../../assets/rent/allow-right.png") no-repeat center center;
    background-size: 160px 6px;
  }
</style>
