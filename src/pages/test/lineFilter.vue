<template>

    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">
                筛选条件
            </block>
        </cu-custom>
        <view class="container">
            <!-- 活动类型 -->
            <!-- 里程 -->
            <!-- 海拔落差 -->
            <!-- 线路难度 -->
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
