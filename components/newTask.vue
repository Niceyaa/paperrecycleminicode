<template>
	<view class="big-container">
		<view>{{refresh.msg}}</view>
		<!-- <view class="litter-item" :style="{'top':distance}"> -->
		<view class="litter-item">
			<!-- <view class="refreshBox">
				<image src="../static/imgs/loading.gif" mode=""></image>
			</view> -->
			<!-- <scroll-view class="newTask" @touchstart="refresh.touchStart" @touchend="refresh.touchEnd"
				@touchmove="refresh.touchMove"> -->
				<!-- <scroll-view class="newTask" @touchstart="touchStart" @touchend="touchEnd"
				@touchmove="touchMove"> -->
				<scroll-view class="newTask">
				<!-- <map v-show="false" id="test_map" :longitude="receiveLocation.longitude" :latitude="receiveLocation.latitude" scale="12"></map> -->
				<!-- <view @click="goToUrl('/pages/orderDetail/orderDetail?status='+raceOrderStatusStr+'&retrieveOrderId='+item.retrieveOrderId+'&receiveLocation='+receiveLocation.name+'&latitude='+receiveLocation.latitude+'&longitude='+receiveLocation.longitude)" -->
				<view v-if="orderData.length>0"
					@click="goToDetail(raceOrderStatusStr,item.retrieveOrderId,receiveLocation.name,receiveLocation.latitude,receiveLocation.longitude,item.orderState,item.orderStateNameRU)"
					class="order-item" v-for="item in orderData" :key='item.retrieveOrderId'>
					<!-- 新任务和待收货公用头部 -->
					<view v-if="['new','wait'].includes(status)" class="newTaskheader">
						<view class="header-left">
							<image src="../static/imgs/timing.png" mode="" />
							<view class="time">{{item.requireTimeStr}}</view>
							<!-- <view class="time">3333</view> -->
							<view>到达</view>
						</view>
						<view class="header-right">
							<view>预估重量</view>
							<view class="weight">{{item.predictWeight}}</view>
							<view>kg</view>
						</view>
					</view>
					<!-- 已完成头部 -->
					<view v-else class="newTaskheader waitTaskheader">
						<view class="header-left">
							<image style="width: 42upx;height: 42upx;" src="../static/imgs/orderNumber.png" mode="" />
							<view style="margin-right: 6upx;">订单编号</view>
							<view>{{item.retrieveOrderId}}</view>
						</view>
						<view class="header-right">{{item.orderStateNameRU}}</view>
					</view>
					<view class="newTaskmiddle">
						<view class="middle-left">
							<image src="../static/imgs/endLoc.png" mode=""></image>
							<view class="distance">{{item.distance?item.distance:' '}}<text class="unit">km</text>
							</view>
							<!-- <view class="line"></view>
					<image src="../static/imgs/startLoc.png" mode=""></image>
					<view class="text">我的位置</view> -->
						</view>
						<view class="middle-right">
							<view class="storefront">{{item.addressBase}}</view>
							<view class="address">{{item.addressDetail?item.addressDetail:' '}}</view>
							<!-- <view class="myAddress">{{receiveLocation.name}}</view> -->
						</view>
					</view>
					<view v-if="newStatus!=='finish'" class="date-wrapper">
						<view>预约时间：</view>
						<view class="time">{{item.predictComeStartTime}}</view>
					</view>
					<!-- 新任务底部按钮 -->
					<view @click.stop.prevent="raceOrderHandle(item.retrieveOrderId)" v-if="newStatus==='new'"
						class="newTaskfooter">立即抢单</view>
					<!-- 待收货底部按钮 -->
					<view v-if="newStatus==='wait'" class="waitTaskfooter">
						<button @click.stop.prevent="cancelOpen(item)" class="item">取消订单</button>
						<button
							@click.stop.prevent="openUrl(item.receiveAddressLatitude,item.receiveAddressLongitude,item.addressDetail)"
							class="item">导航</button>
						<button
							@click.stop.prevent="goToUrl('/pages/orderDetail/fillingReceiptInfo?retrieveOrderId='+item.retrieveOrderId+'&receiveLocation='+receiveLocation.name+'&latitude='+receiveLocation.latitude+'&longitude='+receiveLocation.longitude)"
							class="inputInfo ">立即收货</button>
					</view>
					<!-- 已完成底部 -->
					<view v-if="newStatus==='finish'" class="finishTaskfooter">
						<view v-if="item.orderState!==99" class="left-item">收货时间：{{item.paymentTime}}</view>
						<view v-if="item.orderState!==99" class="right-item">实际重量<text class="finishNum">{{item.weight}}</text>kg</view>
						<view v-if="item.orderState===99" class="right-item" style="text-align: right;width: 100%;">预估重量<text class="finishNum">{{item.predictWeight}}</text>kg</view>
						<!-- 实际重量<text class="finishNum">{{item.weight}}</text>kg -->
					</view>
				</view>
				<uni-load-more v-if="raceOrderStatusStr!=='new'&&isLoadData && orderData.length<total&&pageSize<total" :status="loadingStatus" :contentText="contentText"></uni-load-more>
				<common-race-order-modal :modalRefreshFlag.sync='modalRefreshFlag'
					:retrieveOrderId='currentRetrieveOrderId' :modalFlag.sync='modalFlag'
					:raceOrderStatus.sync='raceOrderStatus'></common-race-order-modal>
				<view v-if="orderData.length<=0&&isLoadData||systemError" class="withoutOrder">
					<image v-if="!systemError" src="../static/imgs/withoutOrder.png" mode=""></image>
					<image v-else src="../static/imgs/systemErr.png" mode=""></image>
					<view class="tip">{{systemError?'系统出错,请刷新重试':'暂无订单'}}</view>
					<view class="refresh-btn" @click="refreshHandle">刷新</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script module='refresh' lang="wxs">
	var startY = 0
	function touchStart(ev,ins){
		console.log("Ins对象是啥",ins)
		startY = ev.changedTouches[0].clientY
	}
	function touchEnd(ev,ins){
		if(ev.changedTouches[0].clientY-startY>=60){
			ins.selectComponent('.litter-item').setStyle({
				top:'60px',
			})
		}else{
			ins.selectComponent('.litter-item').setStyle({
				top:'0',
			})
		}
	}
	function touchMove(ev,ins){
		if(ev.changedTouches[0].clientY<startY){
			ins.selectComponent('.litter-item').setStyle({
				top:'0',
			})
		}else{
			var dis = ev.changedTouches[0].clientY - startY
			ins.selectComponent('.litter-item').setStyle({
				top:dis+'px',
			})
		}
	}
	module.exports = {
		touchEnd: touchEnd,
		touchStart: touchStart,
		touchMove: touchMove
	}
