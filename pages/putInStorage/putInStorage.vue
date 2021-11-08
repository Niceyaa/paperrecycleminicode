<template>
	<view class="storage">
		<view class="header-wrapper">
			<view class="header-left">
				<view class="title">确认入库</view>
				<view>请核实入库信息并确认入库。</view>
			</view>
			<image src="../../static/imgs/storageCar.png" mode=""></image>
		</view>
		<view class="tips">
			<image src="../../static/imgs/tipIcon.png" mode=""></image>
			<view>温馨提示：该站点的付款方式为{{dataInfo.paymentTypeName}}</view>
		</view>
		<view class="info-item">
			<view class="item-title">站点信息</view>
			<view class="info-wrapper">
				<view class="item">
					<view class="label">回收站点：</view>
					<view class="info">{{dataInfo.recycleName}}</view>
				</view>
				<view class="item">
					<view class="label">付款方式：</view>
					<view class="info blue">{{dataInfo.paymentTypeName}}</view>
				</view>
				<view class="item">
					<view class="label">入库重量：</view>
					<view class="info">{{dataInfo.allWeight}}KG</view>
				</view>
				<view class="item">
					<view class="label">入库金额：</view>
					<view class="info">￥{{dataInfo.allPrice}}</view>
				</view>
			</view>
		</view>
		<view class="info-item">
			<view class="item-title">订单信息</view>
			<view>
				<view v-for="(item,idx) in allOrderList" :key='item.retrieveOrderId'>
					<view class="order-num">
						<view class="num">订单{{idx+1}}</view>
						<!-- <image @click="changeShowFlag(idx,false)" v-if="item.showFlag" src="../../static/imgs/upArrow.png" mode=""></image>
				<image  @click="changeShowFlag(idx,true)" v-else src="../../static/imgs/downArrow.png" mode=""></image> -->
					</view>
					<view class="info-wrapper">
						<view class="item">
							<view class="label">订单编号：</view>
							<view class="info">{{item.retrieveOrderId}}</view>
						</view>
						<view class="item">
							<view class="label">订单重量：</view>
							<view class="info">{{item.retrieveOrderWeight}}KG</view>
						</view>
						<view class="item">
							<view class="label">订单金额：</view>
							<view class="info">￥{{item.retrieveOrderPrice}}</view>
						</view>
					</view>
				</view>

			</view>

		</view>

		<view class="storageBtn">
			<view @click="surePutStorage" class="innerBtn">确认入库</view>
		</view>
	</view>
</template>

<script>
	import {
		getOrderListNeedStorage,
		orderPutInStorage
	} from '../../api/putStorage.js'
	export default {
		data() {
			return {
				dataInfo: {
					allWeight: 0,
					allPrice: 0,
					recycleName: null,
					paymentTypeName: null,
					recycler: null,
					orderIdList: []
				},
				optFlag: false,
				allOrderList: []
			}
		},
		onLoad(opt) {
			console.log(opt)
			let data = opt.data
			let prm = {
				json: data
			}
			getOrderListNeedStorage(prm).then(res => {
				let {
					result
				} = res.data
				this.dataInfo.recyclerId = result.recyclerVo.recyclerId
				this.dataInfo.paymentTypeName = result.recyclerVo.payToRuType
				this.dataInfo.recycleName = result.recyclerVo.name
				let {
					napaRetrieveUserOrderStockVOList
				} = result
				this.allOrderList = napaRetrieveUserOrderStockVOList
				this.dataInfo.orderIdList = napaRetrieveUserOrderStockVOList.map(item => {
					/* item = Object.assign(item,{showFlag:true})
					this.allOrderList.push(item) */
					this.dataInfo.allWeight += item.retrieveOrderWeight
					this.dataInfo.allPrice += item.retrieveOrderPrice
					return item.retrieveOrderId
				})
				console.log('订单列表', this.allOrderList)
			})
		},
		methods: {
			changeShowFlag(idx, flag) {
				this.allOrderList[idx].showFlag = !this.allOrderList[idx].showFlag
			},
			surePutStorage() {
				if (this.optFlag) {
					return
				}
				this.optFlag = true
				let prm = {
					"idList": this.dataInfo.orderIdList,
					"recyclerId": this.dataInfo.recyclerId
				}
				uni.showLoading({
					title: '订单入库中',
					icon: 'none'
				})
				orderPutInStorage(prm).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
					this.optFlag = false
					uni.navigateTo({
						url: '/pages/putInStorage/storageResult'
					})
				}).catch(err => {
					this.optFlag = false
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="less">
	.storage {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding: 18upx 32upx 200upx 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.header-wrapper {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 34upx 34upx 22upx 34upx;
			width: 100%;
			box-sizing: border-box;
			background: #FFFFFF;
			box-shadow: 0px 0px 20upx 0upx rgba(0, 0, 0, 0.08);
			border-radius: 18upx;

			.header-left {
				font-size: 26upx;
				color: #515151;
				line-height: 28upx;

				.title {
					font-size: 40upx;
					font-weight: 600;
					color: #23CE85;
					margin-bottom: 24upx;
				}
			}

			image {
				width: 128upx;
				height: 118upx;
			}
		}

		.tips {
			display: flex;
			align-items: center;
			height: 64upx;
			background: #F7F1E1;
			border-radius: 32upx;
			margin-top: 26upx;
			font-size: 26upx;
			color: #C19550;

			image {
				width: 32upx;
				height: 32upx;
				margin: 0 10upx 0 32upx;
			}
		}

		.info-item {
			padding: 0 16upx;
			box-sizing: border-box;
			margin-top: 52upx;

			.item-title {
				font-size: 38upx;
				font-weight: 600;
				color: #333333;
				margin-bottom: 30upx;
			}

			.order-num {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 34upx;

				.num {
					font-size: 30upx;
					color: #333333;
				}

				image {
					width: 20upx;
					height: 12upx;
				}
			}

			.info-wrapper {
				.item {
					display: flex;
					align-items: center;
					font-size: 28upx;
					color: #8B8B8B;
					margin-bottom: 22upx;

					&:last-child {
						margin-bottom: 20upx;
					}

					.info {
						font-size: 28upx;
						color: #272626;
					}

					.label {
						width: 184upx;
						flex: 0 184upx;
					}
				}
			}
		}

		.storageBtn {
			position: fixed;
			z-index: 999;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 128upx;
			padding: 20upx 32upx;
			background: #FFFFFF;
			box-shadow: 0px -6px 8px 0px rgba(71, 137, 98, 0.1);
			box-sizing: border-box;

			.innerBtn {
				width: 100%;
				height: 88upx;
				text-align: center;
				line-height: 88upx;
				font-size: 34upx;
				color: #FFFFFF;
				background: #23CE85;
				border-radius: 12upx;
			}
		}
	}

	.blue {
		color: #0D92E7 !important;
	}
</style>
