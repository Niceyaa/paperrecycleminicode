<template>
	<view class="fillingInfo">
		<view @click='closeModal' v-if="userNotConfirmFlag" class="showModal">
			<view class="modalDetail">
				<image src="../../static/imgs/userNotConfirm.png" mode=""></image>
				<view class="tip">等待客户确认订单...</view>
			</view>
		</view>
		<view class="top-box">
			<!-- <image @click="back" src="../../static/imgs/topBack.png" mode=""></image> -->
			<view class="top-title">填写收货信息</view>
		</view>
		<view class="content">
			<view class="address-info">
				<view class="order-item">
					<view class="newTaskheader">
						<view class="header-left">
							<image src="../../static/imgs/timing.png" mode="" />
							<view class="time">{{orderDetailInfo.orderBaseInfo.requireTimeStr}}</view>
							<view>到达</view>
						</view>
						<view class="header-right">
							<view>预估重量</view>
							<view class="weight">{{orderDetailInfo.orderBaseInfo.predictWeight}}</view>
							<view>kg</view>
						</view>
					</view>
					<view class="newTaskmiddle">
						<view class="middle-left">
							<image src="../../static/imgs/endLoc.png" mode=""></image>
							<view class="distance">{{orderDetailInfo.orderBaseInfo.distance?orderDetailInfo.orderBaseInfo.distance:''}}<text
								 class="unit">km</text></view>
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
				</view>
			</view>
			<view class="order-info margin90">
				<view class="order-header">
					<view class="title">
						<view>清单详情</view>
						<view class="sign"></view>
					</view>
				</view>
				<view class="order-content listDetail">
					<view class="list-item" v-for="(item,idx) in orderDetailInfo.orderDetails" :key='item.retrieveOrderDetailId'>
						<view class="item-header">
							<view>清单{{idx+1}}</view>
							<image @click="delInventory(item.retrieveOrderDetailId)" src="../../static/imgs/delIcon.png" mode=""></image>
						</view>
						<view class="item-info">
							<view class="item-type">
								<view class="item-type-name">
									<view class="name">{{item.goodsName}}</view>
									<view>{{item.goodsUnitPrice}}元/{{item.unit}}</view>
								</view>
								<view class="weight">{{item.goodsWeight}}{{item.unit}}</view>
							</view>
							<view class="imgs">
								<image v-if="idx<3"  v-for="(imgItem,idx) in item.retrieveUserPictures" :src="imgItem" mode=""  @click="$imgPreview(idx,item.retrieveUserPictures)" />
								
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
						<image  @click="goToUrl('/pages/orderDetail/inventory?retrieveOrderId='+currentRetrieveOrderId+'&retrieveOrderDetailId='+item.retrieveOrderDetailId+'&cityId='+cityId+'&unit='+item.unit)" class="fillBtn" src="../../static/imgs/fillingBtn.png" mode=""></image>
					</view>
					<view @click="goToUrl('/pages/orderDetail/inventory?retrieveOrderId='+currentRetrieveOrderId+'&cityId='+cityId)" class="add-btn">
						<image src="../../static/imgs/add.png" mode=""></image>
						<view>增加清单</view>
					</view>
					<view class="bottom-item">
						<view class="bottom-item-left">
							平台服务费
							<image src="../../static/imgs/stagemoney.png" mode=""></image>
						</view>
						<view>{{orderDetailInfo.serviceFee.serviceTotalFee}}</view>
					</view>
					<view class="bottom-item">
						<view class="bottom-item-left">总重量</view>
						<view>{{orderDetailInfo.weight}}</view>
					</view>
					<view class="all-money">
						<view>合计</view>
						<view class="sign">￥</view>
						<view class="money">{{orderDetailInfo.orderPrice}}</view>
					</view>
				</view>
			</view>
			<view class="order-info">
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
				</view>
				<view class="contact" v-if="status!=='new'">
					<view class="contact-info" @click="makePhoneCall">
						<image src="../../static/imgs/phoneIcon.png" mode=""></image>
						<text>联系客户</text>
					</view>

				</view>
			</view>
			<view class="footer-tab">
				<view class="all-price">总金额：
					<view class="unit">￥</view>
					<view class="price-num">{{orderDetailInfo.orderPrice}}</view>
				</view>
				<button @click="payHandle" class="race-order">支付</button>
			</view>
		</view>
		<common-race-order-modal :isShowSeeSee='false' :isShowBackList='true' :modalRefreshFlag.sync='modalRefreshFlag'
		 :retrieveOrderId='currentRetrieveOrderId' :modalFlag.sync='modalFlag' :raceOrderStatus.sync='raceOrderStatus'></common-race-order-modal>
	</view>
</template>

