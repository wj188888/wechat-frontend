<template>
    <!--<main-box :title="title" main-class="scrollingBox has-abs-bottom" :show-more="false">

    </main-box>-->
    <div class="appV">
        <div class="appV-b">
            <div class="appV-icon">
                <img src="../../assets/firm/market.png" alt="">
            </div>
            <p class="appV-des">IOS版本</p>
            <p class="appV-updateTime">
                正在开发中，敬请期待！
            </p>
            <p class="appV-bottom-text">
                连接平台提供技术支持
            </p>
        </div>
    </div>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'

    export default {
        components: {
            MainBox,
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
<style lang="less" scoped>
    .appV {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .appV-t {
        width: 100%;
        height: 302px;

        background: #000;
    }
    .appV-p1 {
        padding: 90px 0 50px 0;
        text-align: center;
        font-size: 32px;
        color: #fff;
    }
    .appV-p2 {
        text-align: center;
        font-size: 40px;
        color: #fff;
    }
    .appV-p2-small {
        font-size: 32px;
        color: #ccc;
    }
    .appV-b {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;

        background: url("../../assets/firm/appBackBig.png") no-repeat left top;
        background-size: cover;
    }
    .appV-icon {
        width: 180px;
        height: 180px;
        margin: 190px auto 0 auto;
        border-radius: 32px;
        box-shadow: 0 0 10px 0 #ccc;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .appV-des {
        padding: 50px 0 20px 0;
        text-align: center;
        font-size: 32px;
        color: #4c4c4c;
    }
    .appV-updateTime {
        text-align: center;
        font-size: 32px;
        color: #4c4c4c;
    }
    .appV-version-text {
        width: 100%;
        padding-top: 200px;

        text-align: center;
        font-size: 28px;
        color: #888;
    }
    .appV-bottom-text {
        position: absolute;
        bottom: 20px;
        left: 0;

        width: 100%;
        text-align: center;
        font-size: 24px;
        color: #888;
    }
</style>