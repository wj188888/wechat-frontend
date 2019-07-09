<template>
    <div class="car-type-selecet">
        <div class="inline-box mar-b-20 auto inline-box-car" @click="jumpToCarTypeSelect">
            <label>{{title}}</label>
            <div class="car" v-if="value">
                <img class="car-type-img" :src="value.imgUrl"/>
                <div class="car-type-info">
                    <p class="car-type">{{carTypeValue}}</p>
                    <div class="clearfix">
                        <p class="car-total-seats">&times;{{value.seats}}</p>
                    </div>
                    <p class="car-type-ctg">{{carBrandValue}}</p>
                </div>
            </div>
            <span class="placeholder" v-if="!value">请选择用车</span>
            <i class="icon-r-jt"></i>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            title:{
                type:String,
                default: '车型选择'
            },
            value: {
                default: ''
            },
            productId: {
                type:String,
                required: true
            },
            productType: {
                type:String,
                required: true
            },
            fromPageRouter: {
                type:String,
                required: true
            },
            saveForm: {
                type: Function,
                default: () => ''
            },
        },
        data () {
            return {

            }
        },
        computed: {
            carTypeValue () {
                if(this.value){
                    return TOOL.carInfo[this.value.carType].value
                }
            },
            carBrandValue () {
                if(this.value){
                    return this.value.carBrand.slice(0, 2).join('、') + '等同级车'
                }
            }
        },
        methods:{
            jumpToCarTypeSelect () {
                this.saveForm()
                this.$router.push({
                    name: 'carTypeSelect',
                    query: {
                        fromPageRouter: this.fromPageRouter,
                        productId: this.productId,
                        productTypeLevelOne: this.productType
                    }
                })
            },

        }
    }
</script>
<style lang="less" scoped>
    .auto{
        overflow:visible!important;
        &.dd-text-active{
            background:#fff;
         }
    }
    .inline-box-car{
        label{
            line-height:100px;
        }
        .car{
            flex:1;
            padding-top:20px;
        }
        .placeholder{
            flex:1;
            line-height:100px;
            color:#999;
        }
    }

    .car-type-img{
        float:left;
        width:160px;
        height:90px;
        margin-top:14px;
    }
    .car-type-info{
        margin-left:180px;
        margin-right:20px;
        .car-type{
            font-size:32px;
            color:#121212;
        }
        .car-total-seats{
            float:left;
            height:60px;
            line-height:60px;
            padding-left:40px;
            background:url("../../../assets/seats.png") no-repeat 0 center;
            background-size:30px 30px;
            font-size:28px;
        }
        .car-type-ctg{
            font-size:24px;
            color:#4c4c4c;
        }
    }
</style>