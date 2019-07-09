<template>
    <main-box :title="title" main-class=" scrollingBox has-abs-bottom" :show-back="false" :show-more="false">
        <div class="sight-box box-com-ui sig-bot">
            <div class="s-slide-box" style="margin:0;">
                <div class="slide-ul">
                    <swiper dots-position="center" auto>
                        <swiper-item v-for="(picData,index) in detailData.banners" :key="index">
                            <a class="slide-item" :style="{backgroundImage: 'url(\'' + picData + '\')'}">
                            </a>
                        </swiper-item>
                    </swiper>
                </div>
            </div>
            <div class="sight-desc">
                <div class="theme">{{ detailData.productTheme | strSplit('42') }}</div>
            </div>
            <div class="sight-box sig-bot">
                <div class="time-pany sub-cls clearfix" style="margin:0;">
                    <i class="pany-icon"></i>
                    <span style="margin-right:20px;" v-text="detailData.firmName"></span>
                    <i class="time-icon" style="margin-top:0.1rem;"></i>
                    <span>{{detailData.tourDays}}日行程</span>
                </div>
                <div class="sight-tags clearfix" v-if="detailData.tags.length > 0">
                    <div class="tag-item clearfix" v-for="tag in detailData.tags">
                        <i></i>
                        <span>{{tag}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!--包含服务-->
        <div class="fee-include mar-b-20" v-if="detailData.includeServices">
            <h3>包含服务</h3>
            <ul>
                <li v-for="service in detailData.includeServices">
                    <i class="sig-fee-icon" v-if="service.name == '座位'"></i>
                    <i class="sig-fee-icon sig-ht" v-if="service.name == '住宿'"></i>
                    <i class="sig-fee-icon sig-meal" v-if="service.name == '餐饮'"></i>
                    <i class="sig-fee-icon sig-jd" v-if="service.name == '景点'"></i>
                    <i class="sig-fee-icon sig-jd" v-if="service.name == '景点服务'"></i>
                    <span v-text="service.content"></span>
                </li>
            </ul>
        </div>
        <div class="form-box form-detail mar-b-20">
            <div class="input-inline"
                 v-if="detailData.tourReferee.content "
                 style="background:#fff;"
                 :class="{'dd-text-active': showManDetail}"
                 @click="showManDetail = !showManDetail">
                <img class="man-icon" :src="detailData.tourReferee.avatar">
                <label style="flex:1;">产品经理推荐</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <ul class="man-list" v-if="detailData.tourReferee.content&&showManDetail">
                <li>
                    <div class="clearfix" v-html="detailData.tourReferee.content"></div>
                </li>
            </ul>
        </div>

        <tour-notice :detail-data="detailData"></tour-notice>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import TourNotice from 'components/tourNotice/index.vue'
    import { Swiper, SwiperItem } from 'vux'

    export default {
        components: {
            MainBox,
            TourNotice,
            Swiper,
            SwiperItem,
        },
        data () {
            return {
                title: this.$route.meta.title,
                detailData: {
                    aAddress:{},
                    bAddress:{},
                    tourPriceSetting:{},
                    tourReferee:{},
                    tags:[],
                    customContents:[]
                },
                productId: '',
                showManDetail: false,
                date: '',
                price: '',
                showText: true
            }
        },
        mounted(){
            this.productId = this.$route.query.id
            this.tourProductGetPreview()
        },
        methods: {
            /**
             * 查找产品详情
             */
            tourProductGetPreview () {
                api.tourProductGetPreview(this.productId).then(res => {
                    const data = TOOL.toJson(res.data)
                    if (data.resultCode == '0') {
                        this.detailData = data.resultData
                        this.title = `${this.detailData.aAddress.city} - ${this.detailData.bAddress.city}`
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
        }
    }
</script>