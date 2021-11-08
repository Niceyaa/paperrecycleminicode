<template>
	<view class="common-modal" v-if='modalFlag'>
		<view class="modal-wrapper">
			<image :src="currentStatusInfo.img" mode=""></image>
			<view class="title">{{currentStatusInfo.title}}</view>
			<view class="desc">{{currentStatusInfo.desc}}</view>
			<view v-if="raceOrderStatus===0" class="sureBtn" @click="sureRaceOrder">确认抢单</view>
			<view v-if="raceOrderStatus===1" class="sureBtn" @click="goToUrl('/pages/index/index?status=wait')">前往收货</view>
			<view v-if="raceOrderStatus===603" class="sureBtn" @click="goToUrl('/personalPackage/pages/my/myAccount/recharge/recharge')">去充值</view>
			<view v-if="raceOrderStatus===604" class="sureBtn" @click="closeModal">继续抢单</view>
			<view v-if="raceOrderStatus===602" class="sureBtn" @click="goToUrl('/personalPackage/pages/my/my')">立即认证</view>
			<view v-if="isShowSeeSee" @click="closeModal" class="noSureBtn">{{tipContent}}</view>
			<view v-if="isShowBackList" @click="backToList" class="noSureBtn">返回列表</view>
			<!-- <view @click="closeModal" class="noSureBtn">联系客服</view> -->
		</view>
	</view>
</template>

<script>
	import {
		raceOrder
	} from '../api/order.js'
	export default {
		data() {
			return {
				tipContent:'我再看看',
				allStatusInfo: {
					raceOrder: {
						img: "../static/imgs/raceOrder.png",
						title: '是否抢单？',
						desc: '抢单后请按订单地址完成收货',
					},
					raceOrderOk: {
						img: "../static/imgs/raceOrderOk.png",
						title: '抢单成功',
						desc: '抢单后请按订单地址完成收货',
					},
					needCharge: {
						img: "../static/imgs/raceOrderFail.png",
						title: '无法接单',
						desc: '您当前账户余额不足，需要充值后才能继续接单',
					},
					recedOrder: {
						img: "../static/imgs/raceOrderFail.png",
						title: '无法接单',
						desc: '已被其他小哥抢单',
					},
					needRealAuth: {
						img: "../static/imgs/raceOrderFail.png",
						title: '无法接单',
						desc: '您还没有实名认证',
					},
				},
				currentStatusInfo: {
					img: "../static/imgs/raceOrder.png",
					title: '是否抢单？',
					desc: '抢单后请按订单地址完成收货',
				}
			}
		},
		computed: {
			newRaceOrderStatus() {
				return this.$props.raceOrderStatus
			}
		},
		watch: {
			modalFlag(val) {
				if (val) {
					console.log("我执行了吗", val)
					this.toggleStatus(this.$props.raceOrderStatus)
				}
			},
			newRaceOrderStatus(val){
				if(val==1){
					this.tipContent = '继续抢单'
				}
				this.toggleStatus(val)
			}
		},
		props: {
			// 抢单状态 
			// 0：是否抢单
			// 1：抢单成功
			// 603：授信额度不足，需要充值
			// 604：已被其他小哥抢单
			// 602：未实名认证
			raceOrderStatus: {
				type: Number,
				default: 0
			},
			retrieveOrderId: {
				type: String
			},
			modalFlag: {
				type: Boolean,
				default: false
			},
			modalRefreshFlag: {
				type: Boolean,
				default: false
			},
			isShowSeeSee: {
				type: Boolean,
				default: true
			},
			isShowBackList: {
				type: Boolean,
				default: false
			},
			orderStatusStr: {
				type: String
			}
		},
		methods: {
			toggleStatus(val){
				switch (val) {
					case 0:
						this.currentStatusInfo = this.allStatusInfo.raceOrder
						break
					case 1:
						this.currentStatusInfo = this.allStatusInfo.raceOrderOk
						break
					case 603:
						this.currentStatusInfo = this.allStatusInfo.needCharge
						break
					case 604:
						this.currentStatusInfo = this.allStatusInfo.racedOrder
						break
					case 602:
						this.currentStatusInfo = this.allStatusInfo.needRealAuth
						break
				}
			},
			goToUrl(url) {
				uni.redirectTo({
					url
				})
			},
			closeModal() {
				this.$emit('update:modalFlag', false)
				this.$emit('update:modalRefreshFlag',true)
			},
			backToList(){
				uni.navigateBack({})
				this.$emit('update:modalFlag', false)
				this.$emit('update:modalRefreshFlag',true)
			},
			sureRaceOrder() {
				let prm = {
					retrieveOrderId: this.$props.retrieveOrderId
				}
				raceOrder(prm).then(res => {
					this.$emit('update:raceOrderStatus',1)
				}).catch(fail=>{
					// 根据失败信息做弹窗信息
					console.log('fail',fail)
					if(fail.data&&fail.data.code){
						this.$emit("update:raceOrderStatus",fail.data.code)
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.common-modal {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.53);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		z-index: 99999;

		.modal-wrapper {
			width: 600upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			box-sizing: border-box;
			padding: 0 0 86upx 0;
			background: #fff;

			image {
				width: 600upx;
				height: 260upx;
			}

			.title {
				width: 480upx;
				text-align: center;
				font-size: 40upx;
				color: #343434;
				margin: 60upx 0 40upx 0;
			}

			.desc {
				width: 480upx;
				text-align: center;
				font-size: 28upx;
				color: #515151;
			}

			.sureBtn {
				width: 480upx;
				height: 88upx;
				background: #27CE85;
				border-radius: 12upx;
				line-height: 88upx;
				text-align: center;
				font-size: 34upx;
				color: #FFFFFF;
				margin-top: 50upx;
			}

			.noSureBtn {
				margin-top: 34upx;
				box-sizing: border-box;
				width: 480upx;
				height: 88upx;
				border-radius: 12upx;
				border: 2upx solid #C9D8D8;
				font-size: 34upx;
				text-align: center;
				line-height: 88upx;
				color: #515151;
			}
		}
	}
</style>
