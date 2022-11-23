<template>

<!-- 记录设置 -->
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">记录设置</block></cu-custom>
        <view class="container"></view>
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
