<template>
	<view class="recharge">
		<view class="top-container">
			<view class="recharge-header">
				<view class="title">充值金额</view>
				<navigator url="/personalPackage/pages/my/myAccount/recharge/rechargeRecord">充值记录</navigator>
			</view>
			<view class="num-list">
				<view @click="changeNum(item)" :class="{'active':item.id===currentNumId}" v-for="item in isHaveNumList" :key='item.id'>{{item.num}}</view>
			</view>
			<view class="other-title">其他充值金额</view>
			<view class="input-wrapper">
				<view class="unit">￥</view>
				<input :adjust-position="false" v-model="paymentMoney" type="digit" />
			</view>
		</view>
		<view class="pay-type">
			<view class="type-title">支付方式</view>
			<view class="type-item" @click="changePayType(2)">
				<view class="type-left">
					<image src="../../../../static/imgs/wxpay.png" mode=""></image>
					<view class="type-name">微信支付</view>
				</view>
				<image v-if="paymentType==2" class="type-right" src="../../../../static/imgs/modelSelect.png" mode=""></image>
				<image v-else class="type-right" src="../../../../static/imgs/modelNotSelect.png" mode=""></image>
			</view>
			<!-- <view class="type-item" @click="changePayType(3)">
				<view class="type-left">
					<image src="../../../../static/imgs/zfbpay.png" mode=""></image>
					<view class="type-name">支付宝</view>
				</view>
				<image v-if="paymentType==3" class="type-right" src="../../../../static/imgs/modelSelect.png" mode=""></image>
				<image v-else class="type-right" src="../../../../static/imgs/modelNotSelect.png" mode=""></image>
			</view> -->
			<view @click="payHandle" class="pay-btn">去支付</view>
		</view>
	</view>
</template>

<script>
	import { rechargePay } from '@/api/thirdApi.js'
	export default {
		data() {
			return {
				isHaveNumList:[
					{id:0,num:100,default:false},
					{id:1,num:200,default:false},
					{id:2,num:300,default:false},
					{id:4,num:500,default:true},
				],
				currentNumId:4,
				paymentMoney:500,
				paymentType: 2
			};
		},
		methods:{
			changePayType(num){
				this.paymentType = num
			},
			changeNum(info){
				this.currentNumId = info.id
				this.paymentMoney = info.num
			},
			payHandle(){
				let prm = {
					paymentType:this.paymentType,
					rechargeAmount:this.paymentMoney
				}
				
				rechargePay(prm).then(res=>{
					if(res.data.code===200){
						let {result} = res.data
						wx.requestPayment({
							timeStamp:result.timeStamp,
							nonceStr:result.nonceStr,
							package:result.package,
							appid:result.appId,
							signType:result.signType,
							paySign:result.paySign,
							success:(data)=>{
								console.log("调起成功")
								uni.navigateBack()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	.recharge {
		width: 100%;
		background: #F2F4F6;
		height: 100%;
		font-size: 26upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.top-container {
			width: 100%;
			-height: 440upx;
			box-sizing: border-box;
			padding: 24upx 32upx 50upx 32upx;
			background-color: #fff;
			border-radius: 24upx 24upx 28upx 28upx;
			margin-bottom: 24upx;

			.recharge-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #525252;

				.title {
					font-size: 40upx;
					color: #333;
				}
			}

			.num-list {
				margin: 40upx 0;
				display: flex;
				justify-content: space-between;

				view {
					width: 156upx;
					height: 80upx;
					background: #F2F2F2;
					border-radius: 6upx;
					text-align: center;
					line-height: 80upx;
					color: #242323;
					font-size: 28upx;

					&.active {
						background-color: #23CE85;
						color: #fff;
					}
				}
			}

			.other-title {
				color: #333333;
				font-size: 30upx;
				margin-bottom: 28upx;
			}

			.input-wrapper {
				display: flex;
				align-items: center;
				height: 88upx;
				color: #474948;
				font-size: 32upx;
				border-bottom: 2upx solid #F0F0F0;
				width: 260upx;

				input {
					height: 60upx;
					font-size: 48upx;
					width: 220upx;
					text-align: center;
				}
			}
		}

		.pay-type {
			background-color: #FFFFFF;
			width: 100%;
			height: calc(100% - 464upx);
			padding: 48upx 32upx 0 32upx;
			box-sizing: border-box;
			position: relative;

			.type-title {
				color: #333333;
				font-size: 36upx;
			}

			.type-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 50upx 0;
				border-bottom: 2upx solid #F0F0F0;

				&:last-child {
					border-bottom: none;
				}

				.type-left {
					display: flex;
					color: #474948;
					font-size: 30upx;
					align-items: center;

					image {
						width: 40upx;
						height: 40upx;
						margin-right: 36upx;
					}
				}

				.type-right {
					width: 40upx;
					height: 40upx;
				}
			}
			.pay-btn{
				position: absolute;
				bottom: 70upx;
				width: 686upx;
				height: 88upx;
				background: #23CE85;
				border-radius: 12upx;
				text-align: center;
				line-height: 88upx;
				color: #fff;
				font-size: 34upx;
			}
		}
	}
</style>
