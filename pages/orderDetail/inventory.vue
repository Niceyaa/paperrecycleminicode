<template>
	<view class="inventory">
		<view v-if="classifyModalFlag" class="classify-wrapper">
			<view class="classify-header">
				<view class="txt">选择类型</view>
				<image @click="changeModalStatus(false)" class="closeImg" src="../../static/imgs/closeModal.png"></image>
			</view>
			<view class="classify-content">
				<view class="big-classify">
					<view :class="{'big-item':true,'active':inventoryInfo.bigClassifyId===item.classifyId}" @click="changeClassifyStatus('bigClassifyId',item)" v-for="item in allGoodsClassify" :key='item.classifyId'>
						<view class="big-name">{{item.name}}</view>
						<view class="big-sign">
							<view class="sign-desc"></view>
						</view>
					</view>
				</view>
				<view class="small-classify">
					<view v-for="item in smallClassify" :key='item.goodsPriceId'  :class="{'small-item':true,'smallActive':inventoryInfo.smallClassifyId===item.goodsPriceId}" @click="changeClassifyStatus('smallClassifyId',item)">
						<image class="image" :src="item.classifyUrl"></image>
						<view class="small-name">{{item.goodsName}}</view>
						<view class="small-price">￥{{item.price}}元/{{item.unit}}</view>
					</view>
				</view>
			</view>
		</view>
		<header-bar :nav='headerBarNav'></header-bar>
		<view class="top-box">
			<view class="top-title">添加清单</view>
		</view>
		<view class="content">
			<view class="papey-type" @click="changeModalStatus(true)">
				<view class="label">类型</view>
				<view class="type-wrapper">
					<view class="type-name">{{inventoryInfo.classifyName?inventoryInfo.classifyName:'请选择纸品类型'}}</view>
					<image v-if="!inventoryInfo.classifyName" src="../../static/imgs/rightGreenArrow.png" mode=""></image>
				</view>
			</view>
			<!-- <view class="type-item">
				<view @click="choosePaperType(item.paperClassifyId,item.price)" v-for="item in allGoodsClassify" :key='item.paperClassifyId'
				 :class="{'item':true,'active':item.paperClassifyId===inventoryInfo.relateId}">{{item.name}}</view>
			</view> -->
			<view class="real-weight-label">实际重量/数量</view>
			<view class="real-weight-wrapper">
				<input v-model="inventoryInfo.weight" type="digit" placeholder="请输入实际重量"
					placeholder-class="placeholderClass" />
				<view class="unit">{{inventoryInfo.unit}}</view>
			</view>
			<view class="info-item">
				<view>单价</view>
				<view class="unitPrice">
					<input type="digit" v-model="inventoryInfo.unitPrice" />
					<view>元/{{inventoryInfo.unit}}</view>
				</view>
			</view>
			<view class="info-item">
				<view>实际费用</view>
				<view class="money">￥{{inventoryInfo.payPrice}}</view>
			</view>
			<view class="papey-type img">
				<view class="label">上传图片</view>
				<view>最多上传三张</view>
			</view>
			<view class="imgs">
				<view class="image-item" v-for="(item,idx) in allList" :key='idx'>
					<image @click="openPreImg(item)" :src="item.url?item.url:item" mode=""></image>
					<image @click="deleteImg(item,idx)" class="delete-img" src="../../static/imgs/deleteImg.png"
						mode=""></image>
				</view>
				<image v-if="allList.length<3" class="image-item" @click="chooseImage"
					src="../../static/imgs/chooseImg.png" mode=""></image>
			</view>
			<view class="save-btn">
				<button :disabled="saveDisabled" @click="submitHanlde" class="save">保存</button>
			</view>
		</view>
		<!-- <view @click="add">打开</view> -->
	</view>
</template>

