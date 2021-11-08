<template>
	<view class="bindCard">
		<view class="title">请绑定本人的银行卡</view>
		<view class="input-item">
			<view class="label">持卡人</view>
			<input v-model="dataInfo.cardholder" type="text" placeholder="请输入姓名" />
		</view>
		<view class="input-item">
			<view class="label">卡号</view>
			<input @blur="getNameByNumber" v-model="dataInfo.bankCardNumber" type="number" placeholder="请输入您本人的银行卡号" />
		</view>
		<view class="bank input-item">
			<view class="label">银行</view>
			<view class="bank-choose"
				@click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/chooseBank?bankName='+dataInfo.bankName)">
				<!-- <picker class="bank-picker" @change="bindPickerChange" :value="index" :range="banks">
					<view class="uni-input">{{banks[index]}}</view>
				</picker> -->
				<view class="tip">
					{{dataInfo.bankName.length>0?dataInfo.bankName:'请选择银行卡'}}
				</view>
				<image src="../../../../static/imgs/rightIcon.png" mode=""></image>
			</view>
		</view>
		<view class="input-item haveMargin">
			<view class="label moreWidth">设为默认银行卡</view>
			<switch checked @change="changeDefaultCard" />
		</view>
		<view @click="saveHandle" class="bindBtn">去绑定</view>
	</view>
</template>

<script>
	import {
		addUserBank,
		getBankName
	} from '@/api/user.js'
	export default {
		data() {
			return {
				dataInfo: {
					"bankCardNumber": "",
					"bankName": "",
					"cardholder": "",
					isDefaultBank: true
				},
				handleFlag: true,
			};
		},
		onShow() {
			this.dataInfo.bankName = uni.getStorageSync('setBankName') ? uni.getStorageSync('setBankName') : ''
		},
		onUnload() {
			uni.removeStorageSync('setBankName')
		},
		methods: {
			changeDefaultCard(e) {
				this.dataInfo.isDefaultBank = e.detail.value
				console.log('我是改变的值', e)
			},
			getNameByNumber() {
				let prm = {
					bankCardNumber: this.dataInfo.bankCardNumber
				}
				getBankName(prm).then(res => {
					this.dataInfo.bankName = res.data.msg
				})
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			saveHandle() {
				if (this.dataInfo.cardholder.length <= 0) {
					uni.showToast({
						title: '请输入持卡人姓名',
						icon: 'none'
					})
				} else if (this.dataInfo.bankCardNumber.length <= 0) {
					uni.showToast({
						title: '请输入卡号',
						icon: 'none'
					})
				} else if (this.dataInfo.bankName.length <= 0) {
					uni.showToast({
						title: '请选择银行卡',
						icon: 'none'
					})
				} else if (this.handleFlag) {
					let prm = {
						"bankCardNumber": this.dataInfo.bankCardNumber,
						"bankName": this.dataInfo.bankName,
						"isDefaultBank": this.dataInfo.isDefaultBank,
						"cardholder": this.dataInfo.cardholder
					}
					uni.showLoading({
						title: '保存中'
					})
					addUserBank(prm).then(res => {
						uni.removeStorageSync('setBankName')
						uni.hideLoading()
						uni.showToast({
							title: res.data.msg
						})
						uni.navigateBack()
					}).catch(err => {
						uni.hideLoading()
					})
				} else {
					uni.showToast({
						title: '请勿重复操作',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	.bindCard {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #F2F4F6;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			padding: 12upx 0 12upx 32upx;
			font-size: 28upx;
			color: #969696;
		}

		.input-item {
			display: flex;
			align-items: center;
			padding-left: 32upx;
			box-sizing: border-box;
			width: 100%;
			background-color: #fff;
			border-bottom: 2upx solid #F0F0F0;
			height: 88upx;
			font-size: 30upx;
			color: #212121;

			&.haveMargin {
				justify-content: space-between;
				margin-top: 36upx;
			}

			.label {
				width: 180upx;
				flex: 0 180upx;
				min-width: 180upx;
			}

			.moreWidth {
				width: 240upx;
				flex: 0 240upx;
				min-width: 240upx;
			}

			input {
				flex: 1;
				color: #333;
			}

			.bank-choose {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
				padding-right: 26upx;
				box-sizing: border-box;

				image {
					min-width: 16upx;
					width: 16upx;
					height: 26upx;
					flex: 0 16upx;
				}

				.bank-picker {
					flex: 1;
				}
			}
		}

		.bindBtn {
			width: 686upx;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			text-align: center;
			line-height: 88upx;
			box-sizing: border-box;
			color: #fff;
			font-size: 34upx;
			margin: 214upx 0 0 32upx;
		}
	}
</style>
