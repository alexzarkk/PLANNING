<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-14 08:06:15
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-18 17:41:42
 * @FilePath: \sport-planing\src\pages\event\point.vue
 * @Description: 
 * 
 * 
-->
<template>

	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">人气打卡点</block>
		</cu-custom>
		<block v-if="loading"><tui-loadmore :fixed="true" :index="3" type="green"></tui-loadmore></block>
		<block v-else>
			<block v-if="list.length" style="position: relative">
				<zz-map :center="center" :scale="10" :line="line" :point="list" :winH="winH" @onMap="mapEmelemntClick"></zz-map>
				<view class="point-list-swiper">
					<swiper class="swiper" :current="currentSwiper" @change="swiperChange">
						<swiper-item v-for="(item, index) in list" :key="index">
							<view class="line-swiper-item-wrapper">
								<view class="left-box">
									<image class="left-box-image" mode="aspectFill" :src="item.cover"></image>
									<view class="left-box-distance">
										<text class="left-box-distance-title">热度</text>
										<text class="left-box-distance-value">5128</text>
									</view>
								</view>
								<view class="right-box">
									<view class="line-title-name-box">
										<text class="line-title text-cut margin-bottom-xs">{{ item.name }}</text>
										<text class="line-name text-cut-2">{{ item.desc }}</text>
									</view>
									<view class="line-info">
										<view class="line-info-wrapper">
											<text class="line-info-wrapper-title">已打卡</text>
											<text class="line-info-wrapper-value">513</text>
										</view>
										<view class="line-info-wrapper">
											<text class="line-info-wrapper-title">距离</text>
											<text class="line-info-wrapper-value">1.78km</text>
										</view>
									</view>
									<view class="clock-btn" @click="openClock"><view class="cu-btn round bg-orange margin-right sm padding-xs">去打卡</view></view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</block>
			<block v-else><tui-no-data :fixed="true">无数据~</tui-no-data></block>
		</block>
	</view>
</template>

<script>


export default {
	data() {
		return {
			currentSwiper: 0,
			loading: true,
			winH: this.WinHeight,
			center: [],
			line: [],
			list: []
		};
	},
	async mounted() {
		let area = uni.getStorageSync('areaGon'); // 边界信息
		// if (!area) {
			area = await this.zz.req({ $url: 'public/zz/geoGon', code: this.bd.sys.code }, true);
			uni.setStorageSync('areaGon', area);
		// }
		//     console.log('获取到的打卡点的信息', point);
		
		this.center = area.center; // 使用边界的center
		this.line = area.children; // 用线模拟边界
		this.list = await this.zz.req({ $url: 'public/poi/list', deptId: this.bd.sys.code, type: [4042, 4044, 4046, 4048, 4048, 4004, 4006] }); // 打卡点列表
		// uni.setStorageSync("hotPoint",this.list);  // 人气打卡点
		// this.list.forEach((point) => {
		//     console.log('获取到的打卡点的信息', point);
		// });
		this.loading = false;
	},
	methods: {
		// 切换swiper
		swiperChange(event) {},
		mapEmelemntClick(element) {
			// console.log('element点击=====', element);
			let markerIndex = this.list.findIndex(res => {
				return res._id === element._id;
			});
			if (markerIndex > 0) {
				this.currentSwiper = markerIndex;
			}
			// console.log('找到的markerIndex', markerIndex);
			// element._id
		},
		openClock() {
			uni.navigateTo({
				url: '/pages/event/clockDetails'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.point-list-swiper {
	z-index: 999;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 750rpx;
	height: 260rpx;
	background-color: #ffffff;

	.swiper {
		height: 260rpx;
		&-item {
			height: 260rpx;
			//    background-color: aqua;
		}
	}
}

.line-swiper-item-wrapper {
	width: 650rpx;
	height: 260rpx;
	// width: 375px;
	background-color: #ffffff;
	padding-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	display: flex;
	flex-direction: row;
	// align-items: center;
	.left-box {
		display: flex;
		flex-direction: column;
		margin-right: 10px;
		// align-items: center;
		&-image {
			width: 150px;
			height: 75px;
			// background-color: aqua;x
		}

		&-distance {
			padding-top: 5px;
			display: flex;
			flex-direction: column;
			&-title {
				color: #828282;
				font-size: 12px;
			}

			&-value {
				color: #252525;
				font-size: 32rpx;
			}
		}
	}

	.right-box {
		.line-title-name-box {
			height: 75px;
			display: flex;
			flex-direction: column;
			// justify-content: space-between;
			border-bottom: 1px solid #eeeeee;
			padding-bottom: 5px;

			.line-title {
				width: 170px;
				// word-wrap:normal;
				color: #222222;
				font-size: 32rpx;
				overflow: hidden;
				// word-break: break-all; /* break-all(允许在单词内换行。) */
				text-overflow: ellipsis; /* 超出部分省略号 */
				// display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
				// -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
				// -webkit-line-clamp: 1; /** 显示的行数 **/
				lines: 1; //NVUE下要用这个属性，来让文字超出隐藏变省略号L
			}

			.line-name {
				color: #555555;
				font-size: 28rpx;
			}
		}

		.line-info {
			padding-top: 5px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			&-wrapper {
				width: 120px;
				display: flex;
				flex-direction: column;
				&-title {
					color: #828282;
					font-size: 12px;
				}

				&-value {
					color: #252525;
					font-size: 32rpx;
				}
			}
		}
		.clock-btn {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
		}
	}
}
</style>
