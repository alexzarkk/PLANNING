<template>
    <!-- 
			@name:行程套餐
			@desc：用于创建新页面
			@date：2022-05-09
			@author: 
	 -->
    <view>
        <!-- 
			这里的导航栏是根据设备和  不同端自适应的  务必使用这个  nav-bar
		 -->
        <!-- <cu-custom bgColor="bg-blue light">
            <block slot="content">驿站</block>
        </cu-custom> -->
        <!-- <view class=c""></view> -->
        <view class="container">
            <!-- <view class="cu-bar">
                <view class="action">
                    <text class="cuIcon-titles text-green"></text>
                    <text class="text-xl text-bold text-white">驿站</text>
                </view>
            </view> -->

            <view class="re-grid-box margin-top text-black">
                <view class="re-grid-box-one">
                    <view class="re-grid-box-one-left">
                        <view class="re-grid-item-big re-grid-item" @click="href('/pages/mall/special')">
                            <view class="re-grid-title">商店</view>
                            <view class="re-grid-sub-title">特产、文创纪念品 ...</view>
                            <view style="position: absolute; top: 20rpx; right: 20rpx">
                                <view class="re-icon zzIcon-z4018"></view>
                            </view>
                        </view>
                        <view class="re-grid-item re-grid-item-small" @click="href('/pages/serve/serve')">
                            <view class="re-grid-title">服务</view>
                            <view class="re-grid-sub-title">救援求助、故障反馈 …</view>
                            <view style="position: absolute; top: 20rpx; right: 20rpx">
                                <view class="re-icon zzIcon-z4004"></view>
                            </view>
                        </view>
                    </view>
                    <view class="re-grid-box-one-right">
                        <view class="re-grid-item re-grid-item-small" @click="href('/pages/station/food')">
                            <view class="re-grid-title">美食</view>
                            <view class="re-grid-sub-title">农家乐、小吃…</view>
                            <view style="position: absolute; top: 20rpx; right: 20rpx">
                                <view class="re-icon zzIcon-z4010"></view>
                            </view>
                        </view>
                        <view class="re-grid-item re-grid-item-small" @click="href('/pages/station/hotel')">
                            <view class="re-grid-title">住宿</view>
                            <view class="re-grid-sub-title">民宿、酒店</view>
                            <view style="position: absolute; top: 20rpx; right: 20rpx">
                                <view class="re-icon zzIcon-z4012"></view>
                            </view>
                        </view>
                        <view class="re-grid-item re-grid-item-small" @click="href('/pages/serve/serve')">
                            <view class="re-grid-title">保障</view>
                            <view class="re-grid-sub-title">行程报备、天气预报 …</view>
                            <view style="position: absolute; top: 20rpx; right: 20rpx">
                                <view class="re-icon zzIcon-safe-fill"></view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="re-grid-box-two re-grid-item" @click="href('/pages/station/news')">
                    <view class="re-grid-title">资讯</view>
                    <view class="re-grid-sub-title">新闻、游记、话题 …</view>
                    <view style="position: absolute; top: 20rpx; right: 20rpx">
                        <view class="re-icon zzIcon-news-fill"></view>
                    </view>
                </view>
                <view class="re-grid-box-two re-grid-item" @click="href('/pages/serve/serve')">
                    <view class="re-grid-title">教育</view>
                    <view class="re-grid-sub-title">户外科普、人文历史、科研培训 …</view>
                    <view style="position: absolute; top: 20rpx; right: 20rpx">
                        <view class="re-icon zzIcon-jiaoyu"></view>
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
        return {};
    },
	onBackPress() { return true },
    methods: {
        async loadData() {},
        href(e) {
            this.zz.href(e);
        }
    }
};
</script>
<style>
page {
    /* background-color: rgba(34, 71, 127, 0.4); */
    background-image: url(../../static/station2.jpg);
    //background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/adcb1df0-ad20-11ea-b94e-47f67ecf8268.JPG');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
	
    -moz-background-size: cover;
    -webkit-background-size: cover;
}
</style>
<style lang="scss" scoped>
.re-icon {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 60rpx;
	opacity: 0.6;
}

.container {
    padding-top: 40px;
    min-height: calc(100vh - 166rpx);
    // background-color: #38436e;

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
            position: relative;
            .re-grid-title {
                color: #ffaa00;
                font-size: 42rpx;
                font-weight: 700;
                // text-shadow: 1px 1px #ffbe4c;
                margin-bottom: 10rpx;
            }

            .re-grid-sub-title {
                color: #ffaa7f;
                font-size: 24rpx;
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
                background-color: rgba(34, 71, 127, 0.4);
                width: 345rpx;
                height: 420rpx;
                border-radius: 20rpx;
                border: 1px solid black;
            }

            .re-grid-item-small {
                background-color: rgba(34, 71, 127, 0.4);
                width: 345rpx;
                height: 200rpx;
                border-radius: 20rpx;
                border: 1px solid black;
            }
        }

        &-two {
            background-color: rgba(34, 71, 127, 0.4);
            margin-top: 30rpx;
            width: 710rpx;
            height: 200rpx;
            border-radius: 20rpx;
            border: 1px solid black;
        }
    }
}
</style>
