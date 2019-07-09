<template>
    <div>
        <div class="form-box form-detail">
            <div class="input-inline"
                 v-if="detailData.tourTrips "
                 :class="{'dd-text-active': showDetails.tourTrips}"
                 @click="showDetail('tourTrips')">
                <label>行程介绍</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <div style="background:#f8f8f8;padding:1rem;" v-if="detailData.tourTrips  && showDetails.tourTrips">
                <div class="route-detail">
                    <h3></h3>
                    <div v-for="(tourDeal, index) in detailData.tourTrips">
                        <div class="com-day-nav clearfix">
                            <span class="day">
                                第{{index+1}}天<i class="trangle-down"></i>
                            </span>
                            <span class="title" v-text="tourDeal.title"></span>
                        </div>
                        <div class="day-tour" v-for="(tour, index2) in tourDeal.tourTripDetails">
                            <div class="time clearfix">
                                <i v-if="tour.type==0" :class="{'hotel': tour.type==0}"></i>
                                <i v-if="tour.type==1" :class="{'food': tour.type==1}"></i>
                                <i v-if="tour.type==2" :class="{'jihe': tour.type==2}"></i>
                                <i v-if="tour.type==5" :class="{'jingdian': tour.type==5}"></i>
                                <i v-if="tour.type==3" :class="{'bus': tour.type==3}"></i>
                                <span v-text="tour.time"></span>
                            </div>
                            <div class="cont-pd">
                                <p class="content" v-if="index2 < tourDeal.tourTripDetails.length-1" v-html="tour.content"></p>
                                <p class="content" v-else v-html="tour.content" style="border:none;"></p>
                            </div>
                        </div>
                        <div class="rest-com" v-if="index < detailData.tourTrips.length-1">
                            <p class="clearfix">
                                <span class="line"></span>
                                <span class="theme-title">好好休息</span>
                                <span class="line"></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="input-inline line line-x-t"
                 v-if="detailData.costDetails"
                 :class="{'dd-text-active': showDetails.costDetails}"
                 @click="showDetail('costDetails')">
                <label>费用说明</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <div v-if="detailData.costDetails  && showDetails.costDetails">
                <div class="route-detail">
                    <div class="fee-clu-box" v-for="(fee, key) in detailData.costDetails">
                        <h3>{{key}}</h3>
                        <div v-html="fee"></div>
                    </div>
                </div>
            </div>

            <div class="input-inline line line-x-t"
                 v-if="detailData.customContents"
                 :class="{'dd-text-active': showDetails.customContents}"
                 @click="showDetail('customContents')">
                <label>预定须知</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <div v-if="detailData.customContents  && showDetails.customContents">
                <div class="route-detail">
                    <div class="fee-clu-box" v-for="fee in detailData.customContents" v-if="fee.content">
                        <h3>{{fee.title}}</h3>
                        <div v-html="fee.content"></div>
                    </div>
                </div>
            </div>

            <div class="input-inline line line-x-t"
                 v-if="detailData.tourManagers"
                 :class="{'dd-text-active': showDetails.tourManagers}"
                 @click="showDetail('tourManagers')">
                <label>相关负责人</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <div v-if="detailData.tourManagers && showDetails.tourManagers">
                <div class="route-detail">
                    <div class="fee-clu-box">
                        <div class="man-about">
                            <p v-for="man in detailData.tourManagers">
                                <span>{{man.position}}：</span>
                                <span>{{man.name}}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p class="firm-name-box line line-x" v-if="detailData.firmName">
            <span v-text="detailData.firmName"></span>
            <i class="icon-v"></i>
        </p>
    </div>
</template>
<script>
    export default {
        props:['detailData', 'text'],
        data () {
            return {
                showDetails: {
                    tourTrips: true,
                    costDetails: false,
                    customContents: false,
                    tourManagers: false,
                },
            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{
            /**
             * 显示隐藏详情
             */
            showDetail (key) {
                let temp = this.showDetails[key]
                for (let i in this.showDetails) {
                    if (this.showDetails.hasOwnProperty(i)) {
                        this.showDetails[i] = false
                    }
                }
                this.showDetails[key] = !temp
            },
        }
    }
</script>