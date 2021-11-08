<template>
	<view class="choose-bank">
		<view class="bank-item" @click="chooseBank(item)" v-for="item in bankList" :key='item.id'>
			<view>{{item.name}}</view>
			<image v-if="item.name === currentBankName" src="../../../../static/imgs/bankCardSelect.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankList:[
					{id:0,name:'中国建设银行'},
					{id:1,name:'贵阳银行'},
					{id:2,name:'贵州银行'},
					{id:3,name:'工商银行'},
				],
				currentBankName:null
			};
		},
		onLoad(opt) {
			this.currentBankName = opt.bankName
		},
		methods: {
			back() {
				uni.navigateBack({})
			},
			chooseBank(info){
				this.currentBankName = info.name
				uni.setStorageSync('setBankName',this.currentBankName)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
	.choose-bank {
		width: 100%;

		.bank-item {
			display: flex;
			justify-content: space-between;
			height: 122upx;
			align-items: center;
			border: 2upx solid #F0F0F0;
			box-sizing: border-box;
			width: 100%;
			padding: 0 40upx;
			font-size: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #2F2F2F;

			image {
				width: 40upx;
				height: 27.7upx;
			}
		}
	}
</style>
