<template>
	<view class="content">
		<header-bar :nav='headerBarNav'></header-bar>
		<view class="header-container" :style="{'top':statusBarHeight}">
			<view class="header">
				<image class="personal-icon" src="../../static/imgs/personal.png" mode=""
					@click="goToUrl('/personalPackage/pages/my/my')"></image>
				<image class="logo" src="../../static/imgs/logo.png" mode=""></image>
				<view class="message">
					<image @click="goToUrl('/thirdPackage/pages/message/messageCenter')" class="messageIcon" src="../../static/imgs/information.png" mode=""></image>
					<image  @click="goToUrl('/pages/receiveOrderSetting/receiveOrderSetting')" src="../../static/imgs/receiveOrderSetting.png" mode=""></image>
					<view v-show="messageNum>0" class="info-num">{{messageNum>99?'99+':messageNum}}</view>
				</view>
			</view>
			<view class="menu">
				<view @click="toggleStatus('new')" :class="{'menu-item':true,'active':status==='new'}">新任务</view>
				<view @click="toggleStatus('wait')" :class="{'menu-item':true,'active':status==='wait'}">待收货</view>
				<view @click="toggleStatus('finish')" :class="{'menu-item':true,'active':status==='finish'}">已完成</view>
			</view>
			<view class="sign">
				<view class="item">
					<view :class="{'sign-item':true,'active':status==='new'}"></view>
				</view>
				<view class="item">
					<view :class="{'sign-item':true,'active':status==='wait'}"></view>
				</view>
				<view class="item">
					<view :class="{'sign-item':true,'active':status==='finish'}"></view>
				</view>
			</view>
		</view>

		<!-- <view @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove" class="info-container" :style="{'margin-top': marginTop+'px'}"> -->
		<view class="info-container">
			<!-- <view class="takePlace">
				<image src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=909624486,4182680343&fm=26&gp=0.jpg" mode=""></image>
			</view> -->
			<newTask :isLoadPageData.sync='isLoadPageData' :scrollTop0.sync='scrollTop0' :loadFlag.sync='loadFlag' :refreshFlag.sync='refreshFlag'
				:status='status'></newTask>
		</view>
		<view class="fixed-footer">
			<view v-if="workState===1" class="btn" @click="changeUserStatus">
				<image src="../../static/imgs/status.png" mode=""></image>
				<view>接单中</view>
			</view>
			<view v-else class="btn" @click="changeUserStatus">
				<image src="../../static/imgs/offStatus.png" mode=""></image>
				<view>离线中</view>
			</view>
			<view class="btn refreshBtn" @click="refreshHandle">
				<view class="refresh refreshLoading">
					<image src="../../static/imgs/refresh.png" mode=""></image>
				</view>
				<view class="refreshText">刷新</view>
			</view>
			<view class="btn" @click="scanCodeHandle">
				<image src="../../static/imgs/scanCode.png" mode=""></image>
				<view>扫码入库</view>
			</view>
		</view>
		<userStatusModal :workState.sync='workState' :modalFlag.sync='modalFlag'></userStatusModal>
	</view>
</template>

