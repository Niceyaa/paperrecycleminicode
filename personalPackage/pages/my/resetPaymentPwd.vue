 <template>
 	<view class="setPayPwd">
 		<view class="title">重置支付密码</view>
 		<view :class="{'input-item':true, 'active':oldPwdFlag}">
 			<view class="item-left">原密码</view>
 			<input maxlength="6" v-model="oldPwd" type="password" placeholder="请输入原密码">
 		</view>
 		<view :class="{'input-item':true, 'active':newPwdFlag}">
 			<view class="item-left">新密码</view>
 			<input maxlength="6" v-model="newPwd" type="password" placeholder="请输入新密码">
 		</view>
 		<view :class="{'input-item':true, 'active':againPwdFlag}">
 			<view class="item-left">确认密码</view>
 			<input maxlength="6" v-model="againPwd" type="password" placeholder="请再次输入密码">
 		</view>
 		<view @click="saveHandle" class="sureBtn">确认</view>
 	</view>
 </template>
 
 <script>
	 import { resetPayPwd } from '@/api/user.js'
 	export default {
 		data() {
 			return {
 				newPwd: '',
 				oldPwd: '',
 				againPwd: '',
 				newPwdFlag:false,
 				oldPwdFlag:false,
 				againPwdFlag:false,
 			};
 		},
 		watch:{
 			newPwd(v){
 					this.newPwdFlag = v.length>0?true:false
 			},
 			oldPwd(v){
 					this.oldPwdFlag = v.length>0?true:false
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
				if(this.oldPwd===this.newPwd){
					uni.showToast({
						title:'新密码不能与原密码相同',
						icon:'none'
					})
				}else if(this.newPwd!==this.againPwd){
					uni.showToast({
						title:'您两次输入的密码不一致'
					})
				}else{
					let prm = {
						newPayPwd:this.againPwd,
						oldPayPwd:this.oldPwd
					}
					uni.showLoading({
						title:'正在重置...'
					})
					resetPayPwd(prm).then(res=>{
						uni.showToast({
							title:'设置成功'
						})
						uni.hideLoading()
						uni.navigateTo({
							url:'/personalPackage/pages/my/setPwdResult'
						})
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
 