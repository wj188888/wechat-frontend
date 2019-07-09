<template>
    <main-box :title="title" main-class=" scrollingBox has-abs-bottom" :show-back="false" :show-more="false">
        <div class="product-info mar-b-20">
            <div class="title">
                <h2>
                    <span v-text="lineProductData.tourType == 0 ? '【往返】' : '【单程】'"></span>
                    <span v-text="lineProductData.theme">成都-乐山拼车 多车型选择 定点乘车 安全舒适 便捷</span>
                </h2>
                <p v-text="lineProductData.description">此趟线路提供多车型5座、7座、10座等车型供用户进行选择，用户可以根据自己实际情况选择</p>
            </div>
            <div class="seats-price line line-x-b">
                <p class="seat-type">{{ lineProductData.seats | getSeatsText }}</p>
            </div>
            <ul class="car-keys line line-x-b">
                <li v-for="sellPoint in lineProductData.sellPoints" v-text="sellPoint">舒适安全</li>
            </ul>
            <div class="product-service line line-x-b" v-if="lineProductData.includeServices">
                <h3>增值服务</h3>
                <ul>
                    <li v-for="includeService in lineProductData.includeServices"
                        :class="{
                  'icon-a': includeService.name == '座位',
                  'icon-b': includeService.name == '餐饮',
                  'icon-c': includeService.name == '住宿',
                  'icon-d': includeService.name == '景点' || includeService.name == '景点服务'}"
                        v-text="includeService.content">舒适座位
                    </li>
                </ul>
            </div>
        </div>
        <div class="form-box form-detail mar-t-20 line line-x-b" v-if="lineProductData.lineManagerTel">
            <p class="firm-name-box mar-b-0 line line-x">
                <span v-text="lineProductData.firmName"></span>
                <i class="icon-v"></i>
            </p>
            <div class="input-inline" @click="callJingli(lineProductData.lineManagerTel)" v-if="lineProductData.lineManagerTel">
                <label class="line-manager">线路经理&nbsp;&nbsp;&nbsp;{{lineProductData.lineManagerFirstName}}经理</label>
                <span class="icon-phone"></span>
            </div>
        </div>
        <div class="carpooling-list line line-x-b">
            <p class="tips">支付开团并邀请要求人数参团，人数不足自动退款</p>
        </div>
        <div class="form-box form-detail mar-b-40">
            <div class="input-inline"
                 v-if="lineProductData.productContents.length > 0"
                 :class="{'dd-text-active': showDetails.productInfo}"
                 @click="showDetail('productInfo')">
                <label>产品信息</label>
                <span class="show-detail">详情</span>
                <i class="icon-r-jt"></i>
            </div>
            <div v-if="lineProductData.productContents.length  && showDetails.productInfo">
                <div class="route-detail">
                    <div class="fee-clu-box" v-for="fee in lineProductData.productContents">
                        <h3>{{fee.title}}</h3>
                        <div v-html="fee.content"></div>
                    </div>
                </div>
            </div>

            <ticket-notice
                    :custom-contents="lineProductData.customContents"
                    refund-notice-type="refundNotice2">
            </ticket-notice>
        </div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import TicketNotice from 'components/ticketNotice/index.vue'

    export default {
        components: {
            MainBox,
            TicketNotice,
        },
        data () {
            return {
                title: '',
                pageRouter: this.$route.name,
                productId: '',
                lineProductData: {
                    aAddress:{},
                    bAddress:{},
                    includeServices:[],
                    productContents:[],
                    customContents:[],
                },
                showDetails: {
                    productInfo: true,
                },
            }
        },
        mounted(){
            this.productId = this.$route.query.id
            this.lineProductGetPreview()
        },
        methods: {
            /**
             * 根据id查找线路包车详情
             */
            lineProductGetPreview () {
                this.$store.commit('UPDATE_LOADING', true)
                api.lineProductGetPreview(this.productId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode == '0') {
                        this.lineProductData = data.resultData
                        this.title = this.lineProductData.aAddress.city + ' — ' + this.lineProductData.bAddress.city
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },

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

            /**
             * 拨打线路经理电话
             */
            callJingli (tel) {
                this.$store.dispatch('showConfirm', {
                    content: '<p style="text-align:center;">线路经理电话：' + tel + '</p>',
                    confirmText: '拨打',
                    onConfirm: () => {
                        location.href = 'tel:' + tel
                    }
                })
            },


            /**
             * 拨打电话
             */
            callKefu () {
                this.$store.dispatch('showConfirm', {
                    content: '<p style="text-align:center;">咨询电话：' + this.lineProductData.serviceTel + '</p>',
                    confirmText: '拨打',
                    onConfirm: () => {
                        location.href = 'tel:' + this.lineProductData.serviceTel
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .icon-phone{
        display:block;
        flex:1;
        background:url("../../assets/charter/phone-carpooling-manage.png") no-repeat right center;
        background-size:50px 50px;
    }
</style>