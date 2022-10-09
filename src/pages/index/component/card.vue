<template>
    <view>
        <view class="padding">
            <view class="header-bar">
                <view class="avatar-box">
                    <view
                        class="cu-avatar round df margin-right-xs"
                        :style="[{ backgroundImage: 'url(' + 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' + ')' }]"
                    >
                        <view class="cu-tag badge cuIcon-male bg-blue"></view>
                    </view>
                    <view class="avatar-name-time">
                        <view class="flex align-center">
                            <text class="text-df text-black margin-right-sm">蓝一2018</text>
                            <view class="cu-tag bg-blue sm round">领队</view>
                        </view>
                        <view class="flex align-center">
                            <text class="text-gray text-xss margin-right-sm">一个月以内</text>
                            <text class="text-gray text-xss">发布了新的评论</text>
                        </view>
                    </view>
                </view>
                <view class="like-box">
                    <button class="cu-btn sm line-blue">
                        <text class="cuIcon-add"></text>
                        关注
                    </button>
                </view>
            </view>
            <view>
                <view class="flex align-center padding-tb-sm">
                    <view class="flex flex-direction">
                        <view class="text-cut text-black text-df text-bold">{{ title }}</view>
                        <view class="text-cut-2 text-sm" style="width: 500rpx">{{ content }}</view>
                    </view>
                    <image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/f0fa0730-9588-11ea-9e8b-05a3242b26f2.jpeg" style="height: 160rpx"></image>
                </view>
                <view class="flex justify-between align-center">
                    <view class="cu-tag sm line-yellow margin-right-xs">话题</view>
                    <view class="watch-box">
                        <view class="watch-box-item">
                            <text class="cuIcon-attention text-df"></text>
                            <text>8.0w</text>
                        </view>
                        <view class="watch-box-item">
                            <text class="cuIcon-comment text-df"></text>
                            <text>13</text>
                        </view>
                        <view class="watch-box-item">
                            <text class="cuIcon-like text-df"></text>
                            <text>2</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: String,
        content: String
    },
    created() {},
    mounted() {},
    data() {
        return {};
    },
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
	column-gap: 24rpx;
	
	&-item{
		.text-df{
			margin-right: 10rpx;
		}
	}
}
</style>
