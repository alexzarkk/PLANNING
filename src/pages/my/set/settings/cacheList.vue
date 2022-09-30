<template>
    <!-- 缓存列表以及清理缓存等功能 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">清理缓存</block>
        </cu-custom>
        <view class="container">
            <!-- <view class="cu-list menu shadow-lg radius solid">
                <view class="cu-item">
                    <view class="content">
                        <text class="cuIcon-fork"></text>
                        <text class="text-grey">图片缓存</text>
                    </view>
                    <view>
                        <button class="cu-btn bg-green">清理</button>
                    </view>
                </view>
                <view class="cu-item">
                    <view class="content">
                        <text class="cuIcon-footprint"></text>
                        <text class="text-grey">视频缓存</text>
                    </view>
                </view>
            </view> -->
            <radio-group class="block response" @change="RadioChange">
                <view class="cu-form-group justify-between">
                    <view class="title">缓存A </view>
                    <view class="flex align-center">
                        <text class="margin-right-xs">110.32Mb</text>
                        <radio :class="radio=='A'?'checked':''" :checked="radio=='A'?true:false" value="A"></radio>
                    </view>
                </view>
                      <view class="cu-form-group justify-between">
                    <view class="title">全选 </view>
                    <view class="flex align-center">
                        <text class="margin-right-xs">110.32Mb</text>
                        <radio :class="radio=='A'?'checked':''" :checked="radio=='A'?true:false" value="A"></radio>
                    </view>
                </view>
            </radio-group>
            <view class="padding response margin-top">
                <button class=" response cu-btn lg radius bg-red text-white">立即清理</button>
            </view>
            <!-- <view>提示:缓存是使用环浙步道产生的临时数据,清理缓存不会影响应用的正常使用。</view> -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            cacheMap: null
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData() {
            let map = new Map()
            map.set("图片缓存", ["imageChche"])
            map.set("视频缓存", ["videoCache"])
            this.cacheMap = map
        }
    }
};
</script>


<style>
page {
    background-color: #ffffff;
}
body {
    background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.cu-form-group{
display: flex;
justify-content: space-between;
align-items: center;
width: 750rpx;
padding:30 20rpx;
}
</style>