</script>
<script>
	var amapFile = require('@/lib/amap/amap-wx.js');
	// var bmapFile = require('@/lib/bmap/bmap-wx.min.js');
	import {
		newTaskOrder,
		waitReceiveOrder,
		finishedOrder,
		raceOrder,
		cancelOrder
	} from '../api/order.js'
	export default {
		data() {
			return {
				total:null,
				// 系统出错标识
				systemError:false,
				
				touchStartDistance: 0,
				touchEndDistance: 0,
				distance: 0,

				// 弹窗关闭刷新页面
				modalRefreshFlag: false,
				triggered: false,
				raceOrderStatus: 0,
				modalFlag: false,
				raceOrderStatusStr: 'new',
				currentRetrieveOrderId: -1,
				// loadingStatus: more,loading,noMore
				loadingStatus: 'more',
				// loadText 上拉文字提示
				contentText: {
					contentdown: '上拉加载更多内容',
					contentrefresh: '正在赶来的路上...',
					contentnomore: '到达尽头了哦'
				},
				statusArray: ['new', 'wait', 'finish'],
				count: 5,
				pageNum: 1,
				pageSize: 10,
				orderData: [],
				receiveLocation: {
					name: '定位中',
					latitude: null,
					longitude: null
				},
				isLoadData: false
			};
		},
		computed: {
			newLoadFlag() {
				return this.$props.loadFlag
			},
			newStatus() {
				this.systemError = false
				return this.$props.status
			},
			newRefresh() {
				this.systemError = false
				return this.$props.refreshFlag
			}
		},
		watch: {
			modalRefreshFlag(val) {
				if (val) {
					this.loadingStatus = 'more'
					this.loadingStatus = 'more'
					this.orderData = []
					this.isLoadData = false
					this.getList(1, this.raceOrderStatusStr)
					this.$emit("update:refreshFlag", false)
				}
			},
			newLoadFlag(val) {
				if(this.raceOrderStatusStr==='new'){
					return
				}
				if (val) {
					// 表示没有更多数据了
					console.log("pageSize<total",this.isLoadData && this.raceOrderStatusStr!=='new'&&this.orderData.length<this.total&&this.pageSize<this.total)
					if (this.loadingStatus === 'noMore') {
						this.$emit('update:loadFlag', false)
						return
					} else {
						console.log(1111)
						this.loadingStatus = 'loading'
						// 获取数据并且拼接数据，获取成功之后设置值为more或者finish
						this.pageNum++
						this.getList(this.pageNum,this.newStatus,true)
					}
				}

			},
			newStatus(val) {
				/* uni.vibrateLong({
					success:success=>{
						console.log('success',success)
					},
					fail:fail=>{
						console.log('fail',fail)
					}
				}) */
				console.log("val", val)
				if (this.statusArray.includes(val)) {
					this.loadingStatus = 'more'
					this.isLoadData = false
					this.pageNum = 1
					this.isLoadData = false
					this.distance = 0
					this.raceOrderStatusStr = val
					this.orderData = []
					uni.showLoading({
						title: '加载中',
						success: () => {
							this.pageNum = 1
							this.getList(this.pageNum, val)
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
						}
					})
				}
			},
			newRefresh(val) {
				if (val) {
					this.loadingStatus = 'more'
					this.pageNum = 1
					this.isLoadData = false
					this.orderData = []
					this.getList(1, this.raceOrderStatusStr)
					// uni.hideLoading()
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					})
					this.$emit('update:refreshFlag', false)
					/* uni.showLoading({
						title: '刷新中',
						success: () => {
							this.orderData = []
							this.getList(1, this.raceOrderStatusStr)
							uni.hideLoading()
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
							this.$emit('update:refreshFlag', false)
						}
					}) */
				}
			}
		},
		props: {
			loadFlag: {
				type: Boolean,
				default: false
			},
			status: {
				type: String,
				default: 'new'
			},
			refreshFlag: {
				type: Boolean,
				default: false
			},
			scrollTop0: {
				type: Boolean,
				default: true
			},
			isLoadPageData: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			if (uni.getStorageSync('loginStatus')) {
				var amapFn = new amapFile.AMapWX({
					key: this.$key
				})
				console.log('amapFn',amapFn)
				amapFn.getRegeo({
					success: res => {
						this.receiveLocation.name = res[0].name
						this.receiveLocation.latitude = res[0].latitude
						this.receiveLocation.longitude = res[0].longitude
					}
				})
				// this.getList(this.pageNum, this.newStatus)
				console.log('我是onload', this.newStatus)
			}
		},
		methods: {
			// 订单取消
			cancelOpen(info){
				uni.showModal({
					title:'取消订单',
					content:'您确认取消该订单吗？',
					cancelText:'我在想想',
					confirmColor:'#4CD964',
					confirmText:'确认取消',
					success:(e)=>{
						if(e.confirm){
							let prm = {
								retrieveOrderId:info.retrieveOrderId
							}
							cancelOrder(prm).then(res=>{
								uni.showToast({
									title:'取消成功'
								})
								this.getList(1, this.raceOrderStatusStr)
							})
						}
					}
				})
			},
			// 定义获取订单列表方法
			getList(pageNum, status, loadMore) {
				this.isLoadData = false
				this.$emit('update:scrollTop0', false)
				// 定义请求参数
				const prm = {
					pageSize: this.pageSize,
					pageNum
				}
				uni.showLoading({
					title: '加载中'
				})
				// 新任务
				if (status === 'new') {
					newTaskOrder(prm).then(res => {
						this.total = res.data.result.total
						this.isLoadData = true
						this.modalRefreshFlag = false
						this.distance = 0
						this.$emit('update:scrollTop0', true)
						this.$emit('update:isLoadPageData', true)
						// this.orderData = this.orderData.concat(res.data.result.list)
						this.orderData = loadMore ? this.orderData.concat(res.data.result.list) : res.data.result
							.list
						console.log("orderdata", this.orderData, loadMore)
						uni.showToast({
							title: res.data.result.msg
						})
						uni.hideLoading()

						if (loadMore) {
							if (this.total === this.orderData.length) {
								// 表示后续还有更多数据
								this.loadingStatus = 'noMore'
								this.$emit('update:loadFlag', false)
							} else {
								this.loadingStatus = 'more'
								this.$emit('update:loadFlag', false)
							}
						}
					}).catch(err => {
						uni.hideLoading()
						this.$emit('update:scrollTop0', true)
						if(!err.data||!err.data.code){
							this.systemError = true
						}
					})
				}
				// 待收货
				else if (status === 'wait') {
					waitReceiveOrder(prm).then(res => {
						this.total = res.data.result.total
						this.isLoadData = true
						this.modalRefreshFlag = false
						this.distance = 0
						this.$emit('update:scrollTop0', true)
						this.$emit('update:isLoadPageData', true)
						this.orderData = loadMore ? this.orderData.concat(res.data.result.list) : res.data.result
							.list
						uni.showToast({
							title: res.data.result.msg
						})
						uni.hideLoading()
						// if (loadMore) {
							if (this.total === this.orderData.length) {
								// 表示后续还有更多数据
								console.log(2222)
								this.loadingStatus = 'noMore'
								this.$emit('update:loadFlag', false)
							} else {
								this.loadingStatus = 'more'
								this.$emit('update:loadFlag', false)
							}
						// }
					}).catch(err => {
						uni.hideLoading()
						this.$emit('update:scrollTop0', true)
						if(!err.data||!err.data.code){
							this.systemError = true
						}
					})
				}
				// 已完成
				else if (status === 'finish') {
					finishedOrder(prm).then(res => {
						this.total = res.data.result.total
						this.isLoadData = true
						this.distance = 0
						this.$emit('update:scrollTop0', true)
						this.$emit('update:isLoadPageData', true)
						this.modalRefreshFlag = false
						this.orderData = loadMore ? this.orderData.concat(res.data.result.list) : res.data.result
							.list
						console.log("this.orderData",this.orderData)
						console.log("loadMore",loadMore)
						console.log("orderdata", this.orderData)
						uni.showToast({
							title: res.data.result.msg
						})
						uni.hideLoading()
						// if (loadMore) {
							// if (pageNum === res.data.result.pages) {
							if (this.total === this.orderData.length) {
								// 表示后续还有更多数据
								this.loadingStatus = 'noMore'
								this.$emit('update:loadFlag', false)
							} else {
								this.loadingStatus = 'more'
								this.$emit('update:loadFlag', false)
							}
						// }
					}).catch(err => {
						uni.hideLoading()
						this.$emit('update:scrollTop0', true)
						if(!err.data||!err.data.code){
							this.systemError = true
						}
					})
				}
			},
			refreshHandle() {
				this.$emit('update:refreshFlag', true)
			},
			// 跳转订单详情
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			goToDetail(statusStr, retrieveOrderId, name, latitude, longitude, orderState, orderStateName) {
				let url = null
				if (statusStr === 'finish') {
					url = '/pages/orderDetail/alreadyFinishedOrderDetail?status=' + statusStr + '&retrieveOrderId=' +
						retrieveOrderId + '&receiveLocation=' + name + '&latitude=' + latitude + '&longitude=' +
						longitude + '&orderState=' + orderState+'&orderStateName='+orderStateName
				} else {
					url = '/pages/orderDetail/orderDetail?status=' + statusStr + '&retrieveOrderId=' + retrieveOrderId +
						'&receiveLocation=' + name + '&latitude=' + latitude + '&longitude=' + longitude
				}
				uni.navigateTo({
					url
				})
				// goToUrl(statusStr,retrieveOrderId,name,latitude,longitude){
			},
			// 抢单
			raceOrderHandle(id) {
				this.raceOrderStatus = 0
				this.currentRetrieveOrderId = id
				this.modalFlag = true
			},
			// 打开第三方导航app
			openUrl(latitude, longitude, address) {
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					address: address,
					success(res) {
						console.log("打开成功", res)
					}
				})
			},

			touchStart(ev) {
				this.touchStartDistance = ev.changedTouches[0].clientY
				console.log("start", ev.changedTouches[0].clientY)
			},
			touchEnd(ev) {
				console.log("end", ev.changedTouches[0].clientY - this.touchStartDistance)
				if (this.$props.scrollTop0) {
					if (ev.changedTouches[0].clientY - this.touchStartDistance >= 60) {
						this.distance = 60 + 'px'
						this.getList(1, this.raceOrderStatusStr)
					} else {
						console.log(">=60")
						this.distance = 0
					}
				}

			},
			touchMove(ev) {
				console.log('scrollTop0', this.$props.scrollTop0)
				if (this.$props.scrollTop0) {
					if (ev.changedTouches[0].clientY < this.touchStartDistance) {
						this.distance = 0
					} else {
						let dis = ev.changedTouches[0].clientY - this.touchStartDistance
						this.distance = dis + 'px'
						console.log('我执行了吗', this.distance)
					}
				}
				return
			}
		}
	}
