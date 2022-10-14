<template>
<page-meta root-font-size="10px"></page-meta>
	<!-- 
			@name:保存线路轨迹信息
			@desc：
			@date：2022-05-09
			@author: 

                        <view class="name form-section">
                <view class="form-section-title flex justify-between">
                    <view>
                        <text class="text-red padding-right-xs">*</text>
                        印象评分
                    </view>
                    <text class="current-level">{{ currentLevelText }}</text>
                </view>
            </view>
	 -->
	<view>
		<!-- 
			这里的导航栏是根据设备和  不同端自适应的  务必使用这个  nav-bar
		 -->
		<cu-custom bgColor="bg-ztsgreen" :isBack="true">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">保存路线</block>
		</cu-custom>
		<view class="container">
			<view class="radius">
				<!-- #ifdef APP-PLUS || H5 -->
				<!-- <zz-mapbox v-if="trail.kml.children" :kml="trail.kml"></zz-mapbox> -->

				<zz-map :winH="240"></zz-map>

				<!-- #endif -->
				<!-- #ifdef MP -->
				<zz-kml-map v-if="trail.kml.children" :kml="trail.kml" :nav="true" @kmlMap="kmlMap"></zz-kml-map>
				<!-- #endif -->
			</view>
			<!-- 名称，详情，活动，难度，照片,隐私设置，保存为草稿 -->
			<view class="name form-section">
				<view class="form-section-title">
					<text class="text-red padding-right-xs">*</text>
					名称
				</view>
				<view><input v-model="lineName" placeholder="输入名称" /></view>
			</view>
			<view class="name form-section">
				<view class="form-section-title">
					<text class="text-red padding-right-xs">*</text>
					详情
				</view>
				<view><input v-model="lineDesc" placeholder="输入详情" /></view>
			</view>

			<view class="name form-section">
				<view class="form-section-title">
					<text class="text-red padding-right-xs">*</text>
					活动
				</view>
				<view class="flex align-center response justify-between">
					<view class="sport-type-wrapper">
						<view class="sport-type-wrapper-icon text-xxl">
							<text :class="'zzIcon-' + sport.iconName" style="font-size: 80rpx"></text>
							<!-- <image class="sport-type-wrapper-icon-image" src="../../static/back.png"></image> -->
						</view>
						<view class="sport-type-wrapper-title">{{ sport.title }}</view>
					</view>
					<view class="change-sport-btn-box"><button class="cu-btn round lg lines-green line-green response" @click="changeSportType">改变活动类型</button></view>
				</view>
			</view>

			<!-- 		<view class="name form-section">
				<view class="form-section-title">
					<text class="text-red padding-right-xs">*</text>
					活动好友
				</view>
				<view class="flex align-center">添加好友</view>
			</view> -->

			<view class="name form-section">
				<view class="form-section-title flex justify-between">
					<view>
						<text class="text-red padding-right-xs">*</text>
						难度
					</view>
					<text class="current-level">{{ currentLevelText }}</text>
				</view>
				<view class="flex align-center margin-tb"><pp-slider activeColor="#94c41a" :value="1" :min="1" :max="5" :vertical="false" @changing="sliderChange" /></view>
				<view class="flex justify-between align-center">
					<view class="text-gray text-sm">简单</view>
					<view class="text-gray text-sm">仅适合专业人士</view>
				</view>
			</view>

			<view class="name form-section">
				<view class="form-section-title flex justify-between">
					<view>
						<text class="text-red padding-right-xs">*</text>
						景观元素
					</view>
					<!-- <text class="current-level">{{ currentLevelText }}</text> -->
				</view>
				<view>
					<!--  @change="CheckboxChange" :data-id="2" -->
					<checkbox-group @change="elCheckboxChange">
						<view class="cu-list grid col-3 solid">
							<view class="cu-item" v-for="(item, index) in trail_element" :key="index">
								<view class="flex align-center padding-left-xs">
									<!-- :class="item.checked ? 'checked' : ''" :checked="item.checked ? true : false" :value="item.value" -->
									<checkbox class="green sm" :class="item.checked ? 'checked' : ''" :checked="item.checked ? true : false" :value="item.value + ''"></checkbox>
									<view class="text-dark margin-left-xs text-df">{{ item.text }}</view>
								</view>
							</view>
							<!-- <view class="cu-item">
                                <view class="flex justify-center align-center">
                                    <checkbox class="green sm"></checkbox>
                                    <view class="text-dark margin-left-xs text-df">元素</view>
                                </view>
                            </view>
                            <view class="cu-item">
                                <view class="flex justify-center align-center">
                                    <checkbox class="green sm"></checkbox>
                                    <view class="text-dark margin-left-xs text-df">元素</view>
                                </view>
                            </view> -->
						</view>
					</checkbox-group>
				</view>
			</view>

			<view class="name form-section">
				<view class="form-section-title flex justify-between">
					<view>
						<text class="text-red padding-right-xs">*</text>
						印象评分
					</view>
					<!-- <text class="current-level">{{ currentLevelText }}</text> -->
				</view>
				<view class="cu-list menu">
					<!-- <view > -->
					<view class="cu-item" v-for="(item, index) in trail_ip" :key="index">
						<view class="content">
							<view class="flex justify-between">
								<!-- :class="'text-' + item.color" -->
								<view :class="'text-' + item.color">
									<text class="cuIcon-info margin-right-xs"></text>
									<text>{{ item.label }}</text>
								</view>
								<!-- :current="item.score" @change="ipChange" :params="idx" -->
								<tui-rate :size="22" :current="item.score" @change="rateChange" :params="index"></tui-rate>
							</view>
						</view>
					</view>
					<!-- </view> -->
				</view>
			</view>
