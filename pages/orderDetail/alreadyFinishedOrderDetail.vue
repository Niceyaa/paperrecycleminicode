<template>
	<view class="orderDetail">
		<view class="top-box" :style="{'background-image':'url('+detailInfo.imgBgc+')'}">
			<view class="top-title">{{detailInfo.name}}</view>
		</view>
		<view class="content">
			<view class="address-info">
				<view class="order-item padding0">
					<view class="newTaskmiddle">
						<view class="middle-left">
							<image src="../../static/imgs/endLoc.png" mode=""></image>
							<view class="distance">
								{{orderDetailInfo.orderBaseInfo.distance?orderDetailInfo.orderBaseInfo.distance:''}}<text
									class="unit">km</text>
							</view>
							<view class="line"></view>
							<image src="../../static/imgs/startLoc.png" mode=""></image>
							<view class="text">我的位置</view>
						</view>
						<view class="middle-right">
							<view class="storefront">{{orderDetailInfo.orderBaseInfo.addressBase}}</view>
							<view class="address">{{orderDetailInfo.orderBaseInfo.addressDetail}}</view>
							<view class="myAddress">{{locationInfo.name}}</view>
						</view>
					</view>
					<view v-if="orderStatus==='alreadyTurnOrder'" class="finishTaskfooter">
						实际重量<text class="finishNum">{{orderDetailInfo.weight}}</text>kg
					</view>
				</view>
			</view>
			<view class="order-info margin90">
				<view class="order-header">
					<view class="title">
						<view>订单详情</view>
						<view class="sign"></view>
					</view>
					<view class="type-item">
						<view class="item-left">
							<view class="type-name">{{orderDetailInfo.consumerPredictGoods.goodsName}}</view>
							<view>{{orderDetailInfo.consumerPredictGoods.goodsUnitPrice}}/kg</view>
						</view>
						<view class="item-right">
							{{orderDetailInfo.consumerPredictGoods.goodsWeight}}kg
						</view>
					</view>
				</view>
				<view class="order-content">
					<view class="content-item">
						<view>订单编号</view>
						<view>{{orderDetailInfo.retrieveOrderId}}</view>
					</view>
					<view class="content-item">
						<view>下单时间</view>
						<view>{{orderDetailInfo.orderBaseInfo.orderTime}}</view>
					</view>
					<view class="content-item">
						<view>预约时间</view>
						<view>{{orderDetailInfo.orderBaseInfo.predictComeStartTime}}</view>
					</view>
					<view class="content-item">
						<view>预估价格</view>
						<view class="price">￥{{orderDetailInfo.orderBaseInfo.predictIncomePrice}}</view>
					</view>
					<view class="content-item">
						<view>转单时间</view>
						<view>{{orderDetailInfo.orderBaseInfo.predictComeStartTime}}</view>
					</view>
				</view>
				<view class="contact" v-if="status!=='new'">
					<view class="contact-info" @click="makePhoneCall">
						<image src="../../static/imgs/phoneIcon.png" mode=""></image>
						<text>联系客户</text>
					</view>
				</view>
			</view>
			<view class="order-info" v-if="orderDetailInfo.paymentTypeInfo">
				<view class="order-header">
					<view class="title">
						<view>支付信息</view>
						<view class="sign"></view>
					</view>
				</view>
				<view class="order-content">
					<view class="content-item">
						<view>支付类型</view>
						<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===1">现金支付</view>
						<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===2">微信支付</view>
						<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===3">支付宝</view>
						<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===4">银行卡支付</view>
					</view>

					<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===4" class="content-item">
						<view>银行卡</view>
						<view>{{orderDetailInfo.orderBaseInfo.bankName}}</view>
					</view>
					<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===4" class="content-item">
						<view>收款账号</view>
						<view>{{orderDetailInfo.orderBaseInfo.bankCardNumber}}</view>
					</view>
					<view v-if="orderDetailInfo.paymentTypeInfo.paymentType===4" class="content-item">
						<view>持卡人</view>
						<view>{{orderDetailInfo.orderBaseInfo.cardholder}}</view>
					</view>
					<view class="content-item">
						<view>支付金额</view>
						<view style="font-size: 34upx;color: #FF7942;font-weight: bold;">{{orderDetailInfo.orderPrice}}元
						</view>
					</view>
					<view class="content-item">
						<view>订单重量</view>
						<view style="font-size: 34upx;color: #FF7942;font-weight: bold;">{{orderDetailInfo.weight}}kg
						</view>
					</view>
					<view class="content-item">
						<view>服务费</view>
						<view>{{orderDetailInfo.serviceFee.serviceTotalFee}}元</view>
					</view>
				</view>
			</view>
			<view v-if="orderDetailInfo.orderDetails.length>0" class="inventory-info">
				<view class="order-header">
					<view class="title">
						<view>清单详情</view>
						<view class="sign"></view>
					</view>
				</view>
				<view class="order-content listDetail">
					<view class="list-item" v-for="(item,idx) in orderDetailInfo.orderDetails"
						:key='item.retrieveOrderDetailId'>
						<view class="item-header">
							<view>清单{{idx+1}}</view>

						</view>
						<view class="item-info">
							<view class="item-type">
								<view class="item-type-name">
									<view class="name">{{item.goodsName}}</view>
									<view>{{item.goodsUnitPrice}}元/kg</view>
								</view>
								<view class="weight">{{item.goodsWeight}}kg</view>
							</view>
							<view class="imgs">
								<image  v-if="idx<3" v-for="(imgItem,idx) in item.retrieveUserPictures" :src="imgItem" mode=""  @click="$imgPreview(idx,item.retrieveUserPictures)" />

							</view>
							<view class="real-price">
								<view class="real-price-left">
									<view class="label">实际费用</view>
									<view class="price-num">
										<text>￥</text>{{item.goodsPrice}}
									</view>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		orderDetail,
		deleteInventory
	} from '../../api/order.js'
	export default {
		data() {
			return {
				detailInfos: [{
						name: '已收货',
						imgBgc: require('@/static/imgs/alreadyReceive.png')
					},
					{
						name: '待入库',
						imgBgc: require('@/static/imgs/alreadyReceive.png')
					},
					{
						name: '已转单',
						imgBgc: require('@/static/imgs/alreadyTurnOrder.png')
					},
				],
				detailInfo: {},
				// alreadyReceive,alreadyTurnOrder
				orderStatus: 'alreadyTurnOrder',
				// 组件配置
				currentRetrieveOrderId: null,
				locationInfo: {
					longitude: null,
					latitude: null,
					name: null
				},
				allWeight: null,
				allPrice: null,
				orderDetailInfo: {}
			};
		},
		onLoad(opt) {
			if (opt.orderState === '7') { //表示已收货
				this.detailInfo = this.detailInfos[0]
				this.orderStatus = 'alreadyReceive'
			} else {
				this.detailInfo = this.detailInfos[1]
				this.detailInfo.name = opt.orderStateName
			}
			console.log("page信息", opt)
			this.locationInfo.name = opt.receiveLocation
			this.locationInfo.latitude = opt.latitude
			this.locationInfo.longitude = opt.longitude
			this.currentRetrieveOrderId = opt.retrieveOrderId
		},
		onShow(opt) {
			console.log("我是show", opt)
			this.getDetail()
		},
		methods: {
			getDetail() {
				let prm = {
					retrieveOrderId: this.currentRetrieveOrderId
				}
				orderDetail(prm).then(res => {
					if (res.data.code === 200) {
						let {
							result
						} = res.data
						this.orderDetailInfo = result
						this.allWeight = null
						this.allPrice = null
						if (result.orderDetails.length > 0) {
							for (let i = 0; i < result.orderDetails.length; i++) {
								this.allWeight += result.orderDetails[i].goodsWeight
								this.allPrice += result.orderDetails[i].goodsPrice
							}
						}
					}
				})
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.orderDetailInfo.phone,
					success(res) {
						console.log('调用电话api', res)
					}
				})
			},
		}
	}
