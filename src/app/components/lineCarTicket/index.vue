<template>
    <div v-if="datas.length > 0">
        <div class="ui-sight-title clearfix mar-tb-20" v-if="showHot">
            <div class="title clearfix">
                <span class="circle"></span>
                <span class="center">热门线路</span>
                <span class="circle"></span>
            </div>
        </div>
        <div class="sight-ticket-box box-com-ui" v-for="data in datas" @click="jumpToCarpoolingList(data.id)">
            <div class="tour-route">
                <div class="tic-line orange-line"></div>
                <div class="left-box">
                    <div class="layer">
                        <i class="icon green-icon"></i>
                        <span v-text="data.aAddress + ' ' + data.aDetailAddress"></span>
                    </div>
                    <div class="long-line" v-if="!data.primaryTransitStation"></div>
                    <div class="short-line" v-if="data.primaryTransitStation"></div>
                    <div class="layer" v-if="data.primaryTransitStation">
                        <i class="icon orange-icon"></i>
                        <span v-text="data.primaryTransitStation"></span>
                    </div>
                    <div class="short-line" v-if="data.primaryTransitStation"></div>
                    <div class="layer">
                        <i class="icon"></i>
                        <span v-text="data.bAddress + ' ' + data.bDetailAddress"></span>
                    </div>
                </div>
                <div class="right-box">
                    <div class="tour-price">
                        <span>¥</span>
                        <span v-text="data.minPrice"></span>
                        <i style="color:#ff6600;font-size:1.4rem;">起</i>
                    </div>
                    <div class="route-type clearfix" v-if="data.tourType == 0">
                        <i class="icon-type"></i>
                        <span>往返</span>
                    </div>
                    <div class="route-type clearfix" v-if="data.tourType == 1">
                        <i class="icon-type icon-dc"></i>
                        <span>单程</span>
                    </div>
                </div>
            </div>
            <div class="tour-tags line line-x-t">
                <p class="seat-type">{{ data.serviceCarSeats | getSeatsText }}</p>
                <a class="btn-carpooling">立即拼车</a>
            </div>
        </div>
    </div>
</template>
<script>
    import checkLogin from 'mixins/checkLogin.js'
    export default {
        props:['datas','showHot'],
        mixins: [checkLogin],
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
             * 跳转线路包车产品详情
             * @param productId
             */
            jumpToCarpoolingList (productId) {
                if(!this.checkIsLogin()) return
              appStorage.remove('carpoolingSelfStation')
                this.$router.push({
                    name: 'carpoolingList',
                    query: {
                        productId: productId
                    }
                })
            },
        }
    }
</script>
