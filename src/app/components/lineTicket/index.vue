<template>
    <div class="line-ticket-box pad-20" v-show="listData.length > 0">
        <div class="sight-ticket-box box-com-ui" v-for="data in listData" @click="jumpToDetail(data.id)">
            <div class="tour-route">
                <div class="tic-line orange-line"></div>
                <div class="left-box">
                    <div class="layer">
                        <i class="icon green-icon"></i>
                        <span>{{data.aAddress}}({{data.aDetailAddress}})</span>
                    </div>
                    <div class="long-line" v-if="!data.primaryTransitStation"></div>
                    <div class="short-line" v-if="data.primaryTransitStation"></div>
                    <div class="layer" v-if="data.primaryTransitStation">
                        <i class="icon orange-icon"></i>
                        <span>{{data.primaryTransitStation}}</span>
                    </div>
                    <div class="short-line" v-if="data.primaryTransitStation"></div>
                    <div class="layer">
                        <i class="icon"></i>
                        <span>{{data.bAddress}}({{data.bDetailAddress}})</span>
                    </div>
                </div>
                <div class="right-box">
                    <div class="tour-price">
                        <span>¥</span>
                        <span>{{data.minPrice}}</span>
                    </div>
                    <div class="route-type clearfix" v-if="data.tourType==0">
                        <i class="icon-type"></i>
                        <span>往返</span>
                    </div>
                    <div class="route-type clearfix" v-if="data.tourType==1">
                        <i class="icon-type icon-dc"></i>
                        <span>单程</span>
                    </div>
                </div>
            </div>
            <div class="tour-tags line line-x-t">
                <p class="tour-time">行程{{data.tourDays}}天</p>
                <p class="tour-tag" v-if="data.includeServiceTags.length > 0">含：{{data.includeServiceTags | getIncludeServices}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:['listData'],
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            jumpToDetail (ticketID) {
                this.$emit('jumpToDetail', ticketID)
            }
        }
    }
</script>