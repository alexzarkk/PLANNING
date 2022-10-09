<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-19 15:20:55
 * @FilePath: \sport-planing\src\components\news\news.vue
 * @Description:  资讯 - 资讯 
 * 
 * 
-->
<template>
    <view class="bg-white solid-bottom">
             <view class="header-bar  padding-lr padding-tb-xs">
            <view class="avatar-box">
                <view class="cu-avatar round df margin-right-xs" :style="[{ backgroundImage: 'url(' + 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' + ')' }]">
                    <view class="cu-tag badge cuIcon-male bg-blue"></view>
                </view>
                <view class="avatar-name-time">
                    <text class="text-df text-black">花开花落</text>
                    <text class="text-grey text-xs">8小时前</text>
                </view>
            </view>
            <view class="like-box">
                <button class="cu-btn sm line-blue">
                    <text class="cuIcon-add"></text>
                    关注
                </button>
            </view>
        </view>
        <view class=" padding-lr padding-bottom-sm">
            <view class="flex align-center padding-tb-sm">
                <view class="flex flex-direction">
                    <view style="width: 500rpx" class="padding-lr-xs text-bold text-black text-df text-cut-2">运单热身的重要性</view>
                    <view style="width: 500rpx" class="pre-line padding-lr-xs text-dark text-sm text-cut-2">
                        热身是确保你发挥最大能力和最大化避免损伤最有效的方式之一，一个有效的热身应该在5分钟以上，包括全身...
                    </view>
                </view>
                <image mode="aspectFill" src="https://fhty.976m.org/bdfh/img/0 (10).JPG" style="height: 160rpx; width: 200rpx"></image>
            </view>
            <view class="flex justify-between align-center">
                <view class="cu-tag sm line-yellow margin-right-xs">资讯</view>
                	<view class="text-gray text-sm">
									<text class="cuIcon-attentionfill margin-lr-xs"></text>
									10
									<text class="cuIcon-appreciatefill margin-lr-xs"></text>
									20
									<text class="cuIcon-messagefill margin-lr-xs"></text>
									30
								</view>
                <!-- <view class="watch-box">
                    <text>青蜂侠</text>
                    <view>
                        <text class="cuIcon-attention text-df"></text>
                        <text>8.0w</text>
                    </view>
                    <view>
                        <text class="cuIcon-comment text-df"></text>
                        <text>13</text>
                    </view>
                </view> -->
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

.header-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .avatar-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        .avatar-name-time {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
        }
    }
}

.watch-box {
    align-items: center;
    font-size: 0.8rem;
    display: flex;
    flex-direction: row;
    column-gap: 20rpx;
}
</style>
