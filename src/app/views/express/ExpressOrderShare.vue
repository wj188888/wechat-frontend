<template>
	<main-box :title="title" main-class="scrollingBox has-abs-bottom">
		<div class="ticket-info-order">
			<p>
				<span class="left-span">寄件时间</span>
				<span class="right-span" v-text="detailData.pickUpDate"></span>
			</p>
			<p>
				<span class="left-span">寄件线路</span>
				<span class="right-span">{{detailData.aAddress.city}} - {{detailData.bAddress.city}}</span>
			</p>
			<p>
				<span class="left-span">物品名称</span>
				<span class="right-span" v-text="detailData.goods"></span>
			</p>
			<p>
				<span class="left-span">寄件人</span>
				<span class="right-span" v-text="detailData.contactName"></span>
			</p>
			<p>
				<span class="left-span">手机号</span>
				<span class="right-span" v-text="detailData.contactTelephone"></span>
			</p>
			<p>
				<span class="left-span">寄件地址</span>
				<span class="right-span" v-text="detailData.pickUpAddress"></span>
			</p>
			<p>
				<span class="left-span">备注</span>
				<span class="right-span" v-text="detailData.remark"></span>
			</p>
		</div>
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
		 		orderId: '',
		 		detailData: {
		          aAddress:{},
		          bAddress:{}
		        }
	 		}
	 	},
	 	mounted() {
	 		this.initialize()
	 	},
	 	methods: {
	 		initialize() {
	 			this.orderId = this.$route.query.orderId;
	 			this.orderDetailById();
	 		},
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
			  } else {
			    this.$store.dispatch('showError', data.resultMsg);
			  }
			})
},
	 	}
	 }
</script>
<style lang="less" scoped>
	.ticket-info-order {
		padding: 20px 0;
	    margin-bottom: 20px;
	    background-color: #fff;
	    p {
	      height: 30px;
	      line-height: 30px;
	      padding: 0 20px;
	      margin-bottom: 30px;
	      font-size: 28px;
	      color: #888888;
	      &:last-child {
	         margin-bottom: 0;
	       }
	    }
	    .left-span {
	      float: left;
	      width: 160px;
	      height: 30px;
	      color: #999;
	    }
	    .right-span {
	      float: right;
	      height: 30px;
	      color: #999;
	      em {
	        color: #272a35;
	      }
	    }
	}
	.mar-b-50 {
	    margin-bottom: 50px !important;
	}
</style>
