<template>
	<view class="bindCard">
		<header-bar :nav='headerBarNav'></header-bar>
		<view class="title">相关信息填写</view>
		<view class="input-item">
			<view class="label">姓名</view>
			<input v-model="dataInfo.username" type="text" placeholder="请输入姓名" />
		</view>
		<view class="input-item">
			<view class="label">身份证号</view>
			<input v-model="dataInfo.licenseCard" type="idcard" placeholder="请输入身份证号" />
		</view>
		<view class="takePlace"></view>
		<view class="tel-item input-item">
			<view class="label">电话号码</view>
			<input :disabled="true" v-model="dataInfo.tel" type="number" maxlength="11" placeholder="请输入电话号码" />
			<view @click="sendCodeHandle" class="sendCode">{{sendCodeText}}</view>
		</view>
		<view class="input-item">
			<view class="label">验证码</view>
			<input v-model="dataInfo.validateCode" maxlength="4" type="number" placeholder="请输入验证码" />
		</view>
		<view class="takePlace"></view>
		<view class="idCard-title">身份证照片</view>
		<view class="idCardImg">
			<view class="img-item">
				<view class="img-wrapper">
					<image class="real-img" :src="dataInfo.idCardFront" mode=""></image>
					<image @click="chooseImg('idCardFront')" class="camera-icon" src="../../static/imgs/cameraIcon.png"
						mode=""></image>
				</view>
				<view class="show-tip">身份证正面</view>
			</view>
			<view class="img-item">
				<view class="img-wrapper">
					<image class="real-img" :src="dataInfo.idCardReverse" mode=""></image>
					<image @click="chooseImg('idCardReverse')" class="camera-icon"
						src="../../static/imgs/cameraIcon.png" mode=""></image>
				</view>
				<view class="show-tip">身份证反面</view>
			</view>
			<view class="img-item">
				<view class="img-wrapper">
					<image class="real-img" :src="dataInfo.handIdCard" mode=""></image>
					<image @click="chooseImg('handIdCard')" class="camera-icon" src="../../static/imgs/cameraIcon.png"
						mode=""></image>
				</view>
				<view class="show-tip">手持身份证</view>
			</view>
		</view>

		<view @click="judgeCondition" class="bindBtn">去绑定</view>
	</view>
</template>

