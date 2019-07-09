<template>
    <main-box :title="title" :show-back="!isUndunionApp" :show-more="!isUndunionApp">
        <ul class="top-flex-nav line line-x-b">
            <router-link tag="li" :to="{name:'commonUsedAddress'}" activeClass="active" replace>
                <a>常用地址</a>
            </router-link>
            <router-link tag="li" :to="{name:'passengerInfo'}" activeClass="active" replace>
                <a>旅客信息</a>
            </router-link>
        </ul>
        <set-common-address></set-common-address>
    </main-box>
</template>
<script>
    import MainBox from 'components/mainBox/index.vue'
    import SetCommonAddress from 'appComponents/set-common-address/index.vue'

    export default {
        components: {
            MainBox,
            SetCommonAddress
        },
        data () {
            return {
              title: this.$route.meta.title,
              isUndunionApp: TOOL.browser().undunion_app
            }
        },
    }
</script>
