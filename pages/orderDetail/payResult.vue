<template>
	<view class="pay-result" v-if="type === 'success'">
		<image src="../../static/imgs/paySuccess.png" mode=""></image>
		<view class="title">支付成功</view>
		<view v-if="paymentType==1" class="desc">请在线下向用户进行现金支付</view>
		<view v-else class="desc">订单支付成功，可继续抢单</view>
		<view class="backIndex" @click="backIndex">返回首页</view>
	</view>
	<view class="pay-result" v-else>
		<image src="../../static/imgs/payFail.png" mode=""></image>
		<view class="title">支付失败</view>
		<view class="desc">支付失败，返回收货页面重新确认支付</view>
		<view @click="goToUrl" class="backIndex">返回收货页面</view>
		<view class="backHome" @click="backIndex">返回首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'fail',
				paymentType: 1,
				orderId:null
			};
		},
		
		onLoad(opt) {
			this.orderId = opt.orderId
			if(opt.code == 200){
				this.type = 'success'
				this.paymentType = opt.paymentType
			}
		},
		methods: {
			backIndex(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
		}
	}
</script>

<style lang="less">
	.pay-result{
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		image{
			width: 140upx;
			height: 140upx;
			display: block;
			margin: 100upx auto 40upx auto;
			box-sizing: border-box;
		}
		.title{
			font-size: 34upx;
			color: #333333;
			text-align: center;
		}
		.desc{
			text-align: center;
			font-size: 28upx;
			color: #939A8F;
			margin: 30upx 0 148upx 0;
		}
		.backIndex{
			width: 636upx;
			height: 88upx;
			background: #23CE85;
			border-radius: 44upx;
			margin: 0 auto;
			font-size: 34upx;
			color: #FFFFFF;
			line-height: 88upx;
			box-sizing: border-box;
			text-align: center;
		}
		.backHome{
			width: 636upx;
			height: 88upx;
			border-radius: 44upx;
			margin: 42upx auto 0 auto;
			font-size: 34upx;
			color: #808984;
			line-height: 88upx;
			border: 2upx solid #808984;
			box-sizing: border-box;
			text-align: center;
		}
	}
</style>
