<template>
    <!--<main-box :title="title" main-class="scrollingBox has-abs-bottom" :show-more="false">

    </main-box>-->
    <div class="appV">
        <div class="appV-t">
            <p class="appV-p1">请点击右上角图标</p>
            <p class="appV-p2">
                <span class="appV-p2-small">选择</span>
                在浏览器中打开
                <span class="appV-p2-small">下载</span>
            </p>
        </div>
        <div class="appV-b">
            <div class="appV-icon">
                <img :src="appData.appSetting.appInformationSetting.appIcon" alt="">
            </div>
            <p class="appV-des">
                {{appData.appSetting.appInformationSetting.appName}}
            </p>
            <p class="appV-updateTime">
                更新于
                <span>{{appData.createdTime.split(' ')[0]}}</span>
            </p>
            <p class="appV-version-text">
                v
                <span>{{appData.versionNumber1}}</span>
                .
                <span>{{appData.versionNumber2}}</span>
                .
                <span>{{appData.versionNumber3}}</span>
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
                appData: {
                    createdTime: '2017-10-10 11:11:11',
                    appSetting: {
                        appInformationSetting: {
                            appName: '',
                            appIcon: ''
                        }
                    }
                },

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
            this.appPackageInfo();
            this.judgeBrowser();
        },
        methods: {
            /**
             * 查找产品详情
             */
            appPackageInfo () {
                let apiData = {
                    versionType: this.$route.query.versionType || 0,
                    appType: this.$route.query.appType || 0,
                    storeId: this.$route.query.storeId || '586a1a0267907f3c72bf6c27'
                };
                api.appPackageInfo(apiData).then(res => {
                    const data = TOOL.toJson(res.data);
                    if (data.resultCode == '0') {
                        this.appData = data.resultData
//                        console.log(this.appData);
                    } else {
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
            /**
             * 判断浏览器类型
             */
            judgeBrowser() {
                var userAgent = navigator.userAgent;
                var webUrl = config.hostUrl;
                webUrl = webUrl.replace('wechat', 'firm');
                var urlLink = webUrl + 'orange-firm/appPackageInfo/a/downloadPackage?versionType='+this.$route.query.versionType+'&appType='+this.$route.query.appType+'&storeId='+this.$route.query.storeId;
                //微信扫描
                if(userAgent.indexOf("MicroMessenger") > 0){

                }else{
                    if (userAgent.indexOf("Android") > 0) {
                        window.location.href = urlLink;
                    } else if (userAgent.indexOf("iPhone") > 0) {
                        alert('苹果版本正在开发中，敬请期待！');
                    }else{
                        window.location.href = urlLink;
                    }
                }
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
        top: 302px;
        bottom: 0;

        background: url("../../assets/firm/appBack.png") no-repeat left top;
        background-size: cover;
    }
    .appV-icon {
        width: 180px;
        height: 180px;
        border-radius: 32px;
        box-shadow: 0 0 10px 0 #ccc;
        margin: 120px auto 0 auto;

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