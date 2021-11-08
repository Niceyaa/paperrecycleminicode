<template>
	<view class="storageRecord">
		<view class="title" @click="test">附近打包站</view>
		<view v-if="true" class="content">
			<view class="info-item" v-for="(item,idx) in dataInfo" :key='item.recyclerId'>
				<view class="recycle-name">{{item.name}}</view>
				<view class="address">{{item.address}}</view>
				<view class="nav-wrapper">
					<view class="nav-left">
						<view class="distance">{{item.distanceKm}}</view>
						<view class="separator">|</view>
						<view class="pay-type">{{item.payToRuTypeName}}</view>
					</view>
					<view @click="openNav(item.longitude,item.latitude,item.address)" class="nav-right">
						<image src="../../static/imgs/navigationIcon.png" mode=""></image>
						<view>导航</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="noRecord">
			<image src="../../static/imgs/noNearRecycleBinIcon.png" mode=""></image>
			<view class="desc">附近暂无打包站</view>
		</view>
	</view>
</template>

<script>
	import {
		nearRecycleBinList
	} from '@/api/common.js'
	export default {
		data() {
			return {
				dataInfo: [],
			};
		},
		onLoad() {
		/* 	uni.openLocation({
				latitude:"26.728559",
				longitude:"106.66571",
				success:(res)=>{
					console.log('121212')
				},
				fail:(err)=>{
					console.log('fail',err)
				}
			}) */
			this.getList()
		},
		onPullDownRefresh() {
			
				uni.getLocation({
					type:'gcj02',
					aititude:true,
					success: (loc) => {
						console.log('loc', loc)
						let prm = {
							latitude: loc.latitude,
							longitude: loc.longitude
						}
						uni.showLoading({
							title: '加载中',
							icon: 'none'
						})
						nearRecycleBinList(prm).then(res => {
							uni.hideLoading()
							let {
								result
							} = res.data
							this.dataInfo = result
								uni.stopPullDownRefresh()
						}).catch(err => {
							uni.hideLoading()
						uni.stopPullDownRefresh()
						})
					},
					fail:(err)=>{
						uni.stopPullDownRefresh()
					}
				})
		},
		methods: {
			test(){
				uni.openLocation({
					latitude:26.728559,
					longitude:106.66571,
					success:(res)=>{
						console.log('121212')
					},
					fail:(err)=>{
						console.log('fail',err)
					}
				})
			},
			getList() {
				uni.getLocation({
					type:'gcj02',
					aititude:true,
					success: (loc) => {
						console.log('loc', loc)
						let prm = {
							latitude: loc.latitude,
							longitude: loc.longitude
						}
						uni.showLoading({
							title: '加载中',
							icon: 'none'
						})
						nearRecycleBinList(prm).then(res => {
							uni.hideLoading()
							let {
								result
							} = res.data
							this.dataInfo = result
						}).catch(err => {
							uni.hideLoading()
						})
					}
				})

			},
			openNav(lng,lat,address) {
				console.log(111)
				uni.openLocation({
					latitude:lat,
					longitude:lng,
					address:address,
					success: () => {

					}
				})
			}
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
			padding-top: 40upx;
		}

		.content {
			padding-top: 22upx;

			.info-item {
				width: 100%;
				background: #FFFFFF;
				border-radius: 16upx;
				margin-top: 32upx;
				box-sizing: border-box;
				padding: 32upx;

				.recycle-name {
					font-size: 36upx;
					font-weight: 600;
					color: #333333;
				}

				.address {
					padding: 16upx 0;
					font-size: 28upx;
					color: #666666;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.nav-wrapper {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10upx 0;

					.nav-left {
						display: flex;
						align-items: center;
						font-size: 26upx;
						color: #8B8B8B;

						.distance {
							font-size: 40upx;
							font-weight: 600;
							color: #23CE85;
						}

						.separator {
							padding: 0 14upx;
						}
					}

					.nav-right {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 64upx;
						background: #23CE85;
						border-radius: 32upx;
						width: 170upx;
						box-sizing: border-box;
						font-size: 26upx;
						color: #FFFFFF;

						image {
							width: 24upx;
							height: 24upx;
						}
					}
				}
			}
		}

		.noRecord {
			margin-top: 190upx;

			image {
				width: 500upx;
				height: 346upx;
				margin-left: 100upx;
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
