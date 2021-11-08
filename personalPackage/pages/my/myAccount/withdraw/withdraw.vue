<template>
	<view class="my-account">
		<view class='balance-wrapper'>
			<view class="balance-left">
				<view class="balance-title">可提现</view>
				<view class="balance">￥<text class="money">{{userInfo.accountBalance}}</text></view>
			</view>
			<view class="balance-right" @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/withdrawRecord')">
				<text>提现记录</text>
				<image src="../../../../static/imgs/greenArrow.png" mode=""></image>
			</view>
		</view>
		<view class="content-wrapper">
			<view class="opt-wrapper">
				<view class="opt-top">
					<view class="opt-top-left">
						提现至{{userInfo.bankName?`${userInfo.bankName}(${userInfo.bankNumberStr})`:''}}</view>
					<view v-if="bankList.length>0" class="opt-top-right black"
						@click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/chooseHoldUserBank?bankCardInfoId='+userInfo.bankCardInfoId)">
						<text>{{bankList[0].isDefaultBank?'更换银行卡':'选择银行卡'}}</text>
						<image src="../../../../static/imgs/blackArrow.png" mode=""></image>
					</view>
					<view v-else class="opt-top-right"
						@click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/bindBankCard')">
						<text>去绑卡</text>
						<image src="../../../../static/imgs/blueArrow.png" mode=""></image>
					</view>
				</view>
				<view class="opt-title">提现金额</view>
				<view class="opt-input-wrapper inputing">
					<view class="unit">￥</view>
					<input v-model="userInfo.withdrawAmount" type="number" placeholder="请输入提现金额"
						placeholder-class="placeholderClass" />
					<view @click="fillAll" class="all-withdraw-btn">全部提现</view>
				</view>
				<view v-if="!userInfo.isOverBalance" class="withdraw-times">本次提现将收取{{userInfo.serviceFee}}服务费</view>
				<view v-else class="withdraw-times redColor">输入金额超过账户余额</view>
				<view @click="saveHandle" class="withdrawBtn">确认</view>
			</view>
			<view class="tip-wrapper">
				<view class="tip-title">温馨提示:</view>
				<view class="tip-text">
					1、每月小哥可以获得<text>2次免费</text>提现次数，超过次数会收取人民币<text>1.0元/笔</text>手续费
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getBankInfo
	} from '@/api/user.js'
	import {
		withdrawApi,
		withdrawServiceFee
	} from '@/api/thirdApi.js'
	export default {
		data() {
			return {
				userInfo: {
					isBindCard: false,
					isOverBalance: false,
					bankName: null,
					bankNumber: null,
					bankNumberStr: null,
					bankCardInfoId: null,
					withdrawAmount: 0,
					serviceFee: 0,
					accountBalance: 0
				},
				bankList: [],
				withdrawalToken: null
			};
		},
		watch: {
			'userInfo.withdrawAmount': {
				handler(val) {
					if (val) {
						if (Number(val) > this.userInfo.accountBalance) {
							this.userInfo.isOverBalance = true
						} else {
							this.userInfo.isOverBalance = false
							if (Number(val) % 10 === 0) {
								let prm = {
									withdrawalAmount: val
								}
								withdrawServiceFee(prm).then(res => {
									let {
										result
									} = res.data
									uni.setStorageSync('withdrawalToken', result.withdrawalToken)
									this.userInfo.serviceFee = result.fee.serviceTotalFee
								})
							}

						}
					}
				}
			}
		},
		onLoad() {},
		onShow() {
			this.userInfo.accountBalance = uni.getStorageSync('accountBalance')
			getBankInfo().then(res => {
				if (res.data.code === 200) {
					this.bankList = res.data.result
					if (this.bankList.length > 0 && this.bankList[0].isDefaultBank) {
						this.userInfo.bankName = this.bankList[0].bankName
						let lastIndex = this.bankList[0].bankCardNumber.length - 4
						this.userInfo.bankNumberStr = this.bankList[0].bankCardNumber.substring(lastIndex)
						this.userInfo.bankCardInfoId = this.bankList[0].bankCardInfoId

						this.userInfo.bankCardInfoId = uni.getStorageSync('bankId') ? uni.getStorageSync(
							'bankId') : this.userInfo.bankCardInfoId
						this.userInfo.bankName = uni.getStorageSync('bankName') ? uni.getStorageSync('bankName') :
							this.userInfo.bankName
						this.userInfo.bankNumber = uni.getStorageSync('bankCardNumber') ? uni.getStorageSync(
							'bankCardNumber') : this.userInfo.bankNumber
						if (uni.getStorageSync('bankCardNumber')) {
							let lastIndex = this.userInfo.bankNumber.length - 4
							this.userInfo.bankNumberStr = this.userInfo.bankNumber.substring(lastIndex)

						}
						console.log(this.userInfo)
					}
					console.log('hhhhhh', this.userInfo)
				}
			})

		},
		methods: {
			fillAll() {
				this.userInfo.withdrawAmount = this.userInfo.accountBalance
			},
			saveHandle() {
				if (this.userInfo.isOverBalance) {
					return
				}
				if (!this.userInfo.bankCardInfoId) {
					uni.showToast({
						title: '选择提现银行卡',
						icon: 'none'
					})
					return
				}
				if (Number(this.userInfo.withdrawAmount) <= 0) return
				if (Number(this.userInfo.withdrawAmount) % 10 !== 0){
					uni.showToast({
						title:'金额需10的倍数',
						icon:'none'
					})
					return
				}
					let prm = {
						"userBankCardInfoId": 0,
						"userPwd": "",
						"withdrawalAmount": 0,
						"withdrawalToken": ""
					}
				uni.navigateTo({
					url: '/personalPackage/pages/my/myAccount/withdraw/withdrawPayPwd?userBankCardInfoId=' + this
						.userInfo.bankCardInfoId + '&withdrawalAmount=' + this.userInfo.withdrawAmount +
						"&serviceFee=" + this.userInfo.serviceFee + '&bankInfo=' + this.userInfo.bankName + '(' +
						this.userInfo.bankNumberStr + ')'
				})
			},
			goToUrl(url) {
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

	}

	.my-account {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		padding: 36upx 0 0 0;
		height: 100%;

		.balance-wrapper {
			box-sizing: border-box;
			width: 686upx;
			background: #23CE85;
			border-radius: 16upx 16upx 0upx 0upx;
			margin: 0 0 0 32upx;
			padding: 36upx 0 32upx 32upx;
			display: flex;
			justify-content: space-between;
			height: 192upx;

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
				display: flex;
				align-items: center;
				text-align: center;
				font-size: 28upx;
				color: #23CE85;
				margin-top: 36upx;
				width: 176upx;
				height: 52upx;
				background: #EAFFF7;
				border-radius: 200upx 0px 0px 200upx;
				padding: 0 0 0 26upx;
				box-sizing: border-box;

				image {
					width: 8upx;
					height: 16upx;
					margin-left: 15upx;
				}
			}
		}

		.content-wrapper {
			width: 100%;
			height: calc(100% - 192upx);
			background: #F2F4F6;
			box-shadow: 0px -14px 8px 0px rgba(39, 214, 139, 0.46);

			.opt-wrapper {
				background: #fff;
				padding: 32upx 32upx 60upx 32upx;
				width: 100%;
				box-sizing: border-box;

				.opt-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28upx;

					.opt-top-left {
						color: #333333;
					}

					.opt-top-right {
						display: flex;
						color: #0D92E7;
						display: flex;
						align-items: center;

						image {
							width: 10upx;
							height: 16upx;
							margin-left: 16upx;
						}
					}

					.black {
						color: #333333;
					}
				}

				.opt-title {
					font-size: 28upx;
					color: #333333;
					margin: 70upx 0 10upx 0;
				}

				.opt-input-wrapper {
					display: flex;
					position: relative;
					border-bottom: 2upx solid #F0F0F0;
					padding: 16upx 0;
					font-size: 50upx;
					color: #333333;

					input {
						width: 400upx;
						padding-left: 20upx;
						font-size: 64upx;
						height: 74upx;
						font-weight: 400;
						line-height: 74upx;
						caret-color: #23CE85;
					}

					.placeholderClass {
						font-size: 40upx;
						font-weight: 400;
						color: #9D9D9D;
					}

					.all-withdraw-btn {
						position: absolute;
						top: 28upx;
						right: 26upx;
						font-size: 26upx;
						color: #23CE85;
					}
				}

				.inputing {
					border-bottom: 2upx solid #23CE85;
				}

				.withdraw-times {
					margin: 24upx 0 116upx 0;
					font-size: 24upx;
					color: #9D9D9D;
				}

				.redColor {
					color: #FD7366;
				}

				.withdrawBtn {
					width: 100%;
					box-sizing: border-box;
					line-height: 88upx;
					text-align: center;
					height: 88upx;
					background: #23CE85;
					border-radius: 12upx;
					font-size: 34upx;
					color: #FFFFFF;
				}
			}

			.tip-wrapper {
				padding: 40upx 32upx 0 32upx;
				font-size: 30upx;
				color: #515151;

				.tip-text {
					margin-top: 26upx;
				}
			}
		}
	}
</style>
