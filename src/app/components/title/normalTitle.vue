<template>
    <div class="ticket-type-tit" :class="[cssClass]" v-if="show">
        <i class="shu"></i>{{title}}
    </div>
</template>
<script>
    export default {
        props:{
            show:{
                default: true
            },
            title:{
                default: ''
            },
            cssClass:{
                default: ''
            }
        },
        data () {
            return {

            }
        },
        computed: {

        },
        mounted () {

        },
        methods:{

        }
    }
</script>
<style lang="less" scoped>
    @import "../../../styles/theme.less";
    .ticket-type-tit {
        padding: 25px 20px 14px;
        font-size: 28px;
        color: @c-4c4c4c;
        .shu{
            position: relative;
            top:1PX;
            display:inline-block;
            width:6px;
            height:24px;
            margin-right:10px;
            background-color: @c-ff6600;
            -webkit-border-radius:2PX;
            border-radius:2PX;
        }
    }
</style>
