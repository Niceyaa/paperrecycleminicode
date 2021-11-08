<template>
	<view class="storageRecord">
		<view class="title">入库详情</view>
		<view class="num" @click="goToDetail(1)">
			<view>共{{dataInfo.retrieveOrderAmount}}个订单</view>
			<image src="../../../static/imgs/rightArrow.png" mode=""></image>
		</view>
		<view class="content">
			<view class="item">
				<view class="label">代理商</view>
				<view>{{dataInfo.agentName}}</view>
			</view>
			<view class="item">
				<view class="label">回收站点</view>
				<view>{{dataInfo.recyclerName}}</view>
			</view>
			<view class="item">
				<view class="label">入库时间</view>
				<view>{{dataInfo.createTime}}</view>
			</view>
			<view class="item">
				<view class="label">入库重量</view>
				<view>{{dataInfo.retrieveStockWeight}}KG</view>
			</view>
			<view class="item">
				<view class="label">入库金额</view>
				<view>￥{{dataInfo.retrieveStockPrice}}</view>
			</view>
			<view class="item">
				<view class="label">订单重量</view>
				<view>{{dataInfo.retrieveOrderWeight}}KG</view>
			</view>
			<view class="item">
				<view class="label">订单金额</view>
				<view>￥{{dataInfo.retrieveOrderPrice}}</view>
			</view>
			<view class="item">
				<view class="label">代理商服务费</view>
				<view>￥{{dataInfo.agentServiceFee}}</view>
			</view>
			<view class="item">
				<view class="label">平台服务费</view>
				<view>￥{{dataInfo.platformServiceFee}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { storageDetail } from '../../../../api/putStorage.js'
	export default {
		data() {
			return {
				dataInfo:{},
				retrieveStockId:null
			};
		},
		onLoad(opt){
			this.retrieveStockId = opt.retrieveStockId
			this.getList()
		},
		methods:{
			getList(date){
				let prm = {
					retrieveStockId:this.retrieveStockId
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				storageDetail(prm).then(res=>{
					uni.hideLoading()
					let {result} = res.data
					this.dataInfo = result
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			goToDetail(info){
				uni.navigateTo({
					url:'/personalPackage/pages/my/storageRecord/storageOrderDetail?retrieveStockId='+this.retrieveStockId
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		height: 100%;
	}
	.storageRecord {
		width: 100%;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		box-sizing: border-box;
		padding: 0 32upx 60upx 32upx;
		background: #fff;
		min-height: 100%;
		.title{
			font-size: 48upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			padding: 30upx 0;
		}
		.num{
			display: flex;
			align-items: center;
			font-size: 32upx;
			font-weight: 600;
			color: #27CE85;
			margin-bottom: 30upx;
			image{
				width: 12upx;
				height: 20upx;
				margin-left: 10upx;
			}
		}
		.content{
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100upx;
				font-size: 28upx;
				color: #272626;
				border-bottom: 2upx solid #F3F3F3;
				box-sizing: border-box;
				.label{
					color: #8B8B8B;
				}
			}
		}
	}
</style>
