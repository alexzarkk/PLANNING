<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-17 15:39:06
 * @FilePath: \sport-planing\src\pages\template\template.vue
 * @Description: 选择兴趣点类型
 * 
 * 
-->
<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">选择兴趣点类型</block></cu-custom>
		<view class="container">
			<view class="sport-section" v-for="(item, index) in sportList" :key="index">
				<view class="sport-title">{{ item.title }}</view>
				<view class="sport-type-box">
					<!-- :class="actionSport === index ? 'sport-type-wrapper-action' : ''" -->
					<view
						class="sport-type-wrapper"
						@click="activeSport(sport)"
						v-for="(sport, sIndex) in item.list"
						:key="sIndex"
						:class="currentActiveIconName === sport.iconName ? 'sport-type-wrapper-action' : ''"
					>
						<view class="sport-type-wrapper-icon text-xxl">
							<text :class="'zzIcon-' + sport.iconName" style="font-size: 80rpx"></text>
							<!-- <image class="sport-type-wrapper-icon-image" src="../../static/back.png"></image> -->
						</view>
						<view class="sport-type-wrapper-title">{{ sport.title }}</view>
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
	onShow() {
		let sportType = uni.getStorageSync('currentSportType'); // 获取当前的运动类型
		if (sportType) {
			this.sportList.forEach(item => {
				item.list.forEach(sport => {
					if (sportType === sport.title) {
						this.currentActiveIconName = sport.iconName;
					}
				});
			});
		}
	},
	data() {
		return {
			actionSport: 0,
			currentActiveIconName: 'sport-112',
			sportList: [
				{
					title: '徒步',
					list: [
						{
							title: '健行',
							iconName: 'sport-110'
						},
						{
							title: '健走',
							iconName: 'sport-112'
						},
						{
							title: '路跑',
							iconName: 'sport-114'
						},
						{
							title: '定向',
							iconName: 'sport-116'
						},
						{
							title: '越野跑',
							iconName: 'sport-118'
						},
						// {
						// 	title: '登山',
						// 	iconName:'sport-120'
						// },
						{
							title: '攀岩',
							iconName: 'sport-122'
						}
						// {
						// 	title: '露营',
						// 	iconName:'sport-140'
						// }
					]
				},
				{
					title: '自行车',
					list: [
						{
							title: '越野单车',
							iconName: 'sport-310'
						},
						{
							title: '公路自行车',
							iconName: 'sport-313'
						},
						{
							title: '山地速降',
							iconName: 'sport-314'
						}
					]
				}
			]
		};
	},
	methods: {
		async loadData() {},
		// 激活当前选择的运动
		activeSport(sport) {
			console.log('当前激活的iconName', sport.iconName);
			this.currentActiveIconName = sport.iconName;
			uni.setStorageSync('currentSportType', sport.title);
			setTimeout(() => {
				uni.navigateBack();
			}, 500);
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fafafa;
}

.container {
	.sport-section {
		padding: 24rpx;
		.sport-title {
			color: #8b8b8b;
			font-size: 1.2rem;
			margin-bottom: 16rpx;
		}

		.sport-type-box {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			column-gap: 20rpx;
			row-gap: 20rpx;
			.sport-type-wrapper {
				box-sizing: border-box;
				width: 220rpx;
				height: 222rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				background-color: #f4f4f4;
				border-radius: 10rpx;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				&-icon {
					padding: 16rpx;

					// .sport-type-icon{
					// 	font-size: 1rem;
					// }

					&-image {
						width: 100rpx;
						height: 100rpx;
					}
				}

				&-title {
					color: #525252;
					font-size: 1.4rem;
				}
			}

			.sport-type-wrapper-action {
				border: 5px solid $zts-green;
			}
		}
	}
}
</style>
