<template>

	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">赛事|活动</block>
		</cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center fixed" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'text-blue text-bold cur' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">
				<text class="margin-right-xs" :class="'cuIcon-' + item[1]"></text>
				<text>{{ item[0] }}</text>
			</view>
		</scroll-view>
		<block v-if="TabCur == 0">
			<view class="cu-progress margin-top xs"></view>
			
			<block v-for="(item,idx) in list" :key="idx">
				<view class="cu-card article no-card" @tap="detail">
					<view class="cu-item shadow">
						<view class="content">
							<image :src="item.url" mode="aspectFill"></image>
							<view class="desc">
								<view class="text-bold text-cut" style="width: 460rpx;">{{item.name}}</view>
								<view class="text-sm text-gray">
									{{item.slogan}}</br>
									{{item.onday}} {{item.location}}</br>
									…… </br>
								</view>
								<view class="hot-lable">
									<view>
										<view class="cu-tag bg-grey light sm round">徒步</view>
										<view class="cu-tag bg-pink light sm round">赏花</view>
										<view class="cu-tag bg-blue light sm round">亲水</view>
									</view>
									<view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</block>
			<tui-nomore></tui-nomore>
			
		</block>
		<block v-if="TabCur == 1">
			<view class="margin-xl bg-white padding-xl radius shadow-lg">
				<view class="text-center margin-bottom text-lg text-grey">暂无数据</view>
			</view>
		</block>
		<block v-if="TabCur == 2">
			<view class="margin-xl bg-white padding-xl radius shadow-lg">
				<view class="text-center margin-bottom text-lg  text-grey">暂无数据</view>
			</view>
		</block>
	</view>
</template>

<script>

export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			TabCur: 0,
			tabNav: [['报名中', 'squarecheck'], ['计划中', 'post '], ['已结束', 'exit ']],
			list: [
				{
					id: 1,
					name: '2022 足行奉化·缘结山水徒步活动-松岙站',
					slogan:'走红色古道 品松岙蜜桔',
					onday: '2022-04-06',
					location: '奉化区 松岙镇',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/f0fa0730-9588-11ea-9e8b-05a3242b26f2.jpeg'
				},
				{
					id: 2,
					name: '2022 江南168越野挑战赛',
					slogan:'全国完赛率最高赛道',
					onday: '2022-05-20',
					location: '奉化区 雪窦山',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/c9d17e26-96db-4945-ab31-eed2202e1f28.jpg'
				},
				{
					id: 3,
					name: '携手奔跑9.9公里，第三届"两岸共跑212线上赛"正在报名中',
					slogan:'全国完赛率最高赛道',
					onday: '2022年2月12日-2月28日',
					location: '不限',
					url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/e8c88303-3096-4371-8b3c-729534e5c4d3.jpg'
				}
			],
		};
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		detail:function(){
			this.zz.href('/pages/event/detail/detail')
		}
	}
};
</script>

<style>
page {
	padding-top: 45px;
}
</style>
