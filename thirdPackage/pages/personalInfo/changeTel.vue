<template>
	<view class="currentTel">
		<view class="title">修改手机号</view>
		<view class="info-item">
			<view class="label">手机号</view>
			<view class="item-right">
				<input maxlength="11" v-model="newTel" type="number" placeholder="请输入您的新手机号" />
				<view class="code-btn" @click="getCode">{{codeText}}</view>
			</view>
		</view>
		<view class="info-item">
			<view class="label">验证码</view>
			<view class="item-right">
				<input maxlength="4" v-model="validateCode" type="number" placeholder="请输入短信验证码" />
			</view>
		</view>
		<view @click="saveHandle" class="bindTel">确认修改</view>
	</view>
</template>

<script>
	import {
		sendCode,
	} from '../../../api/common.js'
	import {
		changeUserTel
	} from '../../../api/user.js'
	export default {
		data() {
			return {
				newTel: null,
				validateCode: null,
				sendFlag: false,
				codeText: '获取验证码',
				timer: null,
				saveFlag: false
			}
		},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		methods: {
			getCode() {
				let rxp = /^[1][0-9][0-9]{9}$/
				if (!rxp.test(this.newTel)) {
					uni.showToast({
						title: '号码格式不正确',
						icon: 'none'
					})
					return
				}
				if (this.sendFlag) {
					return
				}
				this.sendFlag = true
				uni.login({
					success: (loginRes => {
						let {
							code
						} = loginRes
						let prm = {
							"code": code,
							"smsType": 7,
							"userPhone": this.newTel,
							"userType": 200
						}
						uni.showLoading({
							title: '发送中...'
						})
						sendCode(prm).then(res => {
							if (res.data.code === 200) {
								uni.hideLoading()
								let second = 60
								setTimeout(() => {
									uni.showToast({
										title: res.data.msg,
										icon: 'success'
									})
								}, 300)
								this.timer = setInterval(() => {
									if (second === 0) {
										clearInterval(this.timer)
										this.timer = null
										this.codeText = '重新发送'
										this.sendFlag = false
										return
									}
									second--
									this.codeText = `还剩${second}s`
								}, 1000)
							}
						}).catch(err => {
							this.sendFlag = false
							uni.hideLoading()
						})

					}),
					fail: (err) => {
						this.sendFlag = false
					}
				})
			},
			saveHandle() {
				if (!this.newTel || this.newTel.length !== 11) {
					uni.showToast({
						title: '号码格式不正确',
						icon: 'none'
					})
					return
				}
				if (!this.validateCode || this.validateCode.length !== 4) {
					uni.showToast({
						title: '验证码错误',
						icon: 'none'
					})
					return
				}
				if (this.saveFlag) {
					return
				}
				this.saveFlag = true
				let prm = {
					"authCode": this.validateCode,
					"userPhone": this.newTel,
					"userPwd": null
				}
				uni.showLoading({
					title: '保存中...'
				})
				changeUserTel(prm).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.data.msg,
						icon: 'success',
						success: () => {
							setTimeout(() => {
								uni.navigateBack({
									delta: 2
								})
							}, 1500)

						}
					})
				}).catch(err=>{
					this.sendFlag = false
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

	.currentTel {
		width: 100%;
		min-height: 100%;
		background: #fff;
		padding: 60upx 40upx 0 40upx;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			font-size: 48upx;
			color: #333333;
			margin-bottom: 60upx;
		}

		.info-item {
			display: flex;
			align-items: center;
			padding-top: 30upx;

			.label {
				font-size: 30upx;
				color: #333333;
				flex: 0 144upx;
				min-width: 144upx;
			}

			.item-right {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2upx solid #DDDDDD;
				flex: 1;

				.code-btn {
					font-size: 30upx;
					color: #0D92E7;
				}
			}
		}

		.bindTel {
			width: 100%;
			box-sizing: border-box;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			text-align: center;
			line-height: 88upx;
			font-size: 34upx;
			color: #FFFFFF;
			margin-top: 400upx;
		}
	}
</style>
