<template>
	<view class="my-bank">
		<view class="title">我的银行卡</view>
		<view class="bank-list">
			<view @click="chooseBank(item)" class="bank-item" v-for="(item,index) in bankList" :key="index">
				<view class="bank-top">
					<view class="bank-left">
						<image src="../../../../../static/imgs/bankImg.png" mode=""></image>
						<view class="bank-name-num">
							<view class="bank-name">
								{{item.bankName}}<text v-if="item.isDefaultBank">默认</text>
							</view>
							<view class="num">{{item.bankCardNumber}}</view>
						</view>
					</view>
					<image v-if="currentBankInfoId==item.bankCardInfoId" src="../../../../static/imgs/modelSelect.png" class="bank-select" />
					<image  class="bank-select" v-else src="../../../../static/imgs/modelNotSelect.png" mode=""></image>
				</view>
			</view>

			<view class="add-bank">
				<image src="../../../../../static/imgs/add.png" mode=""></image>
				<view @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/bindBankCard')">增加银行卡</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getBankInfo} from '@/api/user.js'
	export default {
		data() {
			return {
				bankList: [],
				currentBankInfoId: null
			};
		},
		onLoad(opt) {
			this.currentBankInfoId = opt.bankCardInfoId
		},
		onShow() {
			getBankInfo().then(res=>{
				this.bankList = res.data.result
			})
		},
		methods: {
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			chooseBank(info) {
				this.currentBankInfoId = info.bankCardInfoId
				uni.setStorageSync('bankId',info.bankCardInfoId)
				uni.setStorageSync('bankName',info.bankName)
				uni.setStorageSync('bankCardNumber',info.bankCardNumber)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	.my-bank {
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;
		background: #F2F4F6;
		padding: 0 32upx 200upx 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			font-size: 48upx;
			color: #333333;
			padding: 36upx 0 50upx 0;
		}

		.bank-list {
			width: 100%;
			box-sizing: border-box;

			.bank-item {
				background: 100%;
				padding: 44upx 32upx 0 40upx;
				background-color: #fff;
				border-radius: 16upx;
				margin-bottom: 24upx;

				.bank-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					border-bottom: 2upx dotted #F0F0F0;
					padding-bottom: 40upx;

					.bank-left {
						display: flex;

						image {
							width: 80upx;
							height: 80upx;
							margin-right: 44upx;
						}

						.bank-name-num {
							font-size: 26upx;
							color: #4F4F4F;

							.bank-name {
								font-size: 32upx;
								color: #4F4F4F;
								margin-bottom: 16upx;

								text {
									width: 64upx;
									height: 30upx;
									background: #F9BF31;
									border-radius: 4upx;
									text-align: center;
									line-height: 30upx;
									margin-left: 20upx;
									color: #fff;
									font-size: 24upx;
									padding: 4upx 6upx;
								}
							}
						}
					}

					.bank-select {
						width: 40upx;
						height: 40upx;
					}
				}
			}

			.add-bank {
				width: 686upx;
				height: 88upx;
				border-radius: 4upx;
				border: 2upx dotted #C4C4C4;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #757876;
				font-size: 34upx;

				image {
					width: 28upx;
					height: 28upx;
					margin-right: 14upx;
				}
			}
		}

		.no-card {
			text-align: center;

			image {
				width: 500upx;
				height: 346upx;
			}

			.tip {
				margin: 16upx auto 58upx auto;
				color: #4F4F4F;
			}

			.add {
				width: 262upx;
				height: 88upx;
				background: #27CE85;
				border-radius: 12upx;
				line-height: 88upx;
				font-size: 34upx;
				color: #FFFFFF;
				margin: 0 auto;
			}
		}
	}
</style>
