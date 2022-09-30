<template>
    <!-- 
    name:  轨迹的展示卡片
    desc:
    date:
    update:
    author:
 -->
    <view class="push-content">
        <view class="line-info-box">
            <image class="line-info-image" src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg" mode="" />
            <view class="flex justify-between flex-direction padding">
                <view class="text-df text-bold text-spacing">2022-02-28 08:50:38</view>
                <view class="flex justify-between text-gray text-df">
                    <text>徒步</text>
                    <text>8.5km</text>
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
.line-info-box {
    display: flex;
    flex-direction: row;
    margin-top: 20rpx;
    // 轨迹信息
    border: 1px solid #e2e2e2;
    border-radius: 20rpx;
    .line-info-image {
        width: 160rpx;
        height: 160rpx;
    }
}
</style>
