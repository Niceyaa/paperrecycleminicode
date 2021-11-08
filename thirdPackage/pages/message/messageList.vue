
<template>
	<view class="message-list">
		<view class="content">
			<view class="message-item" v-for="item in messageList" :key='item.messageId'>
				<view class="date">{{item.sendTime}}</view>
				<view class="message-info" @click="goToUrl('/thirdPackage/pages/message/messageDetail?messageId='+item.messageId)">
					<view class="title">
						<view v-if="!item.readFlag" class="red-sign"></view>
						<view>{{item.title}}</view>
					</view>
					<view class="desc">{{item.content}}</view>
					<view class="footer-wrapper">
						<view>查看详情</view>
						<image src="../../static/rightIcon.png" mode=""></image>
					</view>
				</view>
			</view>
			<uni-load-more v-show="pageSize<total" :status="loadingStatus" :contentText="contentText"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import { getMessageListByType } from '../../../api/common.js'
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
				messageList:[],
				msgType:null,
				total:0,
				pageSize:10,
				currentPage:1,
			};
		},
		onLoad(opt){
			this.msgType = opt.typeId
		},
		onShow() {
			this.getList()
		},
		onReachBottom() {
			
			if(this.loadingStatus==='more'){
				this.currentPage ++
				this.loadingStatus = 'loading'
				let prm = {
					"msgType": this.msgType,
					"pageNum": this.currentPage,
					"pageSize": this.pageSize,
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				getMessageListByType(prm).then(res=>{
					uni.hideLoading()
					let {result} = res.data
					this.messageList = this.messageList.concat(result.list)
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
		methods: {
			getList(){
				let prm = {
						"msgType": this.msgType,
						"pageNum": this.currentPage,
						"pageSize": this.pageSize,
				}
				uni.showLoading({
					title:'加载中',
					icon:'none'
				})
				getMessageListByType(prm).then(res=>{
					let {result} = res.data
					this.total = result.total
					this.messageList = result.list
					if(this.pageSize>result.list.length){
						this.loadingStatus = 'noMore'
					}else{
						this.loadingStatus = 'more'
					}
					uni.hideLoading()
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			goToUrl(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="less">
	page{
		width: 100%;
		height: 100%;
	}
	.message-list{
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		min-height: 100%;
		background: #F5F6F8;
		.content{
			padding: 24upx;
			width: 100%;
			box-sizing: border-box;
			.message-item{
				padding-bottom: 30upx;
				.message-info{
					background: #fff;
					border-radius: 14upx;
					padding: 0 23upx;
					box-sizing: border-box;
					.title{
						font-size: 34upx;
						font-weight: bold;
						color: #333333;
						padding: 40upx 0;
						display: flex;
						align-items: center;
						.red-sign{
							width: 14upx;
							height: 14upx;
							margin-right: 20upx;
							background: red;
							border-radius: 50%;
						}
					}
					.desc{
						font-size: 26upx;
						color: #4A4A4A;
						margin-bottom: 30upx;
						overflow:hidden; 
						text-overflow:ellipsis;
						display:-webkit-box; 
						-webkit-box-orient:vertical;
						-webkit-line-clamp:2; 
					}
					.footer-wrapper{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 26upx;
						color: #333333;
						height: 87upx;
						box-sizing: border-box;
						border-top: 1upx solid #F5F6F8;
						image{
							width: 12upx;
							height: 20upx;
						}
					}
				}
				.date{
					font-size: 24upx;
					color: #9A9A9A;
					margin: 40upx 0 20upx 0;
					text-align: center;
				}
			}
		}
	}
</style>