<script>
	import {
		orderDetail,
		deleteInventory,
		consumerIsConfirmOrder
	} from '../../api/order.js'
	export default {
		data() {
			return {
				cityId:null,
				userNotConfirmFlag: false,
				// 组件配置
				currentRetrieveOrderId: null,
				locationInfo: {
					longitude: null,
					latitude: null,
					name: null
				},
				allWeight:0,
				allPrice: 0,
				orderDetailInfo: {}
			};
		},
		onLoad(opt) {
			console.log("page信息",getCurrentPages())
			this.locationInfo.name = opt.receiveLocation
			this.locationInfo.latitude = opt.latitude
			this.locationInfo.longitude = opt.longitude
			this.currentRetrieveOrderId = opt.retrieveOrderId
			// this.getDetail()
		},
		onPullDownRefresh() {
					let prm = {
						retrieveOrderId: this.currentRetrieveOrderId
					}
					orderDetail(prm).then(res => {
						if (res.data.code === 200) {
							let {result} = res.data
							this.cityId = result.cityId
							this.orderDetailInfo = result
							uni.stopPullDownRefresh()
							this.allWeight = 0
							this.allPrice = 0
							if(result.orderDetails.length>0){
								for (let i = 0; i < result.orderDetails.length; i++) {
									this.allWeight += result.orderDetails[i].goodsWeight
									this.allPrice += result.orderDetails[i].goodsPrice
								}
							}
						}
					})
				
			
		},
		onShow(opt) {
			console.log("我是show",opt)
			this.getDetail()
		},
		methods: {
			closeModal(){
				this.userNotConfirmFlag = false
			},
			getDetail(){
				let prm = {
					retrieveOrderId: this.currentRetrieveOrderId
				}
				orderDetail(prm).then(res => {
					if (res.data.code === 200) {
						let {result} = res.data
						this.cityId = result.cityId
						this.orderDetailInfo = result
						this.allWeight = 0
						this.allPrice = 0
						if(result.orderDetails.length>0){
							for (let i = 0; i < result.orderDetails.length; i++) {
								this.allWeight += result.orderDetails[i].goodsWeight
								this.allPrice += result.orderDetails[i].goodsPrice
							}
						}
					}
				})
			},
			goToUrl(url){
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
			// 抢单
			raceOrderHandle() {
				this.raceOrderStatus = 0
				this.modalFlag = true
			},
			// 删除清单
			delInventory(retrieveOrderDetailId){
				uni.showModal({
					title:'是否删除清单1？',
					confirmColor: '#00D286',
					success:(res)=>{
						if(res.confirm){
							let prm = {
								retrieveOrderDetailId,
								retrieveOrderId:this.currentRetrieveOrderId
							}
							deleteInventory(prm).then(res=>{
								if(res.data.code === 200){
									uni.showToast({
										title:res.data.msg,
										duration: 2000,
										success:()=>{
											this.getDetail()
										}
									})
								}
							})
						}
					}
				})
			},
			// 跳转支付页面,判断用户是否核对了订单
			payHandle(){
				console.log(121212)
				let prm = {
					retrieveOrderId:this.currentRetrieveOrderId
				}
				consumerIsConfirmOrder(prm).then(res=>{
					if(res.data.code === 200){
						uni.navigateTo({
							url:'/pages/orderDetail/payInfo?retrieveOrderId='+this.currentRetrieveOrderId
						})
					}
				}).catch(err=>{
					if(err.data.code === 607){
						this.userNotConfirmFlag = true
						setTimeout(()=>{
							this.userNotConfirmFlag = false
						},1500)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	view {
		box-sizing: border-box;
	}

	.fillingInfo {
		position: relative;
		
		.showModal{
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,.53);
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99999;
			display: flex;
			align-items: center;
			justify-content: center;
			.modalDetail{
				width: 478upx;
				height: 350upx;
				background: #FFFFFF;
				border-radius: 17upx;
				image{
					width: 140upx;
					height: 132upx;
					margin: 62upx 0 50upx 160upx;
				}
				.tip{
					width: 100%;
					text-align: center;
					font-size: 34upx;
					color: #313131;
				}
			}
		}
		
		.top-box {
			background: #23CE85;
			width: 100%;
			height: 240upx;
			padding-top: 48upx;
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
		background: #F2F4F6;
		padding: 0 20upx 120upx 20upx;
		position: relative;

		.address-info {
			width: 100%;
			box-sizing: border-box;
			top: -90upx;
			position: relative;

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
			z-index: 9999;
			.all-price {
				display: flex;
				align-items: center;
				color: #393939;
				.unit{
					color: #FF5B56;
				}
				.price-num{
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
			margin: 0;
			}
		}
	}
</style>
