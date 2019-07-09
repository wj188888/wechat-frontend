<template>
	<main-box :title="title">
	<div v-show="!showNoResult">
    <scroll ref="scroll"
            :pullUpLoad="true"
            @pullingUp="onPullingUp">
			<div>
				<ul class="express-list" >
					<li v-for="express in expressOrderList" @click="jumpToOrderDateil(express.id)">
						<p class="title">
							<span class="pull-left">订单号：{{express.code}}</span>
							<span class="pull-right" v-if="express.status == 0 && (express.chargeMethod == '1' || express.chargeMethod == '0' && !express.actualPayment)">已完成</span>
              <span class="pull-right" v-else>{{express.status | pressStatusTxt}}</span>
						</p>
						<div class="content">
							<i class="firm-logo" :style=" express.customerHeadImgUrl ? {backgroundImage:'url(\'' + express.customerHeadImgUrl + '\')'} : '' "></i>
							<p class="content-title">{{express.contactName}}</p>
							<p class="content-date-time">{{express.createdTime}}</p>
						</div>
					</li>
				</ul>
			</div>
		</scroll>
	</div>
	</main-box>
</template>
<script>
	import MainBox from 'components/mainBox/index.vue'
  import Scroll from 'components/betterScroll/scroll/scroll'
	import NoResult from 'appComponents/noResult/index.vue'

	export default {
		components: {
			MainBox,
      Scroll,
			NoResult
		},
		data() {
			return {
				title: this.$route.meta.title,
        searchKeys: {
					pageNo: 0,
					pageSize: TOOL.pageSize
				},
				totalPage: '',
				expressOrderList: [],
				showNoResult: false,
				noResultText: '暂无<br/>'
			}
		},
		mounted() {
      this.searchKeys.pageNo = 0
      this.onPullingUp()
		},
		methods: {
      /**
       * 下拉刷新
       */
      onPullingUp () {
        if(this.searchKeys.pageNo === 0){
          this.expressOrderList = []
          this.loadPageList()
          this.$refs.scroll.scrollTo(0, 0)
        }else{
          setTimeout(()=>{
            this.loadPageList()
          }, 1000)
        }
      },
      
      loadPageList() {
        if(this.searchKeys.pageNo && this.searchKeys.pageNo >= this.totalPage){
          this.$refs.scroll.forceUpdate()
          return
        }
				api.expressOrderFind(this.searchKeys).then(res=>{
					const data = TOOL.toJson(res.data)
					if (data.resultCode === '0') {
						this.expressOrderList = this.expressOrderList.concat(data.resultData.content)
						this.totalPage = data.resultData.totalPages
            this.showNoResult = !this.expressOrderList.length;
            setTimeout(() => {
              if(this.$refs.scroll){
                this.$refs.scroll.forceUpdate(true)
              }
            }, 20)
            if(this.searchKeys.pageNo === 0 || this.searchKeys.pageNo < this.totalPage){
              this.searchKeys.pageNo++
            }
					} else {
						this.$store.dispatch('showError', data.resultMsg);
					}
				})
			},

			/**
			 * 跳转详情
			 * @param orderId
			 */
			jumpToOrderDateil(orderId) {
				this.$router.push({
					name: 'expressOrderDetail',
					query: {
						orderId: orderId
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.express-list {
		padding-bottom: 50px;
		li {
			position: relative;
			height: 180px;
			margin-bottom: 20px;
			padding: 20px;
			background-color: #fff;
			.title {
				height: 28px;
				line-height: 28px;
				margin-bottom: 20px;
				.pull-left {
					font-size: 24px;
					color: #888888;
				}
	            .pull-right {
		            font-size: 28px;
		            color: #ff6600;
	            }
			}
			.content {
				position: relative;
				padding: 10px 0 0 120px;
				.firm-logo {
					display: inline-block;
					width: 100px;
					height: 100px;
					position: absolute;
					left: 0px;
					top: 0px;
					background-color: #00a11d;
					background-size: 100% 100%;
				}
				.content-title {
					font-size: 32px;
					color: #121212;
					margin-bottom: 20px;
				}
				.content-date-time {
					font-size: 24px;
					color: #888888;
				}
			}
		}
	}
</style>