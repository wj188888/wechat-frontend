<template>
    <ul class="ticket-list" v-if="listData && listData.length > 0">
        <li class="ticket-box line line-box radius-box" v-for="data in listData" @click="jumpToTicketDetail(data.id, data.status)">
            <div class="half-circle hc-left"></div>
            <div class="half-circle hc-right"></div>
            <div class="gen-ticket-box">
                <div class="order-box">
                    <div class="start">
                        <span class="circle circle-bg-start">始</span>
                        <span class="place">
                        {{ getData(data).aAddress | getAddressStation(getData(data).onStation) }}
                      </span>
                        <div class="price">
                            <p class="number">
                              <em v-if="data.integralPrice">{{data.integralPrice}}</em>
                              {{data.integralPrice ? ' 积分' : ''}}
                              {{data.integralPrice && data.actualPayment ? ' + ' : ''}}
                              {{data.actualPayment ? ' ¥' : ''}}
                              <em>{{ data.actualPayment ? data.actualPayment : ''}}</em>
                            </p>
                        </div>
                    </div>
                    <div class="end">
                      <span class="circle circle-bg-end"
                            v-if="!getData(data).terminal || getData(data).offStation.name == getData(data).terminal">终</span>
                        <span class="circle circle-bg-station" v-else>过</span>
                        <span class="place">
                        {{ getData(data).bAddress | getAddressStation(getData(data).offStation) }}
                      </span>
                    </div>

                </div>
            </div>
            <div class="gen-ticket-info">
                <p class="person" v-if="productType != 'WORK_BUS' && productType != 'SCHOOL_BUS'" :class="{'no-person': productType == 'TOUR_BUS'}">
                    乘车人：{{data.passengerName}}
                </p>
                <p class="time"  v-if="productType != 'TOUR_BUS'" :class="{'no-person': productType == 'WORK_BUS' || productType == 'SCHOOL_BUS'}">
                    {{ getData(data).startupTime | formatDate('holeDate') }} 发车
                </p>

                <span class="eval-state red-back" v-show="data.status==0">未付款</span>
                <span class="eval-state green-back" v-show="data.status==1">未验票</span>
                <span class="eval-state green-back" v-show="data.status==2">已验票</span>
                <span class="eval-state orange-back" v-show="data.status==3">已乘坐</span>
                <span class="eval-state orange-back" v-show="data.status==5">已退票</span>
                <span class="eval-state gray-back" v-show="data.status==6">已失效</span>
                <span class="eval-state gray-back" v-show="data.status==7">已过期</span>
                <span class="eval-state gray-back" v-show="data.status==8">退票中</span>
            </div>
        </li>
    </ul>
</template>
<script>
    export default {
        props:['listData', 'type', 'productType'],
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            /**
             * 车票列表返回 orderSku
             * 验票列表直接返回
             */
            getData (data) {
                if(this.type === 'ticket'){
                    return data.orderSku
                }
                return data
            },

            /**
             * 车票列表返回
             * 验票列表直接返回
             */
            getProductType (data) {
                if(this.type === 'ticket'){
                    return this.productType
                }
                return data.productTypeLevelOne
            },

            /**
             * 跳转车票详情
             * 0未付款, 1未验票, 2已验票, 3已乘坐, 5已退票, 6已失效（未支付，不能支付了）, 7已过期(行程已完成了但未乘坐), 8退款申请中
             */
            jumpToTicketDetail (ticketId, status) {
                if (status == 1 || status == 2) {
                    this.$router.push({
                        name: 'ticketDetail',
                        query: {
                            ticketId: ticketId
                        }
                    })
                }
            },
        }
    }
</script>
