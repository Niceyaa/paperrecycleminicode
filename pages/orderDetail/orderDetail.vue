<template>
	<view class="order-detail">
		<view class="map_box">
			<map @click="test"  id="navi_map" :longitude="locationInfo.longitude" :latitude="locationInfo.latitude" scale="12"
			 :markers="markers" :polyline="polyline"></map>
			<!-- <cover-view class="coverArea"></cover-view>s -->
		</view>
		<cover-view class="tip">
			<cover-image class="tip-img" src="../../static/imgs/tipIcon.png" mode=""></cover-image>
			<cover-view>取送路线示意，非导航规划，请遵守交通法则</cover-view>
		</cover-view>
		<view class="content">
			<view class="address-info">
				<view class="order-item">
					<view class="newTaskheader">
						<view class="header-left">
							<image src="../../static/imgs/timing.png" mode="" />
							<view class="time">{{arriveTime}}分钟</view>
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
							<view class="distance">{{orderDetailInfo.orderBaseInfo.distance?orderDetailInfo.orderBaseInfo.distance:''}}<text class="unit">km</text></view>
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
			<view class="order-info">
				<view class="order-header">
					<view class="title">
						<view>图片详情</view>
						<view class="sign"></view>
					</view>
				</view>
				<view class="order-content imgDetail">
					<image v-for="(img,idx) in orderDetailInfo.consumerPredictGoods.userPictures" :src="img" :key='idx' mode="" @click="$imgPreview(idx,orderDetailInfo.consumerPredictGoods.userPictures)"></image>
				</view>
			</view>
			<view v-if="status==='new'" class="footer-tab">
				<view @click="raceOrderHandle" class="race-order">立即抢单</view>
			</view>
			<view v-else class="footer-tab">
				<view class="turn-order" @click="cancelOrder">
					<image src="../../static/imgs/turnOrder.png" mode=""></image>
					<view>取消订单</view>
				</view>
				<view class="turn-order" @click="openURL">
					<image src="../../static/imgs/location.png" mode=""></image>
					<view>导航</view>
				</view>
				<view @click="goToUrl('/pages/orderDetail/fillingReceiptInfo?retrieveOrderId='+currentRetrieveOrderId+'&receiveLocation='+locationInfo.name+'&latitude='+locationInfo.latitude+'&longitude='+locationInfo.longitude)" class="input-info">填写收货信息</view>
			</view>
		</view>
		<!-- <view class="text_box">
			<view class="text">{{distance}}</view>
			<view class="text">{{cost}}</view>
			<button v-if="hidden" type="warning" @click="openURL">打开app</button>
			<view class="detail_button" bindtouchstart="goDetail">详情</view>
		</view> -->
		<common-race-order-modal :isShowSeeSee='false' :isShowBackList='true' :modalRefreshFlag.sync='modalRefreshFlag' :retrieveOrderId='currentRetrieveOrderId' :modalFlag.sync='modalFlag' :raceOrderStatus.sync='raceOrderStatus'></common-race-order-modal>
	</view>
</template>

