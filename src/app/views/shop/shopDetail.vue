<template>
    <main-box :title="title" main-class="scrollingBox">
    <!--<div class="page">-->
        <!--<c-header :title="title" :show-more="false" :go-back="goBack"></c-header>-->
        <div class="container">
            <div class="sight-box box-com-ui sig-bot mar-b-0">
                <!--banner-->
                <div class="s-slide-box" style="margin:0;">
                    <div class="slide-ul">
                        <swiper class="index-swiper" :aspect-ratio="0.5625" dots-position="center" :auto="true" :loop="true" :show-dots="shopDetail.banners.length > 1">
                            <swiper-item class="swiper-demo-img" v-for="(item, index) in shopDetail.banners" :key="index">
                                <img :src="item">
                            </swiper-item>
                        </swiper>
                        <!--<img class="shopImg" src="../../../assets/range_down.png" alt="">-->
                    </div>
                </div>
            </div>
            <div class="shopInfo">
                <!--商品名称-->
                <div class="shopTitle">
                    <div class="theme">{{shopDetail.name}}</div>
                </div>
                <!--价格-->
                <div class="priceBox">
                    <span class="newPrice">￥<span class="f-s-40">{{shopDetail.minPrice}}</span></span>
                    <!--<span class="shopPrice">原价：<span class="oldPrice">￥{{shopDetail.maxPrice}}</span></span>-->
                </div>
            </div>

            <!--标签-->
            <div class="sight-tags clearfix tagBox" v-if="shopDetail.tags && shopDetail.tags.length">
                <div class="tag-item clearfix"
                     v-for="(tag, index) in shopDetail.tags">
                    <i class="tag_i"></i>
                    <span class="f-s-24 c-f-4c4c4c tag-span">{{tag}}</span>
                </div>
            </div>

            <!--商品说明-->
            <div class="wareBoxOuter">
                <div class="wareBox">
                    <h3 class="wareTitle">商品说明</h3>
                    <!--<p>{{shopDetail.details}}</p>-->
                    <div class="wareInfo">
                        <p v-for="details in detailsArr" v-html="details"></p>
                    </div>
                </div>
            </div>

        </div>
        <div slot="footer">
            <div class="abs-bottom-box">
                <div class="buy-right">
                    <div class="iphoneBox">
                        <img class="iphone mar-t-10" src="../../../assets/tel.png" alt="">
                        <p class="f-s-24 c-f-888 contact-phone">联系客服</p>
                        <a class="iphoneBoxContact" @click="callService('')"></a>
                    </div>
                </div>
                <div class="buy-left clearfix">
                    <input type="button" class="button button-primary"
                           @click="jumpCreateOrder"
                           value="立即购买"/>
                </div>
            </div>
        </div>

    <!--</div>-->

    </main-box>
