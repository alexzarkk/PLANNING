<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">个人设置</block>
        </cu-custom>
        <view class="container"></view>
    </view>
</template>

<script>
export default {
    onLoad() {
        this.loadData();
    },
    onReady() {},
    data() {
        return {};
    },
    methods: {
        async loadData() {}
    }
};
</script>

<style lang="scss" scoped>
</style>
