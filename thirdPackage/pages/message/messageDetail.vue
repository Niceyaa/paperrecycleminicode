<template>
	<view class="message-detail">
		<view class="title">{{dataInfo.title}}</view>
		<view class="intro">
			<view class="date">{{dataInfo.msgType}}</view>
			<view class="date">{{dataInfo.sendTime}}</view>
		</view>
		<view class="content">{{dataInfo.content}}</view>
	</view>
</template>

<script>
	import { getMessageDetail } from '../../../api/common.js'
	export default {
		data() {
			return {
				dataInfo:{}
			};
		},
		onLoad(opt) {
			let prm = {
				messageId:opt.messageId
			}
			getMessageDetail(prm).then(res=>{
				this.dataInfo = res.data.result
			})
		},
		methods: {
		}
	}
</script>

<style lang="less">
	.message-detail{
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		padding: 24upx;
		.title{
			font-size: 36upx;
			font-weight: bold;
			color: #333333;
		}
		.intro{
			display: flex;
			margin: 40upx 0;
			.date{
				margin-right: 20upx;
				font-size: 26upx;
				color: #3380FF;
			}
		}
		.content{
			font-size: 26upx;
			color: #333333;
		}
	}
</style>
