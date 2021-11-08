import {
	baseURL
} from '../main.js'

const apiRequest = (url, method, data, contentType = 'application/json') => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') ? uni.getStorageSync('token') : null
		// console.log('token',token)
		uni.request({
			url: baseURL + url,
			method: method,
			data: data,
			header: {
				token: token,
				'content-type': contentType
			},
			success(res) {
				console.log("success")
				if (res.data.code === 200) {
					resolve(res)
				}
				/* else if(res.data.code === 500){
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 3000
						
					})
				} */
				if (res.data.code !== 200) {
					reject(res)
					if (res.data.code === 401 || res.data.code === 402) {
						// 表示需要重新登陆---缓存刷新地址
						uni.showModal({
							title: '信息过期',
							content: '系统检测到您未登录或者登录信息过期，请重新登录！',
							confirmText: '去登陆',
							success(e) {
								if (e.confirm) {
									let pageList = getCurrentPages()
									uni.setStorageSync('refreshFullPath', pageList[pageList
										.length - 1].$page.fullPath)
									uni.redirectTo({
										url: '/pages/login/login'
									})
								}

							}
						})
					} else if (res.data.code === 702) {
						// 表示需要设置支付密码---缓存刷新地址
						let pageList = getCurrentPages()
						uni.setStorageSync('refreshPwdFullPath', pageList[pageList.length - 1].$page
							.fullPath)
						uni.navigateTo({
							url: '/personalPackage/pages/my/setPaymentPwd'
						})
					} else if (res.data.code === 601) {
						// 表示需要设置接单模式---缓存刷新地址
						let pageList = getCurrentPages()
						uni.setStorageSync('refreshFullPath', pageList[pageList.length - 1].$page
							.fullPath)
						uni.showModal({
							confirmText: '去设置',
							confirmColor: '#23CE85',
							content: "没有完成接单设置",
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/receiveOrderSetting/receiveOrderSetting'
									})
								}
							}
						})
					} else {
						setTimeout(() => {
							uni.showToast({
								title: res.data.msg,
								icon: 'none',
							})
						}, 600)
					}
				}
			},
			complete(res) {
				console.log("complete", res)

				if (!res.data || !res.data.code) {
					let errObj = {
						data: {
							msg: '系统出错'
						}
					}
					reject(errObj)
					/* uni.showToast({
						title: '系统出错',
						icon: "none",
						success() {
							reject(res)
						}
					}) */
				}
			}
		})
	})
}
export default apiRequest
