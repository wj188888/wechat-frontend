<template>
	<main-box :title="title" main-class="scrollingBox has-abs-bottom" :show-more="false">
		<p class="notice-txt" v-text="noticeTxT"></p>
	</main-box>
</template>
<script>
	import MainBox from 'components/mainBox/index.vue'

	export default {
		components: {
			MainBox
		},
		data() {
			return {
				title: this.$route.meta.title,
				notice: this.$route.query.page,
				noticeTxT: ''
			}
		},
		mounted () {
			this.noticeTxT = JSON.parse(appStorage.get(this.notice)).notice;
		}
	}	
</script>
<style lang="less" scoped>
	.notice-txt {
		padding: 30px 20px;
		font-size: 26px;
		color: #888888;
		line-height: 26px;
	}
</style>