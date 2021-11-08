<template>
	<view class="my-bank">
		<view class="title">我的银行卡</view>
		<view class="bank-list" v-if="bankList.length>0">
			<view class="bank-item" v-for="(item,index) in bankList" :key="index">
				<view class="bank-top">
					<view class="bank-left">
						<image src="../../../../../static/imgs/bankImg.png" mode=""></image>
						<view class="bank-name-num">
							<view class="bank-name">{{item.bankName}}</view>
							<view class="num">{{item.bankCardNumber}}</view>
						</view>
					</view>
					<view @click="deleteBank(item)" class="bank-delete">删除</view>
				</view>
				<view class="bank-bottom">
					<image v-if="item.isDefaultBank" src="../../../../static/imgs/modelSelect.png" mode=""></image>
					<image @click="setDefault(item)" v-else src="../../../../static/imgs/modelNotSelect.png" mode=""></image>
					<view>默认银行卡</view>
				</view>
			</view>

			<view class="add-bank">
				<image src="../../../../../static/imgs/add.png" mode=""></image>
				<view @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/bindBankCard')">增加银行卡</view>
			</view>
		</view>
		<view v-else class="no-card">
			<image src="../../../../static/imgs/withoutNoBank.png" mode=""></image>
			<view class="tip">暂无银行卡</view>
			<view class="add" @click="goToUrl('/personalPackage/pages/my/myAccount/withdraw/bindBankCard')">添加</view>
		</view>
	</view>
</template>

<script>
	import { getBankInfo,setDefaultBankCard,deleteBankCard } from '@/api/user.js'
	export default {
		data() {
			return {
				bankList:[],
				currentBankName: null
			};
		},
		onLoad(opt) {
			this.currentBankName = opt.bankName
		},
		onShow() {
			this.getList()
		},
		methods: {
			// 设置默认银行卡
			setDefault(info){
				uni.showModal({
					title:'默认银行卡',
					content:`确认将卡号为${info.bankCardNumber}的银行卡设置为默认银行卡吗？`,
					confirmColor:'#4CD964',
					confirmText:"确认设置",
					success:(e) => {
						if(e.confirm){
							let prm = {
								bankCardInfoId:info.bankCardInfoId
							}
							setDefaultBankCard(prm).then(res=>{
								uni.showToast({
									title:res.data.msg
								})
								this.getList()
							})
						}
					}
				})
			},
			deleteBank(info){
				uni.showModal({
					content:`确认将卡号为${info.bankCardNumber}的银行卡删除吗？`,
					confirmColor:'#4CD964',
					confirmText:"确认删除",
					success:(e) => {
						if(e.confirm){
							let prm = {
								bankCardInfoId:info.bankCardInfoId
							}
							deleteBankCard(prm).then(res=>{
								uni.showToast({
									title:res.data.msg
								})
								this.getList()
							})
						}
					}
				})
			},
			getList(){
				getBankInfo().then(res=>{
					this.bankList = res.data.result
				})
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			chooseBank(info) {
				this.currentBankName = info.name
				uni.setStorageSync('setBankName', this.currentBankName)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	.my-bank {
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;
		background: #F2F4F6;
		padding: 0 32upx 200upx 32upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.title {
			font-size: 48upx;
			color: #333333;
			padding: 36upx 0 50upx 0;
		}
		.bank-list{
			width: 100%;
			box-sizing: border-box;
			.bank-item{
				background: 100%;
				padding: 44upx 32upx 0 40upx;
				background-color: #fff;
				border-radius: 16upx;
				margin-bottom: 24upx;
				.bank-top{
					display: flex;
					justify-content: space-between;
					align-items: center;
					box-sizing: border-box;
					border-bottom: 2upx dotted #F0F0F0;
					padding-bottom: 40upx;
					.bank-left{
						display: flex;
						image{
							width: 80upx;
							height: 80upx;
							margin-right: 44upx;
						}
						.bank-name-num{
							font-size: 26upx;
							color: #4F4F4F;
							.bank-name{
								font-size: 32upx;
								color: #4F4F4F;
								margin-bottom: 16upx;
							}
						}
					}
					.bank-delete{
						width: 120upx;
						height: 48upx;
						border-radius: 24upx;
						border: 2upx solid #DEDEDE;
						text-align: center;
						line-height: 48upx;
						box-sizing: border-box;
						color: #6C6C6C;
						font-size: 26upx;
					}
				}
				.bank-bottom{
					height: 80upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					font-size: 24upx;
					color: #4F4F4F;
					image{
						width: 28upx;
						height: 28upx;
						margin-right: 20upx;
					}
				}
			}
			.add-bank{
				width: 686upx;
				height: 88upx;
				border-radius: 4upx;
				border: 2upx dotted #C4C4C4;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #757876;
				font-size: 34upx;
				image{
					width: 28upx;
					height: 28upx;
					margin-right: 14upx;
				}
			}
		}
	
		.no-card{
			text-align: center;
			image{
				width: 500upx;
				height: 346upx;
			}
			.tip{
				margin: 16upx auto 58upx auto;
				color: #4F4F4F;
			}
			.add{
				width: 262upx;
				height: 88upx;
				background: #27CE85;
				border-radius: 12upx;
				line-height: 88upx;
				font-size: 34upx;
				color: #FFFFFF;
				margin: 0 auto;
			}
		}
	}
</style>
