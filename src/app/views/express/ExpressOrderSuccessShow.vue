<template>
	<main-box :title="title" :show-more="false">
	    <div class="pay-success line line-x-b">
	      <span class="success-img"></span>
	      <span>支付成功</span>
	      <span class="c-f-primary float-r f-s-money">{{detailData.actualPayment | formatPrice}}</span>
	    </div>

	    <div class="order-ticket-info line line-x-b">
	    	<h2>
	    		<span>【小件快运】</span>
		    	<span class="citya-box">{{detailData.aAddress.city}}</span>
		    	<span class="jt-two-way"></span>
		    	<span>{{detailData.bAddress.city}}</span>
	    	</h2>
	    	<p class="ticket-time">
	    		<span>寄件时间：</span> {{detailData.pickUpDate}}
	    	</p>
	    </div>

	    <div class="pay-btn-box">
	      <a class="btn-pay-share" @click="showShare = true">提前告诉他</a>
	      <a class="btn-pay-detail" @click="jumpToOrderDetail" v-if="!isShare">查看订单详情</a>
	    </div>

	    <div slot="footer">
	      <share-modal :show="showShare" @closeShare="showShare = false"></share-modal>
	    </div>
	</main-box>
</template>
<script>
	import MainBox from 'components/mainBox/index.vue'
	import ShareModal from 'appComponents/shareModal/index.vue'

	export default {
		components: {
			MainBox,
			ShareModal
		},
		data() {
			return {
				detailData: {
					aAddress: {},
					bAddress: {}
				},
				title: this.$route.meta.title,
				orderId: this.$route.query.orderId,
				showShare: false
			}
		},
		mounted() {
			this.orderDetailById();
		},
		methods: {
			/**
			 * 查找订单详情
			 */
			orderDetailById () {
				this.$store.commit('UPDATE_LOADING', true);
				api.expressOrderFindDetail(this.orderId).then(res => {
				  const data = TOOL.toJson(res.data);
				  this.$store.commit('UPDATE_LOADING', false)
				  if (data.resultCode == '0') {
				    this.detailData = data.resultData;
				    let shareTitle = '【' + this.detailData.contactName + '】分享了快递订单';
				    let shareUrl = TOOL.shareURL + 'expressOrderShare' + '?orderId=' + this.orderId;
				    let shareImgUrl = this.detailData.customerHeadImgUrl;
            interfaceApi.share({
				        share: true,
				        shareUrl: shareUrl,
				        shareTitle: shareTitle,
				        shareDesc: '用小件快运，让快递从未如此便捷',
				        shareImgUrl: shareImgUrl
				    });
				  } else {
				    this.$store.dispatch('showError', data.resultMsg);
				  }
				})
			},
			/**
			 * 跳转订单详情
			 */
			jumpToOrderDetail() {
				this.$router.push({
					name: 'expressOrderDetail',
					query: {
						orderId: this.orderId
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.pay-btn-box{
	    display:flex;
	    padding:30px;
	    a{
	      display:block;
	      flex:1;
	      height:80px;
	      line-height:80px;
	      text-align:center;
	      font-size:28px;
	      color:#524c4c;
	      &.btn-pay-share{
	         margin-right:20px;
	         background-color: #ff6600;
	         color: #fff;
	         -webkit-border-radius:5PX;
	         -moz-border-radius:5PX;
	         border-radius:5PX;
	      }
	      &.btn-pay-detail{
	         border:1PX solid #ddd;
	         -webkit-border-radius:5PX;
	         -moz-border-radius:5PX;
	         border-radius:5PX;
	         background: #fff;
	      }
	    }
	  }
	.pay-success {
	    width: 100%;
	    height: 155px;
	    line-height: 155px;
	    padding: 0 20px;
	    font-size: 36px;
	    color: #272636;
	    background: #fff;

	    span {
	      float: left;
	      display: inline-block;
	      height: 155px;
	      line-height: 155px;
	    }
	  }
	  .success-img {
	    width: 70px;
	    margin-right: 30px;
	    background: url('../../../assets/city/success.png') no-repeat center center;
	    background-size: 70px 70px;
	  }
	  .float-r {
	    float: right !important;
	  }
	  .f-s-money {
	    font-size: 40px !important;
	  }
	  .order-ticket-info {
	    padding: 22px 20px;
	    background-color: #fff;
	    h2 {
	      margin-left: -16px;
	      margin-bottom: 30px;
	      font-weight: normal;
	      font-size: 32px;
	      color: #121212;
	      .citya-box {
	        margin-left: -12px;
	      }
	      .jt-tour-type {
	        position: relative;
	        display: inline-block;
	        width: 40px;
	        height: 30px;
	        background:url("../../../assets/jt_one_way.png") no-repeat center center;
	        background-size:37px 9px;
	        vertical-align: top;
	      }
	      .jt-two-way{
	        background:url("../../../assets/jt_two_way.png") no-repeat center center;
	        background-size:37px 20px;
	      }
	    }
	    .ticket-time{
	    	font-size: 28px;
	    	color: #4c4c4c;
	    }
	   }
</style>