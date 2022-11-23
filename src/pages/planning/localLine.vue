<template>

	<!-- 
			@name:地方频道
			@desc：用于创建新页面
			@date：2022-05-09
			@author: 
	 -->
	<view>
		<!-- 
			这里的导航栏是根据设备和  不同端自适应的  务必使用这个  nav-bar
		 -->
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">本地频道</block>
		</cu-custom>
		<view class="container">
			<view id="stickBar" class="sticky-box solid margin-top bg-white" :style="[{ top: customBar + 'px' }]">
				<scroll-view class="nav text-center" scroll-x scroll-with-animation :scroll-left="scrollLeft">
					<view
						class="cu-item"
						:class="index == currentTab ? 'text-bold text-red cur' : ''"
						v-for="(item, index) in regionData"
						:key="index"
						@tap="swichNav"
						:data-current="index"
					>
						{{ item.name }}
					</view>
				</scroll-view>
			</view>

			<view v-if="regionData.length > 0">
				<view v-for="(item, index) in regionData" :key="index">
					<view v-if="currentTab === index">
						<view v-if="item.list.length ===0">
							<view :style="'height:' + mainHeight + 'px'" :class="index == currentTab ? '' : 'hide'">
								<view class="cu-tabbar-height"></view>
								<tui-no-data :fixed="true" :imgUrl="'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/5acf9550-9e74-11ea-b244-a9f5e5565f30.png'">暂无数据</tui-no-data>
							</view>
						</view>
						<view v-else>
							<zz-trail-list :dataList="item.list" :show="index == currentTab" @detail="detail" @userEvent="userEvent"></zz-trail-list>
						</view>
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
	},
	onReady() {},
	data() {
		return {
			bd: this.bd,
			currentTab: 0, // 当前tab的索引
			regionData: null, // 当前的地方数据
			customBar: this.CustomBar,
			statusBar: this.StatusBar,
			mainHeight: this.WinHeight,
			scrollLeft: 0 //tab标题的滚动条位置
		};
	},
	methods: {
		async loadData() {
			let trailData = uni.getStorageSync('trailData')
			let regionData = trailData.regionData; // 地方数据
			this.regionData = regionData

			// console.log('获取到的地方数据', this.regionData);
			this.regionData.forEach(res=>{
				// console.log("地方数据===",res.list.length)
			})
		},
		userEvent(e) {
			let o = this.regionData[this.currentTab].list[e.idx]
			// this.zz.userEvent(e.t, e.tt, o)
			this.$set(this.regionData[this.currentTab].list,e.idx,o)
		},
		detail(id) {
			this.zz.href('/pages/planning/detail?id=' + id);
		},
		swichNav(e) {
			let cur = e.currentTarget.dataset.current;
			this.currentTab = cur;
			this.scrollLeft = (cur - 1) * 60;
			uni.pageScrollTo({ scrollTop: this.stickBarPosition, duration: 200 });
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
