<template>
	<view class="orderStatistic">
		<view class="header-nav">
			<view class="nav-left">
				<view @click="changeStatisticType(0)" :class="{'nav-item':true,'active':statisticType===0}">
					<view class="label">日单统计</view>
					<view class="sign"></view>
				</view>
				<view @click="changeStatisticType(1)" :class="{'nav-item':true,'active':statisticType===1}">
					<view class="label">月单统计</view>
					<view class="sign"></view>
				</view>
			</view>
			<view class="rank-nav" @click="show">
				<image src="../../../static/imgs/rankIcon.png" mode=""></image>
				<view>排行榜</view>
			</view>
		</view>
		<view v-if="statisticType===0" class="date-wrapper">
			<picker class="date-picker" mode="date" fields="day" :value="searchInfo.date" @change="bindDateChange">
				<view class="uni-input">{{searchInfo.date}}</view>
			</picker>
			<image src="../../../static/imgs/downSelect.png" mode=""></image>
		</view>
		<view v-else class="date-wrapper">
			<picker class="date-picker" mode="date" fields="month" :value="searchInfo.monthDate" @change="bindMonthDateChange">
				<view class="uni-input">{{searchInfo.monthDate}}</view>
			</picker>
			<image src="../../../static/imgs/downSelect.png" mode=""></image>
		</view>
		<view class="content">
			<view class="finished">完成订单</view>
			<view class="finishedNum">{{orderData.finishOrderNum}}<text>单</text></view>
			<view class="other-statistic">
				<view class="statistic-item">
					<view class="title">取消订单</view>
					<view class="num">{{orderData.cancelOrderNum}}<text>单</text></view>
				</view>
				<!-- <view class="statistic-item">
					<view class="title">收货里程</view>
					<view class="num">12<text>KM</text></view>
				</view> -->
				<view class="statistic-item">
					<view class="title">订单总重</view>
					<view class="num">{{orderData.allWeight}}<text>KG</text></view>
				</view>
			</view>
			<view class="tip-info" @click="goToAccount">
				<view>收入相关信息请前往“我的账户”查看</view>
				<image src="../../../static/imgs/rightIcon.png" mode=""></image>
			</view>
		</view>
		<view class="bottom">
			<image src="../../../static/imgs/arrowLeft.png" mode=""></image>
			<view>我是有底线的</view>
			<image src="../../../static/imgs/arrowRight.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import { orderStatistic } from '../../../../api/account.js'
	export default {
		data() {
			return {
				searchInfo: {
					date: this.$formatDate(new Date()),
					// date: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`,
					monthDate: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}`
				},
				statisticType:1,//0 日单统计  1 月单统计
				orderData:{
					finishOrderNum:1100,
					cancelOrderNum:12,
					allWeight:10000
				}
			};
		},
		onLoad(){
			this.getList(this.searchInfo.date)
		},
		methods:{
			show(){
				uni.showToast({
					title:'功能正在开发中',
					icon:'none'
				})
			},
			changeStatisticType(n){
				this.statisticType = Number(n)
				let date = this.statisticType===0?this.searchInfo.date:this.searchInfo.monthDate+'-01'
				this.getList(date)
			},
			getList(date){
				let prm = {
					date:date,
					type:this.statisticType
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				orderStatistic(prm).then(res=>{
					uni.hideLoading()
					let {result} = res.data
					this.orderData.finishOrderNum = result.retrieveOrderAmount
					this.orderData.cancelOrderNum = result.cancelRetrieveOrderNumber
					this.orderData.allWeight = result.retrieveStockTotal
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			bindMonthDateChange(e){
				this.searchInfo.monthDate = e.detail.value
				this.getList(this.searchInfo.monthDate + '-01')
				console.log(e)
			},
			bindDateChange(e){
				this.searchInfo.date = e.detail.value
				this.getList(this.searchInfo.date)
				console.log(e)
			},
			goToAccount(){
				uni.navigateTo({
					url:'/personalPackage/pages/my/myAccount/myAccount'
				})
			}
		}
	}
</script>

<style lang="less">
	.orderStatistic {
		width: 100%;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.header-nav {
			width: 750upx;
			height: 106upx;
			background: #FFFFFF;
			box-shadow: 0px 6upx 10upx 0px rgba(15, 94, 60, 0.08);
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			padding: 0 32upx 0 32upx;
			border-top: 2upx solid #eee;
			align-items: center;

			.nav-left {
				display: flex;
				font-size: 30upx;
				color: #666666;
				padding-top: 38upx;

				.nav-item {
					margin-right: 64upx;
					text-align: center;

					.sign {
						width: 34upx;
						height: 10upx;
						background: #23CE85;
						border-radius: 5upx;
						margin: 18upx auto 0 auto;
						display: none;
					}

					&.active {
						font-size: 34upx;
						color: #333333;
						font-weight: 600;

						.sign {
							display: block;
						}
					}
				}
			}

			.rank-nav {
				display: flex;
				color: #333333;
				font-size: 30upx;
				align-items: center;

				image {
					width: 24upx;
					height: 26upx;
					margin-right: 14upx;
				}
			}
		}

		.date-wrapper {
			margin: 40upx 0 40upx 32upx;
			width: 190upx;
			height: 56upx;
			border-radius: 33upx;
			border: 2upx solid #DFDFDF;
			display: flex;
			justify-content: center;
			// padding: 0 18upx 0 28upx;
			-justify-content: space-between;
			box-sizing: border-box;
			align-items: center;
			font-size: 28upx;
			color: #333;

			image {
				margin-left: 14upx;
				width: 14upx;
				height: 8upx;
			}
		}

		.content {
			width: 686upx;
			height: 417upx;
			margin-left: 32upx;
			box-sizing: border-box;
			background: url(../../../static/imgs/orderStatisticBgc.png);
			background-size: 100% 100%;
			padding: 42upx 0 0 54upx;
			color: #CCF3E2;
			font-size: 26upx;
			position: relative;
			box-shadow: 0px 8upx 20upx 0px rgba(18, 99, 64, 0.24);
			border-radius: 16upx;
			.finishedNum {
				font-size: 64upx;
				color: #fff;
				margin: 6upx 0 30upx 0;

				text {
					font-size: 24upx;
					color: #CCF3E2;
				}
			}

			.other-statistic {
				display: flex;

				.statistic-item {
					margin-right: 118upx;

					.num {
						margin-top: 14upx;
						font-size: 48upx;
						color: #fff;

						text {
							font-size: 24upx;
							color: #CCF3E2;
						}
					}

					&:last-child {
						margin: 0;
					}
				}
			}

			.tip-info {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 100upx;
				width: 100%;
				display: flex;
				box-sizing: border-box;
				background-color: rgba(30, 184, 119, 0.57);
				align-items: center;
				justify-content: space-between;
				padding: 0 30upx 0 36upx;
				border-radius: 0px 0px 16upx 16upx;

				image {
					width: 12upx;
					height: 20upx;
				}
			}
		}
		.bottom{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #C0C5D3;
			font-size: 26upx;
			margin-top: 96upx;
			image{
				width: 76upx;
				height: 6upx;
				margin: 0 10upx;
			}
		}
	}
</style>
