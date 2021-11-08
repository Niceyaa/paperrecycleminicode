<template>
	<view class="my-account">
		<view class="title">我的账户</view>
		<view class='balance-wrapper'>
			<view class="balance-left">
				<view class="balance-title">账户余额</view>
				<view class="balance">￥<text class="money">{{dataInfo.accountBalance}}</text></view>
			</view>
			<view class="balance-right" @click="goToUrl('/personalPackage/pages/my/myAccount/recharge/recharge')">充值
			</view>
		</view>
		<view class="content-wrapper">
			<view class="list-wrapper">
				<view class="opt-item" @click="goToUrl('/personalPackage/pages/my/myAccount/billDetail')">
				<!-- <view class="opt-item"> -->
					<image src="../../../static/imgs/billDetail.png" mode=""></image>
					<view class="txt">账单明细</view>
				</view>
				<view class="opt-item" @click="goToUrl('/personalPackage/pages/my/myAccount/billStatistic')">
				<!-- <view class="opt-item"> -->
					<image src="../../../static/imgs/incomePayStat.png" mode=""></image>
					<view class="txt">收支统计</view>
				</view>
				<view @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/withdraw')" class="opt-item">
					<image src="../../../static/imgs/withdraw.png" mode=""></image>
					<view class="txt">提现</view>
				</view>
				<view @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/myBank')" class="opt-item">
					<image src="../../../static/imgs/myBank.png" mode=""></image>
					<view class="txt">我的银行卡</view>
				</view>
			</view>
			<view class="today-bill-top">
				<view>今日账单</view>
				<view class="data-explain">
					<view>数据说明</view><image src="../../../static/imgs/ask.png" mode=""></image>
				</view>
			</view>
			<view class="today-bill">
				<view class="bill-item">
					<view class="money">+{{todayBill.revenue}}</view>
					<view class="bill-column">今日收入</view>
				</view>
				<view class="bill-item">
					<view class="money">-{{todayBill.pay}}</view>
					<view class="bill-column">今日支出</view>
				</view>
				<view class="bill-item">
					<view class="money">{{todayBill.profit}}</view>
					<view class="bill-column">盈余</view>
				</view>
			</view>
			<view class="bottom-show">
				<image src="../../../static/imgs/arrowLeft.png" mode=""></image>
				<view>我是有底线的</view>
				<image src="../../../static/imgs/arrowRight.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUserAccountData
	} from '@/api/user.js'
	export default {
		data() {
			return {
				dataInfo: {
					accountBalance: 0.00,
				},
					todayBill:{
						pay:0,
						profit:0,
						revenue:0
					}
			};
		},
		onShow() {
			// this.dataInfo.accountBalance = uni.getStorageSync('accountBalance')
			getUserAccountData().then(res => {
				let {result} = res.data
				console.log(result.todayDetailVO.pay)
				this.dataInfo.accountBalance = result.accountBalances
				this.todayBill.pay = (result.todayDetailVO.pay).toFixed(2)
				this.todayBill.profit = (result.todayDetailVO.profit).toFixed(2)
				this.todayBill.revenue = (result.todayDetailVO.revenue).toFixed(2)
				uni.setStorageSync('accountBalance', result.accountBalances)
			})
		},
		methods: {
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="less">
	.my-account {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			font-size: 48upx;
			color: #333333;
			margin: 40upx 0 48upx 32upx;
		}

		.balance-wrapper {
			box-sizing: border-box;
			width: 686upx;
			background: #23CE85;
			border-radius: 16upx 16upx 0upx 0upx;
			margin-left: 32upx;
			padding: 36upx 70upx 32upx 32upx;
			display: flex;
			justify-content: space-between;

			.balance-left {
				font-size: 28upx;
				color: rgba(255, 255, 255, 0.8);

				.balance {
					margin-top: 12upx;
					font-size: 28upx;
					color: rgba(255, 255, 255, 0.8);

					.money {
						font-size: 52upx;
						font-weight: 600;
						color: #FFFFFF;
					}
				}
			}

			.balance-right {
				width: 172upx;
				height: 70upx;
				line-height: 70upx;
				text-align: center;
				background: #EAFFF7;
				border-radius: 35upx;
				font-size: 30upx;
				font-weight: 600;
				color: #23CE85;
				margin-top: 36upx;
			}
		}

		.content-wrapper {
			width: 100%;
			box-shadow: 0px -14px 8px 0px rgba(39, 214, 139, 0.46);

			.list-wrapper {
				display: flex;
				justify-content: space-between;
				padding-top: 40upx;

				.opt-item {
					flex: 0.3333;
					text-align: center;
					font-size: 26upx;
					color: #515151;

					image {
						width: 88upx;
						height: 88upx;
					}
				}
			}

			.today-bill-top {
				padding: 64upx 46upx 46upx 52upx;
				font-size: 34upx;
				color: #333333;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.data-explain {
					display: flex;
					align-items: center;
					font-size: 26upx;
					color: #333333;

					image {
						width: 26upx;
						height: 26upx;
						vertical-align: middle;
						margin-left: 4upx;
					}
				}
			}

			.today-bill {
				width: 686upx;
				height: 214upx;
				background: #FFFFFF;
				box-shadow: 0upx 4upx 16upx 0upx rgba(7, 83, 25, 0.15);
				border-radius: 16upx;
				margin: 0 32upx;
				padding: 60upx 0;
				box-sizing: border-box;
				display: flex;

				.bill-item {
					flex: 0.33333;
					text-align: center;
					border-right: 2upx dashed #E2DFDF;
					font-size: 38upx;
					color: #333333;

					.bill-column {
						font-size: 24upx;
						color: #797979;
						padding-top: 30upx;
					}

					&:last-child {
						border: none;
					}
				}
			}

			.bottom-show {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26upx;
				color: #C0C5D3;
				margin-top: 80upx;

				image {
					width: 76upx;
					height: 6upx;
					margin: 0 12upx;
				}
			}
		}
	}
</style>
