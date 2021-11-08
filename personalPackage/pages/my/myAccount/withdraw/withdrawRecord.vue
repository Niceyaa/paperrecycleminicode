<template>
	<view class="withdraw-record">
		<view class="header-container">
			<view class="date-wrapper">
				<picker class="date-picker" mode="date" fields="month" :value="searchInfo.date"
					@change="bindDateChange">
					<view class="uni-input">{{searchInfo.realDate}}</view>
				</picker>
				<image src="../../../../static/imgs/downSelect.png" mode=""></image>
			</view>
			<view class="money-info">收入￥<text>{{totalFee}}元</text></view>
		</view>
		<view class="marginTop">
			<scroll-view class="record-detail" scroll-y="true">
				<view class="record-item" v-for="item in withdrawRecord" :key='item.serviceWithdrawalId'>
					<view class="item-left">
						<image src="../../../../static/imgs/withdrawRecord.png" mode=""></image>
						<view class="left-content">
							<view class="title">
								提现到{{item.withdrawalBankName}}（{{item.withdrawalBankCardId.substring(item.withdrawalBankCardId.length-4)}}）
							</view>
							<view class="time">{{item.createTime}}</view>
						</view>
					</view>
					<view class="item-right">
						<view v-if="item.withdrawalStatus===1" class="status">待审核</view>
						<view v-if="item.withdrawalStatus===2" class="status success">提现成功</view>
						<view v-if="item.withdrawalStatus===3" class="status fail">提现失败</view>
						<view class="money">-{{item.withdrawalPrice}}</view>
					</view>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import {
		withdrawRecord
	} from '@/api/thirdApi.js'
	export default {
		data() {
			return {
				searchInfo: {
					date: `${new Date().getFullYear()}年${(new Date().getMonth()+1).toString().padStart(2,0)}月`,
					realDate: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}`
				},
				withdrawRecord: [],
				totalFee: null
			};
		},
		onShow() {
			this.getData()
		},
		onPullDownRefresh() {
			let prm = {
				date: this.searchInfo.realDate
			}
			uni.showLoading({
				title: '加载中'
			})
			withdrawRecord(prm).then(res => {
				this.withdrawRecord = res.data.result.serviceWithdrawals
				this.totalFee = res.data.result.withdrawalTotalAmount
				uni.stopPullDownRefresh()
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			})
		},
		methods: {
			getData() {
				let prm = {
					date: this.searchInfo.realDate
				}
				uni.showLoading({
					title: '加载中'
				})
				withdrawRecord(prm).then(res => {
					this.withdrawRecord = res.data.result.serviceWithdrawals
					this.totalFee = res.data.result.withdrawalTotalAmount
					uni.hideLoading()
					uni.stopPullDownRefresh()
				}).catch(err => {
					uni.hideLoading()
				})
			},
			bindDateChange(e) {
				this.searchInfo.date =
					`${new Date(e.detail.value).getFullYear()}年${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}月`
				this.searchInfo.realDate =
					`${new Date(e.detail.value).getFullYear()}-${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}`
				this.getData()
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;

		.withdraw-record {
			height: 100%;
			position: relative;
			background: #fff;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;

			.header-container {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				background: #F2F4F6;
				height: 132upx;
				z-index: 999;
				box-sizing: border-box;
				padding: 24upx 0 24upx 32upx;

				.date-wrapper {
					display: flex;
					align-items: center;
					font-size: 30upx;
					color: #333333;

					image {
						width: 14upx;
						height: 8upx;
						margin-left: 10upx;
					}
				}

				.money-info {
					margin-top: 16upx;
					font-size: 28upx;
					color: #656565;
				}
			}

			.marginTop {
				margin-top: 132upx;
				height: 100%;

				.record-detail {
					width: 100%;
					height: 100%;
					box-sizing: border-box;

					.record-item {
						display: flex;
						width: 100%;
						align-items: center;
						justify-content: space-between;
						border-top: 2upx solid #F0F0F0;
						padding: 52upx 32upx;
						box-sizing: border-box;

						.item-left {
							display: flex;

							image {
								width: 80upx;
								height: 80upx;
								margin-right: 48upx;
							}

							.left-content {
								.title {
									font-size: 32upx;
									color: #252525;
									margin-bottom: 18upx;
								}

								.time {
									font-size: 24upx;
									color: #7F7F7F;
								}
							}
						}

						.item-right {
							text-align: right;
							.status{
								width: 106upx;
								height: 32upx;
								background: #F9BF31;
								border-radius: 20upx;
								text-align: center;
								line-height: 32upx;
								box-sizing: border-box;
								color: #FFFFFF;
								font-size: 20upx;
								margin: 8upx 0 8upx 0;
								&.success{
									background-color: #23CE85;
								}
								&.fail{
									background: #909090;
								}
							}
							.money {
								color: #212121;
								font-size: 40upx;
							}
						}


					}
				}
			}
		}
	}
</style>
