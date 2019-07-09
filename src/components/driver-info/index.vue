<template>
    <div class="driver-info-box" v-if="driverInfo && driverInfo.driverFirstName">
        <router-link tag="div" :to="{name:'driver', query:{id: driverInfo.driverId, productTypeLevelOne: productType}}" class="driver-avatar" :style="driverInfo.driverHeadImg ? {backgroundImage:'url(\'' + driverInfo.driverHeadImg + '\')'} :''"></router-link>
        <div class="driver-name">
            <span v-text="driverInfo.driverFirstName + '师傅'">张师傅</span>
            <span class="score" v-text="driverInfo.driverScore ? driverInfo.driverScore.toFixed(1) : '5.0'">5.0</span>
            <span class="order-num" v-if="driverInfo.serviceOrderCount" v-text="driverInfo.serviceOrderCount + '单'"></span>
        </div>
        <p class="driver-car" v-text="driverInfo.driverCarNo"></p>
        <p class="driver-brand" v-if="driverInfo.driverCarBrand" v-text="driverInfo.driverCarBrand + (driverInfo.driverCarColor ? '.' + driverInfo.driverCarColor : '')"></p>
        <a class="driver-phone" v-show="!hidePhone" target="_blank" @click="callService(driverInfo.driverPhone, 'driver')"></a>
        <!--<router-link class="driver-phone" :to="{name: 'userComplain', query:{orderId: orderId, productTypeLevelOne: productType}}"></router-link>-->
    </div>
</template>
<script>
    import phone from 'mixins/phone.js'
    export default {
        props:['orderId', 'productType', 'driverInfo', 'hidePhone'],
        mixins: [phone],
        data () {
            return {

            }
        },
        mounted () {

        },
        methods:{

        }
    }
</script>
<style lang="less" scoped>
    .driver-info-box{
        position: relative;
        height:160px;
        padding:20px 130px 20px 170px;
        background-color:#fff;
        overflow:hidden;
        .driver-avatar{
            position:absolute;
            top:25px;
            left:20px;
            width:110px;
            height:110px;
            background:url("../../assets/driver.png") no-repeat 0 center;
            background-size:110px;
            border-radius:50%;
        }
        .driver-name{
            margin-top:6px;
            font-size:32px;
            color:#121212;
            .score{
                position:relative;
                padding-left:32px;
                font-size:24px;
                color:#ff6600;
                &:before{
                     content: "";
                     display:block;
                     position: absolute;
                     top:-4px;
                     left:0;
                     width: 30px;
                     height:28px;
                     background:url("../../assets/car/star_yellow.png") no-repeat 2px center;
                     background-size:26px 26px;
                }
            }
            .order-num{
                font-size:24px;
                color:#888;
            }
        }
        .driver-car{
            display:inline-block;
            margin:10px 0 16px;
            font-size:22px;
            color:#4c4c4c;
            background-color:#e5e5e5;
            padding:5px;
            border-radius:5px;
        }
        .driver-brand{
            font-size:22px;
            color:#4c4c4c;
        }
        .driver-phone{
            position:absolute;
            top:0;
            right:0;
            bottom:0;
            width:80px;
            background:url("../../assets/carhailing/phone.png") no-repeat 0 center;
            background-size:60px 60px;
        }
    }
</style>
