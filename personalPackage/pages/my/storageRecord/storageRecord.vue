<template>
	<view class="storageRecord">
		<view class="title">入库记录</view>
			<view class="search-date">
				<picker class="date-picker" mode="date" fields="day" :value="searchInfo.date" @change="bindDateChange">
					<view class="uni-input">{{searchInfo.date}}</view>
				</picker>
				<view class="line"></view>
				<picker class="date-picker" mode="date" fields="day" :value="searchInfo.endDate" @change="bindEndDateChange">
					<view class="uni-input">{{searchInfo.endDate}}</view>
				</picker>
			</view>
		<view v-if="dataInfo.length>0" class="content">
			<view class="info-item" v-for="(item,idx) in dataInfo" :key='item.retrieveStockId' @click="goToDetail(item.retrieveStockId)">
				<view class="header">
					<view class="header-left">
						<view class="circle"></view>
						<view>入库信息</view>
					</view>
					<view class="header-right">
						<view>查看详情</view>
						<image src="../../../static/imgs/rightArrow.png" mode=""></image>
					</view>
				</view>
				<view class="item-content">
					<view class="num">共{{item.retrieveOrderAmount}}个订单</view>
					<view class="info">
						<view class="label">入库时间：</view>
						<view>{{item.createTime}}</view>
					</view>
					<view class="info">
						<view class="label">入库重量：</view>
						<view>{{item.retrieveStockWeight}}KG</view>
					</view>
				</view>
				<view class="item-footer">
					<view class="label">入库金额</view>
					<view>
						<text>￥</text>
						{{item.retrieveStockPrice}}
					</view>
				</view>
			</view>
			<uni-load-more v-show="pageSize<total" :status="loadingStatus" :contentText="contentText"></uni-load-more>
		</view>
		<view v-else class="noRecord">
				<image src="../../../static/imgs/noRecord.png" mode=""></image>
				<view class="desc">暂无入库记录</view>
				<view class="btn-wrapper">
					<view @click="goToIndex" class="nav-btn">去入库</view>
				</view>
			
		</view>
	</view>
</template>

<script>
	import { orderPutInStorageRecord } from '../../../../api/putStorage.js'
	export default {
		data() {
			return {
				// loadingStatus: more,loading,noMore
				loadingStatus: 'more',
				// loadText 上拉文字提示
				contentText: {
					contentdown: '上拉加载更多内容',
					contentrefresh: '正在赶来的路上...',
					contentnomore: '到达尽头了哦'
				},
				searchInfo: {
					date: this.$getBeforeDay(7),
					// date: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-${(new Date().getDate()).toString().padStart(2,0)}`,
					endDate: this.$formatDate(new Date())
				},
				dataInfo:[],
				pageSize:10,
				total:0,
				currentPage:1
			};
		},
		onLoad(){
			this.getList()
		},
		onReachBottom() {
			if(this.loadingStatus==='more'){
				this.currentPage ++
				this.loadingStatus = 'loading'
				let prm = {
					createTimeStart:this.$formatDate(this.searchInfo.date)+' 00:00:00',
					createTimeEnd:this.$formatDate(this.searchInfo.endDate)+' 23:59:59',
					pageSize:this.pageSize,
					pageNum:this.currentPage
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				orderPutInStorageRecord(prm).then(res=>{
					uni.hideLoading()
					let {result} = res.data
					this.dataInfo = this.dataInfo.concat(result.list)
					this.total = result.total
					if(this.pageSize>result.list.length){
						this.loadingStatus = 'noMore'
					}else{
						this.loadingStatus = 'more'
					}
				}).catch(err=>{
					uni.hideLoading()
				})
			}else{
				return
			}
		},
		methods:{
			getList(n = this.currentPage){
				let prm = {
					createTimeStart:this.$formatDate(this.searchInfo.date)+' 00:00:00',
					createTimeEnd:this.$formatDate(this.searchInfo.endDate)+' 23:59:59',
					pageSize:this.pageSize,
					pageNum:n
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				orderPutInStorageRecord(prm).then(res=>{
					uni.hideLoading()
					let {result} = res.data
					this.dataInfo = result.list
					this.total = result.total
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			bindEndDateChange(e){
				this.searchInfo.endDate = e.detail.value
				this.getList()
				console.log(e)
			},
			bindDateChange(e){
				this.searchInfo.date = e.detail.value
				this.getList()
				console.log(e)
			},
			goToDetail(info){
				uni.navigateTo({
					url:'/personalPackage/pages/my/storageRecord/storageDetail?retrieveStockId='+info
				})
			},
			goToIndex(){
				uni.reLaunch({
					url:'/pages/index/index'
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
		background: #F2F4F6;
		min-height: 100%;
		.title{
			font-size: 48upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			padding-top: 40upx;
		}
		.search-date{
				display: flex;
				align-items: center;
				padding: 50upx 0;
				.date-picker{
					width: 232upx;
					height: 66upx;
					border-radius: 35upx;
					border: 2px solid #27CE85;
					text-align: center;
					line-height: 66upx;
					font-size: 28upx;
					color: #333333;
					box-sizing: border-box;
				}
				.line{
					width: 20upx;
					border: 2upx solid #27CE85;
					margin: 0 14upx;
					background-color: #27CE85;
				}
			}
		.content{
			
			.info-item{
				width: 100%;
				background: #FFFFFF;
				border-radius: 20upx;
				margin-bottom: 32upx;
				.header{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 24upx 32upx;
					background: #EEFDF4;
					border-radius: 18upx 18upx 0px 0px;
					.header-left{
						display: flex;
						align-items: center;
						font-size: 32upx;
						color: #333333;
						.circle{
							width: 22upx;
							height: 22upx;
							border: 4upx solid #27CE85;
							margin-right: 10upx;
							border-radius: 20upx;
							box-sizing: border-box;
						}
					}
					.header-right{
						font-size: 28upx;
						color: #27CE85;
						display: flex;
						align-items: center;
						image{
							width: 12upx;
							height: 20upx;
							margin-left: 10upx;
						}
					}
				}
				.item-content{
					padding: 0 32upx;
					.num{
						font-size: 32upx;
						font-weight: 600;
						color: #333333;
						margin: 24upx 0;
					}
					.info{
						display: flex;
						align-items: center;
						font-size: 28upx;
						color: #272626;
						margin-bottom: 14upx;
						&:last-child{
							padding-bottom: 30upx;
							border-bottom: 2upx dashed #F3F3F3;
						}
						.label{
							color: #8B8B8B;
						}
					}
				}
				.item-footer{
					height: 96upx;
					box-sizing: border-box;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 36upx;
					font-weight: 600;
					color: #F97A31;
					padding-right: 32upx;
					.label{
						font-size: 24upx;
						color: #999999;
						font-weight: normal;
					}
					text{
						font-size: 24upx;
						font-weight: normal;
					}
				}
			}
		}
		.noRecord{
			margin-top: 100upx;
			image{
				width: 500upx;
				height: 346upx;
				margin-left: 125upx;
			}
			.desc{
				width: 100%;
				text-align: center;
				font-size: 30upx;
				color: #4F4F4F;
			}
			.btn-wrapper{
				display: flex;
				justify-content: center;
				margin-top: 58upx;
				.nav-btn{
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
