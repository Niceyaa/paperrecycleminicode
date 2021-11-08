<template>
		<web-view :src="articleUrl"></web-view>
	</view>
</template>

<script>
	import { getCommonUrl } from '../../../api/common.js'
	export default {
		data() {
			return {
				articleUrl:""
			};
		},
		onLoad() {
			let prm = {
				articleId:1
			}
			getCommonUrl(prm).then(res=>{
				this.articleUrl = res.data.result.articleUrl
			})
		},
		methods: {


		}
	}
</script>

<style lang="less">
	
</style>
