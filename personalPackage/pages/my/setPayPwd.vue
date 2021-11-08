<template>
	<view class="setPwd" v-if="type==1">
		<view class="title">请设置支付密码</view>
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
	</view>
	<view class="setPwd" v-else>
		<view class="title">请确认支付密码</view>
		<view class="input-wrapper">
			<view class="show-input">
				<input v-model="passwordInfo.v1" type="password" :disabled="true" />
				<input v-model="passwordInfo.v2" type="password" :disabled="true" />
				<input v-model="passwordInfo.v3" type="password" :disabled="true" />
				<input v-model="passwordInfo.v4" type="password" :disabled="true" />
				<input v-model="passwordInfo.v5" type="password" :disabled="true" />
				<input v-model="passwordInfo.v6" type="password" :disabled="true" />
			</view>
			<input class="hidden-input" v-model="againRealPwd" type="number" maxlength="6" />
		</view>
	</view>
</template>

<script>
	import {
		setPayPwd
	} from '@/api/user.js'
	export default {
		data() {
			return {
				// type 密码类型 1表示第一次输入的密码，2表示第二层输入的密码
				type: 1,
				passwordInfo: {
					v1: null,
					v2: null,
					v3: null,
					v4: null,
					v5: null,
					v6: null,
				},
				realPwd: '',
				againRealPwd: '',
				inputFlag: false
			};
		},
		watch: {
			realPwd(v) {
				console.log("我市实际值", v)
				this.setFakeValue(v, 1)
			},
			againRealPwd(v) {
				this.setFakeValue(v, 2)
			}
		},
		onLoad(opt) {},
		methods: {
			setFakeValue(v, type) {
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

						if (type == 1) {
							this.type = 2
							this.passwordInfo.v1 = '';
							this.passwordInfo.v2 = '';
							this.passwordInfo.v3 = '';
							this.passwordInfo.v4 = '';
							this.passwordInfo.v5 = '';
							this.passwordInfo.v6 = '';
							console.log('type', this.type)
						} else {
							if (this.realPwd === this.againRealPwd) {
								let prm = {
									usePayPwd: this.againRealPwd
								}
								uni.showLoading({
									title: '正在设置'
								})
								setPayPwd(prm).then(res => {
									uni.hideLoading()
									uni.showToast({
										title: res.data.msg,
										duration: 2000,
										success: (data) => {
											// 做跳转
											if (uni.getStorageSync('refreshPwdFullPath')) {
												uni.navigateTo({
													url: uni.getStorageSync('refreshPwdFullPath'),
													success() {
														uni.removeStorageSync('refreshPwdFullPath')
													}
												})
											}else{
												uni.navigateBack({})
											}
										}
									})
								}).catch(err => {
									this.hideLoading()
								})
							} else {
								uni.showModal({
									title: '您两次输入密码不一致，请重新输入',
									cancelText: '取消',
									confirmColor: "#4CD964",
									confirmText: '重新输入',
									success: res => {
										if (res.confirm) {
											this.type === 1
											this.realPwd = ''
											this.againRealPwd = ''
										}
									}
								})
							}
						}

						break;
				}
			}
		}
	}
</script>

<style lang="less">
	.setPwd {
		width: 100%;

		.title {
			width: 100%;
			font-size: 40upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			text-align: center;
			margin: 124upx 0 90upx 0;
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
					font-size: 80upx;
					padding: 0;

					&:last-child {
						border: none;
					}
				}
			}

			.hidden-input {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 9999;
				line-height: 100upx;
				opacity: 0;
			}
		}
	}
</style>