</script>

<style lang="less">
	view {
		box-sizing: border-box;
	}

	.orderDetail {
		position: relative;

		.top-box {
			-background: #23CE85;
			width: 100%;
			height: 240upx;
			padding-top: 48upx;
			box-sizing: border-box;
			background-size: 100% 100%;

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
		background: #F2F4F6;
		padding: 0 20upx 120upx 20upx;
		position: relative;

		.address-info {
			width: 100%;
			box-sizing: border-box;
			top: -90upx;
			position: relative;

			.padding0 {
				padding-top: 0 !important;
				padding-bottom: 0 !important;
			}

			.order-item {
				width: 100%;
				padding: 16upx 32upx 40upx 32upx;
				color: #87898F;
				font-size: 28upx;
				box-sizing: border-box;
				margin-bottom: 24upx;
				background: #fff;
				border-radius: 28upx;

				.newTaskheader {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20upx;
					border-bottom: 2upx solid #F0F0F0;
					align-items: baseline;
					font-size: 26upx;

					.header-left {
						display: flex;
						align-items: center;

						image {
							width: 24upx;
							height: 24upx;
							margin-right: 16upx;
						}

						.time {
							color: #F05858;
							margin-right: 10upx;
						}
					}

					.header-right {
						align-items: baseline;
						display: flex;

						.weight {
							font-size: 48upx;
							color: #FD7366;
							font-weight: bold;
						}
					}
				}

				.newTaskmiddle {
					width: 100%;
					padding: 52upx 0;
					display: flex;
					-align-items: center;

					.middle-left {
						flex: 0 136upx;
						width: 136upx;
						min-width: 136upx;
						color: #B7B7B7;
						font-size: 26upx;

						image {
							width: 36upx;
							height: 36upx;
							margin-bottom: 14upx;
						}

						.distance {
							color: #222222;
							font-weight: 600;

							.unit {
								font-weight: normal;
								color: #B7B7B7;
								margin-left: 4upx;
							}
						}

						.line {
							border-left: 4upx dashed #E0E0E0;
							height: 48upx;
							margin: 10upx 0 10upx 16upx;
						}
					}

					.middle-right {
						width: 480upx;

						.storefront {
							font-size: 32upx;
							color: #222;
							margin-bottom: 26upx;
						}

						.address {
							font-size: 28upx;
							color: #87898F;
							margin-bottom: 60upx;
						}

						.myAddress {
							color: #222222;
							font-size: 32upx;
						}
					}
				}

				.finishTaskfooter {
					text-align: right;
					width: 646upx;
					border-top: 2upx solid #F0F0F0;
					color: #666666;
					font-size: 24upx;
					padding: 20upx 0;

					.finishNum {
						font-size: 48upx;
						font-weight: 600;
						color: #FD7366;
					}
				}
			}

		}

		.margin90 {
			margin-top: -90upx;
		}

		.order-info {
			width: 100%;
			padding: 48upx 26upx 40upx 26upx;
			border-radius: 28upx;
			background: #fff;
			margin-bottom: 24upx;
			box-sizing: border-box;

			.order-header {
				.title {
					font-size: 36upx;
					color: #131313;
					position: relative;
					margin-bottom: 48upx;

					.sign {
						position: absolute;
						bottom: 0;
						left: 0;
						width: 142upx;
						height: 14upx;
						background: #23CE85;
						opacity: .9;
					}
				}

				.type-item {
					font-size: 28upx;
					color: #515151;
					display: flex;
					justify-content: space-between;
					margin-bottom: 30upx;

					.item-left {
						display: flex;

						.type-name {
							margin-right: 28upx;
							color: #131313;
						}
					}
				}
			}

			.imgDetail1 {
				display: flex;
				flex-wrap: wrap;
				border: none;
				padding: 0;

				image {
					width: 210upx;
					height: 200upx;
					margin-left: 14upx;
					border-radius: 10upx;

					&:first-child {
						margin: 0;
					}
				}
			}

			.order-content {
				border-bottom: 2upx solid #F0F0F0;
				border-top: 2upx solid #F0F0F0;
				width: 100%;
				box-sizing: border-box;
				padding: 8upx 0 40upx 0;

				.content-item {
					display: flex;
					justify-content: space-between;
					color: #515151;
					font-size: 28upx;
					margin-top: 28upx;

					.price {
						font-weight: 600;
						color: #FF7942;
					}
				}
			}

			.listDetail {
				width: 662upx;
				box-sizing: border-box;
				padding: 0;
				border: none;

				.list-item {
					margin-bottom: 40upx;
					box-sizing: border-box;
					background: #F3FFFA;
					position: relative;
					border-radius: 40upx;

					.item-header {
						width: 100%;
						box-sizing: border-box;
						padding: 0 40upx;
						height: 74upx;
						background: #D1F4E5;
						font-size: 30upx;
						color: #2AA470;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-radius: 40upx 40upx 0px 0px;

						image {
							width: 32upx;
							height: 32upx;
						}
					}

					.item-info {
						padding: 0 35upx;

						.item-type {
							padding: 28upx 0;
							display: flex;
							justify-content: space-between;
							font-size: 28upx;
							color: #515151;

							.item-type-name {
								display: flex;

								.name {
									margin-right: 28upx;
									color: #131313;
								}
							}
						}

						.imgs {
							width: 100%;
							display: flex;
							margin-bottom: 30upx;

							image {
								margin-right: 20upx;
								width: 184upx;
								height: 174upx;
								border-radius: 20upx;

								&:last-child {
									margin: 0;
								}
							}
						}

						.real-price {
							width: 100%;
							padding: 20upx 0;

							.real-price-left {
								display: flex;
								align-items: center;
								font-size: 24upx;
								color: #525252;

								.price-num {
									color: #FD7366;
									font-size: 34upx;

									text {
										font-size: 24upx;
									}
								}
							}

						}
					}

					.fillBtn {
						position: absolute;
						bottom: 0;
						right: 0;
						width: 116upx;
						height: 80upx;
					}
				}

				.add-btn {
					width: 646upx;
					height: 88upx;
					border-radius: 4upx;
					border: 2upx dashed #23CE85;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 34upx;
					color: #23CE85;
					margin: 20upx 0 60upx 0;
					font-weight: 600;

					image {
						width: 28upx;
						height: 28upx;
						margin-right: 14upx;
					}
				}

				.bottom-item {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 28upx;
					color: #5A5A5A;
					margin-bottom: 36upx;

					.bottom-item-left {
						display: flex;
						align-items: center;
						color: #2B2B2B;

						image {
							height: 32upx;
							width: 32upx;
							margin-left: 10upx;
						}
					}
				}

				.all-money {
					border-top: 2upx solid #F0F0F0;
					padding: 36upx 0 0 0;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 28upx;
					color: #5A5A5A;

					.sign {
						font-size: 24upx;
						color: #FD7366;
					}

					.money {
						font-size: 40upx;
						font-weight: 600;
						color: #FD7366;
					}
				}
			}


			.contact {
				width: 100%;
				box-sizing: border-box;
				padding: 32upx 0 0 0;
				font-size: 28upx;
				color: #3A3A3A;

				image {
					width: 28upx;
					height: 36upx;
					margin-right: 6upx;
				}

				.contact-info {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}

		.footer-tab {
			width: 100%;
			box-sizing: border-box;
			height: 128upx;
			padding: 0 32upx;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			box-shadow: 0px -6px 8px 0px rgba(71, 137, 98, 0.1);
			font-size: 28upx;

			.all-price {
				display: flex;
				align-items: center;
				color: #393939;

				.unit {
					color: #FF5B56;
				}

				.price-num {
					color: #FF685E;
					font-size: 34upx;
				}
			}

			.race-order {
				width: 380upx;
				height: 88upx;
				background: #23CE85;
				border-radius: 12upx;
				line-height: 88upx;
				text-align: center;
				color: #fff;
				font-size: 34upx;
			}
		}
	}

	.inventory-info {
		width: 100%;
		padding: 48upx 26upx 40upx 26upx;
		border-radius: 28upx;
		background: #fff;
		margin-bottom: 24upx;
		box-sizing: border-box;

		.order-header {
			.title {
				font-size: 36upx;
				color: #131313;
				position: relative;
				margin-bottom: 48upx;

				.sign {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 142upx;
					height: 14upx;
					background: #23CE85;
					opacity: .9;
				}
			}

			.type-item {
				font-size: 28upx;
				color: #515151;
				display: flex;
				justify-content: space-between;
				margin-bottom: 30upx;

				.item-left {
					display: flex;

					.type-name {
						margin-right: 28upx;
						color: #131313;
					}
				}
			}
		}

		.order-content {
			border-bottom: 2upx solid #F0F0F0;
			border-top: 2upx solid #F0F0F0;
			width: 100%;
			box-sizing: border-box;
			padding: 8upx 0 40upx 0;

			.content-item {
				display: flex;
				justify-content: space-between;
				color: #515151;
				font-size: 28upx;
				margin-top: 28upx;

				.price {
					font-weight: 600;
					color: #FF7942;
				}
			}
		}

		.listDetail {
			width: 662upx;
			box-sizing: border-box;
			padding: 0;
			border: none;

			.list-item {
				margin-bottom: 40upx;
				box-sizing: border-box;
				background: #F3FFFA;
				position: relative;
				border-radius: 40upx;

				.item-header {
					width: 100%;
					box-sizing: border-box;
					padding: 0 40upx;
					height: 74upx;
					background: #D1F4E5;
					font-size: 30upx;
					color: #2AA470;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-radius: 40upx 40upx 0px 0px;

					image {
						width: 32upx;
						height: 32upx;
					}
				}

				.item-info {
					padding: 0 35upx;

					.item-type {
						padding: 28upx 0;
						display: flex;
						justify-content: space-between;
						font-size: 28upx;
						color: #515151;

						.item-type-name {
							display: flex;

							.name {
								margin-right: 28upx;
								color: #131313;
							}
						}
					}

					.imgs {
						width: 100%;
						display: flex;
						margin-bottom: 30upx;

						image {
							margin-right: 20upx;
							width: 184upx;
							height: 174upx;
							border-radius: 20upx;

							&:last-child {
								margin: 0;
							}
						}
					}

					.real-price {
						width: 100%;
						padding: 20upx 0;

						.real-price-left {
							display: flex;
							align-items: center;
							font-size: 24upx;
							color: #525252;

							.price-num {
								color: #FD7366;
								font-size: 34upx;

								text {
									font-size: 24upx;
								}
							}
						}

					}
				}

				.fillBtn {
					position: absolute;
					bottom: 0;
					right: 0;
					width: 116upx;
					height: 80upx;
				}
			}

			.add-btn {
				width: 646upx;
				height: 88upx;
				border-radius: 4upx;
				border: 2upx dashed #23CE85;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 34upx;
				color: #23CE85;
				margin: 20upx 0 60upx 0;
				font-weight: 600;

				image {
					width: 28upx;
					height: 28upx;
					margin-right: 14upx;
				}
			}

			.bottom-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28upx;
				color: #5A5A5A;
				margin-bottom: 36upx;

				.bottom-item-left {
					display: flex;
					align-items: center;
					color: #2B2B2B;

					image {
						height: 32upx;
						width: 32upx;
						margin-left: 10upx;
					}
				}
			}

			.all-money {
				border-top: 2upx solid #F0F0F0;
				padding: 36upx 0 0 0;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 28upx;
				color: #5A5A5A;

				.sign {
					font-size: 24upx;
					color: #FD7366;
				}

				.money {
					font-size: 40upx;
					font-weight: 600;
					color: #FD7366;
				}
			}
		}


		.contact {
			width: 100%;
			box-sizing: border-box;
			padding: 32upx 0 0 0;
			font-size: 28upx;
			color: #3A3A3A;

			image {
				width: 28upx;
				height: 36upx;
				margin-right: 6upx;
			}

			.contact-info {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
