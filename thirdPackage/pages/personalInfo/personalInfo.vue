<template>
	<view class="personalInfo">
		<view class="imgCut">
			<image class='origin-img' src="../../static/myBgc.png"></image>
			<canvas class="cutCanvas" id='cutCanvas1' canvas-id="cutCanvas1"></canvas>
			<view class="btn-wrapper">
				<view class="cancel-btn">取消</view>
				<view @click="sureHandle" class="sure-btn">确定</view>
			</view>
		</view>

		<view class="header-portrait">
			<view class="center-wrapper">
				<image @click="openImg(accountInfo.retrieveUserForShowBaseVO.userPhoto)" class="portraitIcon"
					:src="accountInfo.retrieveUserForShowBaseVO.userPhoto.length>0?accountInfo.retrieveUserForShowBaseVO.userPhoto:'../../../static/imgs/headerIcon.png'"
					mode=""></image>
			</view>
			<view class="center-wrapper">
				<image @click="changeImg" class="cameraIcon" src="../../static/cameraIcon.png" mode=""></image>
			</view>
			<view class="tip-wrapper">
				<image class="tip-icon" src="../../static/tip.png" mode=""></image>
				<view>更换头像时，只能上传本人头像</view>
			</view>
		</view>
		<!-- </view> -->
		<view class="other-info">
			<view class="info-item"
				@click="goToUrl('/thirdPackage/pages/personalInfo/currentTel?phone='+accountInfo.retrieveUserForShowBaseVO.userPhone)">
				<view class="label">手机号</view>
				<view class="right-wrapper">
					<view class="right-detail">{{accountInfo.retrieveUserForShowBaseVO.userPhone}}</view>
					<image src="../../static/rightIcon.png" mode=""></image>
				</view>
			</view>
			<view class="info-item info-item1">
				<view class="label label1">服务区域</view>
				<view class="info-detail info-detail1">{{accountInfo.workArea}}</view>
				<!-- <view class="info-detail info-detail1">fuw quye</view> -->
			</view>
			<view class="info-item" @click="goToUrl('/thirdPackage/pages/personalInfo/workPicture?imgList')">
				<view class="label">工作照</view>
				<image src="../../static/rightIcon.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPersonalInfo,
		uploadHeaderImg
	} from '../../../api/user.js'
	import {
		getTicket,
		deleteFile
	} from '../../../api/file.js'
	export default {
		data() {
			return {
				accountInfo: {},
				width: null
			}
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			openImg(url) {
				if (url.length > 0) {
					this.$imgPreview(0, [url])
				} else {
					uni.chooseImage({
						count: 1,
						success: (imgRes) => {
							console.log('img', imgRes)

							uni.navigateTo({
								url: '/thirdPackage/pages/personalInfo/imgCutPage?src=' + imgRes
									.tempFilePaths[0] + '&oldImg=' + this.accountInfo
									.retrieveUserForShowBaseVO.userPhoto
							})
						}
					})
				}
			},
			sureHandle() {
				console.log(111)
				this.initCanvas()
			},
			initCanvas() {
				let info = uni.getSystemInfo({
					success: (res) => {
						console.log(res)
						this.width = res.screenWidth
						let canWidth = this.width * 60 / 75
						let canCenter = canWidth / 2

						let context = uni.createCanvasContext('cutCanvas1')
						/* context.arc(100, 75, 50, 0, 2 * Math.PI)
						context.rect(10, 10, 100, 30)
						context.setFillStyle('yellow')
						context.fill()
						context.draw() */
						context.setStrokeStyle('#000')
						context.beginPath()
						context.setLineWidth(2)
						context.arc(canCenter, canCenter, canCenter, 0, 2 * Math.PI)
						context.setFillStyle('rgba(255,255,255,.3)')
						context.fill()
						context.draw()
					}
				})

			},
			getUserInfo() {
				getPersonalInfo().then(res => {
					this.accountInfo = res.data.result
				})
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			changeImg() {
				uni.chooseImage({
					count: 1,
					success: (imgRes) => {
						console.log('img', imgRes)

						uni.navigateTo({
							url: '/thirdPackage/pages/personalInfo/imgCutPage?src=' + imgRes
								.tempFilePaths[0] + '&oldImg=' + this.accountInfo
								.retrieveUserForShowBaseVO.userPhoto
						})

						/* uni.showLoading({
							title: '上传中...'
						})
						uni.uploadFile({
							url: `${this.$baseURL}/zmsys-file/api/fileManage/upload`,
							filePath: imgRes.tempFilePaths[0],
							name: 'file',
							header: {
								token: uni.getStorageSync('token')
							},
							formData: {
								uploadType: 1
							},
							success: (finishRes => {
								let data = JSON.parse(finishRes.data)
								if (data.code === 200) { //表示图片上传成功
									// this.accountInfo.retrieveUserForShowBaseVO.userPhoto = policyData.host+'/'+fileKey
									// 删除之前的图片文件
									if(this.accountInfo.retrieveUserForShowBaseVO.userPhoto.length>0){
										let deletePrm = {
											absolutePath:this.accountInfo.retrieveUserForShowBaseVO.userPhoto
										}
										deleteFile(deletePrm).then(deleteRes=>{
											if(deleteRes.data.code===200){
												let uploadPrm = {
													fileId: data.result.fileId,
													// url: data.result.url
												}
												uploadHeaderImg(uploadPrm).then(res => {
													console.log(1111,res)
													uni.hideLoading()
													setTimeout(() => {
														uni.showToast({
															title: res
																.data
																.msg,
															icon: 'success'
														})
														this.getUserInfo()
													}, 300)
																		
												}).catch(()=>{
													uni.hideLoading()
												})
											}
										}).catch(()=>{
											uni.hideLoading()
										})
									}
									// 直接上传
									else{
										let uploadPrm = {
											fileId: data.result.fileId,
											// url: data.result.url
										}
										uploadHeaderImg(uploadPrm).then(res => {
											uni.hideLoading()
											setTimeout(() => {
												uni.showToast({
													title: res
														.data
														.msg,
													icon: 'success'
												})
												this.getUserInfo()
											}, 300)
																
										}).catch(()=>{
											uni.hideLoading()
										})
									}
									
									
								}
								// console.log("finish", finishRes)
							}),
							fail: () => {
								uni.hideLoading()
							}
						}) */


						/* let policyPrm = {
							fileNum: 1,
							uploadType: 1
						}
						getTicket(policyPrm).then(policyRes => {
							console.log('policy', policyRes)
							let policyData = policyRes.data.result
							let idx = imgRes.tempFilePaths[0].lastIndexOf('.')
							let name = imgRes.tempFilePaths[0].substring(idx)
							let fileKey = policyData.dir + policyData.fileIds[0] + name
							uni.uploadFile({
								url: policyData.host,
								filePath: imgRes.tempFilePaths[0],
								name: 'file',
								formData: {
									policy: policyData.policy,
									OSSAccessKeyId: policyData.accessid,
									signature: policyData.signature,
									key: fileKey
								},
								success: (finishRes => {
									if (finishRes.statusCode === 204) { //表示图片上传成功
										// this.accountInfo.retrieveUserForShowBaseVO.userPhoto = policyData.host+'/'+fileKey
										let uploadPrm = {
											fileId: policyData.fileIds[0],
											url: policyData.host + '/' + fileKey
										}
										uploadHeaderImg(uploadPrm).then(res => {
											uni.hideLoading()
											setTimeout(() => {
												uni.showToast({
													title: res
														.data
														.msg,
													icon: 'success'
												})
												this.getUserInfo()
											}, 300)

										})
									}
									console.log("finish", finishRes)
								}),
								fail: () => {
									uni.hideLoading()
								}
							})
						}).then(res => {
							uni.hideLoading()
						}) */
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

	.personalInfo {
		width: 100%;
		min-height: 100%;
		background: #F2F4F6;
		padding: 32upx;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.imgCut {
			width: 200%;
			height: 200%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999;
			background: rgba(0, 0, 0, .5);
			overflow: auto;
			display: none;

			.origin-img {
				width: 650upx;
				-height: auto;
				height: 700upx;
				margin: 100upx 0 0 50upx;
				z-index: 9999;
			}

			.cutCanvas {
				width: 600upx;
				height: 600upx;
				position: fixed;
				top: 300upx;
				left: 75upx;
				z-index: 10000;
			}

			.btn-wrapper {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 750upx;
				height: 140upx;
				background: #212121;
				box-shadow: 0px 4upx 8upx 0px rgba(0, 0, 0, 0.5);
				padding: 56upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				z-index: 9999999;
				box-sizing: border-box;
				color: #FFFFFF;
			}
		}

		.header-portrait {
			padding-top: 70upx;

			.center-wrapper {
				display: flex;
				justify-content: center;

				.portraitIcon {
					width: 148upx;
					height: 148upx;
					border-radius: 50%;
				}

				.cameraIcon {
					width: 60upx;
					height: 32upx;
					margin-top: -16upx;
					z-index: 99;
				}
			}

			.tip-wrapper {
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 36upx 0 64upx 0;
				font-size: 24upx;
				color: #F97A31;

				.tip-icon {
					width: 24upx;
					height: 24upx;
					margin-right: 12upx;
				}
			}

		}

		.other-info {
			width: 100%;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 20upx;
			padding: 0 40upx;

			.info-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 120upx;
				font-size: 30upx;
				color: #212121;
				border-bottom: 2upx solid #F3F3F3;

				&:last-child {
					border: none;
				}

				.info-detail {
					font-size: 30upx;
					color: #666666;
				}

				.info-detail1 {
					-flex: 1;
					-text-align: right;
				}

				.label1 {
					flex: 0 180upx;
					min-width: 180upx;
				}

				.right-wrapper {
					display: flex;
					align-items: center;
					font-size: 30upx;
					color: #666666;

					.right-detail {
						margin-right: 20px;
					}

					image {
						width: 16upx;
						height: 26upx;
					}
				}

				image {
					width: 16upx;
					height: 26upx;
				}
			}
			.info-item1{
				display: flex;
				justify-content: space-between!important;
			}
		}
	}
</style>
