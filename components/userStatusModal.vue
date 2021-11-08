<template>
	<view class="common-modal" v-if='modalFlag'>
		<view class="modal-wrapper">
			<image v-if="workState===1" src="../static/imgs/offlineImg.png" mode=""></image>
			<view v-if="workState===1" class="title">请确认下线</view>
			<view v-if="workState===1" class="desc">请确认下线，下线后将不能接单</view>
			<image v-if="workState===2" src="../static/imgs/onlineImg.png" mode=""></image>
			<view v-if="workState===2" class="title">请确认上线</view>
			<view v-if="workState===2" class="desc">请确认已做好接单准备，上线后可以接单</view>
			<view class="sureBtn" @click="sureHandle">确认</view>
			<view @click="closeModal" class="noSureBtn">取消</view>
		</view>
	</view>
</template>

<script>
	import {
		setUserStatus
	} from '../api/user.js'
	export default {
		data() {
			return {
				
			}
		},
		props: {
			modalFlag: {
				type: Boolean,
				default: false
			},
			workState:{
				type: Number,
				default: 1
			}
		},
		methods: {
			closeModal(){
				this.$emit('update:modalFlag',false)
			},
			sureHandle(){
				let workState = this.$props.workState===1?2:1
				let prm = {
					workState
				}
				uni.showLoading()
				setUserStatus(prm).then(res=>{
					if(res.data.code === 200){
						uni.hideLoading()
						uni.showToast({
							title:'设置成功'
						})
						uni.setStorageSync('workState',workState)
						this.$emit('update:modalFlag',false)
						this.$emit('update:workState',workState)
					}
				}).catch(err=>{
					uni.hideLoading()
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
