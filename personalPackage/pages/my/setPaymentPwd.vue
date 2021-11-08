<template>
	<view class="setPayPwd">
		<view class="title">设置支付密码</view>
		<view :class="{'input-item':true, 'active':pwdFlag}">
			<view class="item-left">新密码</view>
			<input maxlength="6" v-model="pwd" type="password" placeholder="请输入密码">
		</view>
		<view :class="{'input-item':true, 'active':againPwdFlag}">
			<view class="item-left">确认密码</view>
			<input maxlength="6" v-model="againPwd" type="password" placeholder="请再次输入密码">
		</view>
		<view @click="saveHandle" class="sureBtn">确认</view>
	</view>
</template>

<script>
	import { setPayPwd } from '@/api/user.js'
	export default {
		data() {
			return {
				pwd: '',
				againPwd: '',
				pwdFlag:false,
				againPwdFlag:false,
			};
		},
		watch:{
			pwd(v){
					this.pwdFlag = v.length>0?true:false
			},
			againPwd(v){
					this.againPwdFlag = v.length>0?true:false
			}
		},
		methods: {
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			saveHandle(){
				if(this.pwd!==this.againPwd){
					uni.showToast({
						title:'两次输入密码不一致',
						icon:'none'
					})
				}else{
					let prm = {
						payPwd:this.againPwd
					}
					uni.showLoading({
						title:'设置中...'
					})
					setPayPwd(prm).then(res=>{
						if(res.data.code === 200){
							uni.hideLoading()
							uni.navigateTo({
								url:"/personalPackage/pages/my/setPwdResult"
							})
						}
					}).catch(err=>{
						uni.hideLoading()
					})
				}
			}
		}
	}
</script>

<style lang="less">
	page {
		width: 100%;
		height: 100%;
	}

	.setPayPwd {
		width: 100%;
		position: relative;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		height: 100%;

		.title {
			font-size: 48upx;
			color: #333333;
			padding: 80upx 0 110upx 40upx;
		}

		.input-item {
			display: flex;
			align-items: center;
			margin: 0 53upx 0 46upx;
			border-bottom: 2upx solid #DDDDDD;
			height: 100upx;
			font-size: 30upx;
			color: #333333;

			.item-left {
				width: 168upx;
			}
			input{
				caret-color: #23CE85;
			}
			&.active{
				border-bottom: 2upx solid #23ce85;
			}
		}

		.sureBtn {
			width: 686upx;
			height: 88upx;
			line-height: 88upx;
			text-align: center;
			background: #23CE85;
			border-radius: 12upx;
			font-size: 34upx;
			color: #fff;
			position: absolute;
			bottom: 242upx;
			left: 32upx;
		}
	}
</style>
