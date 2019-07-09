<template>
    <main-box :title="title">
        <div class="flex-vertical">
            <div class="flex-vertical-box mar-t-0">
                <ul class="passenger-list check-passenger-list">
                    <li class="line line-x-b passenger_li_list"
                        v-for="(passenger, index) in tickets"
                        @click="checkPassenger(index, passenger)">
                        <div class="check-box" v-if="passenger.status == 1">
                            <input class="hide" type="checkbox"
                                   v-model="passenger.check"
                                   :checked="passenger.check">
                            <i class="icon-check"></i>
                        </div>
                        <p class="name color-4c4c4c"
                           :class="{'c-f-888': passenger.status != 1}">
                            {{passenger.passengerName}}
                        </p>
                        <p class="card-num c-f-888" v-text="passenger.passengerIdcard"></p>

                        <div class="ticket-validate">
                            <span v-if="passenger.status == 1">未验票</span>
                            <span v-if="passenger.status == 2">已验票</span>
                            <span v-if="passenger.status == 3">已乘坐</span>
                            <span v-if="passenger.status == 5">已退票</span>
                            <span v-if="passenger.status == 6">已失效</span>
                            <span v-if="passenger.status == 7">已过期</span>
                            <span v-if="passenger.status == 8">退款申请中</span>
                        </div>
                    </li>
                    <!--<li class="refund_amount">-->
                        <!--<p>退票金额<span>￥<span class="money_txt">{{price}}</span></span></p>-->
                    <!--</li>-->
                </ul>

                <!--退票-->
                <!--<p class="login-footer">-->
                    <!--<input type="button" value="退票"-->
                           <!--:disabled = "!checked"-->
                           <!--@click="openRefundTicket"-->
                           <!--class="login-btn"/>-->
                <!--</p>-->

                <div slot="footer">
                    <div class="abs-bottom-box">
                        <div class="buy-left line line-x-t clearfix" @click="showPriceDetail = !showPriceDetail">
                            <label>退票金额</label>
                            <span v-if="refundFeeData.refundPrice >=0">￥{{refundFeeData.refundPrice}}</span>
                            <span class="detail" v-show="priceMore">详情</span>
                            <i class="yellow-jt-up" v-show="priceMore"></i>
                        </div>
                        <div class="buy-right">
                            <input type="button" @click="openRefundTicket"
                                   :disabled="disableBtn || !checked"
                                   class="button button-primary" value="退票"/>
                        </div>
                    </div>

                    <div class="price-detail" v-show="priceMore && showPriceDetail">
                        <div class="price-mask" @click="showPriceDetail = false"></div>
                        <div class="price-detail-box">
                            <p>
                                <span class="price-d-tit">车票价格</span>
                                <span class="price-d-box">￥{{refundFeeData.price}}</span>
                            </p>
                            <p class="line line-x-t" v-if="refundFeeData.refundFee != 0">
                                <span class="price-d-tit">手续费</span>
                                <span class="price-d-box">-￥{{refundFeeData.refundFee}}</span>
                            </p>
                            <p class="line line-x-t" v-show="refundFeeData.refundShuttle">
                                <span class="price-d-tit">接驳服务</span>
                                <span class="price-d-box">
                                    <span class="shuttle_txt"
                                          v-if="refundFeeData.shuttlePrice !=0">
                                        ￥</span>
                                    {{refundFeeData.shuttlePrice}}</span>
                            </p>
                        </div>
                    </div>


                </div>

                <!--填写退票原因-->
                <div id="tui-clear-over">
                    <x-dialog :show="tuiDialog.showDialog" class="dialog-demo">
                        <div class="return-title">
                            <span>请选择退票原因</span>
                            <i class="close" @click="tuiDialog.showDialog = false"></i>
                        </div>
                        <div class="mar-lr-20 tc-dialog">
                            <div class="check-item line line-box radius-box" v-for="data in returnReson">
                                <div class="check-box">
                                    <label>
                                        {{data}}
                  <input class="hide" type="radio" :value="data" v-model="returnData.refundReason"/>
                                        <i class="icon-com"></i>
                                    </label>
                                </div>
                            </div>

                            <div class="check-item line line-box radius-box">
                                <input type="button" value="确认" @click="retTicket" class="button button-primary return-mg">
                            </div>
                        </div>
                    </x-dialog>
                </div>

            </div>
        </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import { Clocker, Swiper, SwiperItem, XDialog } from 'vux'

    export default {
        components: {
            MainBox,
            Clocker,
            Swiper,
            SwiperItem,
            XDialog,
        },
        data () {
            return {
                title: '退票',
                tickets: [],
                price: 0,
                orderId: this.$route.query.orderId,
                checked: false,//控制按钮颜色
                detailData: {},
                selectedIds: [],
                disableBtn: false,
                priceMore: false,
                showPriceDetail: false,
                tuiDialog: {
                    showDialog: false,
                    showSuc: false,
                    showFal: false
                },
                returnReson: ['车辆故障', '车辆晚点太久', '车辆不符', '多次购票', '其他'],
                returnData: {
                    orderId: '',
                    ticketId: '',
                    refundReason: ''
                },
                refundFeeData: {}, //退票价格计算
                showDialog: false, // 控制弹窗
            }
        },
        mounted () {
            this.orderDetailById();
        },
        computed: {
            isRefund () {
                let now = TOOL.newGetDate({type: 'holeDate'})
                let refund = true

                if(this.detailData.productTypeLevelOne === 'STATION_BUS' ||
                    this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS' ||
                    this.detailData.productTypeLevelOne === 'CUSTOM_BUS'){
                    refund = false
                }
//      && refund
                if(this.detailData.startupTime){
                    return TOOL.dateCompare(this.detailData.startupTime, now, 'datetime') > 0
                }
            }
        },
        methods: {
            /**
             * 选择旅客
             */
            checkPassenger (index, passenger) {
                passenger.check = !passenger.check;
                let checklength = 0;

                this.checked = false;
                this.selectedIds = [];
                this.jieBoRefund = true;
                for(let [index, value] of this.tickets.entries()) {
                    if(value.check) {
                        checklength++;
                        this.selectedIds.push(value.ticketId);
                        this.checked = true;
                        this.priceMore = true;
                    }
                }
                this.price = checklength * this.detailData.adultPrice;

                this.findRefundFee();
            },

            //查看车票
            orderDetailById () {
                this.$store.commit('UPDATE_LOADING', true)
                api.orderDetailById({
                    orderId: this.orderId
                }).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.detailData = data.resultData;
                        this.tickets = this.detailData.tickets;
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            /**
             * 退票需判断发车时间是否大于当前时间
             * 退票规则：
             * 1.车辆已出发，不能进行退票
             * 2.发车前2小时内退票，收取20%的手续费，发车前大于等于2小时，收取10%的手续费
             */
            openRefundTicket () {
                if (this.isRefund > 0) {
                    if (this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS') {
                        this.$store.dispatch('showError', TOOL.LINE_CAR_POOL_BUS + '不支持退票');
                        return
                    }
                    if (this.detailData.productTypeLevelOne === 'CUSTOM_BUS') {
                        this.$store.dispatch('showError', '请联系公司线下为您办理退票');
                        return
                    }
                    this.tuiDialog.showDialog = true
                } else {
                    this.$store.dispatch('showError', '车已出发啦，无法退票')
                }
            },

            findRefundFee () {
              this.$store.commit('UPDATE_LOADING', true)
                let apiData = {
                    ticketIds: [],
                    orderId: ''
                };
                apiData.ticketIds = this.selectedIds.join(',');
                apiData.orderId = this.detailData.id;
                api.findRefundFee(apiData).then(res => {
                    const data = TOOL.toJson(res.data);
                    this.$store.commit('UPDATE_LOADING', false);
                    if (data.resultCode === '0') {
                        this.refundFeeData = data.resultData;
                    } else {
                        this.$store.dispatch('showError', data.resultMsg)
                    }
                })
            },

            /**
             * 退票
             * 退票需企业后台审核
             */
            retTicket () {
                let _this = this
                this.tuiDialog.showDialog = false;
                this.returnData.ticketIds = this.selectedIds.join(',');
                this.returnData.orderId = this.detailData.id;
                this.$store.commit('UPDATE_LOADING', true);
                api.ticketRefundMore(this.returnData).then(res => {
                    const data = TOOL.toJson(res.data);
                    this.$store.commit('UPDATE_LOADING', false);
                    if (data.resultCode === '0') {
                        this.$store.dispatch('showAlert', {
                            title: '退票成功',
                            content: '您的车票已退，车票款将于2个工作日内返还到您的账户上',
                            buttonText: '好的',
                            onHide: ()=> {
                                _this.$router.push({
                                    name: 'ticketList',
                                    query: {
                                        productTypeLevelOne: this.detailData.productTypeLevelOne
                                    }
                                })
                            }
                        })
                    } else {
                        this.$store.dispatch('showError', data.resultMsg)
                    }
                })
            },

        }
    }
</script>

<style lang="less" scoped>
    .price-detail-box{
        padding:0;
        p{
            margin:0;
            height:80px;
            overflow:hidden;
        }
        .price-d-tit{
            float:left;
            width:auto;
            line-height:80px;
            color:#121212;
        }
        .price-d-box{
            float:right;
            line-height:80px;
            text-align:right;
        }
    }
    .passenger_li_list{
        margin-bottom: 0;
    }
    .refund_amount{
        height: 100px;
        padding-left: 0;
        display: flex;
        align-items: center;
        p{
            color: #383A3E;
            margin-left: 20px;
            font-size: 28px;
            span{
                margin-left: 12px;
                color: #ff6600;
                font-size: 28px;
                .money_txt{
                    margin-left: 0;
                    font-size: 40px !important;
                }
            }
        }
    }
    .ticket-validate {
        position: absolute;
        right: 20px;
        top: 0;
        display: inline-block;
        height: 130px;
        line-height: 130px;
        font-size: 28px;
        color: #888888;
    }
    .login-footer{
        margin:40px 20px;
        display: flex;
        .login-btn{
            flex:1;
            display: block;
            height:80px;
            line-height:80px;
            text-align: center;
            color: #ffffff;
            background-color: #ff6600;
            border:0;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            font-size:32px;
            &[disabled]{
                color: #ffffff;
                font-size: 32px;
                background-color:#cccccc;
            }
        }
    }
    .shuttle_txt{
        display: inline-block !important;
        padding-right:0 !important;
    }
</style>

