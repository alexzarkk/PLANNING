<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-24 09:43:08
 * @FilePath: \sport-planing\src\pages\comm\region.vue
 * @Description: 地区选择
 * 
 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">地区选择</block>
        </cu-custom>
        <view class="container">
            <!-- <view class="bg-white response" id="location">
                <view class="cur-location padding">
                    <view class="text-sm text-gray margin-bottom-xs">当前定位</view>
                    <view class="flex justify-between text-df">
                        <view class="text-df">宁波市</view>
                        <view>
                            <text class="cuIcon-focus margin-right-xs"></text>
                            重新定位
                        </view>
                    </view>
                </view>
            </view> -->
            <!-- <tui-segmented-control :values="titleList" activeColor="#0081ff" @click="titleChange"></tui-segmented-control> -->
            <view class="margin-top bg-white response" id="city">
                <view class="padding tag-list-box">
                    <view class="city-tag" :class="activeCity===city.id?'city-active': ''" @click="cityClick(city)" v-for="(city, index) in cityList" :key="index">{{ city.name }}</view>
                </view>
            </view>
            <scroll-view scroll-y scroll-with-animation="true" :style="regionListStyle" :scroll-into-view="targetCityId">
                <view :id="'city' + region.id" v-for="(region, reIndex) in cityList" :key="reIndex">
                    <tui-list-view :id="region.id + ''" :title="region.name" color="#777">
                        <tui-list-cell v-for="(district, index) in region.regionList" :key="index" @click="selectRegion(district)" arrow>{{ district.name }}</tui-list-cell>
                    </tui-list-view>
                </view>
            </scroll-view>
            <!-- <tui-tag type="white" padding="20rpx 30rpx">实心标签</tui-tag> -->
        </view>
    </view>
</template>

<script>
export default {
	data() {
	    return {
			activeCity:330100, // 当前激活的城市
	        targetCityId: 'city330100',
	        StatusBar: this.StatusBar,
	        CustomBar: this.CustomBar,
	        regionListStyle: {},
	        dict: uni.getStorageSync('sys_dict'),
	        currentTitle: 0,
	        titleList: ['市', '县（市，区）', '乡镇街道'],
	        cityList: []
	    };
	},
    onLoad() {
        const codes = Object.keys(this.dict.deps);
        let cityList = [],
            regionList = [];
        for (let i = 0, len = codes.length; i < len; i++) {
            let region = this.dict.deps[codes[i]];
            if (region.pid === 330000) {
                cityList.push(region);
            } else if (region.id !== 330000) {
                regionList.push(region);
            }
        }
        for (let i = 0, len = cityList.length; i < len; i++) {
            cityList[i].regionList = [];
            for (let j = 0, jLen = regionList.length; j < jLen; j++) {
                if (regionList[j].pid === cityList[i].id) {
                    cityList[i].regionList.push(regionList[j]);
                }
            }
        }
        this.cityList = cityList; // 格式化城市列表
    },
    mounted() {
        // 计算滑动列表高度
        // console.log((this.StatusBar + this.CustomBar)*2);
        let height = (this.StatusBar + this.CustomBar) * 2;
        const query = uni.createSelectorQuery().in(this);
        let height1 = 0,
            height2 = 0;
			
        // query.select('#location').boundingClientRect((data) => { height1 = data.height }).exec()

        query.select('#city').boundingClientRect((data) => { height2 = data.height }).exec()

        // console.log('高度======', height + height1 * 2 + height2 * 2);
        height = height + height1 * 2 + height2 * 2 - 20;
        this.regionListStyle = { height: `calc(100vh - ${height}rpx)` }
    },
    
    methods: {
        async selectRegion(d){
        	uni.setStorageSync('cur_deptId', d.id+'')
        	uni.showLoading({ mask:true })
        	await this.zz.setDept()
        	uni.navigateBack()
        },
        cityClick(item) {
			this.activeCity = item.id
            this.targetCityId = 'city' + item.id;
        },
        titleChange({ index }) {
            this.currentTitle = index;
        },
        // 地区点击
        regionClick({ index }) {}
    }
};
</script>

<style lang="scss" scoped>
page {
    height: calc(100vh - 188rpx);
    background-color: #f1f1f1;
}
body {
    height: calc(100vh - 188rpx);
    background-color: #f1f1f1;
}

.tag-list-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    // row-gap: 20rpx;
    // column-gap: 20rpx;
    .city-tag {
		margin-bottom: 20rpx;
        font-size: 1.2rem;
        width: 210rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: #e2e2e2;
        text-align: center;
        border-radius: 20rpx;
        margin-right: 21rpx;
    }
	
	.city-active{
		border:2px solid $zts-green;
	}
}
</style>