<!-- <zz-upload-image :count="40" @uploadImage="uploadImage"></zz-upload-image> -->
			<view class="form-section">
                <view class="cu-bar bg-white">
                    <view class="action">
                        沿途照片
                        <text class="text-gray text-sm">（上传原图照片可自动定位坐标）</text>
                    </view>
                    <view class="action"></view>
                </view>
                <view class="cu-form-group solid-bottom">
                    <view class="grid col-4 grid-square flex-sub">
                        <view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="onPreview(index)">
                            <image :src="imgList[index]" mode="aspectFill"></image>
                            <view class="cu-tag bg-red" @tap.stop="deleteimg(index)"><text class="cuIcon-close"></text></view>
                        </view>
                        <view class="solids" @tap="uploadImage" v-if="imgList.length < 40"><text class="cuIcon-cameraadd"></text></view>
                    </view>
                </view>
                <view class="cu-bar bg-white">
                    <view class="action"></view>
                    <view class="action">{{ imgList.length }}/40</view>
                </view>
            </view>
			
			<!--底部操作栏-->
			<view class="cu-tabbar-height"></view>
			<view class="cu-bar bg-white tabbar border shop foot">
				<button class="action text-red" @tap="close">
					<view class="cuIcon-close"></view>
					放弃
				</button>
				<view class="bg-ztsgreen submit cuIcon-check" @tap="saveLineTrack">保存路线</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	onShow() {
		let sportType = uni.getStorageSync('currentSportType'); // 获取当前的运动类型

		// if(sportType){

		// }

		if (sportType) {
			this.sportList.forEach(item => {
				item.list.forEach(sport => {
					if (sportType === sport.title) {
						this.sport = sport;
					}
				});
			});
		}
	},
	onLoad() {
		this.lineName = this.getTimeFormat();
		// this.lineDesc = this.getTimeFormat();
		this.trail_element = this.dict.trail_element;
		// console.log('印象评分', JSON.parse(JSON.stringify(this.dict.trail_ip)));
		this.trail_ip = this.dict.trail_ip;
	},
	onReady() {},
	data() {
		return {
			trail_ip: [],
			trail_element: [],
			dict: uni.getStorageSync('sys_dict'),
			lineName: '', // 路线名称
			lineDesc: '', // 路线详情
			currentLevelText: '简单', // 当前的路线等级
			imgList: [], // 上传的图片
			sport: {
				// 当前的运动类型
				title: '健行',
				iconName: 'sport-110'
			},
			sportList: [
				// 运动类型列表
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
		rateChange(event) {
			this.$set(this.trail_ip[Number(event.params)], 'score', event.index);
		},
		// 景观元素点击
		elCheckboxChange(event) {
			let checkList = event.target.value; // 当前选中的列表
			let keys = Object.keys(this.trail_element);
			keys.forEach(key => {
				this.$set(this.trail_element[key], 'checked', false);
			});
			for (let i = 0, len = checkList.length; i < len; i++) {
				keys.forEach(key => {
					if (checkList[i] === key) {
						this.$set(this.trail_element[key], 'checked', true);
					}
				});
			}
		},
		// 格式化时间
		getTimeFormat() {
			let d = new Date();
			let year = d.getFullYear();
			let month = change(d.getMonth() + 1);
			let day = change(d.getDate());
			let hour = change(d.getHours());
			let minute = change(d.getMinutes());
			let second = change(d.getSeconds());

			function change(t) {
				if (t < 10) {
					return '0' + t;
				} else {
					return t;
				}
			}
			let time = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute + ':' + second;
			return time;
		},

		// 滑动条改变
		sliderChange(event) {
			// console.log('滑动条==', event);
			let map = new Map();
			map.set(1, '简单');
			map.set(2, '中等');
			map.set(3, '难');
			map.set(4, '很难');
			map.set(5, '仅适合专业人士');
			this.currentLevelText = map.get(event);
		},
		close() {
			uni.navigateBack();
		},
		saveLineTrack() {
			uni.showToast({
				title: '保存成功',
				icon: 'none',
				duration: 750
			});

			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/planning/myLineTrack'
				});
			}, 800);
		},
		uploadImage() {
			uni.chooseImage({
			    count: 40, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'], //从相册选择
			    success: (res) => {
			        if (this.imgList.length != 0) {
			            this.imgList = this.imgList.concat(res.tempFilePaths);
			        } else {
			            this.imgList = res.tempFilePaths;
			        }
			
			        this.$emit('uploadImage', this.imgList);
			    }
			});
		},
		onPreview() {
			// uni.previewImage({
			// 		urls: kmlPoints ? this.kml.pics[1] : this.imgs,
			// 		current: index
			// 	});
		},
		deleteimg() {
			this.imgList.splice(e.currentTarget.dataset.index, 1);
		},
		changeSportType() {
			uni.navigateTo({
				url: '/pages/planning/sportType',
				animationType: 'slide-in-bottom'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f1f1f1;
}

body {
	background-color: #f1f1f1;
}
.container {
	.form-section {
		background: #ffffff;
		border-radius: 16rpx;
		margin: 20rpx 20rpx;
		padding: 24rpx 28rpx;
		box-sizing: border-box;

		&-title {
			margin-bottom: 12rpx;
			font-size: 1.2rem;
			color: #999999;
		}
	}
}

.sport-type-wrapper {
	box-sizing: border-box;
	width: 222rpx;
	height: 222rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background-color: #f4f4f4;
	border-radius: 10rpx;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	margin-right: 20rpx;
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

.change-sport-btn-box {
	width: 420rpx;
}

.current-level {
	font-size: 1.4rem;
	color: #222222;
}

// .cu-list.menu > .cu-item {
//     position: relative;
//     display: flex;
//     padding: 0 15px;
//     min-height: 50px;
//     background-color: #ffffff;
//     justify-content: space-between;
//     align-items: center;
// }
</style>
