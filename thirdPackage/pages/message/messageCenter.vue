<template>
	<view class="message-center">
		<view class="take-place"></view>
		<view class="opt-wrapper">
			<view class="read-opt" @click="readHandle">一键已读</view>
		</view>
		<view class="message-top">
			<view v-for="item in allTypeMessage" :key='item.typeId' class="message-type" @click="goToUrl('/thirdPackage/pages/message/messageList?typeId='+item.typeId)">
				<image v-if="item.typeId===1" src="../../static/message_system_icon.png" mode=""></image>
				<image v-if="item.typeId===3" src="../../static/message_order_icon.png" mode=""></image>
				<view class="type-right">
					<view class="type-name">
						<view class="name">{{item.typeName}}</view>
						<view class="date">{{item.messageDate?item.messageDate:''}}</view>
					</view>
					<view class="message-num">
						<view class="message-desc">{{item.typeCount===0?'您当前没有新消息哦':'最新一条通知信息'}}</view>
						<view v-if="item.typeCount>0" class="manyOne">{{item.typeCount}}</view>
						<!-- <view v-if="item.typeCount===0" class="onlyOne"></view> -->
					</view>
				</view>
			</view>
			<!-- <view class="message-type">
				<image src="../../static/message_order_icon.png" mode=""></image>
				<view class="type-right">
					<view class="type-name">
						<view class="name">订单消息</view>
						<view class="date">昨天</view>
					</view>
					<view class="message-num">
						<view class="message-desc">最新一条通知信息</view>
						<view v-if="false" class="manyOne">3</view>
						<view v-else class="onlyOne"></view>
					</view>
				</view>
			</view> -->
			<!-- <view class="message-type">
				<image src="../../static/message_integral_icon.png" mode=""></image>
				<view class="type-right">
					<view class="type-name">
						<view class="name">积分消费消息</view>
						<view class="date">昨天</view>
					</view>
					<view class="message-num">
						<view class="message-desc">最新一条通知信息</view>
						<view v-if="true" class="manyOne">3</view>
						<view v-else class="onlyOne"></view>
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { getMessageByType,makeMessageReadable } from '../../../api/common.js'
	export default {
		data() {
			// typeId:1,系统消息
			// typeId:3,用户订单消息
			return {
				allTypeMessage:[],
				optFlag:false
			};
		},
		onShow() {
			this.getTypeList()
		},
		methods: {
			getTypeList(){
				getMessageByType().then(res=>{
					this.allTypeMessage = res.data.result
				})
			},
			readHandle(){
				let allCount = 0
				this.allTypeMessage.forEach(item=>{
					allCount += item.typeCount
				})
				if(allCount<=0){
					uni.showToast({
						title:'您当前没有未读消息',
						icon:'none'
					})
					return
				}
				if(this.optFlag){
					return
				}
				this.optFlag = true
				uni.showModal({
					content:'您确定将所有未读消息标记为已读吗？',
					confirmColor:'#4CD964',
					success:() => {
						makeMessageReadable().then(res=>{
							uni.showToast({
								title:res.data.result,
								icon:'none'
							})
							this.optFlag = false
							this.getTypeList()
						})
					},
					fail:() => {
						this.optFlag = false
					}
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
		height: 100%;
		width: 100%;
	}
	.message-center {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		min-height: 100%;
		background: #F5F6F8;
		.take-place{
			width: 100%;
			height: 6upx;
		}
		.opt-wrapper{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 60upx;
			box-sizing: border-box;
			.read-opt{
				/* width: 160upx;
				height: 40upx;
				line-height: 40upx;
				text-align: center;
				background-color: #007AFF;
				color: #fff; */
				color: #333333;
				font-size: 26upx;
				margin-right: 30upx;
			}
		}
		.message-top{
			width: 100%;
			box-sizing: border-box;
			background: #fff;
			padding: 46upx;
			.message-type{
				display: flex;
				align-items: center;
				margin-bottom: 63upx;
				&:last-child{
					margin-bottom: 0;
				}
				image{
					flex: 0 88upx;
					min-width: 88upx;
					height: 89upx;
					margin-right: 21upx;
				}
				.type-right{
					flex: 1;
					.type-name{
						display: flex;
						justify-content: space-between;
						font-size: 28upx;
						font-weight: bold;
						color: #333333;
						.date{
							font-size: 20upx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #9A9A9A;
						}
					}
					.message-num{
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 6upx;
						font-size: 22upx;
						color: #9A9A9A;
						.manyOne{
							background: #FF4848;
							border-radius: 50%;
							// padding: 3upx 11upx;
							font-size: 22upx;
							color: #FFFFFF;
							width: 40upx;
							height: 40upx;
							text-align: center;
							line-height: 40upx;
						}
						.onlyOne{
							width: 18upx;
							height: 18upx;
							background: #FF4848;
							border-radius: 50%;
						}
					}
				}
			}
		}
	}
</style>
