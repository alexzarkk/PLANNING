<template>
    <!-- 
    name: 文章的简略图，列表
    desc:
    date:
    update:
    author:
 -->
    <view class="cu-card case" :class="isCard ? 'no-card' : ''">
        <view class="cu-item shadow">
            <view class="image">
                <image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" mode="widthFix"></image>
                <view class="cu-tag bg-blue">热门</view>
                <view class="cu-bar bg-shadeBottom">
                    <text class="text-cut"></text>
                </view>
            </view>
            <view class="cu-list menu-avatar">
                <view class="cu-item">
                    <view class="cu-avatar round lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg)"></view>
                    <view class="content flex-sub">
                        <view class="text-grey">正义天使 凯尔</view>
                        <view class="text-gray text-sm flex justify-between">
                            十天前
                            <view class="text-gray text-sm">
                                <text class="cuIcon-attentionfill margin-lr-xs"></text>
                                10
                                <text class="cuIcon-appreciatefill margin-lr-xs"></text>
                                20
                                <text class="cuIcon-messagefill margin-lr-xs"></text>
                                30
                            </view>
                        </view>
                    </view>
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

<style lang="scss" scoped></style>
