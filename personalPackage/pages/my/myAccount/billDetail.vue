<template>
	<view class="withdraw-record">
		<view class="header-container">
			<view class="date-wrapper">
				<picker class="date-picker" mode="date" fields="month" :value="searchInfo.realDate"
					@change="bindDateChange">
					<view class="uni-input">{{searchInfo.realDate}}</view>
				</picker>
				<image src="../../../static/imgs/downSelect.png" mode=""></image>
			</view>
			<view class="money-info">
				<view class="income-wrapper">
					<view>支出￥{{pay}}</view>
					<view>收入￥{{income}}</view>
				</view>
				<view class="statistic" @click="goToUrl('/personalPackage/pages/my/myAccount/billStatistic?date='+searchInfo.realDate)">
					<text>统计</text>
					<image src="../../../static/imgs/billStatisticRight.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="marginTop">
		<!-- 	<scroll-view refresher-enabled="true" :refresher-triggered="true" :refresher-threshold="100" refresher-background="lightgreen" class="record-detail" scroll-y="true"> -->
				<view class="record-detail">
				<view class="record-item" v-for="(item,idx) in dataList" :key='idx'>
					<image v-if="item.varyAccountBalances>=0" class="item-left" src="../../../static/imgs/withdrawRecord.png" mode="" />
					<image v-else class="item-left" src="../../../static/imgs/incomeIcon.png" mode="" />
					<view class="item-right">
						<view class="right-top">
							<view>{{item.serviceBusinessType}}</view>
							<view>{{item.varyAccountBalances}}</view>
						</view>
						<view class="right-bottom">
							<view>{{item.createTime}}</view>
							<view>余额{{item.accountBalances}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getBillDetail
	} from '../../../../api/account.js'
	export default {
		data() {
			return {
				searchInfo: {
					date: `${new Date().getFullYear()}年${(new Date().getMonth()+1).toString().padStart(2,0)}月`,
					realDate: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}`
				},
				dataList:[],
				pay:0.00,
				income:0.00,
				total: 0,
				pageSize: 20,
				currentPage: 1,
			};
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh() {
			let prm = {
				"startDate": this.searchInfo.realDate
			}
			uni.showLoading({
				title:'加载中',
				icon:'none'
			})
			getBillDetail(prm).then(res=>{
				let {result} = res.data
				this.pay = result.pay
				this.income = result.revenue
				this.dataList = result.list
				uni.stopPullDownRefresh()
				uni.hideLoading()
			}).catch(err=>{
				uni.stopPullDownRefresh()
				uni.hideLoading()
			})
		},
		methods: {
			getList(n = this.currentPage) {
				let prm = {
					"startDate": this.searchInfo.realDate
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				getBillDetail(prm).then(res=>{
					let {result} = res.data
					this.pay = result.pay
					this.income = result.revenue
					this.dataList = result.list
					uni.hideLoading()
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			bindDateChange(e) {
				this.searchInfo.date = `${new Date(e.detail.value).getFullYear()}年${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}月`
				this.searchInfo.realDate = `${new Date(e.detail.value).getFullYear()}-${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}`
				this.getList()
			},
			goToUrl(url){
				uni.navigateTo({
					url
				})
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
				padding: 24upx 32upx 24upx 32upx;

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
					display: flex;
					justify-content: space-between;
					align-items: center;

					.income-wrapper {
						display: flex;
						align-items: center;

						view {
							&:last-child {
								margin-left: 50upx;
							}
						}
					}

					.statistic {
						display: flex;
						color: #12B36E;
						font-size: 28upx;
						align-items: center;

						image {
							width: 26upx;
							height: 26upx;
							margin-left: 12upx;
						}
					}
				}
			}

			.marginTop {
				margin-top: 132upx;

				.record-detail {
					width: 100%;
					height: 100%;
					box-sizing: border-box;

					.record-item {
						display: flex;
						width: 100%;
						align-items: center;
						border-top: 2upx solid #F0F0F0;
						padding: 52upx 32upx;
						box-sizing: border-box;

						.item-left {
							display: flex;
							width: 80upx;
							height: 80upx;
							flex: 0 80upx;
							min-width: 80upx;
							margin-right: 48upx;
						}

						.item-right {
							flex: 1;

							.right-top {
								display: flex;
								justify-content: space-between;
								color: #252525;
								font-size: 32upx;
								margin-bottom: 24upx;
							}

							.right-bottom {
								display: flex;
								justify-content: space-between;
								color: #7F7F7F;
								font-size: 24upx;
							}
						}


					}
				}
			}
		}
	}
</style>