<script>
	const amapFile = require('@/lib/amap/amap-wx.js');
	const Coordinate = require('@/lib/Coordinate.js');
	import {
		raceOrder,
		cancelOrder,
		orderDetail
	} from '../../api/order.js'
	export default {
		data() {
			return {
				// 组件配置
				modalRefreshFlag: false,
				currentRetrieveOrderId: null,
				modalFlag: false,
				raceOrderStatus: 0,
				
				
				status: 'new',
				markers: null,
				// steps: {},
				// distance: '',
				// cost: '',
				polyline: [],
				locationInfo: {
					longitude: null,
					latitude: null,
					name: null
				},
				orderDetailInfo:{},
				arriveTime: 0
			};
		},
		onLoad(opt) {
			var that = this;
			console.log('opt', opt)
			this.locationInfo.name = opt.receiveLocation
			this.locationInfo.latitude = opt.latitude
			this.locationInfo.longitude = opt.longitude
			this.currentRetrieveOrderId = opt.retrieveOrderId
			this.status = opt.status

			let prm = {
				retrieveOrderId: this.currentRetrieveOrderId
			}
			orderDetail(prm).then(res => {
				if (res.data.code === 200) {
					this.orderDetailInfo = res.data.result
					// let turnResult = Coordinate.transformFromBaiduToGCJ(res.data.result.orderBaseInfo.receiveAddressLatitude,res.data.result.orderBaseInfo.receiveAddressLongitude)
					// let turnResult = Coordinate.transformFromBaiduToGCJ(26.6795,106.648047)
					this.markers = [{
						iconPath: "../../static/imgs/startAddress.png",
						id: 0,
						latitude: opt.latitude,
						longitude: opt.longitude,
						width: 30,
						height: 45
					}, {
						iconPath: "../../static/imgs/endAddress.png",
						id: 0,
						latitude: res.data.result.orderBaseInfo.receiveAddressLatitude,
						longitude: res.data.result.orderBaseInfo.receiveAddressLongitude,
						/* latitude:turnResult.latitude,
						longitude:turnResult.longitude, */
						/* latitude:26.679536,
						longitude:106.648039, */
						width: 30,
						height: 45
					}]
					// console.log("mark",turnResult)
					const myAmapFun = new amapFile.AMapWX({
						key: this.$key
					});
					myAmapFun.getRidingRoute({
						// origin: '26.722312,106.659038',
						origin: `${opt.longitude},${opt.latitude}`,
						// destination: '26.613346,106.678963',
						destination: `${res.data.result.orderBaseInfo.receiveAddressLongitude},${res.data.result.orderBaseInfo.receiveAddressLatitude}`,
						success: (data) => {
							console.log("规划", data)
							this.arriveTime = parseInt(data.paths[0].duration/60)
							var points = [];
							if (data.paths && data.paths[0] && data.paths[0].steps) {
								var steps = data.paths[0].steps;
								for (var i = 0; i < steps.length; i++) {
									var poLen = steps[i].polyline.split(';');
									for (var j = 0; j < poLen.length; j++) {
										points.push({
											longitude: parseFloat(poLen[j].split(',')[0]),
											latitude: parseFloat(poLen[j].split(',')[1])
										})
									}
								}
							}
							this.polyline = [{
								points: points,
								color: "#23CE85",
								width: 8,
								arrowLine: true
							}]
							if (data.paths[0] && data.paths[0].distance) {
								this.distance = data.paths[0].distance + '米'
							}
							if (data.taxi_cost) {
								this.cost = '打车约' + parseInt(data.taxi_cost) + '元'
							}

						},
						fail: function(info) {
							console.log("失败了", info)
						}
					})
				}
			})
			},
		methods: {
			test(ev){
				console.log(11,ev)
			},
			cancelOrder(){
				uni.showModal({
					title:'取消订单',
					content:'您确认取消该订单吗？',
					cancelText:'我在想想',
					confirmColor:'#4CD964',
					confirmText:'确认取消',
					success:(e)=>{
						if(e.confirm){
							let prm = {
								retrieveOrderId:this.currentRetrieveOrderId
							}
							cancelOrder(prm).then(res=>{
								uni.showToast({
									title:'取消成功'
								})
								setTimeout(()=>{
									uni.navigateTo({
										url:'/pages/index/index?status=wait'
									})()
								})
							})
						}
					}
				})
			},
			makePhoneCall(){
				uni.makePhoneCall({
					phoneNumber:this.orderDetailInfo.phone,
					success(res) {
						console.log('调用电话api',res)
					}
				})
			},
			openURL() {
				let a = wx.createMapContext('navi_map')
				a.openMapApp({
					longitude: this.orderDetailInfo.orderBaseInfo.receiveAddressLongitude,
					latitude: this.orderDetailInfo.orderBaseInfo.receiveAddressLatitude,
					destination: this.orderDetailInfo.orderBaseInfo.addressDetail,
					success: (success) => {
						console.log("success", success)
					},
					fail: (fail) => {
						console.log("fail", fail)
					},
					complete: (com) => {
						console.log("complete", complete)
					}
				})
			},
			/* zoomChange(ev) {
				console.log('缩放信息', ev)
			},
			zoomTap(ev) {
				console.log("con", ev)
				this.markers.push({
					iconPath: "../../static/mapicon_navi_s.png",
					id: 0,
					latitude: ev.detail.latitude,
					longitude: ev.detail.longitude,
					width: 23,
					height: 33
				})
				const myAmapFun = new amapFile.AMapWX({
					key: this.$key
				});
				myAmapFun.getRegeo({
					location: `${ev.detail.longitude},${ev.detail.latitude}`,
					success: function(data) {
						console.log('检索数据', data)
					},
					fail: function(err) {
						console.log("错误信息", err)
					}
				})
			}, */
			
			// 抢单
			raceOrderHandle() {
				this.raceOrderStatus = 0
				this.modalFlag = true
			},
			// 页面跳转
			// url:'/pages/orderDetail/orderDetail?status='+statusStr+'&retrieveOrderId='+retrieveOrderId+'&receiveLocation='+name+'&latitude='+receiveLocation.latitude+'&longitude='+receiveLocation.longitude
			// goToUrl(statusStr,retrieveOrderId,name,latitude,longitude){
			goToUrl(url){
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="less">
	.order-detail {
		position: relative;

		.tip {
			position: absolute;
			top: 16upx;
			left: 0;
			width: 702upx;
			margin: 0 24upx;
			height: 64upx;
			background: #F7F1E1;
			border-radius: 32upx;
			display: flex;
			padding-left: 20upx;
			align-items: center;
			font-size: 26upx;
			box-sizing: border-box;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #C19550;

			.tip-img {
				width: 32upx;
				height: 32upx;
				margin: 0 12upx 0 0;
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
			position: relative;
			margin-top: -84upx;

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

			.imgDetail {
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

			.turn-order {
				display: flex;
				align-items: center;
				color: #505753;

				image {
					width: 44upx;
					height: 48upx;
					margin-right: 12upx;
				}
			}

			.input-info {
				width: 380upx;
				height: 88upx;
				background: #23CE85;
				border-radius: 12upx;
				line-height: 88upx;
				text-align: center;
				color: #fff;
			}

			.race-order {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				text-align: center;
				color: #fff;
				background: #23CE85;
				border-radius: 12upx;
			}
		}
	}


	/* .map_box {
		position: absolute;
		top: 0;
		bottom: 90px;
		left: 0px;
		right: 0px;
	} */

	#navi_map {
		width: 100%;
		height: 700upx;
	}

	.text_box {
		position: absolute;
		height: 90px;
		bottom: 0px;
		left: 0px;
		right: 0px;
	}

	.text_box .text {
		margin: 15px;
	}

	.detail_button {
		position: absolute;
		bottom: 30px;
		right: 10px;
		padding: 3px 5px;
		color: #fff;
		background: #0091ff;
		width: 50px;
		text-align: center;
		border-radius: 5px;
	}

	.coverArea {
		position: absolute;
		top: calc(50% - 250upx);
		left: calc(50% - 250upx);
		width: 500upx;
		height: 500upx;
		background: rgba(0, 0, 0, .4);
		border-radius: 50%;
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
