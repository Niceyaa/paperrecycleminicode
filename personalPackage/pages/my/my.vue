<template>
	<view class="personal">
		<header-bar :nav='headerBarNav'></header-bar>
		<!-- <image @click="goToUrl('/thirdPackage/pages/personalInfo/personalInfo')" class='header-icon' :src="userData.userPhoto&&userData.userPhoto.length>0?userData.userPhoto:'../../static/imgs/headerIcon.png'" mode=""></image>
		<view class="username">{{userData.userNick?userData.userNick:''}}</view> -->
		<view class="header-wrapper">
			<image class="myBgc" src="../../static/imgs/myBgc.png" mode=""></image>
			<view class="inner-wrapper">
				<view class="headerIcon-wrapper">
					<image :class="{'headerIcon':true, 'isExcellentFlag':userData.showData.isExcellentUser}" :src="userData.showData.userPhoto.length>0?userData.showData.userPhoto:'../../static/imgs/headerIcon.png'" mode=""></image>
					<image v-if="userData.showData.isExcellentUser" class="excellentIcon" src="../../static/imgs/excellentRecycleUserIcon.png" mode=""></image>
					<view v-else class="excellentIcon" style="padding-bottom: 15upx;"></view>
					<view class="work-status" v-if="userData.showData.workState===1">
						<view class="work-sign"></view>
						<view class="work-txt">在线</view>
					</view>
					<view class="work-status" v-if="userData.showData.workState===2">
						<view class="work-sign grayBgc"></view>
						<view class="work-txt grayBgc">离线</view>
					</view>
				</view>
				<view class="inner-right">
					<view class="user-info">
						<view class="info-top">
							<view class="username1">{{userData.showData.realName.length>0?userData.showData.realName:'信息未认证'}}</view>
							<image v-if="userData.showData.isRealNameCheck" class="auth-icon" src="../../static/imgs/alreadyAuthIcon.png" mode=""></image>
						</view>
						<view class="info-bottom">
							<image class="star" v-for="(item,idx) in (parseInt(userData.showData.evaluateScore))" :key='idx' src="../../static/imgs/fillStar.png" mode=""></image>
							<image class="star" v-for="(item,idx) in (parseInt(5-userData.showData.evaluateScore))" :key='idx' src="../../static/imgs/noFillStar.png" mode="">
							</image>
							<view class="score">{{userData.showData.evaluateScore}}</view>
							<view class="separator"></view>
							<view class="finish-order">{{userData.showData.retrieveOrderAmount}}单</view>
						</view>
					</view>
					<view class="personal-btn" @click="goToUrl('/thirdPackage/pages/personalInfo/personalInfo')">
						<image src="../../static/imgs/storageIcon.png" mode=""></image>
						<view class="btn-txt">个人资料</view>
					</view>
				</view>
			</view>
		</view>
		<view class="item-wrapper">
			<view class="info-item noBorder"
				@click="goToUrl('/personalPackage/pages/my/orderStatistic/orderStatistic')">
				<view class="item-left">
					<image src="../../static/imgs/orderStatistic.png" mode=""></image>
					<view>订单统计</view>
				</view>
				<image class="item-right right-icon" src="../../static/imgs/rightIcon.png" mode=""></image>
			</view>
			<view class="info-item" @click="goToUrl('/personalPackage/pages/my/myAccount/myAccount')">
				<view class="item-left">
					<image src="../../static/imgs/myAccount.png" mode=""></image>
					<view>我的账户</view>
				</view>
				<view class="item-right">
					<text>余额￥{{userData.accountBalances}}</text>
					<image src="../../static/imgs/rightIcon.png" mode=""></image>
				</view>
			</view>
			<view class="info-item" @click="goToAuth">
				<view class="item-left">
					<image src="../../static/imgs/realAuth.png" mode=""></image>
					<view>实名认证</view>
				</view>
				<view class="item-right">
					<text v-if="userData.checkStatus===0">未通过</text>
					<text v-if="userData.checkStatus===1">已通过</text>
					<text v-if="userData.checkStatus===2">审核中</text>
					<text v-if="userData.checkStatus===3">未认证</text>
					<image src="../../static/imgs/rightIcon.png" mode=""></image>
				</view>
			</view>
			<view v-if="userData.isSetPayPwd" class="info-item"
				@click="goToUrl('/personalPackage/pages/my/resetPaymentPwd')">
				<view class="item-left">
					<image src="../../static/imgs/payPwd.png" mode=""></image>
					<view>重置支付密码</view>
				</view>
				<image class="item-right" src="../../static/imgs/rightIcon.png" mode=""></image>
			</view>
			<view v-else class="info-item" @click="goToUrl('/personalPackage/pages/my/setPaymentPwd')">
				<view class="item-left">
					<image src="../../static/imgs/payPwd.png" mode=""></image>
					<view>设置支付密码</view>
				</view>
				<image class="item-right" src="../../static/imgs/rightIcon.png" mode=""></image>
			</view>
			<view class="info-item" @click="goToUrl('/personalPackage/pages/my/storageRecord/storageRecord')">
				<view class="item-left">
					<image src="../../static/imgs/storageIcon.png" mode=""></image>
					<view>入库记录</view>
				</view>
				<image class="item-right" src="../../static/imgs/rightIcon.png" mode=""></image>
			</view>
			<view class="info-item" @click="goToUrl('/personalPackage/pages/my/nearRecycleBin')">
				<view class="item-left">
					<image src="../../static/imgs/nearRecycleIcon.png" mode=""></image>
					<view>附近打包站</view>
				</view>
				<image class="item-right" src="../../static/imgs/rightIcon.png" mode=""></image>
			</view>

		</view>
		<view class="help-wrapper">
			<view class="help-item" @click="goToUrl('/personalPackage/pages/my/helpCenter')">
				<image src="../../static/imgs/help.png" mode=""></image>
				<view>帮助中心</view>
			</view>
			<view class="help-item" @click="goToUrl('/personalPackage/pages/my/contactService')">
				<image src="../../static/imgs/contact.png" mode=""></image>
				<view>联系客服</view>
			</view>
			<view class="help-item last" @click="loginOutHandle">
				<image src="../../static/imgs/loginOut.png" mode=""></image>
				<view>退出登录</view>
			</view>
			<!-- <button class="help-btn">
				<image src="../../static/imgs/help.png" mode=""></image>
				<view>联系客服</view>
			</button> -->
		</view>
	</view>
