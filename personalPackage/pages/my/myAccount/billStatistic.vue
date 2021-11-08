<template>
	<view class="billStatistic">
		<view class="header-nav">
			<view class="nav-center">
				<view class="nav-item navActive">月账单</view>
				<!-- <view class="nav-item last-navItem">年账单</view> -->
			</view>
		</view>
		<view class="nav-content">
			<view class="top-content">
				<view class="nav-left">
					<view @click="changeType(0)" :class="{'item':true,'active':billType===0}">支出</view>
					<view @click="changeType(1)" :class="{'item':true,'active':billType===1}">收入</view>
				</view>
				<view class="nav-date">
					<picker class="date-picker" mode="date" fields="month" :value="searchInfo.date"
						@change="bindDateChange">
						<view class="uni-input">{{searchInfo.date}}</view>
					</picker>
					<image src="../../../static/imgs/downBlackArrow.png" mode=""></image>
				</view>
			</view>
			<view class="label">共支出{{serverData.sumCount}}笔，合计</view>
			<view class="money"><text>￥</text>{{serverData.sumAmount}}</view>
		</view>
		<view class="show-content">
			<view class="title">收入对比</view>
			<view class="qiun-charts">
				<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" disable-scroll=true
					@touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getIncomeAndExpensesStatistic
	} from '../../../../api/account.js'
	import uCharts from '@/lib/uchart/ucharts.js'
	var _self;
	var canvaColumn = null;
	export default {
		data() {
			return {
				// 图表配置信息
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				serverData: null,
				billType: 0,
				statisticsType: 0,
				searchInfo: {
					date: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}`,
					realDate: `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,0)}-01 00:00:00`,
				},
				yMaxValue:100000
			}
		},
		onLoad(opt) {
			// 图表配置
			if(opt.date){
				this.searchInfo.date = opt.date
				this.searchInfo.realDate = opt.date+'-01 00:00:00'
			}
			_self = this;
			this.cWidth = uni.upx2px(650);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			changeType(type) {
				this.billType = type
				this.getServerData()
			},
			bindDateChange(e) {
				this.searchInfo.date =
					`${new Date(e.detail.value).getFullYear()}-${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}`
				this.searchInfo.realDate =
					`${new Date(e.detail.value).getFullYear()}-${(new Date(e.detail.value).getMonth()+1).toString().padStart(2,0)}-01 00:00:00`,
					console.log(e.detail.value)
				this.getServerData()
			},
			getServerData() {
				/* uni.request({
					url: 'https://www.ucharts.cn/data.json',
					data: {},
					success: function(res) {
						console.log(res.data.data)
						//下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
						_self.serverData = res.data.data;
						let Column = {
							categories: [],
							series: []
						};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						Column.categories = res.data.data.Column.categories;
						Column.series = res.data.data.Column.series;
						_self.showColumn("canvasColumn", Column);
					},
					fail: () => {
						_self.tips = "网络错误，小程序端请检查合法域名";
					},
				}); */
				this.yMaxValue = 0
				let prm = {
					"billType": this.billType,
					"statisticsTime": this.searchInfo.realDate,
					"statisticsType": this.statisticsType
				}
				getIncomeAndExpensesStatistic(prm).then(res => {
					this.serverData = res.data.result
					let {monthStatisticsVOList} = res.data.result
					let categories = []
					let seriesData = []
					monthStatisticsVOList.forEach((item,idx)=>{
						categories.push(item.month)
						
						if(this.yMaxValue<Math.abs(item.totalAmount)){
							this.yMaxValue = Math.abs(item.totalAmount)
						}
						if(idx===monthStatisticsVOList.length-1){
							seriesData.push({
								value:Math.abs(item.totalAmount),
								color:"#1DB85C"
							})
						}else{
							seriesData.push({
							value:Math.abs(item.totalAmount),
							color:"#D3EBDD"
						})
						}
					})
					this.yMaxValue = this.yMaxValue*1.1
					let Column = {
						categories,
						series: [{
							color: "#D3EBDD",
							data: seriesData,
							name: "成交量A",
							textColor: "#1DB85C"
						}]
					}
					_self.showColumn("canvasColumn", Column);
				})
				/* let Column = {
					categories: ['2020.01', '2020.02', '2020.03', '2020.04', '2020.05', '2020.06', '2020.07',
						'2020.08', '2020.09', '2020.10', '2020.11', '2020.12',
					],
					series: [{
						color: "#D3EBDD",
						data: [100, 300, 95, 150, 112, 132, 112, 132, 111, 112, 132, 111],
						name: "成交量A",
						textColor: "#1DB85C"
					}]
				} */
				/* let temp = Column.series[0].data.map((item,idx)=>{
					return idx===1 ? {value:item,color:'#1DB85C'} : {value:item,color:'#D3EBDD'}
				})
				console.log("temp",temp)
				Column.series[0].data = temp */
				// _self.showColumn("canvasColumn", Column);
			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: false
					},
					enableScroll: true,
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
						itemCount: 6,
						// scrollShow: true,
						scrollAlign: 'right',
						scrollBackgroundColor: '#F7F7FF',
						scrollColor: '#DEE7F7',
					},
					yAxis: {
						disabled: true,
						disableGrid: true,
						max:this.yMaxValue
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: _self.cWidth * _self.pixelRatio * 0.8 / chartData.categories.length,
							meter: {
								fillColor: '#D3EBDD'
							}
						}
					}
				});

			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
			touchLineA(e) {
				canvaColumn.scrollStart(e);
			},
			moveLineA(e) {
				canvaColumn.scroll(e);
			},
			touchEndLineA(e) {
				canvaColumn.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				/* canvaColumn.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				}); */
			},
		}

	}
</script>

<style lang="less">
	.billStatistic {
		width: 100%;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;

		.header-nav {
			width: 100%;
			background: #19BF56;
			display: flex;
			justify-content: center;

			.nav-center {
				-width: 240upx;
				display: flex;
				justify-content: space-between;

				.nav-item {
					padding: 7upx 0;
					font-size: 32upx;
					color: rgba(255, 255, 255, 0.71);

					&.navActive {
						color: #fff;
						border-bottom: 3upx solid #fff;
					}
				}
			}
		}

		.nav-content {
			box-sizing: border-box;
			width: 100%;
			height: 440upx;
			background: url(../../../static/imgs/billStatisticBgc.png);
			background-size: 100% 100%;
			padding: 50upx 32upx 0 32upx;

			.top-content {
				display: flex;
				width: 100%;
				box-sizing: border-box;
				justify-content: space-between;

				.nav-left {
					width: 198upx;
					height: 52upx;
					background: rgba(255, 255, 255, 0.42);
					border-radius: 10upx;
					box-sizing: border-box;
					display: flex;

					.item {
						width: 96upx;
						text-align: center;
						line-height: 52upx;
						color: #fff;
						font-size: 26upx;

						&.active {
							background: #fff;
							width: 102upx;
							border-radius: 10upx;
							color: #1DB85C;
						}
					}
				}

				.nav-date {
					display: flex;
					align-items: center;
					font-size: 26upx;
					color: #FFFFFF;
					height: 52upx;
					line-height: 52upx;
					background: rgba(255, 255, 255, 0.42);
					border-radius: 10upx;
					padding: 0 18upx;

					image {
						width: 16upx;
						height: 10upx;
					}
				}
			}

			.label {
				margin: 90upx 0 20upx 0;
				font-size: 26upx;
				color: rgba(255, 255, 255, 0.72);
			}

			.money {
				font-size: 68upx;
				font-weight: 600;
				color: #FFFFFF;

				text {
					font-size: 32upx;
				}
			}
		}

		.show-content {
			width: 100%;
			background: #FFFFFF;
			border-radius: 28upx 28upx 0upx 0upx;
			margin-top: -32upx;
			box-sizing: border-box;
			padding: 0 50upx;

			.title {
				padding: 50upx 0 0 0;
				font-size: 36upx;
				color: #212121;
			}
		}

		.qiun-charts {
			width: 750upx;
			height: 500upx;
			background-color: #FFFFFF;
		}

		.charts {
			width: 650upx;
			height: 500upx;
			box-sizing: border-box;
			background-color: #FFFFFF;
		}
	}
</style>
