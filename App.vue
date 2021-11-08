<script>
	export default {
		onLaunch: function(opt) {
			console.log('App Launch', opt)
			if (opt.query.scene) {
				uni.setStorageSync('recommendedCode', opt.query.scene)
			}
			// 判断登录状态，
			/* if(!uni.getStorageSync('loginStatus')){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			} */
			/* setInterval(()=>{
				uni.getLocation({
					success:(loc)=>{
						console.log("loc",loc)
					}
				})
			}) */
			/* if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			} else {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			} */
		},
		onShow: function() {
			console.log('App Show')
			const updateManager = uni.getUpdateManager(); // 获取更新管理器对象
			updateManager.onCheckForUpdate(function(res) {
				console.log("showres",res)
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，点击确定重新启动',
							showCancel: false,
							success: res => {
								if (res.confirm) {
									updateManager.applyUpdate();
								}
							}
						})
					})
					updateManager.onUpdateFailed(function() {
						uni.showModal({
							title: '提示',
							content: '检查到有新版本，但是下载失败，请检查网络设置',
							showCancel: false
						})
					})
				}
			})
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