</template>
<script>
    import CHeader from 'components/c-header/index.vue'
    import MainBox from 'components/mainBox/index.vue'
    import { Swiper, SwiperItem } from 'vux'
    import phone from 'mixins/phone'

    export default {
        components: {
            MainBox,
            CHeader,
            Swiper,
            SwiperItem,
        },
        mixins: [phone],
        data () {
            return {
                serviceTel: 'tpl:110',
                pageRouter: this.$route.name,
                id: this.$route.query.id || '',
                shopDetail: {
                    banners: ['../../../assets/range_down.png'],
                },
                title: this.$route.meta.title,
                text:'成都至重庆学生专享票成都至重庆学生专享票成都至重庆学生专享票',
                detailsArr:[]
            }
        },
        mounted(){
//            $('.app-main').addClass('relative');
            this.findShopDetailById();
        },
        methods: {
            findShopDetailById() {
                if(!this.id) {
                    this.$store.dispatch('showError', '参数id不存在');
                    return;
                }
                api.findShopDetailById(this.id).then(res => {
                    const data = TOOL.toJson(res.data);
                    if(data.resultCode === '0') {
                        this.serviceTel = 'tpl:'+data.resultData.serviceTel;
                        this.shopDetail = data.resultData.goods;
                        let tempBanner = [];
                        for(let [index, val] of this.shopDetail.banners.entries()) {
                            if(val) {
                              tempBanner.push(val);
                            }
                        }
                        this.shopDetail.banners = [...tempBanner];
                        this.detailsArr = this.shopDetail.details.split('\n');
                        this.visitLog();
                        setTimeout(() => {
                            this.autoScreen();
                        }, 100);
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
            visitLog () {
                TOOL.saveVisitLogs({
                    url: this.$route.name,
                    productId: this.shopDetail.id,
                    productTypeLevelOne: this.shopDetail.productTypeLevelOne,
                    productTypeLevelTwo: this.shopDetail.productTypeLevelTwo
                })
            },
            autoScreen() {
//                wareBoxOuter
                let appH = $('.app-container').height();
                let H = $('.container').height();
                let shopDetailH = $('.wareBoxOuter').height();
                if(appH > H) {
                    $('.wareBoxOuter').height(shopDetailH + (appH - H - 30));
                }
            },
            jumpCreateOrder() {
                if(!this.id) {
                    this.$store.dispatch('showError', '参数id不存在');
                    return;
                }
                this.$router.push({
                    name: 'shopCreateOrder',
                    query: {
                        id: this.id
                    }
                })
            },
            goBack () {
                this.$router.push({
                    name: appStorage.get('indexRouter')
                })
            },
        }
    }
</script>
<style type="less" scoped>
    .page{
        background-color: #ffffff !important;
        height: 100% !important;
    }
    .container{
        background-color: #f2f2f2;
    }
    .shopImg{
        height: 360px;
        width: 100%;
    }
    .shopInfo{
        padding: 20px;
        background-color: #ffffff;
    }
    .shopTitle{
        width: 100%;
        font-size: 32px;
        color: #121212;
        line-height: 35px;
        margin-bottom: 20px;
    }
    .f-s-40{
         font-size: 40px !important;
     }
    .newPrice{
        color: #ff6600;
        font-size: 32px;
    }
    .shopPrice{
        color: #888888;
        font-size: 24px;
        margin-left: 20px;
     }
    .oldPrice{
        text-decoration: line-through;
    }

    .tagBox{
        background-color: #ffffff;
        margin-top: 20px;
        height: 80px;
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
    }
    .tag-item {
        /*max-width: 140px;*/
      display: flex;
      width: 25%;
      padding-right: 10px;
        margin-right: 0 !important;
    }
    .tag-span {
      width: 0;
      flex: 1;
        padding-top: 4px;
        /*max-width: 80px;*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .tag_i{
        width: 26px !important;
        height: 26px !important;
        margin-right: 10px !important;
    }
    .mar-r-30{
        margin-right: 30px!important;
    }
    .wareBoxOuter {
        padding: 20px 0 0 0;
    }
    .wareBox{
        background-color: #ffffff;
        padding: 20px 20px 120px 20px;
        min-height: 100%;
        height: auto;
    }
    .wareTitle{
        font-size: 32px;
        color: #121212;
        width: 100%;
        text-align: center;
    }
    .wareInfo{
        width: 100%;
        font-size: 24px;
        color: #4c4c4c;
        line-height: 30px;
        margin-top: 20px;
        word-wrap: break-word;
        word-break: break-all;
        min-height: 200px;
    }
    .iphoneBox{
        position: relative;
        text-align: center;
        border-top: 1PX solid #e5e5e5;
        width: 100%;
        /*height: 4.5rem;*/
        display: flex;
        align-items: center;
        line-height: 35px;
        flex-direction: column;
    }
    .iphoneBoxContact {
        position: absolute;
        left: 0;
        top: 0;

        width: 100%;
        height: 100px;
        z-index: 100;
    }
    .iphone{
        width: 40px;
        height: 40px;
        display: block;
        margin: 0 auto;
    }
    .relative {
        position: relative !important;
    }
    .slide-ul img {
        width: 100%;
        height: 100% !important;
        border-radius: 0 !important;
    }
    .contact-phone {
        margin-top: 10px;
    }
</style>