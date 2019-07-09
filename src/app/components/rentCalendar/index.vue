<template>
  <div class="rentCalendar" v-show="show">
      <table class="rentCalendar-table-box">

          <thead class="thead">
              <tr>
                  <th style="width:14.2857%" v-for="week in weekList">
                      {{week}}
                  </th>
              </tr>
          </thead>
          <tbody class="tbody">
              <tr v-for="weekArr in dateList">
                  <td v-for="(item, index) in weekArr">
                      <div :class="{'calendar-item-active':item.selected,}"
                           class="calendar-item"
                      >
                        <p class="num">{{item.day}}</p>
                        <p class="money">￥{{item.price}}</p>
                      </div>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
</template>

<script>

    export default{
        data(){
            return{
                msg:'hello vue',
                weekList: ['一','二','三','四','五','六','日'],
                monthList: [1,2],
                dateList: [],
                feeArr: [],
                baseDay: null,
                allowGetPrice: true,
                startDate: '',
                endDate: ''
            }
        },
        components:{

        },
        props: {
            startDateTemp: {
                type: String,
                default: '2017-06-13 12:12:12'
            },
            endDateTemp: {
                type: String,
                default: '2017-06-22 12:12:12'
            },
            priceCalendar: {
                type: Array,
                default() {
                    return [];
                }
            },
            show: {
                type:Boolean,
                default: false
            },
            getFirstPrice: {
                type: Function,
                default() {
                    return function() {

                    }
                }
            },
            aboveHourToDay: {
              default: 1
            },
            crOrder: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        methods: {
            getDateList() {
                this.startDate = TOOL.changeDateStyle(this.startDateTemp);
                this.endDate = TOOL.changeDateStyle(this.endDateTemp);
                let startDay = new Date(this.startDate);
                this.baseDay = new Date(this.startDate.split(' ')[0]);
                let endDay = new Date(this.endDate);
                let num = 0;

                this.crOrder.orderPrice = 0;

                do {
                    let weekArr = this.getWeekList();
                    this.dateList.push(weekArr)
                    num++; // 防止死循环
                } while(this.baseDay.getTime() < endDay.getTime() && num < 10)


                for(let arr1 of this.dateList.values()) {
                    for(let arr2 of arr1.values()) {
                        arr2.price = this.getMoney(arr2);
                    }
                }
                let feeLength = this.feeArr.length;
                this.feeArr[0] = this.getStartRent(this.startDateTemp.split(' ')[1],this.feeArr[0]);
                this.feeArr[feeLength-1] = this.getEndRent(this.endDateTemp.split(' ')[1],this.feeArr[feeLength-1]);

                this.crOrder.orderPrice = 0;
                for(var money  of this.feeArr.values()) {
                  this.crOrder.orderPrice += parseFloat(money);
                }
                this.crOrder.orderPrice = parseFloat(this.crOrder.orderPrice.toFixed(2));
            },
            zero (n) {
              return n < 10 ? '0' + n : n
            },
            compareTime() {
                let baseTime =  this.baseDay.getTime();
                let startTime =  new Date(this.startDate.split(' ')[0]).getTime();
                let endTime =  new Date(this.endDate).getTime();
                if(startTime <= baseTime && baseTime <= endTime) {
                    return true;
                }
                return false;
            },
            getWeekList() {
                let weekDay = this.baseDay.getDay();
                let weekArr = [];
                if(weekDay == 0) {
                  weekDay = 7;
                }
                let that = this;
                this.baseDay.setDate(this.baseDay.getDate() - weekDay + 1);
                for(let i = 0; i < 7; i++) {
                  let weekObj = {
                      year: that.baseDay.getFullYear(),
                      month: that.baseDay.getMonth() + 1,
                      day: that.baseDay.getDate(),
                      selected: that.compareTime(),
                      price: 0
                  };
                  weekObj.date = weekObj.year + '-' + this.zero(weekObj.month) + '-' + this.zero(weekObj.day);
                  weekArr.push(weekObj);
                  that.baseDay.setDate(that.baseDay.getDate() + 1);
                }
                return weekArr;
            },
            getMoney(arr) {
                for(let obj of this.priceCalendar.values()) {
                    if(obj.date == arr.date) {
                        let tempPrice = 0;
                        if(obj.realPrice) {
                          tempPrice = obj.realPrice;
                        }
                        if(arr.selected) {
                          if(this.allowGetPrice) {
                            this.allowGetPrice = false;
                            this.$emit('getFirstPrice', tempPrice);
//                            startDateTemp
                          }
                          this.crOrder.orderPrice += tempPrice;
                          this.feeArr.push(tempPrice);
                        }
                        return tempPrice;
                    }
                }
                return 0;
            },
            getStartRent(start, fee) {
                let min = TOOL.changeHourToMin(start);
                let endMin = 24*60;
                let realHour = Math.ceil((endMin-min)/60);
                if(realHour<this.aboveHourToDay) {
                  let money = (realHour/this.aboveHourToDay)*fee;
                  return money.toFixed(2);
                } else {
                  return fee;
                }

            },
            getEndRent(end, fee) {
              let min = TOOL.changeHourToMin(end);
              let realHour = Math.ceil(min/60);
              if(realHour<this.aboveHourToDay) {
                let money = (realHour/this.aboveHourToDay)*fee;
                return money.toFixed(2);
              } else {
                return fee;
              }
            },
        },
        created () {
            this.getDateList();
        }
    }
</script>
<style lang="less" scoped>
  .rentCalendar {
    width: 100%;
  }
  .rentCalendar-table-box {
    width: 100%;
    text-align: center;
    border-collapse:collapse;

    .thead {
      width: 100%;
      height: 60px;

      font-size: 24px;
      color: #888;
      tr {
        width: 100%;
        height: 60px;
        border-bottom: 1PX solid #e5e5e5;
      }
      th {
        font-weight: normal;
      }
    }
    .tbody:before, .tbody:after {
      display: block;
      width: 100%;
      height: 10px;
      background: #fff;
      content: ' ';
    }
    .tbody tr{
      width: 100%;
      height: 94px;

      td {
        height: 94px;

      }
      .calendar-item {
        display: inline-block;
        width: 80%;
        /*height: 80%;*/

        border-radius: 6px;
        overflow: hidden;

        .num {
          font-size: 24px;
          color: #4c4c4c;
          padding-top: 12px;
        }
        .money {
          font-size: 20px !important;
          color: #888;
          padding-top: 12px;
          padding-bottom: 10px;
        }
      }
      .calendar-item-active {
        background: #ff6600;

        .num, .money {
          color: #fff;
        }
      }
    }
  }
  .mar-b-28 {
    margin-bottom: 28px;
  }
</style>
