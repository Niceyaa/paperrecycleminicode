<template>
	<view class="workPicture">
		<view class="title">上传工作照</view>
		<view class="img-wrapper">
			<view class="img-list">
				<view class="img-item" v-for="(item,idx) in imgList" :key='idx'>
					<image class="work-img" :src="item.url" mode=""></image>
					<image @click="deleteImg(item,idx)" class="delete-img" src="../../static/deleteImgIcon.png" mode="">
					</image>
				</view>
				<image @click="chooseImg" v-if="imgList.length<allCount" class="upload-img"
					src="../../static/uploadImgIcon.png" mode=""></image>
			</view>
			<view class="num">{{imgList.length}}/{{allCount}}</view>
		</view>
		<view @click="saveHandle" class="saveBtn">保存</view>
	</view>
</template>

<script>
	import {
		uploadWorkImg,
		getPersonalInfo
	} from '../../../api/user.js'
	import {
		getTicket,
		deleteFile
	} from '../../../api/file.js'
	export default {
		data() {
			return {
				imgList: [],
				allCount: 3,
				allInfo: []
			}
		},
		onLoad(opt) {
			/* console.log('0001',opt.imgList)
			console.log(111,opt.imgList.length)
			if (opt.imgList.length > 0) {
				let list = opt.imgList.split(',')
				console.log(222,list)
				if (list.length > 0) {
					list.forEach(item => {
						this.imgList.push({
							url: item,
							isUpload: true
						})
					})

				}
			} */
			getPersonalInfo().then(res => {
				let {
					result
				} = res.data
				if (result.workPhotoListUrl && result.workPhotoListUrl.length > 0) {
					result.workPhotoListUrl.forEach(item => {
						this.imgList.push({
							url: item,
							isUpload: true
						})
					})
				}
			})
		},
		methods: {
			deleteImg(item, idx) {
				if (item.isUpload) {
					let prm = {
						absolutePath: item.url
					}
					uni.showLoading({
						title: '正在删除'
					})
					deleteFile(prm).then(res => {
						uni.hideLoading()
						setTimeout(() => {
							uni.showToast({
								title: res.data.msg,
								icon: 'success'
							})
							this.imgList.splice(idx, 1)
						}, 300)
					}).catch(() => {
						uni.hideLoading()
					})
				} else {
					this.imgList.splice(idx, 1)
				}
			},
			chooseImg() {
				uni.chooseImage({
					count: this.allCount - this.imgList,
					success: (imgRes => {
						console.log('imgres', imgRes)
						this.imgList.push({
							url: imgRes.tempFilePaths[0],
							isUpload: false
						})
					})
				})
			},

			saveHandle() {
				if (this.imgList.length === 0) {
					uni.showToast({
						title: '请选择工作图片',
						icon: 'none'
					})
					return
				}
				let tempList = []
				tempList = this.imgList.filter(item => {
					return item.isUpload === false
				})
				console.log('tempList', tempList)
				/* if (tempList.length === 0) {
					uni.showToast({
						title: '没有更新图片哦',
						icon: 'none'
					})
					return
				} */
				/* let prm = {
					fileNum: tempList.length,
					uploadType: 1
				}
				getTicket(prm).then(res => {
					let policyResult = res.data.result
					
				}).catch(err => {
					uni.hideLoading()
					this.allInfo = []
				}) */

				uni.showLoading({
					title: '保存中...',
				})
				this.allInfo = []
				this.uploadFn(tempList, 0)
			},
			uploadFn(list, count) {
				// debugger
				if (list.length === count) {
					let prm = this.allInfo
					uploadWorkImg(prm).then(res => {
						uni.hideLoading()
						setTimeout(() => {
							uni.showToast({
								title: res.data.msg,
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.navigateBack()
										/* uni.redirectTo({
											url:'/thirdPackage/pages/personalInfo/personalInfo'
										}) */
									}, 1000)
								}
							})
						}, 300)
					}).catch(() => {
						this.allInfo = []
						uni.hideLoading()
					})
				} else {
					uni.uploadFile({
						url: `${this.$baseURL}/zmsys-file/api/fileManage/upload`,
						filePath: list[count].url,
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
								this.allInfo.push({
									fileId: data.result.fileId,
									// url: data.result.url
								})
								count++
								this.uploadFn(list, count)
							}
						},
						fail: () => {
							uni.hideLoading()
							this.allInfo = []
						}
					})

					// let idx = list[count].url.lastIndexOf('.')
					// let name = list[count].url.substring(idx)
					// let fileKey = policyRes.dir + policyRes.fileIds[count] + name
					/* 	uni.uploadFile({
							url: policyRes.host,
							filePath: list[count].url,
							name: 'file',
							formData: {
								policy: policyRes.policy,
								OSSAccessKeyId: policyRes.accessid,
								signature: policyRes.signature,
								key: fileKey
							},
							success: (finishRes) => {
								uni.hideLoading()
								if (finishRes.statusCode === 204) {
									this.allInfo.push({
										fileId: policyRes.fileIds[count],
										url: policyRes.host + '/' + fileKey
									})
									count++
									this.uploadFn(list, policyRes, count)
								}
							},
							fail: () => {
								this.allInfo = []
								uni.hideLoading()
							}
						}) */
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

	.workPicture {
		width: 100%;
		min-height: 100%;
		background: #F2F4F6;
		padding: 60upx 24upx 0 24upx;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			font-size: 48upx;
			color: #333333;
			margin: 0 0 60upx 14upx;
		}

		.img-wrapper {
			width: 100%;
			background: #FFFFFF;
			border-radius: 20upx;
			box-sizing: border-box;
			padding: 48upx 32upx 0 32upx;

			.img-list {
				display: flex;

				.img-item {
					width: 192upx;
					height: 226upx;
					position: relative;
					margin-right: 31upx;

					.work-img {
						width: 192upx;
						height: 226upx;
					}

					.delete-img {
						width: 52upx;
						height: 52upx;
						position: absolute;
						top: -27upx;
						right: -16upx;
					}
				}

				.upload-img {
					width: 192upx;
					height: 226upx;
				}
			}

			.num {
				width: 100%;
				text-align: right;
				padding: 32upx 0 40upx 0;
				font-size: 26upx;
				color: #B6B6B6;
			}
		}

		.saveBtn {
			width: 100%;
			box-sizing: border-box;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			text-align: center;
			line-height: 88upx;
			font-size: 34upx;
			color: #FFFFFF;
			margin-top: 450upx;
		}
	}
</style>
