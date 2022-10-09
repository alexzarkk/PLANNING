<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-19 15:52:35
 * @FilePath: \sport-planing\src\components\news\video.vue
 * @Description:  资讯 - 视频
 * 
 * 
-->
<template>
    <!-- 推荐动态模块 -->
    <view class="moment-box padding">
        <view class="header-bar">
            <view class="avatar-box">
                <!-- <view class="cu-avatar round df margin-right-xs" :style="[{ backgroundImage: 'url(' + 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' + ')' }]"> -->
                    <view class="cu-tag badge cuIcon-male bg-blue"></view>
                </view>
                <view class="avatar-name-time" @click="testLogin">
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

        <view class="content-box">
            <view class="text-box text-cut-2 padding-bottom">发布了一条动态</view>
            <view class="image-box">
                <image
                    mode="aspectFill"
                    style="width: 33%; height: 200rpx"
                    v-for="(item, idx) in 9"
                    :key="idx"
                    :src="'https://fhty.976m.org/bdfh/img/0 (' + (idx + 1) + ').JPG'"
                ></image>
            </view>
        </view>

        <view class="info-bar">
            <view class="location-box cu-tag round">
                <text class="cuIcon-locationfill"></text>
                地点
            </view>
            <text class="text-grey text-xs">拍摄于：2022-04-04</text>
        </view>

        <view class="footer-bar">
            <view class="tag-box">
                <view class="cu-tag line-yellow margin-right-xs sm">动态</view>
                <view class="cu-tag line-yellow sm">精选</view>
            </view>
            <view class="watch-box">
                <view>
                    <text class="cuIcon-attention text-df margin-right-xs"></text>
                    <text>8.0w</text>
                </view>
                <view>
                    <text class="cuIcon-comment text-df margin-right-xs"></text>
                    <text>13</text>
                </view>
                <view>
                    <text class="cuIcon-like text-df margin-right-xs"></text>
                    <text>2</text>
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
    font-size: 1rem;
    display: flex;
    flex-direction: row;
    column-gap: 20rpx;
}

.moment-box {
    border-bottom: 1px solid #e2e2e2;
    .content-box {
        padding: 20rpx 0;

        .text-box {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .image-box {
            height: 606rpx;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;
        }
    }
    .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        .location-box {
            margin-right: 20rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

    .footer-bar {
        padding-top: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
