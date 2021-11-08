<template>
	<view class="real-name-auth-result">
		<view class="header">
			<view class="header-top">
				<view class="name">{{dataInfo.username}}</view>
				<view v-if="dataInfo.checkStatus===0" class="status">未通过</view>
				<view v-if="dataInfo.checkStatus===1" class="status">已通过</view>
				<view v-if='dataInfo.checkStatus===2' class="status">审核中</view>
			</view>
			<view class="number"><text>身份证号：</text>{{dataInfo.licenseCard}}</view>
			<!-- <view class="number"><text>手机号码：</text>15145123122</view> -->
		</view>
		<view class="takeplace"></view>
		<view class="idCard-wrapper">
			<view class="title-left"></view>
			<view class="title">身份证照片</view>
		</view>
		<view class="imgs-list">
			<view class="img-item">
				<image :src="dataInfo.idCardFront" mode=""></image>
				<view class="tip">身份证正面</view>
			</view>
			<view class="img-item">
				<image :src="dataInfo.idCardReverse" mode=""></image>
				<view class="tip">身份证反面</view>
			</view>
			<view class="img-item">
				<image  :src="dataInfo.handIdCard" mode=""></image>
				<view class="tip">手持身份证</view>
			</view>
		</view>
		<view @click="goToUrl" v-if="dataInfo.checkStatus===0" class="repeat-save">重新上传</view>
	</view>
</template>

<script>
	import {
		getAuthInfo
	} from '@/api/user.js'
	export default {
		data() {
			return {
				dataInfo: {
					"username": "",
					"licenseCard": "",
					checkStatus:0,
					tel: '',
					idCardFront: '',
					idCardReverse: '',
					handIdCard: '',
				},
				
			};
		},
		onLoad(opt) {
			this.dataInfo.checkStatus = parseInt(opt.checkStatus)
			getAuthInfo().then(res=>{
				let {result} = res.data
				this.dataInfo.username = result.realName
				this.dataInfo.licenseCard = result.idNumber
				this.dataInfo.idCardReverse = result.backUrl
				this.dataInfo.idCardFront = result.frontUrl
				this.dataInfo.handIdCard = result.holdUrl
			})
		},
		onShow() {},
		methods: {
			goToUrl(){
				uni.navigateTo({
					url:'/personalPackage/pages/my/realNameAuth'
				})
			}
		}
	}
</script>


<style lang="less">
	.real-name-auth-result{
		padding: 24upx 32upx 40upx 32upx;
		box-sizing: border-box;
		width: 100%;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		.header{
			width: 100%;
			background: #23CE85;
			border-radius: 12upx;
			padding: 0 24upx 32upx 24upx;
			box-sizing: border-box;
			color: #fff;
			.header-top{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88upx;
				box-sizing: border-box;
				border-bottom: 2upx solid #0EC175;
				padding: 0 16upx;
				.name{
					font-size: 38upx;
					color: #FFFFFF;
				}
				.status{
					width: 106upx;
					height: 36upx;
					background: #FFFFFF;
					border-radius: 17upx;
					text-align: center;
					line-height: 36upx;
					color: #23CE85;
					font-size: 24upx;
				}
			}
			.number{
				font-size: 26upx;
				padding: 0 14upx;
				margin-top: 28upx;
			}
		}
		.takeplace{
			width: 630upx;
			height: 26upx;
			background: #DBF7EB;
			border-bottom-left-radius: 12upx;
			border-bottom-right-radius: 12upx;
			margin-left: 28upx;
		}
		.idCard-wrapper{
			display: flex;
			margin: 54upx 0 24upx 0;
			align-items: center;
			.title-left{
				width: 8upx;
				height: 38upx;
				background: #23CE85;
				border-radius: 4upx;
				margin-right: 18upx;
			}
			.title{
				color: #272727;
				font-size: 32upx;
			}
		}
		.imgs-list{
			display: flex;
			width: 100%;
			box-sizing: border-box;
			justify-content: space-between;
			padding: 0 8upx;
			flex-wrap: wrap;
			.img-item{
				width: 300upx;
				text-align: center;
				margin-bottom: 64upx;
				image{
					width: 300upx;
					height: 198upx;
				}
				.tip{
					margin-top: 32upx;
					color: #666666;
					font-size: 28upx;
				}
			}
		}
		.repeat-save{
			width: 686upx;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			line-height: 88upx;
			text-align: center;
			color: #fff;
			font-size: 34upx;
		}
	}
</style>
