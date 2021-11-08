<template>
	<view class="pay-result">
		<image src="../../static/imgs/paySuccess.png" mode=""></image>
		<view class="title">提交成功</view>
		<view class="desc">订单提交成功，可继续抢单</view>
		<view class="backIndex" @click="backIndex">返回首页</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
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
