<template>
    <div class="city-list-box" v-if="show">
        <div class="city-list-scroll">
            <ul class="city-zm">
                <li class="city-zm-li" v-for="(list, key) in listData">
                    <p v-text="key"></p>
                    <ul class="city-zm-list">
                        <li v-for="(value, index) in list" :key="index" @click="setValue(value)">
                            <span v-if="type === 'city'">{{value}}</span>
                            <span v-if="type === 'airportName'">{{value.airportName}}</span>
                            <span v-if="type === 'cityName'">{{value.name}}</span>
                            <span v-if="type === 'airportStation'">
                                <span class="city-name">{{value.city}}</span>
                                <span class="station-name">{{value.name}}<span v-if="value.terminal">-{{value.terminal}}</span></span>
                            </span>
                            <span v-if="type === 'trainStation'">
                                <span class="city-name">{{value.city}}</span>
                                <span class="station-name">{{value.name}}</span>
                            </span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            listData:{

            },
            type:{
                default: 'city'
            },
            show:{
                default: true
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
            setValue (value) {
                this.$emit('setValue', value)
            },
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../styles/theme.less";
    .city-list-box{
        position:relative;
        font-size:28px;
        background-color: @c-fff;
        overflow:hidden;
        .city-zm-li{
            p{
                height:80px;
                line-height:80px;
                padding:0 20px;
                color: @c-ff6600;
                background:#f2f2f2;
            }
        }
        .city-zm-list li{
            height:86px;
            line-height:86px;
            padding:0 20px;
            color:#4d4d4d;
            border-bottom:1PX solid #e1e1e1;
            .city-name{
                font-size:30px;
                color:#121212;
                margin-right:28px;
            }
            .station-name{
                font-size:26px;
            }
        }
    }
</style>