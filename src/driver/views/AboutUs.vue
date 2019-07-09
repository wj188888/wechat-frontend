<template>
    <div class="app-main">
        <div class="logo-box">
            <p>{{version}}</p>
        </div>
        <router-link tag="div" :to="{name: 'serviceAgreement'}" class="driver-copyright">
            <p class="pro">连接司机软件许可及服务协议</p>
            <p class="company">连接版权所有</p>
            <p class="version">Copyright @ 2016-2017 undunion All Right Reserved</p>
        </router-link>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                version:'',
            }
        },
        mounted () {
           this.version = localStorage.version ? 'V' + localStorage.version : 'V1.12'
        },
        methods:{

        }
    }
</script>
<style lang="less" scoped>
    .app-main{
        height:100%;
        overflow:hidden;
    }
    .logo-box{
        height:370px;
        margin:40px 30px 0;
        background:url("../../../static/driverPics/logo.png") no-repeat center 30px #fff;
        background-size:274px 224px;
        -webkit-box-shadow: 0 1px 4px rgba(1, 1, 1, 0.2);
        -moz-box-shadow: 0 1px 4px rgba(1, 1, 1, 0.2);
        box-shadow: 0 1px 4px rgba(1, 1, 1, 0.2);
        -webkit-border-radius: 0.5rem;
        -moz-border-radius: 0.5rem;
        border-radius: 0.5rem;
        p{
            padding-top:300px;
            font-size:28px;
            color:#888;
            text-align: center;
        }
    }
    .driver-copyright{
        position:absolute;
        width:100%;
        bottom:20px;
        font-size:22px;
        color:#888;
        text-align: center;
        p{
            margin-bottom:10px;
        }
        .pro{
            color:#65a4ef;
        }
    }
</style>