<script>
	import {
		orderDetail,
		fillingInventory,
		updateInventory,
		deleteInventory,
		getInventoryDetail,
		getGoodsClassify
	} from '../../api/order.js'
	import {
		paperClassify
	} from '../../api/paperInfo.js'
	import {
		deleteFile
	} from '../../api/file.js'
	export default {
		data() {
			return {
				classifyModalFlag:false,
				saveDisabled: false,
				allGoodsClassify: [],
				smallClassify: [],
				inventoryInfo: {
					unit:"KG",
					cityId:null,
					classifyName: null,
					bigClassifyId:null,
					smallClassifyId:null,
					fileList: [],
					payPrice: '0.00',
					relateId: null,
					retrieveType: 1,
					currentInventoryId: null,
					currentRetrieveOrderId: null,
					weight: null,
					unitPrice: '-'
				},
				headerBarNav: {
					'bg': '#23CE85', //背景色
					'color': '#fff', //字体颜色
					backIconType: 'white',
					'isdisPlayNavTitle': true, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle': '', //导航标题
					backUrl: null
				},
				// 限制图片数量
				limit: 3,
				allList: [],
			};
		},
		watch: {
			'inventoryInfo.relateId': {
				handler(e) {
					if (this.inventoryInfo.weight && this.inventoryInfo.weight.length > 0) {
						this.inventoryInfo.payPrice = (this.inventoryInfo.unitPrice * this.inventoryInfo.weight).toFixed(2)
					}
					console.log('纸品类型改变了', e)
				},
				deep: true
			},
			'inventoryInfo.weight': {
				handler(e) {
					if (this.inventoryInfo.smallClassifyId) {
						this.inventoryInfo.payPrice = (this.inventoryInfo.unitPrice * this.inventoryInfo.weight).toFixed(2)
					}
					console.log('纸品类型改变了', e)
				},
				deep: true
			},
			'inventoryInfo.unitPrice': {
				handler(e) {
					if (this.inventoryInfo.smallClassifyId) {
						this.inventoryInfo.payPrice = (this.inventoryInfo.unitPrice * this.inventoryInfo.weight).toFixed(2)
					}
					console.log('纸品类型改变了', e)
				},
				deep: true
			},
			allList(val) {
				this.limit = 3 - val.length
			}
		},
		onLoad(opt) {
			this.inventoryInfo.currentRetrieveOrderId = opt.retrieveOrderId
			this.inventoryInfo.cityId = opt.cityId
			if (opt.retrieveOrderDetailId) {
				// 表示修改清单信息---调用清单详情接口
				console.log("我执行了吗", opt)
				this.inventoryInfo.unit = opt.unit
				this.inventoryInfo.currentInventoryId = opt.retrieveOrderDetailId
				let prm = {
					retrieveOrderDetailId: this.inventoryInfo.currentInventoryId,
					retrieveOrderId: this.inventoryInfo.currentRetrieveOrderId
				}
				getInventoryDetail(prm).then(res => {
					if (res.data.code === 200) {
						let {
							result
						} = res.data
						this.inventoryInfo.classifyName = result.goodsName
						this.inventoryInfo.bigClassifyId = result.retrieveClassifyId
						this.inventoryInfo.smallClassifyId = result.goodsId
						this.inventoryInfo.payPrice = result.goodsPrice
						this.inventoryInfo.weight = result.goodsWeight
						this.inventoryInfo.relateId = result.goodsId
						this.inventoryInfo.unitPrice = result.goodsUnitPrice
						this.allList = result.retrieveUserPictures
						this.limit = this.limit - this.allList.length
						
						getGoodsClassify({cityId:this.inventoryInfo.cityId}).then(res => {
							this.allGoodsClassify = res.data.result
							this.allGoodsClassify.forEach(item=>{
								if(item.classifyId===this.inventoryInfo.bigClassifyId){
									console.log(1111)
									this.smallClassify = item.subMenus
									
								// console.log(this.smallClassify)
								}
							})
							
						})
					}
				})
			}else{
				getGoodsClassify({cityId:this.inventoryInfo.cityId}).then(res => {
					this.allGoodsClassify = res.data.result
					this.smallClassify = this.allGoodsClassify[0].subMenus
				})
			}
			
			// 请求纸品类型数据
			

		},
		methods: {
			changeClassifyStatus(target,info){
				if(info.subMenus){
					this.inventoryInfo[target] = info.classifyId
					this.smallClassify = info.subMenus
				}else{
					this.inventoryInfo[target] = info.goodsPriceId
					this.inventoryInfo.classifyName = info.goodsName
					this.inventoryInfo.unitPrice = info.price
					this.inventoryInfo.unit = info.unit
					this.classifyModalFlag = false
				}
			},
			changeModalStatus(flag){
				this.classifyModalFlag = flag
				console.log(this.classifyModalFlag)
			},
			back() {
				uni.navigateBack({})
			},
			// 定义一个公共函数，判断数据类型
			isRawType(val) {
				let _toString = Object.prototype.toString
				return _toString.call(val).slice(8, -1)
			},
			deleteImg(url, idx) {
				uni.showModal({
					cancelText: '取消',
					confirmText: '确认',
					confirmColor: '#23CE85',
					content: '是否删除该图片',
					success: (res) => {
						if (res.confirm) {
							if (!url.includes('https:')) {
								this.allList.splice(idx, 1)
								console.log("limit1", this.limit)
							} else {
								let prm = {
									absolutePath: url
								}
								deleteFile(prm).then(delRes => {
									if (delRes.data.code === 200) {

										console.log("limit2", this.limit)
										uni.showToast({
											title: delRes.data.msg,
											duration: 2000,
											success: () => {
												this.allList.splice(idx, 1)
											}
										})
									}
								})
							}
						}
					}
				})
			},
			chooseImage() {

				console.log("limit3", this.limit)
				uni.chooseImage({
					count: this.limit,
					success: (res) => {
						for (var i = 0; i < res.tempFilePaths.length; i++) {
							this.allList.push(res.tempFilePaths[i])
						}
					}
				})
			},
			// 选择纸品类型
			choosePaperType(id, price) {
				this.inventoryInfo.relateId = id
				this.inventoryInfo.unitPrice = price
			},
			// 提交信息
			submitHanlde() {
				this.saveDisabled = true
				// 判断allList 如果是新添加的图片，那么他的值就一个字符串，已经存在的图片，就是一个对象
				const tempList = []
				for (let i = 0; i < this.allList.length; i++) {
					// if(this.isRawType(this.allList[i])==="String"){
					if (!this.allList[i].includes('https:')) {
						// 表示新添加的图片
						tempList.push(this.allList[i])
					}
					/* else{
						this.inventoryInfo.fileList.push(this.allList[i])
					} */
				}
				tempList.length > 0 ? this.uploadFn(tempList, 0) : this.saveInventoryHandle()
				/* if(tempList.length>0){}
				this.uploadFn(tempList, 0) */
			},
			// 添加或者修改清单
			saveInventoryHandle() {
				let FN = this.inventoryInfo.currentInventoryId ? updateInventory : fillingInventory
				let prm = this.inventoryInfo.currentInventoryId ? {
					fileIdList: this.inventoryInfo.fileList,
					// payPrice: this.inventoryInfo.payPrice,
					price: this.inventoryInfo.unitPrice,
					relateId: this.inventoryInfo.smallClassifyId,
					retrieveOrderDetailId: this.inventoryInfo.currentInventoryId,
					retrieveOrderId: this.inventoryInfo.currentRetrieveOrderId,
					weight: this.inventoryInfo.weight,
					retrieveType: 1,
				} : {
					fileIdList: this.inventoryInfo.fileList,
					// payPrice: this.inventoryInfo.payPrice,
					price: this.inventoryInfo.unitPrice,
					relateId: this.inventoryInfo.smallClassifyId,
					retrieveOrderId: this.inventoryInfo.currentRetrieveOrderId,
					weight: this.inventoryInfo.weight,
					retrieveType: 1,
				}
				console.log('参数', prm)
				FN(prm).then(res => {
						if (res.data.code === 200) {
							this.saveDisabled = false
							uni.hideLoading()
							uni.showToast({
								title: res.data.msg,
								duration: 1500,
								success: (res) => {
									uni.navigateBack({

									})
								}
							})
						}
						console.log("清单操作", res)
					})
					.catch(err => {
						uni.hideLoading()
						this.saveDisabled = false
					})
			},
			// 上传图片
			uploadFn(list, count) {

				uni.showLoading({
					title: '正在保存'
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
							this.inventoryInfo.fileList.push(data.result.fileId)
							count++
							//表示还有未添加图片
							if (count < list.length) {
								this.uploadFn(list, count)
							} else {
								this.saveInventoryHandle()
							}
						}
						console.log('上传完成', uploadRes)
					},
				})
			},
			// 预览图片
			openPreImg(urls) {
				uni.previewImage({
					urls: [urls]
				})
			}
		}
	}
