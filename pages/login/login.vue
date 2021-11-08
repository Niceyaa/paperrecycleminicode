<template>
	<view class="login">
		<image src="../../static/imgs/loginImg.png" class="login-img" mode="" />
		<button :disabled="loginFlag" class="miniapp-login" type="default" open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber">微信用户一键登录</button>
		<!-- <button class="miniapp-login" type="default" open-type="getUserInfo" @getuserinfo="getUserInfo">微信用户一键登录</button>
		<navigator class="phone-login" url="/pages/login/codeLogin">手机号码登录/注册</navigator> -->
		<view class="policy">
			登录即同意
			<!-- <text @click="goToUrl('/pages/index/index')" class="policy-item">
				《中国移动认证服务条款》
			</text> -->
			<!-- 和 -->
			<text class="policy-item" @click="goToUrl('/personalPackage/pages/my/userPolicy')">
				《用户使用协议》
			</text>
			<text class="policy-item" @click="goToUrl('/personalPackage/pages/my/provitePolicy')">
				《隐私政策》
			</text>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/user.js'
	export default {
		data() {
			return {
				code: null,
				iv: null,
				loginFlag: false,
				encryptedData: null
			};
		},
		onShow() {
			uni.login({
				success: (res) => {
					console.log(121, res)
					this.code = res.code
				}
			})
		},
		methods: {
			getUserInfo(e) {
				console.log('e', e)
			},
			getPhoneNumber(e) {
				console.log('phone', e)
				// if (e.detail.errMsg.indexOf('ok') > -1) {
				if (!e.detail.iv) return
				let recommendedCode = uni.getStorageSync('recommendedCode') ? uni.getStorageSync('recommendedCode') : null
				let prm = {
					code: this.code,
					iv: e.detail.iv,
					userType: 200,
					recommendedCode: recommendedCode,
					encryptedData: e.detail.encryptedData
				}
				this.loginFlag = true
				console.log("prm", prm)
				uni.showLoading({
					title: '正在登录'
				})
				login(prm).then(res => {
						console.log("登录信息", res)
						uni.hideLoading()
						this.loginFlag = false
						if (res.data.code === 200) {
							// 保存token
							uni.setStorageSync('token', res.header.token)
							uni.setStorageSync('workState', res.data.result.workState)
							// 登录成功
							uni.showToast({
								title: '登录成功',
								duration: 1000,
								success() {
									uni.setStorageSync('loginStatus', true)
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}
							})
						} else {
							uni.showToast({
								title: '登录失败',
								icon: 'none'
							})
							// 重新更新code值
							uni.login({
								success: (res) => {
									this.code = res.code
								}
							})
						}

					})
					.catch(fail => {
						// 重新更新code值
						uni.hideLoading()
						this.loginFlag = false
						uni.login({
							success: (res) => {
								this.code = res.code
							}
						})
					})

					.catch(err => {
						uni.hideLoading()
					})
				// }

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
		height: 100%;
	}

	.login {
		width: 100%;
		height: 100%;
		padding-top: 180upx;
		box-sizing: border-box;
		-display: flex;
		-flex-wrap: wrap;
		-justify-content: center;
		position: relative;

		.login-img {
			width: 481upx;
			height: 200upx;
			margin-left: 135upx;
		}

		.miniapp-login {
			-margin: 173upx 0 38upx 57upx;
			margin: 230upx 0 38upx 57upx;
			width: 636upx;
			height: 86upx;
			line-height: 86upx;
			text-align: center;
			background: #24CE85;
			border-radius: 43upx;
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
		}

		.phone-login {
			box-sizing: border-box;
			width: 635.8upx;
			height: 86upx;
			line-height: 86upx;
			text-align: center;
			background: none;
			border-radius: 43upx;
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 400;
			border: 1px solid #808984;
			color: #808984;
		}

		.policy {
			width: 508upx;
			font-size: 24upx;
			font-family: Adobe Heiti Std;
			font-weight: normal;
			color: #808984;
			text-align: center;
			position: absolute;
			bottom: 100upx;
			left: 121upx;
			box-sizing: border-box;

			.policy-item {
				color: #24CE85;
			}
		}
	}
</style>
