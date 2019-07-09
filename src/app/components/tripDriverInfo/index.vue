<template>
    <div class="trip-info-box line line-box radius-box">
        <div class="trip-info clearfix">
            <div class="driver-avator" :style="taskData.driverAvatar?{backgroundImage:'url(\'' + taskData.driverAvatar + '\')'}:''"></div>
            <div class="pull-left">
                <p class="driver-info">{{taskData.driverFirstName + '师傅'}}
                    <span class="star-box star-small-box" v-html="starHtml"></span>
                </p>
                <p class="company-name" v-text="taskData.storeBrandName">巴运集团</p>
            </div>
            <div class="pull-right">
                <p class="start-time" v-if="taskData.startTime">
                    上车时间<span>{{ taskData.startTime | formatDate('time') }}</span>
                </p>
                <p class="start-time" v-if="taskData.endTime">
                    下车时间<span>{{ taskData.endTime | formatDate('time') }}</span>
                </p>
            </div>
        </div>
        <div class="address-info">
            <div class="ad-start">
                <p v-text="taskData.aAddress.city">成都</p>
                <p class="small-text">{{taskData.aAddress | getAddressTitle}}</p>
            </div>
            <div class="car-info">
                <p v-text="taskData.carLicensePlatProvince + taskData.carLicensePlat">川A12312a</p>
                <p class="border">
                    <i class="right"></i>
                </p>
                <p v-text="taskData.seats + '座'">52座</p>
            </div>
            <div class="ad-end">
                <p v-text="taskData.bAddress.city">成都</p>
                <p class="small-text">{{taskData.bAddress | getAddressTitle}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:['taskData'],
        data () {
            return {

            }
        },
        computed: {
            starHtml () {
                return TOOL.renderStar(this.taskData.driverScore || 5)
            },
        },
        mounted () {

        },
        methods:{

        }
    }
</script>