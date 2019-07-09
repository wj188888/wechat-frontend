<template>
    <div class="product-info mar-b-20">
        <slot></slot>
        <div class="title">
            <h2>
                <span v-text="infoData.tourType == 0 ? '【往返】' : '【单程】'"></span>
                <span v-text="infoData.theme">成都-乐山拼车 多车型选择 定点乘车 安全舒适 便捷</span>
            </h2>
            <p v-text="infoData.description">此趟线路提供多车型5座、7座、10座等车型供用户进行选择，用户可以根据自己实际情况选择</p>
        </div>

        <div class="seats-price line line-x-b" v-if="priceType === 1">
            <p class="seat-type">{{ infoData.seats | getSeatsText }}</p>
            <p class="product-price">
                <span>¥</span>
                <span v-text="infoData.minPrice">43</span>
                <i>/人 起</i>
            </p>
        </div>

        <div class="seats-price line line-x-b" v-if="priceType === 2">
            <div class="seats-flex">
                <p class="seat-text">{{ infoData.carBrand | strSplit('4') }}&nbsp;&nbsp;{{infoData.totalSeats}}座</p>
                <p class="seat-text icon-carpooling-time">{{infoData.startupTime | formatDate('monthDay') }}出发</p>
            </div>
            <p class="product-price">
                <span>¥</span>
                <span v-text="infoData.price">43</span>
                <i>/人</i>
            </p>
        </div>

        <div class="seats-price line line-x-b" v-if="priceType === 3">
            <p class="seat-type">{{ infoData.seats | getSeatsText }}</p>
            <p class="product-price">
                <span>¥</span>
                <span v-text="infoData.minPrice">43</span>
                <i>起</i>
            </p>
        </div>

        <ul class="car-keys line line-x-b" v-if="infoData.sellPoints && infoData.sellPoints.length > 0">
            <li v-for="sellPoint in infoData.sellPoints" v-text="sellPoint">舒适安全</li>
        </ul>

        <div class="product-service line line-x-b" v-if="showService && infoData.includeServices">
            <h3>增值服务</h3>
            <ul>
                <li v-for="includeService in infoData.includeServices"
                    :class="{
                  'icon-a': includeService.name == '座位',
                  'icon-b': includeService.name == '餐饮',
                  'icon-c': includeService.name == '住宿',
                  'icon-d': includeService.name == '景点' || includeService.name == '景点服务'
                }"
                    v-text="includeService.content">舒适座位
                </li>
            </ul>
        </div>

        <div v-if="tipsType === 'carpooling'">
            <p class="carpooling-warning-tips line line-x-b" v-if="minMember > 0">支付开团，满{{minMember}}人成团发车，人数不足自动退款</p>
            <p class="carpooling-warning-tips line line-x" v-else>选择用车，并按要求邀请指定人数参团，人数不足自动退款</p>
        </div>

        <p v-if="tipsType === 'carpoolingSuccess' || tipsType === 'carpoolingShare'" class="carpooling-warning-tips line line-x">支付参与拼团，满{{minMember}}人成团后发车，人数不足自动退款。</p>

        <p v-if="tipsType === 'carpoolingSelf'" class="carpooling-warning-tips line line-x">如您选择全额支付包车款，系统将优先为您安排司机车辆哦~~</p>

    </div>
</template>
<script>
    export default {
        props:[
            'infoData',
            'minMember',
            'priceType',
            'showService',
            'tipsType',
            'showTips',
        ],
        data () {
            return {
                showNotice: false
            }
        },
        computed : {
            refundNotice () {
                return TOOL[this.refundNoticeType]
            }
        }
    }
</script>