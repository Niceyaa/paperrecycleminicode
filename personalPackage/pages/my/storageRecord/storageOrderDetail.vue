<template>
	<view class="storageRecord">
		<view class="title">入库订单详情</view>
		<view class="num">共{{dataInfo.length}}个订单</view>
		<view class="content">
			<view class="info-item" v-for="(item,idx) in dataInfo" :key='item.retrieveOrderId'>
				<view class="header">
					<view class="circle"></view>
					<view>订单{{idx}}</view>
				</view>
				<view class="item-content">
					<view class="info">
						<view class="label">订单编号：</view>
						<view>{{item.retrieveOrderId}}</view>
					</view>
					<view class="info">
						<view class="label">下单时间：</view>
						<view>{{item.orderTime}}</view>
					</view>
					<view class="info">
						<view class="label">代理商服务费：</view>
						<view>￥{{item.agentServiceFee}}</view>
					</view>
					<view class="info">
						<view class="label">平台服务费：</view>
						<view>￥{{item.plateFormServiceFee}}</view>
					</view>
					<view class="info">
						<view class="label">回收时间：</view>
						<view>{{item.paymentTime}}</view>
					</view>
					<view class="info">
						<view class="label">支付方式：</view>
						<view>{{item.paymentType}}</view>
					</view>
				</view>
				<view class="item-footer">
					<view class="label">订单重量</view>
					<view class="black">{{item.retrieveOrderWeight}}KG</view>
					<view class="label">订单金额</view>
					<view>
						<text>￥</text>
						{{item.retrieveOrderPrice}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		orderPutInStorageDetail
	} from '../../../../api/putStorage.js'
	export default {
		data() {
			return {
				dataInfo:[]
			};
		},
		onLoad(opt) {
			this.retrieveStockId = opt.retrieveStockId
			this.getList()
		},
		methods: {
			getList(date) {
				let prm = {
					retrieveStockId:this.retrieveStockId
				}
				uni.showLoading({
					title: '加载中',
					icon: 'none'
				})
				orderPutInStorageDetail(prm).then(res => {
					uni.hideLoading()
					let {
						result
					} = res.data
					this.dataInfo = result
				}).catch(err => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
	}

	.storageRecord {
		width: 100%;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		box-sizing: border-box;
		padding: 0 32upx 60upx 32upx;
		background: #F2F4F6;
		min-height: 100%;

		.title {
			font-size: 48upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			padding: 30upx 0;
		}

		.num {
			font-size: 32upx;
			color: #333333;
			margin-bottom: 30upx;
		}

		.content {
			.info-item {
				width: 100%;
				background: #FFFFFF;
				border-radius: 20upx;
				margin-bottom: 32upx;

				.header {
					display: flex;
					align-items: center;
					padding: 24upx 0 24upx 32upx;
					background: #EEFDF4;
					border-radius: 18upx 18upx 0px 0px;

					.circle {
						width: 10upx;
						height: 10upx;
						border: 4upx solid #27CE85;
						margin-right: 10upx;
						border-radius: 20upx;
						box-sizing: border-box;
						background: #27CE85;
					}
				}

				.item-content {
					padding: 40upx 32upx 0upx 32upx;
					.info {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 28upx;
						color: #272626;
						margin-bottom: 14upx;
						.label {
							color: #8B8B8B;
						}
						&:last-child{
							padding-bottom: 34upx;
							margin-bottom: 0;
							border-bottom:  2upx solid #F3F3F3;
						}
					}
				}

				.item-footer {
					height: 96upx;
					box-sizing: border-box;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 36upx;
					font-weight: 600;
					color: #F97A31;
					padding-right: 32upx;

					.label {
						font-size: 24upx;
						color: #999999;
						font-weight: normal;
					}

					text {
						font-size: 24upx;
						font-weight: normal;
					}
					.black{
						font-size: 36upx;
						font-weight: normal;
						color: #333333;
						padding: 0 30upx 0 10upx;
					}
				}
			}
		}

		.noRecord {
			margin-top: 100upx;

			image {
				width: 500upx;
				height: 346upx;
				margin-left: 125upx;
			}

			.desc {
				width: 100%;
				text-align: center;
				font-size: 30upx;
				color: #4F4F4F;
			}

			.btn-wrapper {
				display: flex;
				justify-content: center;
				margin-top: 58upx;

				.nav-btn {
					width: 262upx;
					height: 88upx;
					background: #27CE85;
					border-radius: 12upx;
					text-align: center;
					line-height: 88upx;
					font-size: 34upx;
					color: #FFFFFF;
				}
			}
		}
	}
</style>
