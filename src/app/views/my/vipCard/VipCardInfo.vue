<template>
    <main-box :title="title" main-class="scrollingBox">
        <div class="comy-int-box" v-html="cardInfo.description"></div>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'

    export default {
        components: {
            MainBox
        },
        data () {
            return {
                title: this.$route.meta.title,
                cardId:'',
                cardInfo:{}
            }
        },
        mounted () {
            this.cardId = this.$route.query.cardId
            this.memberCardFindById()
        },
        methods: {
            memberCardFindById () {
                this.$store.commit('UPDATE_LOADING', true)
                api.memberCardFindById(this.cardId).then(res => {
                    const data = TOOL.toJson(res.data)
                    this.$store.commit('UPDATE_LOADING', false)
                    if (data.resultCode === '0') {
                        this.cardInfo = data.resultData
                    }else{
                        this.$store.dispatch('showError', data.resultMsg);
                    }
                })
            },
        }
    }
</script>
