<template>
	<view class="contact-service">
		<image class="logo" src="../../static/imgs/contactService.png" mode=""></image>
		<view class="title">纸秘</view>
		<view class="contact-item">
			<view>客服电话</view>
			<view @click="makePhoneCall" class="blueColor">{{tel}}</view>
		</view>
		<view class="contact-item">
			<view>客服QQ</view>
			<view>3038159696</view>
		</view>
		<view class="contact-item">
			<view>工作时间</view>
			<view>09:00-17:00</view>
		</view>
		<view class="contact-item" @click="goToUrl('/personalPackage/pages/my/userPolicy')">
			<view>用户使用协议</view>
			<image src="../../static/imgs/rightIcon.png" mode=""></image>
		</view>
		<view class="contact-item" @click="goToUrl('/personalPackage/pages/my/provitePolicy')">
			<view>隐私协议</view>
			<image src="../../static/imgs/rightIcon.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel:4001553660,
			};
		},
		methods:{
			goToUrl(url){
				uni.navigateTo({
					url
				})
			},
			makePhoneCall(){
				uni.makePhoneCall({
					phoneNumber:this.tel
				})
			}
		}
	}
</script>

<style lang="less">
.contact-service{
	width: 100%;
	padding: 0 32upx;
	box-sizing: border-box;
	.logo{
		width: 154upx;
		height: 146upx;
		margin: 90upx 0 40upx 264upx;
	}
	.title{
		width: 100%;
		text-align: center;
		margin-bottom: 70upx;
	}
	.contact-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		height: 112upx;
		box-sizing: border-box;
		border-bottom: 2upx solid #F0F0F0;
		&:last-child{
			border: none;
		}
		.blueColor{
			color: #0D92E7;
		}
		image{
			width: 16upx;
			height: 26upx;
		}
	}
}
</style>
