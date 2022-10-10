<template>
	<view>
		<!-- { paddingTop: sysInfo.statusBarHeight + 'px'} -->
		<view class="record" :style="recordStyle">
			<view class="record-title" style="height:44px;">
				<!-- <button class="cu-btn bg-gray" type="default" @click="tools"><text>工具</text></button> -->
				<view style="display: flex;flex-direction: row; justify-content: center; ">
					<text style="width: 250rpx; text-align: center; color: #55ff00; font-weight: bold;">{{ (tim.H > 9 ? tim.H : '0' + tim.H) + ':' + (tim.M > 9 ? tim.M : '0' + tim.M) + ':' + (tim.S > 9 ? tim.S : '0' + tim.S) }}</text>
					<text v-if="isShow" style="text-align: center; color: #ff0000; font-weight: bold;">已暂停</text>
				</view>
				<button class="cu-btn bg-gray" @click="info"><text>数据统计</text></button>
			</view>
			<view v-if="isShow && process"><progress :percent="process" activeColor="#ff0000" /></view>
		</view>

		<view>
			<!-- 普通弹窗 -->
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<data-swiper :dataList="dataList1"></data-swiper>
				<data-swiper></data-swiper>
				<data-swiper></data-swiper>
				<data-swiper></data-swiper>
			</uni-popup>
		</view>

		<view class="uni-cursor-point">
			<view class="uni-fab uni-fab--leftBottom" :style="{ opacity: isShow ? 1 : 0 }">
				<view class="uni-fab__content--left uni-fab__content">
					<view class="uni-fab__item uni-fab__item--first" />
					<view v-if="isShow" v-for="(item, index) in content" :key="index" class="uni-fab__item uni-fab__item--active" @touchend="end(index, item)" @touchstart="onStartTouch(index, item)" @click="_onItemClick(index, item)">
						<image :src="item.active ? item.selectedIconPath : item.iconPath" class="uni-fab__item-image" mode="aspectFit" />
						<text class="uni-fab__item-text" :style="{ color: item.textColor }">{{ item.text }}</text>
					</view>
				</view>
			</view>
			<view class="uni-fab__circle uni-fab__circle--leftBottom" :style="{ opacity: isShow ? 1 : 0.5 }" @click="_onClick"><uni-icons class="fab-circle-icon" type="circle-filled" color="#ff0000" size="42"></uni-icons></view>
		</view>
	</view>
</template>