</script>
<style lang="less" scoped>
	.big-container {
		padding-top: 166upx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
	}

	.litter-item {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;

		.refreshBox {
			position: absolute;
			top: -60px;
			left: 0;
			height: 60px;
			width: 100%;
			z-index: 999;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 60px;
				height: 60px;
			}
		}
	}

	.newTask {
		-margin-top: 160upx;
		font-family: PingFangSC-Regular, PingFang SC;
		width: 100%;
		min-height: 100%;
		-height: calc(100% - 108upx);
		box-sizing: border-box;
		padding: 24upx 20upx 140upx 20upx;
		background: #F2F4F6;
		position: relative;

		.order-item {
			width: 100%;
			padding: 16upx 32upx 40upx 32upx;
			color: #87898F;
			font-size: 28upx;
			box-sizing: border-box;
			margin-bottom: 24upx;
			background: #fff;
			border-radius: 12upx;

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

			.waitTaskheader {
				align-items: center;
				justify-content: space-between;

				.header-right {
					color: #0FB06C;
					font-size: 26upx;
				}
			}

			.newTaskmiddle {
				width: 100%;
				-padding: 52upx 0;
				padding: 52upx 0 26upx 0;
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
						-margin-bottom: 60upx;
					}

					.myAddress {
						color: #222222;
						font-size: 32upx;
					}
				}
			}

			.date-wrapper {
				width: 646upx;
				height: 80upx;
				background: #F3FFFA;
				border-radius: 8upx;
				display: flex;
				align-items: center;
				padding: 0 20upx 0 40upx;
				font-size: 26upx;
				margin-bottom: 26upx;
				color: #23CE85;
				box-sizing: border-box;

				.time {
					color: #515151;
				}
			}

			.newTaskfooter {
				text-align: center;
				width: 646upx;
				height: 88upx;
				line-height: 88upx;
				background: linear-gradient(143deg, #15E8AB 0%, #23CE85 100%);
				border-radius: 12upx;
				font-size: 34upx;
				color: #fff;
			}

			.waitTaskfooter {
				color: #fff;
				display: flex;
				justify-content: space-between;
				button{
					flex: 0.3;
				}
				.item {
					-width: 148upx;
					height: 88upx;
					border-radius: 12upx;
					border: 2upx solid #C9D8D8;
					text-align: center;
					line-height: 88upx;
					font-size: 28upx;
					color: #505753;
				}

				.inputInfo {
					-width: 314upx;
					height: 88upx;
					background: #27CE85;
					border-radius: 12upx;
					text-align: center;
					line-height: 88upx;
					font-size: 28upx;
					color: #FFFFFF;
				}
			}

			.finishTaskfooter {
				-text-align: right;
				width: 646upx;
				border-top: 2upx solid #F0F0F0;
				color: #666666;
				font-size: 26upx;
				padding-top: 20upx;
				align-items: baseline;
				display: flex;
				justify-content: space-between;

				.finishNum {
					font-size: 48upx;
					font-weight: 600;
					color: #FD7366;
				}
			}
		}

		.withoutOrder {
			width: 100%;
			box-sizing: border-box;

			image {
				width: 500upx;
				height: 346upx;
				margin: 152upx 0 0 100upx;
			}

			.tip {
				width: 100%;
				color: #4F4F4F;
				font-size: 30upx;
				margin: 10upx 0 0 0;
				text-align: center;
			}

			.refresh-btn {
				width: 262upx;
				height: 88upx;
				background: #27CE85;
				border-radius: 12upx;
				text-align: center;
				line-height: 88upx;
				margin: 58upx 0 0 220upx;
				font-size: 34upx;
				color: #fff;
			}
		}

	}
</style>