<script>
	import {
		uploadAuthInfo
	} from '@/api/user.js'
	import {
		sendCode
	} from '@/api/common.js'
	export default {
		data() {
			return {
				headerBarNav:{
					'bg':'#fff',  //背景色
					'color':'red',  //字体颜色
					'isdisPlayNavTitle':true, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle':'实名认证', //导航标题
				},
				dataInfo: {
					"username": "",
					"licenseCard": "",
					"validateCode": "",
					"fileIds": [],
					tel: '',
					idCardFront: require('@/personalPackage/static/imgs/idCardFront.png'),
					idCardReverse: require('@/personalPackage/static/imgs/idCardReverse.png'),
					handIdCard: require('@/personalPackage/static/imgs/handIdCard.png'),
					// realTel:
				},
				sendCodeText: '发送验证码',
				handleFlag: true,
				allFileList: [],
				newIdCardFront: null,
				newIdCardReverse: null,
				newHandIdCard: null,
				sendCodeFlag: true,
				timerSetting: null,
				newLoginCode: null
			};
		},
		onShow() {
			/* let tel = uni.getStorageSync('userPhone')
			let start = tel.substring(0,3)
			let end = tel.substring(7)
			this.dataInfo.tel = start+'****'+end
			console.log(start,"xxxx",end) */
			this.dataInfo.tel = uni.getStorageSync('userPhone')
		},
		methods: {
			sendCodeHandle() {
				if (this.dataInfo.tel.length <= 0) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
					return
				}
				if (!this.sendCodeFlag) {
					return
				}
				uni.login({
					success: (eee) => {
						console.log('eeee', eee.code)
						this.newLoginCode = eee.code

						let prm = {
							"smsType": 5,
							"userPhone": uni.getStorageSync('userPhone'),
							"userType": 200,
							code: this.newLoginCode
						}
						uni.showLoading({
							title: '发送中'
						})
						this.sendCodeFlag = false
						sendCode(prm).then(res => {
							uni.hideLoading()
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							let seconds = 60
							this.timerSetting = setInterval(() => {
								seconds--
								this.sendCodeText = `还剩${seconds}s`
								if (seconds === 0) {
									clearInterval(this.timerSetting)
									this.timerSetting = null
									this.sendCodeText = '发送验证码'
									this.sendCodeFlag = true
								}
							}, 1000)

						}).catch(err => {
							uni.hideLoading()
							this.sendCodeFlag = true
							uni.showToast({
								title: err.data.msg,
								icon: 'none'
							})
						})

					}
				})

			},

			judgeCondition() {
				if (!this.handleFlag) return
				let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				if (this.dataInfo.username.length <= 0) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
				} else if (!regIdNo.test(this.dataInfo.licenseCard)) {
					uni.showToast({
						title: '身份证号填写有误',
						icon: 'none'
					})
				} else if (this.dataInfo.tel.length <= 0) {
					uni.showToast({
						title: '请输入电话号码',
						icon: 'none'
					})
				} else if (this.dataInfo.validateCode.length <= 0) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
				} else if (this.dataInfo.idCardFront.indexOf('://') > -1 && this.dataInfo.idCardReverse.indexOf('://') > -
					1 && this.dataInfo.handIdCard.indexOf('://') > -1) {
						this.allFileList = []
					this.allFileList.push(this.dataInfo.idCardFront)
					this.allFileList.push(this.dataInfo.idCardReverse)
					this.allFileList.push(this.dataInfo.handIdCard)
					this.handleFlag = false
					this.uploadFile(this.allFileList, 0)
				} else {
					uni.showToast({
						title: '您需要上传完整的身份证信息',
						icon: 'none'
					})
					this.allFileList = []
				}
			},
			saveHandle() {
				let prm = {
					"authCode": this.dataInfo.validateCode,
					"frontId": this.dataInfo.fileIds[0],
					"backId": this.dataInfo.fileIds[1],
					"holdId": this.dataInfo.fileIds[2],
					"idNumber": this.dataInfo.licenseCard,
					"realName": this.dataInfo.username,
					"userPhone": uni.getStorageSync('userPhone')
				}
				uploadAuthInfo(prm).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.data.msg
					})
					this.handleFlag = true
					uni.navigateBack()
				}).catch(err => {
					this.handleFlag = true
					uni.hideLoading()
				})
			},
			uploadFile(list, count) {
				
				uni.showLoading({
					title: '信息保存中'
				})
				uni.uploadFile({
					url: `${this.$baseURL}/zmsys-file/api/fileManage/upload`,
					filePath: list[count],
					name: 'file',
					header: {
						token: uni.getStorageSync('token')
					},
					formData: {
						uploadType: 1
					},
					success: uploadRes => {
						let data = JSON.parse(uploadRes.data)
						if (data.code === 200) {
							this.dataInfo.fileIds.push(data.result.fileId)
							count++
							//表示还有未添加图片
							if (count < list.length) {
								this.uploadFile(list, count)
							} else {
								this.saveHandle()
							}
						}
						console.log('上传完成', uploadRes)
					},
				})
			},
			chooseImg(target) {
				uni.chooseImage({
					count: 1,
					success: (e) => {
						this.dataInfo[target] = e.tempFilePaths[0]
						console.log('图片', e.tempFilePaths[0])
					}
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

	.bindCard {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		background: #fff;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			padding: 12upx 0 12upx 32upx;
			font-size: 28upx;
			color: #969696;
			background: #F2F4F6;
		}

		.takePlace {
			width: 100%;
			background: #F2F4F6;
			height: 20upx;
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

			.sendCode {
				color: #23CE85;
				padding-right: 40upx;
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
			margin: 0 0 80upx 32upx;
		}

		.idCard-title {
			padding: 28upx 0 28upx 30upx;
			box-sizing: border-box;
			color: #272727;
			font-size: 32upx;
		}

		.idCardImg {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			padding: 0 48upx;
			box-sizing: border-box;
			width: 100%;

			.img-item {
				text-align: center;
				margin-bottom: 50upx;

				.img-wrapper {
					position: relative;
					width: 300upx;
					height: 194upx;
					background: url(../../static/imgs/idCardBgc.png);
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;

					.real-img {
						width: 178upx;
						height: 116upx;
					}

					.camera-icon {
						position: absolute;
						width: 82.2upx;
						height: 82.04upx;
					}
				}

				.show-tip {
					padding-top: 30upx;
					font-size: 28upx;
					color: #666666;
				}


			}
		}

	}
</style>
