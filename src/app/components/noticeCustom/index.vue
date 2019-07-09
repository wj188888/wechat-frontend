<template>
    <div>
        <div v-if="contents" v-for="content in contents">
            <notice :text="content.content">
                <h3>{{content.title}}</h3>
            </notice>
        </div>
    </div>
</template>
<script>
    import Notice from 'appComponents/notice/index.vue'

    export default {
        props:['contents'],
        components:{
            Notice
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
