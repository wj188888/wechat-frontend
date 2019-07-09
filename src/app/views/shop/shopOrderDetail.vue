<template>
    <main-box :title="title" main-class="scrollingBox has-abs-bottom">
        <div class="order-status-box">
            <clocker class="clocker" :time="clocker.time" slot="value" @on-finish="finish" v-show="detailData.status === 0 && clocker.timeStatus && detailData.consumeType !== 1">
                <span>%_M1</span>
                <span>%_M2</span>
                <span>:</span>
                <span>%_S1</span>
                <span>%_S2</span>
            </clocker>
            <p class="order-status">
                <span>
                  {{detailData.status | getGoodsOrderStatusText(detailData.productTypeLevelOne)}}
                </span>
            </p>

            <p>
                <!-- -1:品牌约车行程中, 0:待支付, 1:已支付, 2:已失效（过了支付时间） 3:已退款 4:未评价 5:已评价 6:已过期（任务已执行但未乘坐）-->
                <!--* 拼车状态 0.未付款 1.未成团，2.未安排，3.已安排，4.已失效（过期未支付），5.已取消（司机或企业超时未响应）-->
                <span v-if="detailData.status === 0">请在截止时间前完成付款，到期后订单将自动取消</span>
                <!--<span v-if="detailData.status === 1">请在发车前10分钟到指定站点准备乘车</span>-->
                <span v-if="detailData.status === 2">订单超时未支付，已为您取消订单</span>
                <span v-if="detailData.status === 3">已成功为您办理退款，款项将于1-3个工作日内返还到您的账户上</span>
                <!--<span v-if="detailData.status === 4">您的班车已准时出发，请您及时评价</span>-->
                <span v-if="detailData.status === 5">感谢您的支持，欢迎下次继续乘坐</span>
                <span v-if="detailData.status === 6">您的班车已出发，下次记得准时乘坐哦</span>
                <span v-if="detailData.status === 11">正在申请退款中，请您耐心等待</span>
            </p>
        </div>

        <div class="shop__properties">
            <p class="shop__name"
               :class="{'pad-b-0':!detailData.propertyMap}">{{detailData.name}}</p>
            <div v-if="detailData.propertiesItem&&detailData.propertiesItem.length">
                <p class="shop__properties-item" v-for="(property, index) of detailData.propertiesItem">
                    {{property.name}}：{{property.value}}
                </p>
            </div>
        </div>

        <div class="ticket-info-order pad-b-0 mar-t-20">
            <p>
                <span class="left-span">订单编号</span>
                <span class="right-span">{{detailData.code}}</span>
            </p>
            <p>
                <span class="left-span">订单日期</span>
                <span class="right-span">{{detailData.createdTime}}</span>
            </p>

            <div class="abs-tit-box orange">
                <p class="abs-tit">订单价格</p>
                <p class="right-text">
                    <span>{{detailData.actualPayment | formatPrice}}</span>
                </p>
            </div>


            <p class="text-larger text-price-total line line-x-t">
                <span class="left-span">实付款</span>
                <span class="right-span orange">{{ detailData.actualPayment | formatPrice }}</span>
            </p>
        </div>



        <div class="ticket-info-order pad-0">
            <div class="line-height-100 line line-x">
                <p v-if="detailData.contactName">
                    <span class="left-span">联系人</span>
                    <span v-text="detailData.contactName"></span>
                </p>
                <p class="mar-t-0 line line-x-t">
                    <span class="left-span">联系电话</span>
                    <span v-text="detailData.contactTelephone"></span>
                </p>
                <p v-if="detailData.remark" class="mar-t-0 line line-x-t remark">
                    <i class="remark-left">备注</i>
                    <i class="remark-right">{{detailData.remark}}</i>
                </p>
            </div>
        </div>


        <!--未上车前都可以取消订单-->
        <!--订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期-->
        <!--拼车状态 0.待支付 1.待安排，2.已安排，3.已上车，4.已取消 5.已完成-->
        <!--<div class="online-service mar-t-20" v-if="detailData.productTypeLevelTwo === 'GOODS' && detailData.status !== 2 && detailData.status !== 11">
            <input type="button" class="button button-primary" value="取消订单" @click="cancleOrderAndTicket">
        </div>-->

        <div class="online-service mar-t-20">
            <input type="button" class="button button-primary" value="联系客服" @click="callService('')">
        </div>

        <div slot="footer">
            <div class="abs-bottom-box line line-x-t"
                 v-if="detailData.status === 0">
                <div class="buy-left clearfix">
                    <label>共计</label>
                    <span>{{ detailData.actualPayment | formatPrice }}</span>
                </div>
                <div class="buy-right">
                    <input type="button" class="button button-primary" @click="payMoney" :disabled="disableBtn" value="立即支付"/>
                </div>
            </div>

            <div class="abs-bottom-box  line line-x-t"
                 v-if="detailData.status === 2 || detailData.status === 3 || detailData.status === 5 || detailData.status === 6">
                <div class="buy-right buy-w100">
                    <a class="button button-primary" @click="againBuy">重新购买</a>
                </div>
            </div>

            <div class="abs-bottom-box  line line-x-t"
                 v-if="detailData.status === 1"
                 >
                <div class="buy-left clearfix" style="width: 50%;">
                    <input type="button" class="button button-empty" @click="cancleOrderAndTicket" :disabled="disableBtn" value="取消订单"/>
                </div>
                <div class="buy-right" style="width: 50%;">
                    <input type="button" class="button button-primary" @click="consumeShopOrder" :disabled="disableBtn" value="已完成"/>
                </div>
            </div>

            <!--<share-modal :show="showShare" @closeShare="showShare = false"></share-modal>-->
        </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index'
    import OrderBaseInfo from 'appComponents/orderBaseInfo/index'
    import GroupStatus from 'appComponents/groupStatus/index'
    import TicketNotice from 'components/ticketNotice/index'
    import ShareModal from 'appComponents/shareModal/index'
    import { Clocker, Swiper, SwiperItem, XDialog } from 'vux'
    import phone from 'mixins/phone'

    // consumeType消费方式：0.先付款后乘车，1.先乘车后付款
    export default {
        components: {
            MainBox,
            OrderBaseInfo,
            GroupStatus,
            TicketNotice,
            Clocker,
            Swiper,
            SwiperItem,
            XDialog,
            ShareModal
        },
        mixins: [phone],
        data () {
            // 订单状态：0待支付，1已支付，2已失效，3已退款,4未评价，5已评价，6已过期
            return {
                title: this.$route.meta.title,
                orderId: '',
                detailData: {
                    aAddress:{},
                    bAddress:{},
                    tickets:[],
                    propertiesItem: [],
                },
                dispatchVehicles: [],
                ticketList: [], //可用车票列表，拼车为未成团不展示车票
                insurePrice: 0, //保险金额
                insuranceNum: 0, //购买保险数
                adultNum: 0,
                childNum: 0,
//        allowRefund: true, // 是否允许退款
                ticketTipsShow: false, //退票须知
                refundNotice: '', //购票须知
                returnReson: ['车辆故障', '车辆晚点太久', '车辆不符', '多次购票', '其他'],
                countState: false,
                returnData: {
                    orderId: '',
                    ticketId: '',
                    refundReason: ''
                },
                tuiDialog: {
                    showDialog: false,
                    showSuc: false,
                    showFal: false
                },
                clocker: {
                    time: TOOL.newGetDate({date: new Date(), type: 'future'}),
                    timeStatus: true
                },
                showDialog: false, // 控制弹窗
                dialogServiceCar: '',// 弹窗要显示的服务车辆信息
                showShare: false,
                feederData:[],
                disableBtn: false,
            }
        },
        computed: {
            orderAmount () {
                let commissionPrice = this.detailData.commissionPrice || 0
                let invoicePrice = this.detailData.invoicePrice|| 0
                return this.detailData.amount - this.insurePrice * this.insuranceNum - commissionPrice - this.detailData.serviceFee - invoicePrice
            },
            /**
             * 退票按钮控制
             */
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
            },

            serviceCarsList () {
                let newObj = Object.assign({},this.detailData)
                if(newObj.serviceCars && newObj.serviceCars.length){
                    return newObj.serviceCars
                }else if (newObj.dispatchVehicles && newObj.dispatchVehicles.length){
                    return newObj.dispatchVehicles
                }else{
                    return []
                }
            }
        },
        mounted () {
            this.initialize()
        },
        methods: {
            initialize () {
                this.orderId = this.$route.query.orderId;
                this.orderDetailById();
//                this.shuttleOrderFindByOrderId();
            },
            /**
             * 查找订单详情
             */
            orderDetailById () {
                this.$store.commit('UPDATE_LOADING', true)
                api.orderDetailById({
                    orderId: this.orderId
                }).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.detailData = data.resultData;
                        this.initProperties();
                        if (data.resultData.status === 0) {
                            this.clocker.time = data.resultData.paymentInvalidTime
                            this.countState = true
                        }
                        console.log(this.detailData);
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

            initProperties() {
                if(this.detailData.propertyMap) {
                    this.detailData.propertiesItem = [];
                    for(let [key, val] of Object.entries(this.detailData.propertyMap)) {
                        this.detailData.propertiesItem.push({
                            name: key,
                            value: val
                        });
                    }
                }
            },

//      checkCanRefundOrder() {
//
//      },

            /**
             * 退票需判断发车时间是否大于当前时间
             * 退票规则：
             * 1.车辆已出发，不能进行退票
             * 2.发车前2小时内退票，收取20%的手续费，发车前大于等于2小时，收取10%的手续费
             */
            openRefundTicket () {
                api.checkCanRefundOrder({orderId: this.detailData.id}).then(res =>{
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    //判断是否已发车
                    if(this.isRefund <= 0){
                        this.$store.dispatch('showError', '车已出发啦，无法退票')
                    }else if(this.isRefund > 0){
                        //判断企业后台是否开启不允许线上退票
                        if (data.resultCode === '0') {
                            //判断是多张票or单张票
                            console.log(this.detailData);
                            if(this.detailData.tickets.length > 1 && this.detailData.productTypeLevelOne=='CITY_BUS') {
                                this.retTicket();
                            } else if(this.detailData.tickets.length > 1 &&this.detailData.productTypeLevelOne=='STATION_BUS') {
                                this.retTicket();
                            } else {
                                if (this.detailData.productTypeLevelTwo === 'LINE_CAR_POOL_BUS') {
                                    this.$store.dispatch('showError', TOOL.LINE_CAR_POOL_BUS + '不支持退票');
                                    return
                                }
                                if (this.detailData.productTypeLevelOne === 'CUSTOM_BUS') {
                                    this.$store.dispatch('showError', '请联系公司线下为您办理退票');
                                    return
                                }
                                this.tuiDialog.showDialog = true
                            }
                        }else {
                            if(data.resultCode === '40001') {
                                this.$store.dispatch('showAlert', {content: '该车次不支持线上退款，请联系所在车站管理员处理',buttonText:'好的'});
                            } else {
                                this.$store.dispatch('showError', data.resultMsg)
                            }
                        }
                    }
                });

            },

            /**
             * 退票
             * 退票需企业后台审核
             */
            retTicket () {
                let _this = this
                if(this.detailData.tickets.length > 1) {
                    appStorage.set('refundMore', JSON.stringify(this.detailData))
                    this.$router.push({
                        name: 'refundMore',
                        query: {
                            orderId:this.detailData.id
                        }
                    });
                    return false;
                }
                this.returnData.ticketIds = [];
                this.returnData.orderId = this.detailData.id;
                for(let [index, value] of this.detailData.tickets.entries()) {
                    this.returnData.ticketIds.push(value.ticketId)
                }
                this.returnData.ticketIds = this.returnData.ticketIds.join(',');
                this.$store.commit('UPDATE_LOADING', true)
                api.ticketRefundMore(this.returnData).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.tuiDialog.showDialog = false
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

            /**
             * 查询接驳信息
             */
            shuttleOrderFindByOrderId () {
                api.shuttleOrderFindByOrderId(this.orderId).then(res => {
                    const data = TOOL.toJson(res.data)
                    if (data.resultCode === '0') {
                        this.feederData = data.resultData || []
                    }
                });
            },

            /**
             * 跳转接驳详情
             */
            jumpToFeederDetail (data) {
                this.$router.push({
                    name:'feederDetail',
                    query:{
                        feederId: data.id
                    }
                })
            },

            showCarDialog(carData) {
                this.dialogServiceCar = carData;
                this.showDialog = true;
            },

            hideCarDialog() {
                this.showDialog = false;
            },

            finish () {
                this.clocker.timeStatus = false;
                if(this.detailData.productTypeLevelTwo !== 'CITY_CAR_POOL_BUS' && this.detailData.consumeType !== 1){
                    api.invalidOrder(this.orderId).then(res => {
                        const data = TOOL.toJson(res.data)
                        this.$store.commit('UPDATE_LOADING', false)
                        if (data.resultCode === '0') {
                            this.initialize();
                        }
                    })
                }
            },

            groupFinish () {
                this.orderDetailById();
            },

            /**
             *  订单支付
             */
            payMoney (){
                this.disableBtn = true
                interfaceApi.wxPay({
                    tradeNo: this.orderId,
                    productTypeLevelOne: this.detailData.productTypeLevelOne,
                    wxPaySuccess: TOOL.wxPaySuccess,
                    wxPayFail: TOOL.wxPayFail,
                    price: this.detailData.actualPayment
                })
                setTimeout(()=>{
                    this.disableBtn = false
                },1000)
            },

            /**
             * 确认上车
             */
            carpoolOrderConfirm () {
                if(this.detailData.consumeType === 0){
                    this.confirmToBus()
                }else{
                    if(this.detailData.carpoolStatus === 3){
                        this.payMoney()
                    }else{
                        this.confirmToBus()
                    }

                    /*if(this.detailData.status === 1){
                     this.confirmToBus()
                     }else{
                     this.payMoney()
                     }*/
                }
            },
            confirmToBus () {
                this.$store.dispatch('showConfirm', {
                    title: '温馨提醒',
                    content: '是否确定已经上车？',
                    onConfirm: () => {
                        this.$store.commit('UPDATE_LOADING', true)
                        api.carpoolOrderConfirm(this.orderId).then(res => {
                            const data = TOOL.toJson(res.data)
                            this.$store.commit('UPDATE_LOADING', false)
                            if (data.resultCode === '0') {
                                this.$store.dispatch('showSuccess', '您已确认上车')
                                this.orderDetailById();
                            } else {
                                this.$store.dispatch('showError', data.resultMsg);
                            }
                        })
                    },
                    onCancel: () => {
                    }
                })
            },

            /**
             *  完成订单
             */
            consumeShopOrder() {
                this.$store.dispatch('showConfirm', {
                    title: '状态确认',
                    content: '商品服务是否已经完成？',
                    onConfirm: () => {
                        this.$store.commit('UPDATE_LOADING', true)
                        api.consumeShopOrder(this.orderId).then(res => {
                            const data = TOOL.toJson(res.data)
                            this.$store.commit('UPDATE_LOADING', false)
                            if (data.resultCode === '0') {
                                this.$store.dispatch('showSuccess', '操作完成')
                                this.orderDetailById();
                            } else {
                                this.$store.dispatch('showError', data.resultMsg);
                            }
                        })

                    },
                    onCancel: () => {
                    }
                })
            },

            /**
             *  取消订单
             */
            cancleOrderAndTicket () {
                this.$store.dispatch('showConfirm', {
                    title: '温馨提醒',
                    content: '是否确定要取消订单？',
                    onConfirm: () => {
                        this.$store.commit('UPDATE_LOADING', true)
                        api.cancelShopOrder(this.orderId).then(res => {
                            const data = TOOL.toJson(res.data)
                            this.$store.commit('UPDATE_LOADING', false)
                            if (data.resultCode === '0') {
                                this.$store.dispatch('showSuccess', '取消订单成功')
                                this.orderDetailById();
                            } else {
                                this.$store.dispatch('showError', data.resultMsg);
                            }
                        })

                    },
                    onCancel: () => {
                    }
                })
            },

            /**
             *  订单查看线路详情跳转到对应的车票页面
             *  如只有一张票则跳转至车票详情页面
             */
            goTicket () {
                if(this.detailData.tickets && this.detailData.tickets.length === 1){
                    this.$router.push({
                        name: 'ticketDetail',
                        query: {
                            ticketId: this.detailData.tickets[0].ticketId
                        }
                    });
                }else{
                    let productTypeLevelOne = this.detailData.productTypeLevelOne
                    if (productTypeLevelOne === 'LINE_BUS') {
                        productTypeLevelOne = 'CUSTOM_BUS'
                    }
                    this.$router.push({
                        name: 'ticketList',
                        query: {
                            productTypeLevelOne: productTypeLevelOne,
                            orderId:this.detailData.id,
                            ticketType: 'own'
                        }
                    });
                }
            },

            /**
             * 再次购买
             */
            getSearchKey (address) {
                if(address.county) {
                    if(address.town){
                        return address.county + '('+ address.town +')'
                    }else{
                        return address.county
                    }
                }
                return address.city
            },

            againBuy () {
                this.$router.push({
                    name: 'shopIndex'
                });
            },

            // 跳转到发票页面
            jumpToInvoice() {
                this.$router.push({
                    name: 'invoice',
                    query: {
                        edit: 0
                    }
                })
            },

            /**
             * 跳转评价
             */
            jumpToOederEval () {
                if (this.detailData.productTypeLevelOne === 'CUSTOM_BUS') {
                    this.$store.dispatch('showError', TOOL.CUSTOM_BUS + '不支持评价')
                    return
                }
                this.$router.push({
                    name:'orderEval',
                    query: {
                        orderId: this.detailData.id,
                        productTypeLevelOne: this.detailData.productTypeLevelOne
                    }
                })
            }
        }

    }
</script>
<style lang="less" scoped>
    .shop__properties {
        padding: 20px;
        background: #fff;
    }
    .shop__name {
        font-size: 34px;
        color: #333;
        padding-bottom: 20px;
        width: 100%;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .shop__properties-item {
        font-size: 28px;
        color: #999;
        padding-bottom: 20px;
    }
    .order-status-box {
        position: relative;
        height: 170px;
        margin-bottom: 20px;
        padding: 20px;
        background-color: #ff9900;
        color: #fff;
    .order-status {
        margin: 22px 0 28px;
        font-size: 36px;
    }
    .order-status-tips {
        font-size: 24px;
        line-height: 1.414;
    }
    .clocker{
        position:absolute;
        right:20px;
        top:42px;
        font-size:28px;
    }
    }

    .order-ticket {
        margin-bottom: 20px;
        overflow: hidden;
    }

    .ewm-pic-box {
        height: 520px;
        background-color: #fff;
    .ewm-pic {
        position: relative;
        width: 100%;
        height: 312px;
        margin-top: 140px;
        text-align: center;
    .ticket-status-tag {
        position: absolute;
        top: -20px;
        left: 50%;
        width: 168px;
        height: 135px;
        background: no-repeat center center;
        background-size: 168px 135px;
        z-index: 1;
    }
    .ticket-status-2 {
        background-image: url("../../../assets/ticket_2.png");
    }
    .ticket-status-3 {
        background-image: url("../../../assets/ticket_3.png");
    }
    .ticket-status-456 {
        background-image: url("../../../assets/ticket_456.png");
    }
    .ticket-status-8 {
        background-image: url("../../../assets/ticket_8.png");
    }
    img {
        width: 260px;
        height: 260px;
    &.opacity {
         opacity: 0.3;
     }
    }
    }

    .ticket-user {
        position: absolute;
        left: 0;
        bottom: 32px;
        width: 100%;
        display: flex;
        text-align: center;
        font-size: 26px;
        color: #b2b2b2;
    p {
        flex: 1;
        height: 34px;
        line-height: 34px;
    }
    i {
        display: inline-block;
        vertical-align: bottom;
    }
    .icon-username {
        width: 40px;
        height: 34px;
        background: url('../../../assets/user.png') no-repeat 0 center;
        background-size: 27px 31px;
    }
    .icon-userphone {
        width: 32px;
        height: 34px;
        background: url('../../../assets/phone.png') no-repeat 0 center;
        background-size: 19px 31px;
    }
    }
    }

    .btn-ewm-save {
        display: block;
        height: 80px;
        line-height: 80px;
        font-size: 28px;
        color: #272a35;
        text-align: center;
    }

    .ticket-info-box {
        margin-bottom: 20px;
        background-color: #fff;
    }

    .ticket-h2 {
        height: 86px;
        line-height: 86px;
        padding: 0 20px;
        font-size: 28px;
        color: #272a35;
        font-weight: normal;
    &.ticket-tips-tit {
         position: relative;
         padding-left: 77px;
         background: url('../../../assets/ticket_tips.png') no-repeat 20px center;
         background-size: 37px 37px;
    i:after {
        right: 20px;
    }
    }
    span {
        margin-left:5px;
        color: #999;
        font-size: 24px;
    }
    }

    .ticket-tips {
        padding: 0 20px 60px;
        overflow: hidden;
    h3 {
        margin: 30px 0 26px;
        font-size: 26px;
        color: #272a35;
    }
    .h-2 {
        margin-top: 60px;
    }
    p {
        position: relative;
        padding-left: 40px;
        margin-bottom: 20px;
        line-height: 1.414;
        font-size: 26px;
        color: #6b6c70;
    }
    span {
        position: absolute;
        left: 0;
        top: 0;
    }
    .warning-tips {
        padding-left: 0;
        color: #ff6600;
    }
    }

    .ticket-info-order {
        padding: 28px 0;
        margin-bottom: 20px;
        background-color: #fff;
    p {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        margin-top: 20px;
        font-size: 26px;
        color: #272a35;
    &:first-child {
         margin-top: 0;
     }
    }
    .remark {
        display: flex;
    }
    .remark-left {
        /*width: 60px;*/
        padding-right: 30px;
        color: #999;
    }
    .remark-right {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .left-span {
        float: left;
        width: 160px;
        height: 30px;
        color: #999;
    }
    .right-span {
        float: right;
        height: 30px;
        color: #999;
    em {
        color: #272a35;
    }
    }
    .name {
        display: inline-block;
        min-width: 140px;
    }
    .tel {
        display: inline-block;
        padding-left: 20px;
        margin-left: 16px;
        background: url('../../../assets/phone-blue.png') no-repeat 0 center;
        background-size: 15px 24px;
        color:#2772CC;
    }
    .text-larger .left-span,
    .text-larger .right-span {
        font-size: 30px;
        color: #272a35;
    }
    .text-larger .gray {
        color: #999;
    }
    .text-price-total {
        height: 88px;
        line-height: 88px;
    .left-span,
    .right-span {
        height: 88px;
    }
    }
    .abs-tit-box {
        position: relative;
        color: #999;
    .abs-tit {
        position: absolute;
        left: 0;
        top: 0;
        height: 30px;
        color: #999;
    }
    .right-text {
        height: 30px;
        color: #999;
        text-align: right;
    }
    .special-tips {
        margin-left: 180px;
        padding-left: 0;
        height: auto;
        text-align: left;
        color: #272a35;
    }
    .right-text span {
        display: inline-block;
    }
    .right-text em {
        height: 30px;
        color: #272a35;
    }
    }
    }
    .line-height-100 p{
        height:100px;
        line-height:100px;
    }

    .tag-age {
        display: inline-block;
        margin-left: 20px;
        line-height: 1;
        padding: 4px 8px;
        background-color: #FF9900;
        color: #fff;
        font-size: 20px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        vertical-align: top;
    &.tag-age-child {
         background-color: #2772CC;
     }
    }
    .orange {
        color: #ff6600 !important;
    }
    .abs-bottom-box{
    .order-tips{
        float:left;
        line-height:96px;
        padding-left:20px;
        font-size:24px;
        color:#4c4c4c;
    }
    .price{
        font-size:28px;
    span{
        font-size: 30px;
        color: #ff6600;
    }
    }
    .icon-tips{
        padding-left:60px;
        background:url("../../../assets/i.png") no-repeat 20px center;
        background-size:30px 30px;
    }
    .button-small{
        float:right;
        margin-right:20px;
        margin-top:23px;
        font-size: 28px;
        width: auto;
        padding:0 20px;
        height: 50px !important;
        line-height: 50px
    }
    }

    .swiper-dispatch {
        padding-top: 50px;
    }
    .dispatch-vehicles {
    span {
        text-align: left !important;
    }
    }
    .dispatch-car {
        position: absolute;
        right: 20px;
        top: 70px;

        font-size: 28px;
        padding-right: 28px;
        background: url("../../../assets/charter/gantan.png") no-repeat right top;
        background-size: 24px 24px;
    }
    .dispatch-hide {
        display: none;
    }
    .dispatch-title {
        width: 100%;
        height: 80px;
        line-height: 80px;
        padding-left: 20px;

        text-align: left;
        font-size: 28px;
    }
    .dispatch-bottom {
        width: 100%;
        height: 80px;
        line-height: 80px;

        text-align: center;
        font-size: 28px;
    }
    .pad-0 {
        padding: 0 !important;
    }
    .pad-t-20 {
        padding-top: 20px !important;
    }
    .pad-b-50 {
        padding-bottom: 50px !important;
    }
    .mar-b-0 {
        margin-bottom: 0 !important;
    }
    .black-color {
        color: #272a35 !important;
    }
    .txt-left {
        text-align: left !important;
    }
    .float-l {
        float: left !important;
    }
    .wd-220 {
        width: 220px !important;
    }
    .icon-feeder-send{
        padding-left:36px;
        background:url("../../../assets/icon-feeder-send.png") no-repeat 0 center;
        background-size:26px 26px;
    }
    .icon-feeder-pick{
        padding-left:36px;
        background:url("../../../assets/icon-feeder-pick.png") no-repeat 0 center;
        background-size:26px 26px;
    }
    .text-888{
        color:#888;
        padding-right:20px;
    }
    .text-ff6600{
        color:#ff6600;
        padding-right:20px;
    }
    .online-service {
        padding: 0 20px;
    input {
        height: 80px;
        background-color: #fff;
        font-size: 28px;
        color: #4c4c4c;
        border-color: #e5e5e5;
    }
    }
    .button-gray-one{
        background: #8e8e8e;
        border: none;
    }
    .pull-left{
        float: left;
    }
    .width-500{
        width: 500px;
    }
    .display-flex{
        display: flex;
    }
    .border{
        border: 1PX solid #e5e5e5;
    }
</style>