<script>
const d = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAA',
	play =
		d +
		'BERJREFUWEe9V12IG1UU/s5kU+pP9UVZ9Elt6YLUTGhXWJNJ60Lpg7qCaAXBHxC0D+pu7q4/WJDNoigKu7O7VbT6ZoVCrSj+QdeHVmeSim41E6vYVWsfpFWqD/5uNMkcuZOZOJmdJJNs8cI8zLnn57vnnnvPdwldDN1IXs/gW4hwHYBL3U96OCs/Zhwl0JsiUzwS1S11UtQXt1xmL1d2KUR3ANjYSd+dX7KZ9yvnxfeKwWNn2tm0BaDnE5PEdD8Dl0cM3KRGwGkmflmkS1Ot7FsC0E31IwCZZkNeJCgLzPjABp+uUvnMciXG569R+mPU16/Y9jYAIwDJLfIPQ2jW1jAQoQB0Qz0LwiU+A4OI57Lp0htRMjGbT9zKTGNNC2D8LDKWrJtglpoFuql+D+AKT2ozT01kSrkogYM600YipxBN+uSnhGZd6ddryoCeVw+AsfNcBPd86Hn1ITDmG0EJr4u0dbv33wAQRLualQczMWdcs8UmZTFsYQ4AedSoXF30qv1cBveCzhbUm9jGO/LfOR1r+wblEa0DyCcmweTtc8uKlbozpnpIKdfuzm4//lO3daHn1VfBuMuxI87J41kHYKrfAbjKkRPf1q7adVNlqceEp8bT1hPdgJj5UN1BMRxybU4KzVpP02byBgX8Xl1IJaEV1XZOPQCuzl8g5R6R/vxgVCC6mbQATkh9G3Qj6ab6EoBdroMXhGY92AUAT/WI0mc/PDb0xbFOQHRTfR7AA67eXgngEwDXOgKm4U6NJJCBYLw9y+W/p3Zv//qXVkBkQwPxYXf+UwmgcfHYjIGJjLXUQwb+M2HUmPDIuGbpYX6mDXWjQjjhzp2SAP4AcIEU/IPyRY9pJ35fFQDXmAGLFMqJVPEtv79nzYF1a7D2N1f2ZxOAXyuVdbnhrySglqPDFvjtvgQpuWCB5g5ffeHF8bi3SAdAYwsqVNvwaPq4PJI9AyBQjcFTQrOeDHPyXH7T+jjHvvVvQaMIbYXSE6lioWcATPspXhXZodaX1HQhmVJszjeKcMZQ54gwWhfwbqGVnukBQBFMotMJkn51M/E4QE870Rjz1Hws+KjQSqmoAAgos83jYmvpxXY2/jndTBQahIVp2LuK5bFw+F7Uq5gI89m0JUlH5BG4ipeEZg04AAKtuG0z0k11IdbH944OlX6IHNlV9Dcjr+P+f+3YSO5k4gNOloPtOCQLUmtUpK093a4yTH+msHkD2bVvvDk/32imZAEmrLA9OJbp3GDagZz9eFM/V2M/+nSatngFKw4yYlIwkk1Z7/aSiUDRASHMOJyWB5gxCPu4itfGt1kLUYA4gftwZ4P91I1WMGK3HsJdBhlyXYtKABtgOhj2MInZPMKEHWBsbvIaYML+ubZPM3k8Y0T3reZpVmN+pd27opvHqSSTDm+MME7azPtW/TgNBnL5482Ak+IVz3MAn9mgtye04vsRQDoq/wKJWwo9X2L8owAAAABJRU5ErkJggg==',
	stop =
		d +
		'AndJREFUWEfNlz9oU1EUxr9z09wUBNd2qC8GlPdiRQQHR3VQ8Q84KK4ddHDRwcGCDraDRR3TxaEOXcWpVAUnwUVBQdD0JbQQ89qhXQtCc5O8I/clLzSveU1qam7feu873++cc8+55xIMf7RXfXds6LxIiIvwacQnHtX/C6Z1CN6o1XlhfK36dS82ewIopIczzP6EAG4xMN5F4DsDi0Ri3ilvlbrB7AqwbMkTPvgegyYAHI4YUwQsM+ADsAHIyPomgecF6NVxTy3FgcQCNMTxJvSYgRUG5oiwMsRwo0YLmZSNGmwQOwx+SKARLUpAXgC34yA6AuwU59lhIWcyv/+sdwrpxg9g6pwDcKkbxA6AqDgRXbXLlQ+9CEf3FCz5CMCL3SDaAKLijqfT3P9XsCTHQbQJFK1kjkH3m5KTjqde9i8PFNOpK8z8vgHBs7ZXfRDabQHoUgP7P5qn/aPjqcv7IR7acK1kjhrObYLE6bBEWwCuJacIeMrgDUqIc06pUtxPgNLRQ6NbfvUzAccImLI9Nd1MS0OmYMlvAM4AiA29huwFKuupjvuWLDkpgOe6NG1PnWwB5MeSZxOCvgTGmW44q5WFTkJhlHaDYGA6DsBNy5vEeBvI+P6F7FrtU5CCYlo+Y8bjwHCCnLjw9wugq6wO5APPCTN2WT1pABxJzTHxHQDK8VQqzsN+AZqprui2TUyv7dXK3QDAteQiAdcA/HQ8dep/AhQt+Uu3dwbeZT11/WAAGE+B8UNovAyNN6JmJQysFW9vVgfnMgoaksnrWAMYH0g6QQx0JAtbsNGhNB5igGN5O4Shh8n2G9HY06zjVGTicdrLHPive/4CfIfnMFwwuEwAAAAASUVORK5CYII=';

import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup';
import dataSwiper from './dataSwiper';

