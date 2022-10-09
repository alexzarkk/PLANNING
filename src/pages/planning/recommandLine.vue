<template>
    <!-- 
			@name:行程套餐
			@desc：用于创建新页面
			@date：2022-05-09
			@author: 
            linear-gradient( to top ,rgba( 29,80,162, 1) 0%,rgba( 29,80,162, 0.9) 30%,rgba( 29,80,162, 0.4) 42%,rgba( 29,80,162, 0.1) 60%,rgba(0, 0, 0, 0) 100%), 
	 -->
    <view>
        <!-- 
			这里的导航栏是根据设备和  不同端自适应的  务必使用这个  nav-bar
		 -->
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <!-- <block slot="backText">返回</block> -->
            <block slot="content">行程套餐</block>
        </cu-custom>
        <view class="container">
            <view class="margin-top">
<!--                <view class="action">
                    <text class="cuIcon-titles text-green"></text>
                    <text class="text-xl text-bold text-white">行程套餐</text>
                </view> -->
            </view>

            <view class="re-grid-box"  @tap="href('/pages/planning/list?key=1')">
                <view class="re-grid-box-one">
                    <view class="re-grid-box-one-left">
                        <view
                            class="re-grid-item-big re-grid-item"
                            :style="{
                                backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2Jhj.jpg)'
                            }"
							
                            style="background-position: 70% 90%"
                        >
						<!-- https://s1.ax1x.com/2022/05/26/XE2Jhj.jpg -->
						<!-- /static/planning/recommand/918.jpg -->
                            <view class="re-grid-title">红色系列</view>
                            <view class="re-grid-sub-title">不忘初心，牢记使命</view>
                        </view>
                        <view
                            class="re-grid-item re-grid-item-small"
                            :style="{
                                backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2cC9.jpg)'
                            }"
                            style="background-position: 70% 50%"
                        >
                            <view class="re-grid-title">森林系列</view>
                            <view class="re-grid-sub-title">森林</view>
                        </view>
                    </view>
                    <view class="re-grid-box-one-right">
                        <view
                            class="re-grid-item re-grid-item-small"
                            :style="{
                                backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2hDK.jpg)'
                            }"
                            style="background-position: 70% 50%"
                        >
                            <view class="re-grid-title">名山系列</view>
                            <view class="re-grid-sub-title">留下您的脚印</view>
                        </view>
                        <view
                            class="re-grid-item re-grid-item-small"
                            :style="{
                                backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2IED.jpg)'
                            }"
                            style="background-position: 50% 82%"
                        >
                            <view class="re-grid-title">田园系列</view>
                            <view class="re-grid-sub-title">体验田园农趣</view>
                        </view>
                        <view
                            class="re-grid-item re-grid-item-small"
                            :style="{
                                backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2T4H.jpg)'
                            }"
                            style="background-position: 50% 50%"
                        >
                            <view class="re-grid-title">古道系列</view>
                            <view class="re-grid-sub-title">怀古忆往昔</view>
                        </view>
                    </view>
                </view>
                <view
                    class="re-grid-box-two re-grid-item"
                    :style="{
                        backgroundImage: 'url(/static/planning/recommand/904.jpg)'
                    }"
                    style="background-position: 50% 80%"
                >
                    <view class="re-grid-title">海岛系列</view>
                    <view class="re-grid-sub-title">尽享山海风光</view>
                </view>
                <view
                    class="re-grid-box-two re-grid-item"
                    :style="{
                        backgroundImage: 'url(/static/planning/recommand/908.jpg)'
                    }"
                    style="background-position: 70% 50%"
                >
                    <view class="re-grid-title">河湖系列</view>
                    <view class="re-grid-sub-title">沿河步道、环湖绿道</view>
                </view>
                <!-- <view class="re-grid-box-two re-grid-item">
                    <view class="re-grid-title">滨海系列</view>
                    <view class="re-grid-sub-title">滨海风情...</view>
                </view> -->
                <view
                    class="re-grid-box-two re-grid-item"
                    :style="{
                        backgroundImage: 'url(https://s1.ax1x.com/2022/05/26/XE2zVS.jpg)'
                    }"
                    style="background-position: 50% 40%"
                >
                    <view class="re-grid-title">体育系列</view>
                    <view class="re-grid-sub-title">赛事路线，等你来战</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            data: [
                { text: '名山系列', value: 902 },
                { text: '海岛系列', value: 904 },
                { text: '森林系列', value: 906 },
                { text: '河湖系列', value: 908 },
                { text: '滨海系列', value: 910 },
                { text: '田园系列', value: 912 },
                { text: '古道系列', value: 914 },
                { text: '体育系列', value: 916 },
                { text: '红色系列', value: 918 }
            ]
        };
    },
    onLoad() {
        this.loadData();
    },
    onReady() {},

    methods: {
        async loadData() {},
		href(u, e) {
			this.zz.href(u, e);
		}
		
    }
};
</script>

<style lang="scss" scoped>
page {
    background-color: #38517a;
}
.container {
    min-height: calc(100vh - 166rpx);
    background-color: #38517a;
    .re-grid-box {
        width: 750rpx;
        display: flex;
        flex-direction: column;
        align-items: center;

        .re-grid-item {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-left: 20rpx;
            padding-bottom: 20rpx;

            .re-grid-title {
                color: #ffffff;
                font-size: 1.8rem;
                margin-bottom: 10rpx;
            }

            .re-grid-sub-title {
                color: #efefef;
				
                font-size: 1.2rem;
            }
        }

        &-one {
            width: 750rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            &-left {
                width: 345rpx;
                height: 630rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
            }

            &-right {
                width: 345rpx;
                height: 630rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
            }

            .re-grid-item-big {
                width: 345rpx;
                height: 420rpx;
                border-radius: 20rpx;
                border: 1px solid black;
            }

            .re-grid-item-small {
                width: 345rpx;
                height: 200rpx;
                border-radius: 20rpx;
                border: 1px solid black;
            }
        }

        &-two {
            margin-top: 30rpx;
            width: 710rpx;
            height: 200rpx;
            border-radius: 20rpx;
            border: 1px solid black;
        }
    }
}
</style>