</template>

<script>
	import {
		getUserInfo,
		loginOut,
		getAuthPrm
	} from '@/api/user.js'
	export default {
		data() {
			return {
				userData: {
					accountBalances: 0.00,
					isSetPayPwd: false,
					userName: null,
					userNick: null,
					checkStatus: null,
					userPhoto: null,
					userPhone: null,
					showData:{}
				},
				headerBarNav: {
					'bg': '#23CE85', //背景色
					'color': 'red', //字体颜色
					'backIconType': 'white',
					'isdisPlayNavTitle': true, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle': '', //导航标题
					backUrl: '/pages/index/index'
				}
			};
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			goToAuth() {
				console.log(111)
				let url = this.userData.checkStatus === 3 ? '/personalPackage/pages/my/realNameAuth' :
					'/personalPackage/pages/my/realNameAuthResult?checkStatus=' + this.userData.checkStatus
				uni.navigateTo({
					// url:'/personalPackage/pages/my/realNameAuthResult'
					url
				})
				/* getAuthPrm().then(res=>{
					let {result} = res.data
					wx.navigateToMiniProgram({
						appId:'wx88736d7d39e2eda6',
						path:'pages/oauth/authindex',
						extraData:{
							api_version:result.api_version,
							appid:result.appid,
							mch_id:result.mch_id,
							openid:result.openid,
							nonce_str:result.nonce_str,
							response_type:result.response_type,
							scope:result.scope,
							sign:result.sign,
							sign_type:result.sign_type,
						},
						envVersion:'release',
						success(resu) {
							console.log("打开成功",resu)
						},
						fail(err) {
							console.log("错误信息",err)
						}
					})
				}) */
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},
			getUserInfo() {
				getUserInfo().then(res => {
					let {
						result
					} = res.data
					// 将余额存于本地
					uni.setStorageSync('accountBalance', result.accountBalances)
					this.userData.accountBalances = result.accountBalances
					this.userData.isSetPayPwd = result.isSetPayPwd
					this.userData.userName = result.userName
					this.userData.userNick = result.userNick
					this.userData.checkStatus = result.checkStatus
					this.userData.userPhone = result.retrieveUserForShowBaseVO.userPhone
					this.userData.showData = result.retrieveUserForShowBaseVO
					this.userData.userPhoto = result.userPhoto && result.userPhoto.length > 0 ? result.userPhoto :
						this.userData.userPhoto
					uni.setStorageSync('userPhone', result.retrieveUserForShowBaseVO.userPhone)
				})
			},
			loginOutHandle() {
				loginOut().then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							title: '退出成功'
						})
						uni.clearStorage()
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.personal {
		width: 100%;
		box-sizing: border-box;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		padding-bottom: 60upx;

		.header-wrapper {
			width: 100%;
			position: relative;

			.myBgc {
				width: 100%;
				height: 228upx;
				margin-top: -4upx;
			}

			.inner-wrapper {
				position: absolute;
				top: 88upx;
				width: 702upx;
				box-sizing: border-box;
				background: #fff;
				margin: 0 24upx;
				box-shadow: 0px 2upx 14upx 0upx rgba(224, 224, 224, 0.5);
				border-radius: 20upx;
				z-index: 9999;
				padding: 63upx 0 63upx 40upx;
				display: flex;

				.headerIcon-wrapper {
					width: 140upx;
					position: relative;
					margin-right: 26upx;
					flex: 0 140upx;

					.headerIcon {
						position: absolute;
						top: -116upx;
						left: -4upx;
						box-sizing: border-box;
						width: 140upx;
						height: 140upx;
						border-radius: 100%;
						z-index: -1;

						&.isExcellentFlag {
							border: 4upx solid #F4C775;
						}
					}

					.excellentIcon {
						width: 134upx;
						height: 44upx;
						padding-bottom: 8upx;
						z-index: 9999999;
					}

					.work-status {
						display: flex;
						align-items: center;
						justify-content: center;

						.work-sign {
							width: 12upx;
							height: 12upx;
							background: #23CE85;
							border-radius: 100%;
							margin-right: 8upx;
							&.grayBgc{
								background: #A9A9A9;
							}
						}

						.work-txt {
							font-size: 24upx;
							color: #6F6F6F;
							&.grayBgc{
								color: #A9A9A9;
							}
						}
					}
				}

				.inner-right {
					display: flex;
					align-items: center;
					justify-content: space-between;
					flex: 1;
					.user-info {
						.info-top {
							display: flex;
							align-items: center;
							margin-bottom: 16upx;

							.username1 {
								font-size: 34upx;
								color: #333333;
							}

							.auth-icon {
								margin-left: 30upx;
								width: 132upx;
								height: 38upx;
							}
						}

						.info-bottom{
							display: flex;
							align-items: center;
							.star{
								width: 20upx;
								height: 20upx;
								margin-right: 8upx;
							}
							.score{
								font-size: 20upx;
								color: #4B4B4B;
								margin: 0 16upx 0 6upx;
							}
							.separator{
								width: 2upx;
								height: 18upx;
								background: #CACACA;
								margin-right: 16upx;
							}
							.finish-order{
								height: 30upx;
								background: #F4F4F4;
								border-radius: 22upx;
								padding: 0 15upx;
								text-align: center;
								line-height: 30upx;
								font-size: 20upx;
								color: #808080;
								
							}
						}
					}
					.personal-btn{
						width: 154upx;
						height: 42upx;
						display: flex;
						align-items: center;
						background: #D1F4E5;
						border-radius: 200upx 0px 0px 200upx;
						image{
							width: 20upx;
							height: 24upx;
							margin: 0 12upx;
						}
						.btn-txt{
							font-size: 24upx;
							color: #23CE85;
						}
					}

				}
			}
		}





		.header-icon {
			width: 120upx;
			height: 120upx;
			margin: 68upx 0 0 284upx;
		}

		.username {
			width: 100%;
			text-align: center;
			font-size: 30upx;
			color: #212121;
			margin: 20upx 0 28upx 0;
		}

		.item-wrapper {
			padding: 0 32upx;
			width: 100%;
			box-sizing: border-box;
		}

		.info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 34upx 0;
			border-top: 2upx #F0F0F0 solid;

			&.noBorder {
				border: none;
				margin-top: 66upx;
			}

			.item-left {
				display: flex;
				align-items: center;
				font-size: 30upx;
				color: #212121;

				image {
					margin-right: 40upx;
					width: 28upx;
					height: 34upx;
				}
			}

			image {
				&.item-right {
					width: 16upx;
					height: 26upx;
					margin-right: 10upx;
				}
			}

			.item-right {
				font-size: 26upx;
				color: #F97A31;

				image {
					width: 16upx;
					height: 26upx;
					margin: 10upx 10upx 0 18upx;
				}
			}
		}

		.help-wrapper {
			width: 100%;
			padding: 70upx 116upx 0 116upx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;

			.help-item {
				width: 104upx;
				text-align: center;
				font-size: 26upx;
				color: #2C2C2C;

				image {
					width: 90upx;
					height: 90upx;
					margin-bottom: 16upx;
				}
			}

			/deep/.help-btn {
				display: block;
				width: 104upx;
				text-align: center;
				font-size: 26upx;
				color: #2C2C2C;
				border: none !important;
				background: none;
				padding: 0;
				margin: 0;

				image {
					width: 90upx;
					height: 90upx;
				}
			}


		}
	}
</style>
