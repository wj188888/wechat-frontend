<template>
    <ul class="carpool-group-list">
        <li class="radius-box" @click="jumpToJoinCarpool">
            <div class="list-body line line-x-b">
                <div class="time-price clearfix">
                    <p class="text-time">{{groupdata.startupTime | formatDate('time')}}<em class="car-type line line-box radius-box">{{groupdata.carGrade | getCarType}}</em></p>
                    <p class="text-price">{{groupdata.price | formatPrice}}</p>
                </div>
                <p class="list-address">
                    <i class="circle-bg-start">始</i> {{ groupdata.source + ' ' + (groupdata.sourceDetailAddress || '') }} <span>距我{{groupdata.distance}}km</span>
                </p>
                <p class="list-address mar-b-0">
                    <i class="circle-bg-end">终</i> {{ groupdata.destination + ' ' + (groupdata.destDetailAddress || '' )}}
                </p>
            </div>
            <div class="list-footer clearfix">
                <p class="carpool-people">还差<em>{{groupdata.availableSeats}}</em>人成团</p>
                <a class="carpool-join-btn">我要参团</a>
            </div>
        </li>
    </ul>
</template>
<script>
    export default {
        props:{
          "groupdata": {
            default: {
                startupTime: '2017-05-11 11:10:00'
            }
          }
        },
        methods:{
            jumpToJoinCarpool () {
                this.$emit('jumpToJoinCarpool', this.groupdata)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../../styles/theme.less";
    .carpool-group-list{
        margin-bottom:20px;
        &:last-child{
             margin-bottom:0;
        }
        li{
            background-color:@bg-fff;
        }
        .list-body{
            padding:20px 30px;
            .time-price{
                margin-bottom:36px;
                font-size:40px;
                .text-time{
                    float:left;
                    color:#121212;
                }
                .car-type{
                    position: relative;
                    top:-10px;
                    margin-left:20px;
                    padding:5px 10px;
                    color: @fc-888;
                    font-size: 22px;
                }
                .text-price{
                    float:right;
                    color:#ff6600;
                }
            }
            .list-address {
                margin-bottom: 50px;
                font-size: 30px;
                color: #121212;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                i {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    margin-right: 20px;
                    text-align: center;
                    color: #fff;
                    background-color: #4D4D4D;
                    -webkit-border-radius: 15px;
                    -moz-border-radius: 15px;
                    border-radius: 15px;
                    font-size: 16px;
                    vertical-align: middle;
                }
                span{
                    margin-left:16px;
                    font-size:24px;
                    color:#888;
                }
            }
        }
        .list-footer{
            height:100px;
            line-height:100px;
            padding:0 30px;
            font-size:24px;
            color:#4c4c4c;
            .carpool-people{
                float:left;
                padding-left:38px;
                background:url("../../../assets/city/group.png") no-repeat 0 center;
                background-size:30px 30px;
            }
            em{
                color:#ff6600;
            }
            .carpool-join-btn{
                float:right;
                width: 156px;
                height:60px;
                line-height:60px;
                margin-top:20px;
                font-size:28px;
                color:#fff;
                text-align:center;
                background-color: #ff6600;
                border-radius:4PX;
            }
        }
    }
</style>
