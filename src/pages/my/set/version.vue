<template>
    <!-- APP 版本以及帮助信息 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">关于环浙步道</block></cu-custom>
        <view class="container">
            <!-- 图标 + 版本 -->
            <view class="header-block flex align-center flex-direction">
                <view class="margin-bottom" style="margin-top: 100rpx">
                    <tui-lazyload-img width="200rpx" height="200rpx" :src="logo || ''"></tui-lazyload-img>
                </view>
                <view class="text-xxl text-bold">V1.0.1-885</view>
            </view>
            <tui-list-view margin-top="50rpx">
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">检查新版本</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">帮助中心</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">常见问题解答</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">去评分</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">服务协议</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">隐私政策</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">活动发布守则</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
            </tui-list-view>

            <tui-list-view margin-top="50rpx">
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">QQ群:123456</text>
                        <!-- <text class="text-black  ">179cm,79kg</text> -->
                    </view>
                </tui-list-cell>
            </tui-list-view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            logo: 'https://s1.ax1x.com/2022/06/16/XHMpvt.png'
        };
    },
    methods: {
        async loadData() {}
    },
    onLoad() {
        this.loadData();
    },
    onReady() {}
};
</script>

<style lang="scss" scoped>
</style>
