<template>
    <!-- 兴趣点 筛选 -->
    <view>
        <cu-custom bgColor="bg-green" :isBack="true">
            <block slot="content">筛选条件</block>
            <view slot="right">
                <view class="padding-right">
                    <button class="cu-btn bg-olive text-white">应用</button>
                </view>
            </view>
        </cu-custom>
        <view class="container">
            <!-- 类型 -->
            <!-- 海拔范围 -->
            <!-- 记录日期 -->
            <!-- 记录月份 -->
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {};
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData() { }
    }
};
</script>

<style lang="scss" scoped>
</style>
