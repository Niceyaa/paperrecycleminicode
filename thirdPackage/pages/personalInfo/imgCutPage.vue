<template>
	<view class="content">
		<view class="cropper-wrapper" style="height:617px">
			<canvas
				class="cropper"
				disable-scroll="true"
				@touchstart="touchStart"
				@touchmove="touchMove"
				@touchend="touchEnd"
				:style="{ width: cropperOpt.width, height: cropperOpt.height }"
				canvas-id="cropper"
			></canvas>
		</view>
		<view class="cropper-buttons">
			<view class="upload" @tap="back">取消</view>
			<view class="upload" @tap="uploadTap">重新选择</view>
			<view class="getCropperImage" @tap="getCropperImage">确定</view>
		</view>
	</view>
</template>

<script>
	import {
		uploadHeaderImg
	} from '../../../api/user.js'
import weCropper from '@/lib/weCropper.js';
const device = uni.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
console.log(device);
export default {
	data() {
		return {
			cropperOpt: {
				id: 'cropper',
				width: width,
				height: height,
				scale: 2.5,
				zoom: 8,
				cut: {
					x: (width - 295) / 2,
					y: (height - 295) / 2,
					width: 295,
					height: 295
				}
			},
			weCropper: '',
			oldImg: ''
		};
	},
	methods: {
		back() {
			uni.navigateBack()
		},
		touchStart(e) {
			this.weCropper.touchStart(e);
		},
		touchMove(e) {
			this.weCropper.touchMove(e);
		},
		touchEnd(e) {
			this.weCropper.touchEnd(e);
		},
		convertBase64UrlToBlob(dataURI, type) {
			var binary = atob(dataURI.split(',')[1]);
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], { type: type }, { filename: '1111.jpg' });
		},
		blobToDataURL(blob) {
			var a = new FileReader();
			a.readAsDataURL(blob); //读取文件保存在result中
			a.onload = function(e) {
				var getRes = e.target.result; //读取的结果在result中
				console.log(getRes);
			};
		},
		getCropperImage() {
			let _this = this;
			//let pathurl = url + '/user/upload';上传服务器地址
			this.weCropper.getCropperImage(avatar => {
				if (avatar) {
					//  获取到裁剪后的图片
					//  获取到裁剪后的图片
					console.log('头像',avatar)
					
					uni.showLoading({
						title: '上传中...'
					})
					uni.uploadFile({
						url: `${this.$baseURL}/zmsys-file/api/fileManage/upload`,
						filePath: avatar,
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
								if(this.oldImg.length>0){
									let deletePrm = {
										absolutePath:this.oldImg
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
														icon: 'success',
												success:()=>{
													uni.navigateBack()
												}
													})
													
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
												icon: 'success',
												success:()=>{
													uni.navigateBack()
												}
											})
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
					}) 
				} else {
					console.log('获取图片失败，请稍后重试');
				}
			});
		},
		uploadTap() {
			const self = this;

			uni.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					let src = res.tempFilePaths[0];
					//  获取裁剪图片资源后，给data添加src属性及其值

					self.weCropper.pushOrign(src);
				}
			});
		}
	},
	onLoad(option) {
		// do something
		const cropperOpt = this.cropperOpt;
		const src = option.src;
		if (src) {
			Object.assign(cropperOpt, {
				src
			});

			this.weCropper = new weCropper(cropperOpt)
				.on('ready', function(ctx) {})
				.on('beforeImageLoad', ctx => {
					uni.showToast({
						title: '上传中',
						icon: 'loading',
						duration: 3000
					});
				})
				.on('imageLoad', ctx => {
					uni.hideToast();
				});
		}
	}
};
</script>

<style>
.content {
	background: rgba(255, 255, 255, 1);
}

.head-list {
	height: 43px;
	width: 100%;
	background: #ffffff;
	justify-content: center;
	align-items: center;
	display: flex;
	border-bottom: 1px solid rgba(244, 244, 244, 1);
}

.head-info {
	text-align: center;
	font-size: 18px;
	color: #000000;
	font-weight: bold;
}

.save-box {
	position: absolute;
	right: 0px;
	width: 50px;
	height: 43px;
	line-height: 43px;
}

.save {
	color: rgba(98, 111, 252, 1);
	font-size: 16px;
	font-weight: 400;
}

.icon-back {
	margin-top: 11px;
	width: 10px;
	height: 18px;
	color: #000000;
	margin-left: 6px;
}

.icon-back-box {
	display: block;
	position: absolute;
	left: 6px;
	height: 43px;
	width: 30px;
	align-items: center;
}
.cropper {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.cropper-buttons {
	background-color: rgba(0, 0, 0, 0.95);
	color: #fff;
}
.cropper-wrapper {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background-color: #F0F0F0;
}

.cropper-buttons {
	width: 100vw;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	bottom: 0;
	left: 0;
	line-height: 50px;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
	width: 50%;
	text-align: center;
}
</style>
