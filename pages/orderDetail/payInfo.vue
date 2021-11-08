<template>
	<view class="pay-info">
		<view class="money"><text class="unit">￥</text>{{payData.payMoney}}</view>
		<view class="title">付款金额</view>
		<view class="info-item">
			<view class="item-left">客户收款方式</view>
			<view>{{payData.paymentTypeName}}</view>
		</view>
		<view class="info-item" v-if="payData.payType!==1">
			<view class="item-left">收款账号</view>
			<view>{{payData.receiveAccount}}</view>
		</view>
		<view class="info-item" v-if="payData.payType!==1">
			<view class="item-left">收款姓名</view>
			<view>{{payData.receiveName}}</view>
		</view>
		<view class="line"></view>
		<view class="info-item">
			<view class="item-left">总重量</view>
			<view class="weight">{{payData.weight}}kg</view>
		</view>
		<view class="info-item">
			<view class="item-left">服务费</view>
			<view class="weight">{{payData.serviceTotalFee}}元</view>
		</view>
		<view class="info-item">
			<view class="item-left">订单编号</view>
			<view>{{payData.retrieveOrderId}}</view>
		</view>
		<button @click="goToPay" class="to-pay">去支付</button>
	</view>
</template>

<script>
	import {
		raceOrder,
		orderDetail,
		getPayInfo,
		pay
	} from '../../api/order.js'
	export default {
		data() {
			return {
				// 组件配置
				payData: {
					payMoney: 0,
					payType: 1,
					paymentTypeName: '',
					receiveAccount: '',
					receiveName: '',
					orderTime: null,
					weight: 0,
					paymentToken: null,
					serviceTotalFee: null,
					retrieveOrderId: null
				}
			};
		},
		onLoad(opt) {
			this.payData.retrieveOrderId = opt.retrieveOrderId
			let prm = {
				retrieveOrderId: this.payData.retrieveOrderId
			}
			getPayInfo(prm).then(res => {
				let {
					result
				} = res.data
				if (res.data.code === 200) {
					this.payData.payMoney = result.orderPrice
					this.payData.retrieveOrderId = result.retrieveOrderId
					this.payData.weight = result.weight
					this.payData.receiveName = result.bankCardHolder
					this.payData.receiveAccount = result.bankCardNumber
					this.payData.paymentToken = result.paymentToken
					this.payData.payType = result.paymentType
					this.payData.paymentTypeName = result.paymentTypeName
					this.payData.orderTime = result.orderTime
					this.payData.serviceTotalFee = result.serviceFee.serviceTotalFee
					console.log(this.payData)
				}
			})
		},
		methods: {
			goToPay() {
				// 支付方式为现金支付 
				if (this.payData.payType === 1) {
					let prm = {
						"paymentToken": this.payData.paymentToken,
						"payAmount": this.payData.payMoney,
						"payPassWord": '',
						"paymentType": this.payData.payType,
						"retrieveOrderId": this.payData.retrieveOrderId,
					}
					pay(prm).then(res => {
						uni.navigateTo({
							url: '/pages/orderDetail/payResult?code=200&paymentType='+this.payData.payType
						})
					}).catch(err => {
						if (err.data.code === 500) {
							uni.navigateTo({
								url: '/pages/orderDetail/payResult?code=500&paymentType='+this.payData.payType+'&orderId='+this.payData.retrieveOrderId
							})
						}

					})

				} else {
					console.log(111)
					uni.setStorageSync('paymentToken',this.payData.paymentToken)
					uni.navigateTo({
						url: `/pages/orderDetail/orderPay?payType=${this.payData.payType}&payMoney=${this.payData.payMoney}&retrieveOrderId=${this.payData.retrieveOrderId}`
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.pay-info {
		width: 100%;
		padding: 0 32upx;
		font-family: PingFangSC-Semibold, PingFang SC;
		box-sizing: border-box;

		.money {
			.unit {
				font-size: 40upx;
			}

			font-size: 52upx;
			font-weight: 600;
			color: #333333;
			text-align: center;
			margin: 56upx 0 20upx 0;
		}

		.title {
			text-align: center;
			font-size: 30upx;
			color: #9EA798;
			margin-bottom: 80upx;
		}

		.info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28upx;
			color: #272626;
			margin-top: 32upx;

			.item-left {
				color: #8B8B8B;
			}

			.weight {
				color: #FD7366;
			}
		}

		.line {
			width: 684upx;
			height: 2upx;
			background: #F0F0F0;
			margin: 40upx 0 15upx 0;
		}

		.to-pay {
			width: 686upx;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			line-height: 88upx;
			text-align: center;
			font-size: 34upx;
			color: #FFFFFF;
			position: absolute;
			bottom: 50upx;
			left: 0;
			margin-left: 32upx;
		}
	}
</style>
