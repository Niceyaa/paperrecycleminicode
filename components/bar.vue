<template>
	<view>
		<view class="header"
			:style="{'height':titleBarHeight,'padding-top':statusBarHeight,'background-color': nav.bg}">
			<!-- <text class="iconfont leftArrow header-back weight"   :style="{'border':nav.color}" v-if="nav.isdisPlayNavTitle" @click="back"></text> -->
			<image v-if="nav.backIconType==='white'&&nav.isdisPlayNavTitle" @click="back" class="back-img" src="../static/imgs/whiteBack.png" mode=""></image>
			<image v-if="nav.backIconType!=='white'&&nav.isdisPlayNavTitle" @click="back" class="back-img" src="../static/imgs/blackBack.png" mode=""></image>
			<view class="header-title weight">{{nav.navTitle}}</view>
		</view>
		<view :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>
<script>
	export default {
		props: ["nav"],
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
			}
		},
		created() {
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					console.log("系统信息", res)
					/* if (res.model.indexOf('iPhone') !== -1) {
							that.titleBarHeight = 44 + 'px';
			 			} else {
			 				that.titleBarHeight = 48  + 'px';
						} */
					that.titleBarHeight = 48 + 'px';
					that.statusBarHeight = res.statusBarHeight + 'px'
				},

			})
		},
		methods: {
			// 回到上一页
			back() {
				if (this.$props.nav.backUrl) {
					console.log("backUrl",this.$props.nav.backUrl)
					uni.reLaunch({
						url: this.$props.nav.backUrl,
						success(){
							console.log("你看我之心了吗")
						},
						fail:(err)=>{
							console.log('跳转失败',err)
						}
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
	}

	.header .header-title {
		position: absolute;
		left: 50%;
		font-size: 34upx;
		transform: translateX(-50%);
	}

	.header-back {
		position: absolute;
		left: 15upx;
		font-size: 30upx;
		padding: 10upx;
		border-radius: 50%;
	}

	.back-img {
		position: absolute;
		left: 15upx;
		width: 48upx;
		height: 48upx;
	}
</style>
