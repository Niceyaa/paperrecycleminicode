<template>
	<view class="setting-model">
		<view class="title">接单模式选择</view>
		<view @click="setModel(item.receiveTypeId)" class="model-item" v-for="item in orderSettings" :key='item.receiveTypeId'>
			<view class="model-left">
				<view class="model-left-top">
					<view class="model-name">{{item.receiveTypeName}}</view>
					<view class="model-distance">/推单范围<text>{{item.receiveRange}}公里</text></view>
				</view>
				<view>优先显示近单，同时接单上限{{item.orderLimit}}单</view>
			</view>
			<image v-if="currentTypeId===item.receiveTypeId" class="model-right" src="../../static/imgs/modelSelect.png" mode=""></image>
			<image v-else class="model-right" src="../../static/imgs/modelNotSelect.png" mode=""></image>
			<image v-if="currentTypeId===item.receiveTypeId" class="current-model" src="../../static/imgs/currentModel.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		getOrderModelInfo,
		setReceiptModel
	} from '../../api/orderSettings.js'
	export default {
		data() {
			return {
				currentTypeId: null,
				orderSettings: []
			};
		},
		onLoad(opt) {
			if (opt.id) {
				console.log("id", opt.id)
				this.currentTypeId = parseInt(opt.id)
			}
		},
		onShow() {
			getOrderModelInfo().then(res => {
				this.orderSettings = res.data.result.list
			})
		},
		methods: {
			setModel(id) {
				if (this.currentTypeId === id) {
					return
				}
				uni.showModal({
					content:'是否选择当前接单模式',
					confirmColor: '#4CD964',
					confirmText: "确认设置",
					success: (res) => {
						if (res.confirm) {
							this.currentTypeId = id
							let prm = {
								receiveTypeId: id
							}
							setReceiptModel(prm).then(res => {
								uni.showToast({
									title: res.data.msg,
									duration: 2000,
									success: () => {
										uni.navigateBack()
									}
								})
							})
						}
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

	.setting-model {
		width: 100%;
		height: 100%;
		background: #F2F4F6;
		position: relative;
		padding: 0 20upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		box-sizing: border-box;

		.title {
			padding: 28upx 0 60upx 32upx;
			font-size: 48upx;
			color: #333333;
		}

		.model-item {
			width: 710upx;
			background: #FFFFFF;
			border-radius: 12upx;
			padding: 50upx 40upx;
			display: flex;
			box-sizing: border-box;
			justify-content: space-between;
			position: relative;
			align-items: center;
			margin-bottom: 30upx;

			.model-left {
				font-size: 24upx;
				color: #989797;

				.model-left-top {
					display: flex;
					margin-bottom: 30upx;
					align-items: baseline;

					.model-name {
						font-size: 34upx;
						color: #222222;
						margin-right: 30upx;
					}

					.model-distance {
						font-size: 24upx;
						color: #403E3E;

						text {
							color: #FF6100;
						}
					}
				}
			}

			.model-right {
				width: 40upx;
				height: 40upx;
			}

			.current-model {
				position: absolute;
				right: 0;
				top: 0;
				width: 134upx;
				height: 38upx;
			}
		}
	}
</style>
