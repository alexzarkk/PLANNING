<template>
    <!-- 
    name:  活动板块 - 我参加的活动 - card
    desc:
    date:
    update:
    author:
 -->
    <!-- <view class="activities-container"> -->
    <!-- 左边图片 -->
    <!-- <view class="margin-right">
            <tui-lazyload-img width="200rpx" height="140rpx" src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg"></tui-lazyload-img>
        </view> -->
    <!-- 右边介绍 -->
    <!-- <view>
            <text>活动名称</text>
            <text>活动地点</text>
            <view>
                <text>集合地点</text>
                <text>持续时间</text>
            </view>
            <view>
                <text>第3届</text>
                <text>8100浏览</text>
            </view>
            <view>免费</view>
        </view>
    </view> -->
    <!-- :class="isCard ? 'no-card' : ''" -->
    <view class="cu-card article">
        <view class="cu-item shadow">
            <view class="title"><view class="text-cut">携手共跑9.9KM</view></view>
            <view class="content">
                <view class="margin-right">
                    <tui-lazyload-img width="200rpx" height="140rpx" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/e8c88303-3096-4371-8b3c-729534e5c4d3.jpg"></tui-lazyload-img>
                </view>
                <!-- <image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" mode="aspectFill"></image> -->
                <view class="desc">
                    <view class="text-content">全国完赛率最高赛道</view>
                    <!-- <view>
							<view class="cu-tag bg-red light sm round">古村</view>
							<view class="cu-tag bg-green light sm round">古道</view>
						</view> -->
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {},
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.activities-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 30rpx;
    background-color: #ffffff;
}
</style>
