<template>
	<view class="order-pay">
		<view class="money"><text class="unit">￥</text>{{payAmount}}</view>
		<view class="title">付款金额</view>
		<view class="input-wrapper">
			<view class="show-input">
				<input v-model="passwordInfo.v1" type="password" :disabled="true" />
				<input v-model="passwordInfo.v2" type="password" :disabled="true" />
				<input v-model="passwordInfo.v3" type="password" :disabled="true" />
				<input v-model="passwordInfo.v4" type="password" :disabled="true" />
				<input v-model="passwordInfo.v5" type="password" :disabled="true" />
				<input v-model="passwordInfo.v6" type="password" :disabled="true" />
			</view>
			<input class="hidden-input" v-model="realPwd" type="number" maxlength="6" />
		</view>
		<view @click="goToUrl" class="forgetPwd">
			<view>忘记密码？</view>
		</view>
	</view>
</template>

<script>
	import {
		pay
	} from '../../api/order.js'
	export default {
		data() {
			return {
				// 组件配置
				passwordInfo: {
					v1: null,
					v2: null,
					v3: null,
					v4: null,
					v5: null,
					v6: null,
				},
				realPwd: '',
				payAmount: 0,
				payType: 0,
				retrieveOrderId: '',
				inputFlag: false,
			};
		},
		watch: {
			realPwd(v) {
				console.log("我市实际值", v)
				let len = v.length;
				if (len > 0) {
					this.inputFlag = true;
				} else {
					this.inputFlag = false;
				}
				switch (len) {
					case 0:
						this.passwordInfo.v1 = '';
						this.passwordInfo.v2 = '';
						this.passwordInfo.v3 = '';
						this.passwordInfo.v4 = '';
						this.passwordInfo.v5 = '';
						this.passwordInfo.v6 = '';
						break;
					case 1:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = '';
						this.passwordInfo.v3 = '';
						this.passwordInfo.v4 = '';
						this.passwordInfo.v5 = '';
						this.passwordInfo.v6 = '';
						break;
					case 2:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = v.substr(1, 1);
						this.passwordInfo.v3 = '';
						this.passwordInfo.v4 = '';
						this.passwordInfo.v5 = '';
						this.passwordInfo.v6 = '';
						break;
					case 3:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = v.substr(1, 1);
						this.passwordInfo.v3 = v.substr(2, 1);
						this.passwordInfo.v4 = '';
						this.passwordInfo.v5 = '';
						this.passwordInfo.v6 = '';
						break;
					case 4:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = v.substr(1, 1);
						this.passwordInfo.v3 = v.substr(2, 1);
						this.passwordInfo.v4 = v.substr(3, 1);
						this.passwordInfo.v5 = '';
						this.passwordInfo.v6 = '';
						break;
					case 5:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = v.substr(1, 1);
						this.passwordInfo.v3 = v.substr(2, 1);
						this.passwordInfo.v4 = v.substr(3, 1);
						this.passwordInfo.v5 = v.substr(4, 1);
						this.passwordInfo.v6 = '';
						break;
					case 6:
						this.passwordInfo.v1 = v.substr(0, 1);
						this.passwordInfo.v2 = v.substr(1, 1);
						this.passwordInfo.v3 = v.substr(2, 1);
						this.passwordInfo.v4 = v.substr(3, 1);
						this.passwordInfo.v5 = v.substr(4, 1);
						this.passwordInfo.v6 = v.substr(5, 1);

						let prm = {
							// "payAmount": this.payAmount,
							"payPassWord": this.realPwd,
							// "payType": this.payType,
							"paymentToken": uni.getStorageSync('paymentToken'),
							"retrieveOrderId": this.retrieveOrderId,
						}
						pay(prm).then(res=>{
							// 表示支付成功
							if(res.data.code===200){
								uni.navigateTo({
									url:'/pages/orderDetail/payResult?code='+res.data.code+'&paymentType='+this.payType
								})
							}
						}).catch(fail=>{
							this.realPwd = ''
							/* uni.showModal({
								content:'密码错误',
								confirmColor:'#23CE85',
								confirmText:'忘记密码',
								success:(res)=>{
									// 跳转忘记密码页面
									if(res.cancel){
										this.realPwd = ''
									}else{
										uni.navigateTo({
											url:'/personalPackage/pages/my/forgetPwd'
										})
									}
								}
							}) */
						})

						break;
				}
			}
		},
		onLoad(opt) {
			this.payType = opt.payType
			this.payAmount = opt.payMoney
			this.retrieveOrderId = opt.retrieveOrderId
		},
		methods: {
			goToUrl(){
				uni.navigateTo({
					url:'/personalPackage/pages/my/forgetPwd'
				})
			}
		}
	}
</script>

<style lang="less">
	.order-pay {
		width: 100%;
		box-sizing: border-box;

		.money {
			.unit {
				font-size: 40upx;
			}

			text-align: center;
			font-size: 74upx;
			font-family: PingFangSC-Semibold,
			PingFang SC;
			font-weight: 600;
			color: #333333;
			margin-top: 150upx;
		}

		.title {
			text-align: center;
			font-size: 30upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9EA798;
			margin: 30upx 0 46upx 0;
		}
		.forgetPwd{
			display: flex;
			justify-content: flex-end;
			padding: 38upx 74upx 0 0;
			width: 100%;
			box-sizing: border-box;
			color: #0D92E7;
			font-size: 26upx;
		}

		.input-wrapper {
			margin: 0 auto;
			width: 602upx;
			position: relative;
			height: 100upx;
			border-radius: 6upx;
			border: 2upx solid #C9D0BC;

			.show-input {
				display: flex;
				align-items: center;
				box-sizing: border-box;

				input {
					width: 100upx;
					height: 100upx;
					box-sizing: border-box;
					border-right: 2upx solid #C9D0BC;
					line-height: 100upx;
					text-align: center;
					font-size: 40upx;
					padding: 0;

					&:last-child {
						border: none;
					}
				}
			}

			.hidden-input {
				width: 200%;
				height: 100%;
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: -100%;
				z-index: 9999;
				line-height: 100upx;
				opacity: 0;
			
				input {
					outline: none;
					color: rgba(0, 0, 0, 0);
				}
			}
		}
	}
</style>
