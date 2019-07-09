<template>
    <router-link tag="div" class="ui-sight-title mar-b-30 clearfix" :to="{name: router}" v-if="show">
        <div class="title clearfix">
            <span class="circle"></span>
            <span class="center">{{title}}</span>
            <span class="circle"></span>
        </div>
        <div class="more clearfix">
            <span>更多</span>
            <i class="icon-r-jt"></i>
        </div>
    </router-link>
</template>
<script>
    export default {
        props:['title', 'router', 'show'],
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