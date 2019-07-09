<template>
    <div>
        <c-header :title="title" :show-more="false" :go-back="goBack"></c-header>
        <div class="app-container">
            <div class="app-main flex-box">
                <driver-info :order-id="orderId" :product-type="orderInfo.productTypeLevelOne" :driver-info="orderInfo.dispatchDriverInfo" :hide-phone="true"></driver-info>
                <div class="map-container map-box" id="container"></div>
                <div class="order-hold-box">
                    <p class="p1" v-text="orderText.p1"></p>
                    <p class="p2" v-html="orderText.p2"></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import CHeader from 'components/c-header/index.vue'
    import DriverInfo from 'components/driver-info/index.vue'
    import qqMap from '../../../utils/qqmap/CreateMap'
    import sharePic from 'static/pics/map.png'
    import {XDialog} from 'vux'

    export default {
        components: {
            CHeader,
            DriverInfo,
            XDialog
        },
        data () {
            return {
                title: '',
                pageRouter: this.$route.name,
                orderId:'',
                productTypeLevelOne:'',
                orderStatus: -1,
                orderText:{
                    p1:'',
                    p2:''
                },
                map:'',
                container:'container',
                mapConfig:{
                    lat: 0,
                    lng: 0,
                    zoom:14
                },
                startPoint:'',
                startPointer:'',
                endPoint:'',
                endPointer:'',
                mapRoute:'',
                resetControl:'',
                showTimerBox: true,
                showFailBox: false,
                distance:'',
                duration:'',
                carPosition:'',
                carPointer:'',
                bestView: {
                    controls: [],
                    pos: {
                        paddingTop: 80,
                        paddingBottom: 80,
                        paddingLeft: 30,
                        paddingRight: 30
                    }
                },
                orderInfo:{
                    dispatchDriverInfo:{},
                    aAddress:{},
                    bAddress:{},
                },
                pollingSatus:true
            }
        },
        watch: {
            carPosition (newVal) {
                if(newVal){
                    this._addGuideLayer()
                }
            }
        },
        mounted () {
            this.orderId = this.$route.query.orderId
            this.productTypeLevelOne = this.$route.query.productTypeLevelOne
            if(this.productTypeLevelOne === 'TAXI'){
                this.title = '出租的士'
            }else{
                this.title = '品牌约车'
            }
            this.chBaseOrderPolling(this.orderId, this.orderStatus)
        },
        destroyed () {
            this.reset()
        },
        methods:{
            goBack () {
                this.$router.push({
                    name: appStorage.get('indexRouter')
                })
            },

            reset () {
                this.pollingSatus = false
                if(this.carPointer){
                    this.carPointer.shutDownPolling()
                }
            },

            chBaseOrderPolling (orderId, orderStatus) {
                if(!this.pollingSatus){
                    return
                }

                api.chBaseOrderPolling(this.orderId, this.orderStatus).then(res => {
                    const data = TOOL.toJson(res.data)
                    if (data.resultCode == '0') {
                        this.orderInfo = data.resultData.content
                        if(this.orderStatus != this.orderInfo.chStatus){
                            this.orderStatus = this.orderInfo.chStatus
                            this.distance = data.resultData.distance
                            this.duration = data.resultData.duration
                            this.chBaseOrderPolling(this.orderId, this.orderStatus)
                        }

                        //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
                        switch(this.orderInfo.chStatus){
                            case 1:
                            case 10:
                                this.orderText.p1 = '司机正在来接你'
                                this.orderText.p2 = `司机距您约${TOOL.getkilometer(this.distance)}，${TOOL.getViewTime(this.duration)}`
                                break;
                            case 2:
                                if(this.mapRoute){
                                    this.mapRoute.remove()
                                }
                                this.orderText.p1 = '司机已到达'
                                this.orderText.p2 = '乘客您好，司机已到达上车地点，请您及时上车'
                                break;
                            case 3:
                                this.orderText.p1 = '行程中'
                                this.orderText.p2 = `距离${this.orderInfo.bAddress.detailAddress}${TOOL.getkilometer(this.distance)}<br/>${TOOL.getViewTime(this.duration)}`
                                break;
                            case 4:
                            case 11:
                            case 13:
                            case 14:
                            case 15:
                                this.reset()
                                this.$router.replace({
                                    name: 'carhailingOrderShare',
                                    query:{
                                        orderId: this.orderId,
                                        productTypeLevelOne: this.productTypeLevelOne
                                    }
                                })
                                break;
                        }

                        if(!this.map){
                            this.startPoint = TOOL.baiduToTencent({
                                lat: this.orderInfo.aAddress.latitude,
                                lng: this.orderInfo.aAddress.longitude
                            })
                            this.endPoint = TOOL.baiduToTencent({
                                lat: this.orderInfo.bAddress.latitude,
                                lng: this.orderInfo.bAddress.longitude
                            })
                            this.mapConfig.lat = this.startPoint.lat;
                            this.mapConfig.lng = this.startPoint.lng;
                            this.map = new qqMap.createMap(this.container, this.mapConfig)
                            this._addStartPointer()
                        }
                    }else{
                        this.chBaseOrderPolling(this.orderId, this.orderStatus)
                    }
                })

            },

            _addStartPointer () {
                this.startPointer = new qqMap.component.Pointer({
                    map: this.map,
                    lat: this.startPoint.lat,
                    lng: this.startPoint.lng,
                    type: 0,
                    content: this.orderInfo.aAddress.detailAddress
                })
                this._addEndPointer()
                this._addCar()
            },

            _addEndPointer () {
                this.endPointer = new qqMap.component.Pointer({
                    map: this.map,
                    lat: this.endPoint.lat,
                    lng: this.endPoint.lng,
                    type: 1,
                    content: this.orderInfo.bAddress.detailAddress
                })
            },

            _addCar () {
                this.carPointer = new qqMap.component.Car({
                    map: this.map,
                    type: 260,
                    lat: 0,
                    lng: 0,
                    orderId: this.orderId,
                    productTypeLevelOne: this.orderInfo.productTypeLevelOne,
                    callback: (t, e) => {
                        if(e){
                            this.carPosition = e.getPosition()
                            this._addGuideLayer()
                            this.carPointer = e;
                            this.bestView.controls = [this.carPointer, this.startPointer]
                            this.setCenter()
                            this._resetControl()
                        }else{
                            if(this.mapRoute){
                                this.carPosition = t.pointer
                                this.mapRoute.remove()
                                this._addGuideLayer()
                            }
                            this.distance = t.data.distance
                            this.duration = t.data.duration
                            //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
                            switch(this.orderInfo.chStatus){
                                case 1:
                                    this.orderText.p2 = `司机距您约${TOOL.getkilometer(this.distance)}，${TOOL.getViewTime(this.duration)}`
                                    break;
                                case 3:
                                    this.orderText.p2 = `距离${this.orderInfo.bAddress.detailAddress}${TOOL.getkilometer(this.distance)}<br/>${TOOL.getViewTime(this.duration)}`
                                    break;
                                case 4:
                                    this.reset()
                                    break;
                            }
                        }
                    }
                })
            },

            _addGuideLayer () {
                let startPoint = this.carPosition
                let endPoint = this.startPoint
                if(this.orderInfo.chStatus !== 1){
                    startPoint = this.startPoint
                    endPoint = this.carPosition
                }
                this.mapRoute = new qqMap.component.Route({
                    map: this.map,
                    startPoint: startPoint,
                    endPoint: endPoint,
                    callback: (i, n) => {
                        if(!i){
                            this.mapRoute = n
                        }
                    }
                })
            },

            _resetControl () {
                this.resetControl = new qqMap.control.ResetControl({
                    map: this.map,
                    clickHandler: () => {
                        this.setCenter()
                    }
                })
            },

            setCenter () {
                this.map.setView(this.bestView.controls, this.bestView.pos)
            },
        }
    }
</script>
<style lang="less" scoped>
    .map-box{
        flex:1;
    }
    .order-hold-box{
        padding:46px;
        background-color:#fff;
        text-align:center;
        font-size:28px;
        color:#4c4c4c;
        .p1{
            font-size:36px;
            color:#ff6600;
            margin-bottom:44px;
        }
        .p2{
            line-height:1.6;
        }
    }
    .pay-dialog{
        text-align:center;
        .pay-dialog-title{
            height:98px;
            line-height:98px;
            font-size:36px;
            color:#121212;
        }
        .pay-dialog-body{
            .pay-price{
                margin:66px auto 100px;
                font-size:28px;
                color:#4c4c4c;
                em{
                    padding:0 10px;
                    font-size:48px;
                }
            }
            .pay-info{
                padding:0 50px;
                margin-bottom:30px;
                font-size:28px;
                color:#888;
                text-align:right;
                 span{
                     float:left;
                 }
            }
            p:last-child{
                margin-bottom:110px;
            }
        }
    }
</style>
