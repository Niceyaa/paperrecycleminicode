<template>
	<view class="content">
		<view class="imgCut">
			<view class="img-wrapper">
				<image class='origin-img' :src="imgSrc" mode="widthFix"></image>
			</view>
			<view class="mask"></view>
			<canvas @touchstart="tapStart" @touchend="tapEnd" @touchmove="tapMove" class="cutCanvas" id='cutCanvas1' canvas-id="cutCanvas1"></canvas>
			<view class="btn-wrapper">
				<view class="cancel-btn">取消</view>
				<view @click="chooseImg" class="cancel-btn">选择图片</view>
				<view @click="sureHandle" class="sure-btn">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				width:"",
				imgSrc: ''
			}
		},
		
		onLoad(opt) {
			
		},
		onShow() {
			this.initCanvas()
		},
		onReachBottom() {
			this.loadFlag = true
		},
		methods: {
			tapStart(ev){
				console.log('start',ev)
			},
			tapEnd(ev){
				console.log('end',ev)
			},
			tapMove(ev){
				console.log('move',ev)
			},
			chooseImg(){
				uni.chooseImage({
					count:1,
					success:res=>{
						
						this.imgSrc = res.tempFilePaths[0]
					}
				})
			},
			sureHandle(){
				console.log(111)
				const ctx = uni.createCanvasContext()
				// ctx.draw(true,()=>{
					console.log('哈哈哈哈哈',this.imgSrc)
					uni.canvasToTempFilePath({
					canvasId:'cutCanvas1',
					success:(ref)=>{
						console.log(ref)
						let img = "http://tmp/nZKE3ODFoZMY5d883c796c7ce7eff0e7471b35e3e9fd.jpg"
						uni.uploadFile({
							url: `${this.$baseURL}/zmsys-file/api/fileManage/upload`,
							filePath: ref.tempFilePath,
							name: 'file',
							header: {
								token: uni.getStorageSync('token')
							},
							formData: {
								uploadType: 1
							},
							success: (finishRes => {
								let data = JSON.parse(finishRes.data)
								if (data.code === 200) { //表示图片上传成功
									console.log('data',data)
									this.imgSrc = data.result.url
								}
							}),
							fail: () => {
								uni.hideLoading()
							}
						})
					}
				})
				
				// })
				// this.initCanvas()
			},
			initCanvas(){
				let info = uni.getSystemInfo({
					success:(res)=>{
						console.log(res)
						this.width = res.screenWidth
						let canWidth = this.width*60/75
						let canCenter = canWidth/2
						
						let context = uni.createCanvasContext('cutCanvas1')
						/* context.arc(100, 75, 50, 0, 2 * Math.PI)
						context.rect(10, 10, 100, 30)
						context.setFillStyle('yellow')
						context.fill()
						context.draw() */
						context.setStrokeStyle('#000')
						context.beginPath()
						context.setLineWidth(2)
						context.arc(canCenter,canCenter,canCenter,0,2 * Math.PI)
						context.setFillStyle('rgba(255,255,255,.3)')
						context.fill()
						context.draw()
					}
				})
				
			},
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

		
		.imgCut{
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999;
			overflow: auto;
			.img-wrapper{
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				padding: 30upx 30upx 170upx 30upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.origin-img{
				width: 100%;
				height: auto;
			}
			.mask{
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,.5);
				position: absolute;
				top: 0;
				left: 0;
			}
			.cutCanvas{
				width: 600upx;
				height: 600upx;
				position: fixed;
				top: 300upx;
				left: 75upx;
				z-index: 10000;
			}
			.btn-wrapper{
				position: absolute;
				bottom: 0;
				left: 0;
				width: 750upx;
				height: 140upx;
				background: #212121;
				box-shadow: 0px 4upx 8upx 0px rgba(0, 0, 0, 0.5);
				padding: 56upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				z-index: 9999999;
				box-sizing: border-box;
				color: #FFFFFF;
			}
		}

	}

	/* .refreshLoading {
		// transform: rotate(30deg);
		transform: rotate(180deg);
	} */
</style>