export default {
	name: 'UniFab',
	components: { uniPopup, dataSwiper },
	emits: ['fabClick', 'trigger'],
	props: {
		tim: {
			type: Object,
			default() {
				return { H: 0, M: 0, S: 0, MS: 0 };
			}
		}
	},
	data() {
		return {
			stH: 0,
			puase: false,
			process: 0,

			fabShow: false,
			isShow: false,
			sysInfo: uni.getStorageSync('sysInfo'),
			CustomBar: this.CustomBar,
			type: 'bottom',

			content: [
				{
					iconPath: play,
					selectedIconPath: play,
					text: '继续',
					textColor: '#8fc42f',
					active: false,
					type: 'continue'
				},
				{
					iconPath: stop,
					selectedIconPath: stop,
					text: '长按结束',
					textColor: '#f9081f',
					active: false,
					type: 'end'
				}
			],

			dataList1: [
				{
					title: '里程',
					item: '0.01',
					unit: '公里'
				},
				{
					title: 'title',
					item: 'item',
					unit: 'unit'
				}
			]
		};
	},
	computed: {
		recordStyle() {
			if (this.isShow && this.process) {
				this.CustomBar = this.sysInfo.statusBarHeight + 50;
			} else {
				this.CustomBar = this.sysInfo.statusBarHeight + 44;
			}
			let style = {
				paddingTop: this.sysInfo.statusBarHeight + 'px',
				height: this.CustomBar + 'px'
			};
			return style;
		}
	},
	mounted() {},
	methods: {
		_onClick() {
			this.isShow = !this.isShow;
			this.$emit('onPuase', this.isShow);
		},
		onStartTouch(index, item) {
			if (index == 1) {
				this.touch = setInterval(() => {
					this.process += 2;
					if (this.process >= 102) {
						clearInterval(this.touch);
						this.$emit('stop');
					}
				}, 33); // 33
			} else {
				this.end();
			}
		},
		close() {
			this.isShow = false;
			this.$emit('onPuase', this.isShow);
			this.end();
		},
		/**
		 * 按钮点击事件
		 */
		_onItemClick(index, item) {
			if (index == 0) this.isShow = false;
			this.$emit('onPuase', this.isShow);
			this.end();
		},
		end() {
			this.process = 0;
			clearInterval(this.touch);
		},
		tools() {
			console.log('tools');
		},
		info() {
			this.$emit('info');
		}
	}
};
</script>

<style lang="scss">
$uni-shadow-base: 0 1px 5px 2px
	rgba(
		$color: #000000,
		$alpha: 0.3
	) !default;

.uni-fab {
	position: fixed;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: flex-start;
	align-items: flex-start;
	z-index: 10;
	border-radius: 10px;
	// box-shadow: $uni-shadow-base;
	// width: 220px;
}

.uni-cursor-point {
	/* #ifdef H5 */
	cursor: pointer;
	/* #endif */
}

.uni-fab--leftBottom {
	left: 0px;
	bottom: 90px;
	// bottom: 30px;
	/* #ifdef H5 */
	left: calc(15px + var(--window-left));
	bottom: calc(60px + var(--window-bottom));
	/* #endif */
	// padding: 10px;
}

.uni-fab__circle {
	position: fixed;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	justify-content: center;
	align-items: center;
	width: 55px;
	height: 55px;
	background-color: #ffffff;
	border-radius: 10px;
	z-index: 11;
	// opacity: 0.5;
	// box-shadow: $uni-shadow-base;
}

.uni-fab__circle--leftBottom {
	left: 0px;
	bottom: 90px;
	/* #ifdef H5 */
	left: calc(0px + var(--window-left));
	bottom: calc(60px + var(--window-bottom));
	/* #endif */
}

.fab-circle-icon {
	transform: rotate(0deg);
	transition: transform 0.33s;
	font-weight: 200;
}

.uni-fab__content {
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	display: flex;
	/* #endif */
	flex-direction: row;
	border-radius: 10px;

	overflow: hidden;
	transition-property: width, height;
	transition-duration: 0.33s;
	width: 95px;
	// border-color: #dddddd;
	width: 420rpx;
	background-color: #ffffff;
}
.uni-fab__content--left {
	justify-content: flex-start;
}

.uni-fab__item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 160rpx;
	height: 55px;
	opacity: 0;
	transition: opacity 0.33s;
	border-left: 3rpx solid #eee;
}

.uni-fab__item--active {
	opacity: 1;
}

.uni-fab__item-image {
	width: 20px;
	height: 20px;
	margin-bottom: 4px;
}

.uni-fab__item-text {
	color: #ffffff;
	font-size: 12px;
	line-height: 12px;
	margin-top: 2px;
}

.uni-fab__item--first {
	width: 110rpx;
}

.record {
	width: 750rpx;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
	padding: 24rpx 0rpx 16rpx 0rpx;
	// background-color:#000000;
	// background: linear-gradient(to bottom, #000000 90%, rgba(255, 255, 255, 0.2) 60%);
	background-image: linear-gradient(to bottom, #3a5ba4, rgba(255, 255, 255, 0.01));
}

.record-title {
	padding: 0rpx 12rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
</style>
