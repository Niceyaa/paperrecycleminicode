<template>
	<view class="currentTel">
		<view class="title">当前手机号</view>
		<view class="info-item">
			<view class="label">手机号</view>
			<view class="item-right">
				<input :disabled="true" v-model="oldTel" type="number" />
			</view>
		</view>
		<view @click="goToChangeTel" class="bindTel">绑定新手机号</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				oldTel:null
			}
		},
		onLoad(opt) {
			this.oldTel = opt.phone
		},
		methods:{
			goToChangeTel(){
				uni.navigateTo({
					url:'/thirdPackage/pages/personalInfo/changeTel?phone='+this.oldTel
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

	.currentTel {
		width: 100%;
		min-height: 100%;
		background: #fff;
		padding: 60upx 40upx 0 40upx;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		.title{
			font-size: 48upx;
			color: #333333;
			margin-bottom: 60upx;
		}
		.info-item{
			display: flex;
			align-items: center;
			padding-top: 30upx;
			.label{
				font-size: 30upx;
				color: #333333;
				flex: 0 144upx;
				min-width: 144upx;
			}
			.item-right{
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2upx solid #DDDDDD;
				flex: 1;
				
			}
		}
		.bindTel{
			width: 100%;
			box-sizing: border-box;
			height: 88upx;
			background: #23CE85;
			border-radius: 12upx;
			text-align: center;
			line-height: 88upx;
			font-size: 34upx;
			color: #FFFFFF;
			margin-top: 500upx;
		}
	}
</style>
