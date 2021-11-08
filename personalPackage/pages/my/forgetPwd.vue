<template>
	<view class="setPayPwd">
		<view class="title">忘记密码</view>
		<view class="input-item">
			<view class="item-left">手机号</view>
			<view class="wrapper">
				<input :disabled="true" v-model="tel" type="number" placeholder="请输入手机号">
				<view maxlength='11' @click="sendCode" class="get-code">{{codeText}}</view>
			</view>
		</view>
		<view class="input-item">
			<view class="item-left">验证码</view>
			<input maxlength="4" v-model="code" type="number" placeholder="请输入短信验证码">
		</view>
		<view class="input-item">
			<view class="item-left">新密码</view>
			<input maxlength="6" v-model="pwd" type="password" placeholder="请输入新密码">
		</view>
		<view class="input-item">
			<view class="item-left">确认密码</view>
			<input maxlength="6" v-model="againPwd" type="password" placeholder="请再次输入密码">
		</view>
		<view @click="saveHandle" class="sureBtn">确认</view>
	</view>
</template>

<script>
	import {
		sendCode
	} from '@/api/common.js'
	import { forgetPayPwd } from '@/api/user.js'
	export default {
		data() {
			return {
				tel: '',
				code: '',
				pwd: '',
				againPwd: '',
				isSendFlag: true,
				codeText: '获取验证码',
				newLoginCode: null,
				timerSetting: null
			};
		},
		onShow(){
			let tel = uni.getStorageSync('userPhone')
			let start = tel.substring(0,3)
			let end = tel.substring(7)
			this.tel = start+'****'+end
		},
		methods: {
			sendCode(){
				if(this.tel.length<0){
					uni.showToast({
						title:'请输入正确的手机号码'
					})
					return 
				}
				if(!this.isSendFlag){
					return
				}
				uni.login({
					success: (eee) => {
						console.log('eeee', eee.code)
						this.newLoginCode = eee.code
				
						let prm = {
							"smsType": 4,
							"userPhone": uni.getStorageSync('userPhone'),
							"userType": 200,
							code: this.newLoginCode
						}
						uni.showLoading({
							title: '发送中'
						})
						this.isSendFlag = false
						sendCode(prm).then(res => {
							uni.hideLoading()
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							let seconds = 60
							this.timerSetting = setInterval(() => {
								seconds--
								this.codeText = `还剩${seconds}s`
								if (seconds === 0) {
									clearInterval(this.timerSetting)
									this.timerSetting = null
									this.codeText = '发送验证码'
									this.isSendFlag = true
								}
							}, 1000)
				
						}).catch(err => {
							uni.hideLoading()
							this.isSendFlag = true
							uni.showToast({
								title: err.data.msg,
								icon: 'none'
							})
						})
				
					}
				})
			},
			saveHandle() {
				if (this.tel.length < 0) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
				} else if (this.code.length < 0) {
					uni.showToast({
						title: '验证码格式不正确',
						icon: 'none'
					})
				} else if (this.pwd !== this.againPwd) {
					uni.showToast({
						title: '两次输入密码不一致',
						icon: 'none'
					})
				} else {
					let prm = {
						"authCode": this.code,
						"userPhone": uni.getStorageSync('userPhone'),
						"payPwd": this.againPwd
					}
					forgetPayPwd(prm).then(res=>{
						uni.showToast({
							title:'设置成功',
							icon:'success'
						})
						uni.navigateBack()
					})
				}
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

	.setPayPwd {
		width: 100%;
		position: relative;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		height: 100%;

		.title {
			font-size: 48upx;
			color: #333333;
			padding: 80upx 0 110upx 40upx;
		}

		.input-item {
			display: flex;
			align-items: center;
			margin: 0 53upx 0 46upx;
			border-bottom: 2upx solid #DDDDDD;
			height: 100upx;
			font-size: 30upx;
			color: #333333;

			.item-left {
				min-width: 168upx;
				flex: 0 168upx;
				width: 168upx;
			}

			input {
				caret-color: #23CE85;
			}

			&.active {
				border-bottom: 2upx solid #23ce85;
			}

			.wrapper {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.get-code {
					font-size: 30upx;
					color: #0D92E7;
				}
			}
		}

		.sureBtn {
			width: 686upx;
			height: 88upx;
			line-height: 88upx;
			text-align: center;
			background: #23CE85;
			border-radius: 12upx;
			font-size: 34upx;
			color: #fff;
			position: absolute;
			bottom: 242upx;
			left: 32upx;
		}
	}
</style>