</script>

<style lang="less">
	.inventory {
		position: relative;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.classify-wrapper {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
			z-index: 100000;
			padding-top: 260upx;
			box-sizing: border-box;

			.classify-header {
				width: 100%;
				height: 172upx;
				box-sizing: border-box;
				padding: 60upx 52upx 0 40upx;
				display: flex;
				justify-content: space-between;
				font-size: 40upx;
				color: #FFFFFF;
				background: url('../../static/imgs/chooseTypeBgc.png');
				background-size: 100% 100%;

				.closeImg {
					width: 26upx;
					height: 26upx;
				}
			}

			.classify-content {
				position: relative;
				height: 100%;
				background-color: #fff;
				width: 100%;
				margin-top: -24upx;
				border-radius: 18upx;
				box-sizing: border-box;
				padding: 0 33upx;
				-overflow: auto;

				.big-classify {
					width: 100%;
					-height: 90upx;
					box-sizing: border-box;
					display: flex;
					border-bottom: 2upx solid #f3f3f3;
					align-items: center;
					font-size: 28upx;
					color: #333333;
					flex-wrap: nowrap;
					overflow: auto;
					padding: 30upx 0 0 0;

					.big-item {
						-flex: .25;
						text-align: center;
						box-sizing: border-box;
						overflow: auto;
						min-width: 171upx;
						flex: 0 171upx;
						&.active {
							font-size: 32upx;
							color: #25CE99 !important;
							.big-sign{
								display: flex;
							}
						}
						.big-name{
							padding-bottom: 18upx;
						}
						.big-sign{
							display: none;
							width: 100%;
							justify-content: center;
							.sign-desc{
								width: 40upx;
								height: 6upx;
								background: #25CE99;
								-margin-top: 20upx;
							}
						}
					}
				}
				.small-classify{
					display: flex;
					flex-wrap: wrap;
					overflow: auto;
					.small-item{
						&.smallActive{
							border: 2upx solid #25CE99;
						}
						width: 206upx;
						height: 230upx;
						background: #FAFAFB;
						border-radius: 14upx;
						box-sizing: border-box;
						margin: 32upx 34upx 0 0;
						text-align: center;
						padding: 24upx 0 0 0;
						font-size: 26upx;
						color: #222222;
						&:nth-child(3n){
							margin-right: 0;
						}
						.image{
							width: 92upx;
							height: 92upx;
							margin: 0 0 24upx 0;
							
						}
						.small-price{
							font-size: 20upx;
							color: #F97B32;
							padding: 10upx 0 20upx 0;
						}
					}
				}
			}
		}

		.top-box {
			background-image: url(../../static/imgs/inventoryBgc.png);
			background-size: 100% 100%;
			width: 100%;
			height: 144upx;
			padding-top: 28upx;
			box-sizing: border-box;

			.top-title {
				font-size: 48upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				margin: 0 0 0 52upx;
			}
		}
	}

	.content {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		background: #fff;
		margin-top: -24upx;
		border-radius: 28upx 28upx 0px 0px;
		padding: 48upx 32upx 58upx 32upx;

		.papey-type {
			display: flex;
			align-items: center;
			font-size: 26upx;
			color: #515151;
			padding-bottom: 38upx;
			margin-bottom: 38upx;
			justify-content: space-between;
			border-bottom: 2upx solid #F3F3F3;
			;

			.label {
				margin-right: 14upx;
				font-size: 36upx;
				color: #2B2B2B;
			}

			.type-wrapper {
				display: flex;
				align-items: center;
				font-size: 28upx;
				color: #25CE99;

				image {
					margin-left: 24upx;
					width: 12upx;
					height: 20upx;
				}
			}
		}

		.type-item {
			display: flex;
			flex-wrap: wrap;
			margin: 8upx 0;

			.item {
				width: 200upx;
				height: 80upx;
				border-radius: 12upx;
				border: 2upx solid #CCDDDC;
				box-sizing: border-box;
				text-align: center;
				line-height: 80upx;
				font-size: 28upx;
				color: #4E5753;
				margin: 0 44upx 30upx 0;

				&:nth-child(3n) {
					margin-right: 0;
				}

				&.active {
					background: #ECFBF4;
					border: 2upx solid #00D689;
					color: #00D286;
				}
			}
		}

		.real-weight-label {
			font-size: 36upx;
			color: #131313;
		}

		.real-weight-wrapper {
			width: 686upx;
			height: 88upx;
			border-radius: 12upx;
			border: 2upx solid #C9D8D8;
			line-height: 88upx;
			box-sizing: border-box;
			padding-left: 36upx;
			font-size: 34upx;
			color: #525252;
			position: relative;
			margin: 30upx 0;

			.placeholderClass {
				font-size: 34upx;
				color: #B4BAB8;
			}

			input {
				height: 88upx;
				line-height: 88upx;
				width: 100%;
			}

			.unit {
				position: absolute;
				height: 88upx;
				line-height: 88upx;
				top: 0;
				right: 38upx;

			}
		}

		.info-item {
			padding: 36upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2upx #F0F0F0 solid;
			font-size: 36upx;
			color: #2B2B2B;

			.money {
				font-size: 36upx;
				color: #FD7366;
			}

			.unitPrice {
				display: flex;
				text-align: right;

				input {
					width: 200upx;
				}
			}
		}

		.img {
			margin-top: 60upx;
		}

		.imgs {
			width: 100%;
			display: flex;
			padding-bottom: 80upx;
			box-sizing: border-box;

			.image-item {
				width: 210upx;
				height: 200upx;
				position: relative;
				border-radius: 20upx;
				margin-right: 28upx;

				&:last-child {
					margin: 0;
				}

				image {
					width: 100%;
					height: 100%;
					border-radius: 20upx;
				}

				.delete-img {
					width: 52upx;
					height: 52upx;
					position: absolute;
					top: -18upx;
					right: -18upx;
				}
			}
		}

		.save-btn {
			width: 100%;
			padding: 10upx 32upx 10upx 32upx;
			position: fixed;
			bottom: 0;
			left: 0;
			box-sizing: border-box;
			box-shadow: 0px -6px 8px 0px rgba(71, 137, 98, 0.1);
			height: 100upx;
			background: #fff;

			.save {
				width: 100%;
				background: #23CE85;
				height: 80upx;
				text-align: center;
				line-height: 80upx;
				border-radius: 12upx;
				font-size: 34upx;
				color: #FFFFFF;
			}
		}
	}
</style>
