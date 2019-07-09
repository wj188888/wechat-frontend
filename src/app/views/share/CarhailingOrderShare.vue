<template>
    <main-box :title="title" :show-more="false" main-class="flex-box" :go-back="goBack">
        <driver-info :order-id="orderId" :product-type="orderInfo.productTypeLevelOne" :driver-info="orderInfo.dispatchDriverInfo" :hide-phone="true"></driver-info>
        <div class="map-container map-box" id="container"></div>
        <div class="order-detail-box line line-x-b">
            <div class="order-detail-info">
                <ul class="driver-ticket-address">
                    <li><i class="circle-bg-start">始</i>{{orderInfo.aAddress.city + '·' + orderInfo.aAddress.detailAddress}}
                        <div class="shu"></div>
                    </li>
                    <li>
                        <i class="circle-bg-end">终</i>{{orderInfo.bAddress.city + '·' + orderInfo.bAddress.detailAddress}}
                    </li>
                </ul>
                <a class="driver-time" v-if="orderInfo.getOnTime">上车时间：<em>{{ orderInfo.getOnTime | formatDate('time') }}</em></a>
                <a class="driver-time end" v-if="orderInfo.getOffTime">下车时间：<em>{{ orderInfo.getOffTime | formatDate('time') }}</em></a>
            </div>
        </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import DriverInfo from 'components/driver-info/index.vue'
    import qqMap from '../../../utils/qqmap/CreateMap'

    export default {
        components: {
            MainBox,
            DriverInfo,
        },
        data () {
            return {
                title: '',
                pageRouter: this.$route.name,
                orderId: '',
                productTypeLevelOne: '',
                map:'',
                container:'container',
                mapConfig:{
                    lat: 0,
                    lng: 0,
                    zoom:16
                },
                startPoint:'',
                startPointer:'',
                endPoint:'',
                endPointer:'',
                mapRoute:'',
                resetControl:'',
                bestView: {
                    controls: [],
                    pos: {
                        paddingTop: 40,
                        paddingBottom: 40,
                        paddingLeft: 30,
                        paddingRight: 30
                    }
                },
                orderInfo:{
                    dispatchDriverInfo:{},
                    aAddress:{},
                    bAddress:{}
                },
                showDialog: false,
                score:5,
                chStatusText:''
            }
        },
        watch: {
            $route () {
                this.initialize()
            }
        },
        created () {
            this.initialize()
        },
        methods:{
            initialize () {
                this.orderId = this.$route.query.orderId
                this.productTypeLevelOne = this.$route.query.productTypeLevelOne
                if(this.productTypeLevelOne === 'TAXI'){
                    this.title = '出租的士'
                }else{
                    this.title = '品牌约车'
                }
                this.orderFindById()
            },

            goBack () {
                this.$router.push({
                    name: appStorage.get('indexRouter')
                })
            },

            orderFindById () {
                api.chBaseOrderFindById(this.orderId, this.productTypeLevelOne).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode == '0') {
                        this.orderInfo = data.resultData.chOrder
                        this.score = data.resultData.score
                        //0生成订单, 1派单成功, 2到达目的地, 3行程中, 4完成行程（待支付）, 11乘客取消, 12超时失败, 13司机取消, 14未评价, 15已评价
                        switch(this.orderInfo.chStatus){
                            case 1:
                            case 2:
                            case 3:
                                this.chStatusText = '行程中'
                                break;
                            case 4:
                                this.chStatusText = '待支付'
                                break;
                            case 11:
                            case 13:
                                this.chStatusText = '已取消'
                                break;
                            case 14:
                                this.chStatusText = '未评价'
                                break;
                            default:
                                this.chStatusText = '已评价'
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
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
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
            },

            _addEndPointer () {
                this.endPointer = new qqMap.component.Pointer({
                    map: this.map,
                    lat: this.endPoint.lat,
                    lng: this.endPoint.lng,
                    type: 1,
                    content: this.orderInfo.bAddress.detailAddress
                })
                this._addGuideLayer ()
                this.bestView.controls = [this.startPointer, this.endPointer]
                this.setCenter()
                this._resetControl()
            },

            _addGuideLayer () {
                this.mapRoute = new qqMap.component.Route({
                    map: this.map,
                    startPoint:{
                        lat: this.startPoint.lat,
                        lng: this.startPoint.lng,
                    },
                    endPoint:{
                        lat: this.endPoint.lat,
                        lng: this.endPoint.lng,
                    },
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
    .order-detail-box{
        height: 220px;
        padding:20px 20px 30px;
        background-color:#fff;
        font-size:24px;
        color:#121212;
        .order-type{
            span{
                display: inline-block;
                margin-right:20px;
            }
        }
        .order-detail-info{
            position: relative;
        }
        .driver-ticket-address {
            margin-top:30px;
            margin-right: 300px;
            li {
                position: relative;
                line-height: 30px;
                height:30px;
                font-size:28px;
                color:#4c4c4c;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &:first-child {
                     margin-bottom: 50px;
                 }
            }
            .shu {
                position: absolute;
                left: 12px;
                top: 34px;
                width: 0;
                height: 46px;
                border-left:1PX dashed #dbdedc;
            }
            i {
                position: relative;
                top:-3px;
                display: inline-block;
                width: 26px;
                height: 26px;
                line-height: 26px;
                margin-right: 16px;
                font-size: 16px;
                text-align: center;
                color: #ffffff;
                border-radius: 50%;
            }

        }
        .driver-time{
            position: absolute;
            top:0;
            right:20px;
            font-size:24px;
            color:#4c4c4c;
            &.end{
                top:auto;
                bottom:0;
             }
        }
    }

</style>