<script>
	import { getNotReadMessage } from '../../api/common.js'
	import newTask from '@/components/newTask.vue'
	import userStatusModal from '@/components/userStatusModal.vue'
	export default {
		components: {
			newTask,
			userStatusModal
		},
		data() {
			return {
				isLoadPageData:false,
				onlyOnceRequest:true,
				timerSign:null,
				messageNum:0,
				// 头部配置
				headerBarNav:{
					'bg':'#fff',  //背景色
					'color':'red',  //字体颜色
					'isdisPlayNavTitle':false, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle':'', //导航标题
					backUrl:'/pages/index/index'
				},
				statusBarHeight: 0,
				
				modalFlag: false,
				workState: 1,
				refreshFlag: false,
				loadFlag: false,
				status: 'new',
				isStatusChange:false,

				scrollTop0: true,

				// 定义自定义下拉刷新距离值
				marginTop: 0,
				startY: 0,
				endY: 0
			}
		},
		watch:{
			isLoadPageData(val){
				if(val&&this.onlyOnceRequest){
					this.onlyOnceRequest = false
					this.getNotReadMessageFn()
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop0 = e.scrollTop === 0 ? true : false
			if(e.scrollTop===0){
				this.refreshHandle()
			}
		},
		onLoad(opt) {
			uni.getSystemInfo({
				success:(res) => {
					this.statusBarHeight = res.statusBarHeight+48+'px'
					console.log("res",res)
				}
			})
			this.status = opt.status ? opt.status : this.status
			this.refreshHandle()
			/* uni.navigateTo({
				url:'/personalPackage/pages/my/headerTest'
			})
			 */
		},
		onShow() {
			this.workState = parseInt(uni.getStorageSync('workState'))
			this.timerSign = setInterval(()=>{
				this.getNotReadMessageFn()
			},120000)
			// this.getNotReadMessageFn()
			// this.refreshHandle()
			console.log(this.workState)
		},
		onHide() {
			clearInterval(this.timerSign)
		},
		onReachBottom() {
			this.loadFlag = true
		},
		methods: {
			getNotReadMessageFn(){
				getNotReadMessage().then(res=>{
					this.messageNum = res.data.result
				})
			},
			changeUserStatus() {
				this.modalFlag = true
			},
			toggleStatus(status) {
				// 切换newTask组件状态值，切换数据

				// 切换标识值
				this.scrollTop0 = true
				this.status = status
			},
			refreshHandle() {
				this.refreshFlag = true
			},
			goToUrl(url) {
				uni.navigateTo({
					url
				})
			},/* 
			scanCodeHandle(){
				 let aaa = "https://zmhs.com.cn/qr?data={\'type\':1,\'recyclerId\':7}"
				 let data = aaa.substring(aaa.indexOf('data=')+5)
				 let newData = data.replace(/\'/g,'"').replace(/[\\]/g,'')
				 // console.log(newData.type)
				 console.log(JSON.parse(newData).type)
				 console.log(newData)
			}, */
			 scanCodeHandle(){
				uni.scanCode({
					success:(res)=>{
						console.log('res',res)
						// 扫码成功
						if(res.errMsg.indexOf('ok')!==-1){
							let {result} = res
							let data = result.substring(result.indexOf('data=')+5)
							// data = data.substring(0,data.length-1)
							data = data.replace(/[\\]/g,'')
							/* let dataObj = JSON.parse(newData) */
							console.log(data)
							uni.navigateTo({
								url:'/pages/putInStorage/putInStorage?data='+data
							})
						}
					}
				})
			 }
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
	}

	.content {
		height: 100%;
		width: 750upx;
		box-sizing: border-box;
		padding: 0;
		position: relative;

		.header-container {
			box-shadow: 0px 3px 3px 0px rgba(146, 171, 160, 0.27);
			position: fixed;
			width: 100%;
			left: 0;
			top: 0;
			background: #fff;
			z-index: 9999;

			.header {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				height: 79upx;
				align-items: baseline;
				padding: 0 40upx 19upx 40upx;

				.personal-icon {
					width: 44upx;
					height: 44upx;
				}

				.logo {
					width: 188upx;
					height: 54upx;
				}

				.message {
					position: relative;

					image {
						width: 44upx;
						height: 44upx;
					}
					.messageIcon{
						margin-right: 38upx;
					}

					.info-num {
						position: absolute;
						left: 20upx;
						bottom: 34upx;
						background: #F05858;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FFFFFF;
						text-align: center;
						font-size: 24upx;
						height: 30upx;
						min-width: 30upx;
						padding: 0 8upx;
						line-height: 30upx;
						border-radius: 15upx;
						box-sizing: border-box;
					}
				}
			}

			.menu {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				padding: 16upx 74upx 20upx 74upx;
				color: #666666;
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;

				.active {
					color: #333333;
					font-weight: 600;
					font-size: 34upx;
				}
			}

			.sign {
				width: 100%;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				padding: 0 74upx;

				.item {
					box-sizing: border-box;
					padding-left: 34upx;
					flex: 0 90upx;
					width: 90upx;
				}

				.sign-item {
					width: 34upx;
					height: 10upx;
					background: #fff;
					border-radius: 6upx;

					&.active {
						background: #23CE85;
					}
				}
			}
		}

		.info-container {
			height: 100%;

			.takePlace {
				width: 100%;
				height: 160upx;
				background: #fff;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 80upx;
					height: 80upx;
				}
			}
		}

		.fixed-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 750upx;
			box-sizing: border-box;
			height: 108upx;
			background: #fff;
			color: #666666;
			font-size: 26upx;
			display: flex;

			.btn {
				padding: 12upx 0 0 0;
				width: 250upx;
				text-align: center;

				image {
					width: 52upx;
					height: 52upx;
				}
			}

			.refreshBtn {
				position: relative;

				.refresh {
					width: 110upx;
					height: 110upx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #fff;
					border-radius: 50%;
					position: absolute;
					box-shadow: 0px -8px 11px 0px rgba(19, 90, 60, 0.08);
					top: -48upx;
					left: 70upx;

					transition: all 2s;

					image {
						width: 86upx;
						height: 86upx;
					}
				}

				.refreshText {
					margin-top: 60upx;
				}
			}
		}

	}

	/* .refreshLoading {
		// transform: rotate(30deg);
		transform: rotate(180deg);
	} */
</style>
