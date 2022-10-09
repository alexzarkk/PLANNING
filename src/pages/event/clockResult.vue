<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-27 17:39:08
 * @FilePath: \sport-planing\src\pages\event\clockResult.vue
 * @Description: 打卡成功的成绩列表页面
 * 
 * 
-->
<template>
	<!-- 
			@name:线路详情
			@desc：
			@date：2022-05-15
			@author: 
	 -->
	<view>
		<cu-custom bgColor="bg-ztsgreen" :isBack="true">
			<block slot="right">
				<view @click="showShareModal" class="margin-right text-xxl"><text class="cuIcon-share"></text></view>
			</block>
			<block slot="content">石头岭古道</block>
		</cu-custom>
		<view class="container">
			<view class="show-certificate" @click="showCer"><button class="cu-btn response lg bg-ztsgreen round">查看证书</button></view>
			<view class="radius">
				<!-- #ifdef APP-PLUS || H5 -->
				<!-- <zz-mapbox v-if="trail.kml.children" :kml="trail.kml"></zz-mapbox> -->
				<zz-map v-if="trail.kml.lines" :line="trail.kml.lines" :point="trail.kml.points" :winH="240"></zz-map>
				<!-- <zz-map :winH="240"></zz-map> -->

				<!-- #endif -->
				<!-- #ifdef MP -->
				<zz-kml-map v-if="trail.kml.children" :kml="trail.kml" :nav="true" @kmlMap="kmlMap"></zz-kml-map>
				<!-- #endif -->
			</view>
			<!-- 线路信息 -->
			<view class="line-info-box">
				<!-- <view class="sport-type-box">
                    <view class="zzIcon-sport-110 sport-icon"></view>
                    <view>健行</view>
                </view> -->
				<view class="line-info-name">自助打卡赛 - 石头岭古道</view>
				<view class="line-time">用时 - 02:32:46</view>
				<!-- <view class="avatar-box">
                    <view class="cu-avatar radius margin-right lg" style="background-image: url(https://s1.ax1x.com/2022/05/27/XmKaGj.jpg)"></view>
                    <view>Draymond</view>
                </view> -->
			</view>
			<!-- 相关操作的盒子 -->
			<!-- <view class="line-operation-box">
                <view class="line-operation" v-for="(item, index) in opeartionList" :key="index">
                    <view class="operation-icon" :class="'cuIcon-' + item.iconName"></view>
                    <view class="operation-title">{{ item.title }}</view>
                </view>
            </view> -->
			<view class="rank-box">
				<view class="my-rank-box">
					<view class="left">
						<view class="title">第10名</view>
						<view class="sub">第129位打卡</view>
					</view>
					<view class="center">
						<!-- https://s1.ax1x.com/2022/05/27/XmK8qf.jpg -->
						<view class="cu-avatar xl round margin-left" style="background-image: url(https://s1.ax1x.com/2022/05/27/XmK8qf.jpg)"></view>
					</view>
					<view class="right">02:50:34</view>
				</view>
				<view class="rank-list">
					<view class="rank-item" v-for="(item, index) in rankList" :key="index">
						<view class="num">
							<view v-if="index === 0"><image style="width: 60rpx; height: 60rpx" src="/static/rank/1.png" /></view>
							<view v-if="index === 1"><image style="width: 60rpx; height: 60rpx" src="/static/rank/2.png" /></view>
							<view v-if="index === 2"><image style="width: 60rpx; height: 60rpx" src="/static/rank/3.png" /></view>
						</view>
						<view class="avatar-wrapper">
							<view
								class="cu-avatar lg round margin-left"
								:style="{
									backgroundImage: 'url(' + item.avatar + ')'
								}"
							></view>
						</view>
						<view class="person-info">
							<view class="title">{{ item.name }}</view>
							<view class="sub">第{{ item.order }}位打卡</view>
						</view>
						<view class="use-time">{{ item.time }}</view>
					</view>
				</view>
				<view class="show-more">查看更多</view>
			</view>
			<view class="line-detail-info-box">
				<view class="line-detail-item-wrapper" v-for="(item, index) in lineDetailList" :key="index">
					<view class="line-detail-border-box" v-for="(inner, iIndex) in item" :key="iIndex">
						<view class="line-detail-item">
							<view class="detail-item-title">{{ inner.title }}</view>
							<view class="detail-item-value">{{ inner.value }}</view>
						</view>
						<!-- <view class="line-detail-item">
                            <view class="detail-item-title">里程</view>
                            <view class="detail-item-value">2.32公里</view>
                        </view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 分享窗口 -->
		<view class="cu-modal" :class="modalName == 'shareModal' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="share-method-box">
					<view class="share-title-box">分享</view>
					<text @click="hideModal" class="cuIcon-close text-bold text-xxl"></text>
					<view class="share-btn-box">
						<button class="cu-btn bg-ztsgreen lg round">
							<text class="cuIcon-qrcode margin-right-xs text-xxl"></text>
							二维码
						</button>
						<button class="cu-btn bg-ztsgreen lg round">
							<text class="cuIcon-share margin-right-xs text-xxl"></text>
							其他
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	onLoad() {
		this.loadData();
		let trail = uni.getStorageSync('clockResultTrail');
		
		if (trail) {
			this.trail = trail;
		}else{
			let tounList = uni.getStorageSync('tounamentList');
			this.trail = tounList[0];
		}
	},
	onReady() {},
	data() {
		return {
			rankList: [
				{
					name: '晴天',
					order: 223,
					time: '02:20:32',
					avatar: 'https://s1.ax1x.com/2022/05/27/XmKfzR.jpg'
				},
				{
					name: '百合花',
					order: 162,
					time: '02:25:02',
					avatar: 'https://s1.ax1x.com/2022/05/27/XmK4Q1.jpg'
				},
				{
					name: '三分命七分拼',
					order: 561,
					time: '02:27:54',
					avatar: 'https://s1.ax1x.com/2022/05/27/XmKWW9.jpg'
				}
			],
			modalName: '',
			opeartionList: [
				{
					title: '点赞',
					iconName: 'appreciate'
				},
				{
					title: '评论',
					iconName: 'comment'
				},
				{
					title: '收藏',
					iconName: 'favor'
				},
				{
					title: '编辑路线',
					iconName: 'write'
				}
			],
			lineDetailList: [
				[{ title: '里程', value: '2.32公里' }, { title: '海拔落差', value: '118米' }],
				[{ title: '难度', value: '中等' }, { title: '海拔下降', value: '238米' }],
				[{ title: '均速', value: '10.8公里/h' }, { title: '移动时间', value: '0 h 14min' }],
				[{ title: '最高海拔', value: '20米' }, { title: '总时间', value: '0 h 15min' }],
				[{ title: '最低海拔', value: '-90米' }, { title: '路线排序', value: '1' }],
				[{ title: '线路类型', value: '单程' }, { title: '日期', value: '2022/5/14' }]
			]
		};
	},
	methods: {
		async loadData() {},
		// 显示分享的弹窗
		showShareModal() {
			this.modalName = 'shareModal';
		},
		hideModal() {
			this.modalName = '';
		},
		// 查看证书
		showCer() {
			uni.showLoading({
				title: '证书生成中...'
			});
			uni.previewImage({
				urls: ['https://s1.ax1x.com/2022/05/30/Xlh4Yj.jpg'],
				current: 0,
				success: res => {
					uni.hideLoading();
					// uni.showToast({
					// 	title:'长按可保存到相册',
					// 	icon:"none"
					// })
				},
				fail: error => {
					console.error('证书打开失败');
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.show-certificate {
	position: fixed;
	z-index: 10;
	bottom: 100rpx;
	left: 0;
	width: 750rpx;
	display: flex;
	flex-direction: row;
	justify-items: center;
	align-items: center;
	// margin-left: 300;
	.cu-btn {
		margin-left: 200rpx;
		width: 350rpx;
	}
}

.container {
	position: relative;
	padding: 40rpx;
	// height: 100vh;
	// background-color: #f1f1f1;
	.line-info-box {
		margin-top: 50rpx;
		border-bottom: 1px solid #e2e2e2;
		padding-bottom: 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 170rpx;
		.sport-type-box {
			display: flex;
			align-items: center;

			.sport-icon {
				font-size: 60rpx;
				margin-right: 20rpx;
			}
		}

		.line-info-name {
			font-size: 2.4rem;
			font-weight: 900;
		}

		.line-time {
			font-size: 42rpx;
			font-weight: 600;
		}

		.avatar-box {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}

	.line-operation-box {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 140rpx;
		border-bottom: 1px solid #e2e2e2;

		.line-operation {
			display: flex;
			flex-direction: column;
			align-items: center;

			.operation-icon {
				margin-bottom: 10rpx;
				color: $zts-green;
				font-size: 2rem;
			}
			.operation-title {
				color: $zts-green;
			}
		}
	}

	.line-detail-info-box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: center;
		padding-bottom: 200rpx;
		.line-detail-item-wrapper {
			height: 160rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			&:not(:last-child) {
				border-bottom: 1px solid #e2e2e2;
			}

			.line-detail-border-box {
				&:first-child {
					border-right: 1px solid #e2e2e2;
				}
			}
			.line-detail-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 335rpx;
				height: 120rpx;

				// border-left: 1px solid black;
				.detail-item-title {
					font-size: 1.2rem;
					color: #858585;
					margin-bottom: 6rpx;
				}

				.detail-item-value {
					font-size: 1.8rem;
					font-weight: bold;
					color: #282828;
				}
			}
		}
	}
}

// 点赞分享等
.share-method-box {
	height: 400rpx;
	.share-title-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.8rem;
		height: 150rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
	}

	.cuIcon-close {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		font-size: 50rpx;
	}

	.share-btn-box {
		height: 200rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;

		.cu-btn {
			width: 80%;
		}
	}
}

.rank-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	.my-rank-box {
		width: 690rpx;
		height: 200rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
		.left {
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				font-size: 1.8rem;
				font-weight: bold;
				color: #333333;
			}

			.sub {
				font-size: 1.2rem;
				color: #b7b7b7;
			}
		}

		.center {
		}

		.right {
			font-size: 1.8rem;
			font-weight: bold;
		}
	}
	.rank-list {
		.rank-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 690rpx;
			padding: 20rpx;
			position: relative;
			border-top: 1px solid #e2e2e2;
			.num {
				font-weight: bold;
				margin-left: 20rpx;
			}

			.avatar-wrapper {
				margin-right: 20rpx;
			}

			.person-info {
				.title {
					font-size: 1.6rem;
					font-weight: bold;
					color: #333333;
				}

				.sub {
					font-size: 1.2rem;
					color: #b7b7b7;
				}
			}

			.use-time {
				position: absolute;
				font-size: 1.8rem;
				font-weight: bold;
				right: 80rpx;
			}
		}
	}
	.show-more {
		width: 750rpx;
		padding: 20rpx 0;
		text-align: center;
		border-top: 1px solid #e2e2e2;
		border-bottom: 1px solid #e2e2e2;
		color: $zts-blue;
		font-size: 1.8rem;
		font-weight: bold;
	}
}
</style>
