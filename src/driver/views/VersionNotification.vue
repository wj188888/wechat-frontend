<template>
    <div class="app-main">
        <ul class="version-list" v-if="versionData.length">
            <li class="line linex-x-b" v-for="(version, index) in versionData">
                <p class="p1":class="{'dd-text-active': showVersion == index}" @click="showVersionDetail(index)">
                    连接司机{{version.alias}}主要更新<i class="icon-r-jt"></i>
                </p>
                <div class="version-detail" v-show="showVersion == index">{{version.updateContent}}</div>
            </li>
        </ul>
        <div class="empty-version" v-if="!versionData.length">暂无新版本</div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                showVersion:'hide',
                versionData: []
            }
        },
        mounted () {
            this.appVersionFind()
        },
        methods:{
            appVersionFind () {
                api.appVersionFind().then(res => {
                    const data = TOOL.toJson(res.data)
                    if (data.resultCode == '0') {
                        this.versionData = data.resultData.content
                    }
                })
            },

            showVersionDetail (index) {
                if(this.showVersion == index){
                    this.showVersion = 'hide'
                }else{
                    this.showVersion = index
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .empty-version{
        height:100%;
        padding-top:18rem;
        font-size: 1.5rem;
        text-align:center;
        color:#888888;
    }
    .version-list{
        background:#fff;
        li{
            padding:0 32px;
            .p1{
                position: relative;
                height:110px;
                line-height:110px;
                font-size: 26px;
                color: #121212;
            }
        }
        .dd-text-active{
            background:#fff;
        }
        .version-detail{
            padding:20px 0;
        }
    }
</style>