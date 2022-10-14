<template>
<page-meta root-font-size="10px"></page-meta>
    <!-- 急救救援信息 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">救援信息</block></cu-custom>
        <view class="container">
            <tui-list-view margin-top="20rpx">
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">姓名</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">手机号</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">生日</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
                <tui-list-cell arrow>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">血型</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
            </tui-list-view>

            <tui-list-view margin-top="20rpx">
                <tui-list-cell>
                    <view class="justify-between flex padding-right align-center">
                        <text class=" ">添加紧急联系人</text>
                        <text class="text-black  "></text>
                    </view>
                </tui-list-cell>
            </tui-list-view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
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
.container {
    background-color: #f1f1f1;
}
</style>
