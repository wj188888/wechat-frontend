<template>
    <main-box :title="title" main-class=" scrollingBox has-abs-bottom" :show-back="false" :show-more="false">
        <div class="sig-rote-line">
            <div class="sig-line-top clearfix">
                <i></i>
                <span v-if="detailData.tourType==1">【单程套票】</span>
                <span v-if="detailData.tourType==0">【往返套票】</span>
                <span>{{detailData.aAddress.city}}-{{detailData.bAddress.city}}</span>
            </div>
            <div class="sight-box sig-bot">
                <div class="time-pany sub-cls clearfix">
                    <i class="pany-icon"></i>
                    <span style="margin-right:20px;" v-text="detailData.firmName"></span>
                    <i class="time-icon time-small"></i>
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

        <tour-notice :detail-data="detailData"></tour-notice>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import TourNotice from 'components/tourNotice/index.vue'

    export default {
        components: {
            MainBox,
            TourNotice
        },
        data () {
            return {
                title: this.$route.meta.title,
                id: '',
                detailData: {
                    aAddress:{},
                    bAddress:{},
                    tags:[],
                    tourTrips:[],
                    tourPriceSetting:{}
                }
            }
        },
        mounted(){
            this.id = this.$route.query.id
            this.tourProductGetPreview()
        },
        methods: {
            /**
             * 查找产品详情
             */
            tourProductGetPreview () {
                api.tourProductGetPreview(this.id).then(res => {
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