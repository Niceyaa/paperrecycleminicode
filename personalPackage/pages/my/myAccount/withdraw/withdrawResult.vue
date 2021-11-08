<template>
	<view class="withdrawResult">
		<view class="content">
			<view class="left-wrapper">
				<image class="top-image" src="../../../../static/imgs/modelSelect.png" mode=""></image>
				<view class="top-part"></view>
				<view class="bottom-part"></view>
				<image class="bottom-image" src="../../../../static/imgs/withdrawResultImg.png" mode=""></image>
			</view>
			<view class="right-wrapper">
				<view class="title">提现申请已提交，等待处理</view>
				<view class="bank">{{bankInfo}}</view>
				<view class="money">{{money}}元</view>
				<view class="result-tip">提现申请后预计1－3个工作日到账，最快可2小时到账</view>
			</view>
		</view>
		<view @click="goBack" class="sureBtn">返回账户</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankInfo: '',
				money: null
			};
		},

		onLoad(opt) {
			this.bankInfo = opt.bankInfo
			this.money = opt.money
		},
		methods: {
			goBack() {
				/* uni.navigateTo({
					url:'/pages/index/index'
				}) */
				uni.navigateBack({
					delta: 3
				})
			}
		}
	}
</script>

<style lang="less">
	.withdrawResult {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.content {
			width: 100%;
			box-sizing: border-box;
			padding: 62upx 62upx 0 38upx;
			display: flex;

			.left-wrapper {
				display: flex;
				width: 74upx;
				margin-right: 26upx;
				flex-wrap: wrap;
				height: 292upx;

				.top-image {
					width: 74upx;
					height: 74upx;
				}

				.top-part {
					width: 6upx;
					height: 96upx;
					background: #23CE85;
					border-radius: 3upx;
					margin-left: 34upx;
				}

				.bottom-part {
					height: 86upx;
					width: 6upx;
					background: #D8D8D8;
					margin-left: 34upx;
				}

				.bottom-image {
					width: 50upx;
					height: 50upx;
					margin-left: 12upx;
				}
			}

			.right-wrapper {
				width: 550upx;

				.title {
					font-size: 30upx;
					color: #333333;
					margin: 12upx 0 22upx 0;
				}

				.bank {
					font-size: 28upx;
					color: #A0A0A0;
					margin-bottom: 22upx;
				}

				.money {
					font-size: 28upx;
					color: #A0A0A0;
					margin-bottom: 90upx;
				}

				.result-tip {
					font-size: 30upx;
					color: #333333;
				}
			}
		}

		.sureBtn {
			width: 686upx;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			text-align: center;
			line-height: 88upx;
			color: #fff;
			font-size: 34upx;
			margin: 90upx 0 0 32upx;
		}
	}
</style>
