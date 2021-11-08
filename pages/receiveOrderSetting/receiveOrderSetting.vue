<template>
	<view class="receiptOrderSetting">
		<view class="top-box">
			<view class="top-title">接单设置</view>
		</view>
		<view class="content">
			<view class="setting-item" @click="openAreaSetting(settingInfo.latitude,settingInfo.longitude)">
				<image class="item-left" src="../../static/imgs/offenArea.png" mode=""></image>
				<view class="item-right">
					<view class="item-right-left">
						<view class="title">常驻收货区域</view>
						<view>{{settingInfo.receiveArea}}</view>
					</view>
					<view class="item-right-right">去设置>
					</view>
				</view>
			</view>
			<view class="setting-item" @click="goToURL(settingInfo.receiveTypeId)">
				<image class="item-left" src="../../static/imgs/receiptOrderModel.png" mode=""></image>
				<view class="item-right">
					<view class="item-right-left">
						<view class="title">选择接单模式</view>
						<view>{{settingInfo.receiveTypeName}}</view>
					</view>
					<view class="item-right-right">去设置>
					</view>
				</view>
			</view>
			<view class="help">
				<view @click="goToHelp">问题帮助</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getOrdeSetting,
		setReceiveArea
	} from '../../api/orderSettings.js'
	export default {
		data() {
			return {
				settingInfo: {
					latitude: null,
					longitude: null,
					receiveArea: null,
					receiveTypeId: null,
					receiveTypeName: null,
				}
			};
		},
		onShow(opt) {
			this.getInfo()
		},
		methods: {
			getInfo() {
				uni.showLoading({
					title:"加载中"
				})
				getOrdeSetting().then(res => {
					uni.hideLoading()
					let {
						result
					} = res.data
					this.settingInfo.latitude = result.latitude
					this.settingInfo.longitude = result.longitude
					this.settingInfo.receiveArea = result.receiveArea ? result.receiveArea : '未设置常驻区域'
					this.settingInfo.receiveTypeId = result.receiveTypeId
					this.settingInfo.receiveTypeName = result.receiveTypeName ? result.receiveTypeName : '未设置接单模式'
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			openAreaSetting(latitude, longitude) {
				uni.chooseLocation({
					latitude,
					longitude,
					success: (res) => {
						console.log("地址信息",res)
						let prm = {
							"receiveArea": res.address.length>0?res.address:res.name,
							"latitude": res.latitude,
							"longitude": res.longitude,
						}
						setReceiveArea(prm).then(data=>{
							uni.showToast({
								title:data.data.msg,
								duration:2000,
								icon:'success',
								success:(res)=>{
									this.getInfo()
								}
							})
						})
						console.log('返回来的地址信息', res)
					}
				})
			},
			goToHelp() {
				uni.navigateTo({
					url: '/pages/receiveOrderSetting/residentAreaHelp'
				})
			},
			goToURL(id) {
				// id
				uni.navigateTo({
					url: '/pages/receiveOrderSetting/receiveOrderModule?id='+id
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

	.receiptOrderSetting {
		position: relative;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		height: 100%;
		box-sizing: border-box;

		.top-box {
			background-image: url(../../static/imgs/receiptOrderSetting.png);
			background-size: 100% 100%;
			width: 100%;
			height: 144upx;
			padding-top: 28upx;
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
		margin-top: -24upx;
		border-radius: 28upx 28upx 0px 0px;
		padding: 16upx 20upx 0 20upx;
		height: calc(100% - 120upx);
		position: relative;

		.setting-item {
			width: 710upx;
			height: 180upx;
			background: #FFFFFF;
			border-radius: 26upx;
			box-sizing: border-box;
			padding: 26upx 60upx 26upx 36upx;
			display: flex;
			align-items: center;
			margin-bottom: 25upx;

			.item-left {
				width: 128upx;
				height: 128upx;
				margin-right: 28upx;
				flex: 0 128upx;
				min-width: 128upx;
			}

			.item-right {
				font-size: 26upx;
				color: #515151;
				display: flex;
				flex: 1;
				justify-content: space-between;
				align-items: center;
				padding-top: 10upx;

				.item-right-left {
					width: 330upx;
					.title {
						font-size: 34upx;
						color: #333333;
						margin-bottom: 10upx;
					}
				}

				.item-right-right {
					font-size: 26upx;
					color: #23CE85;
				}
			}
		}

		.help {
			width: 100%;
			text-align: center;
			position: absolute;
			bottom: 60upx;
			left: 0;
			font-size: 30upx;
			color: #1196EB;
			margin: 0 auto;
		}
	}
</style>
