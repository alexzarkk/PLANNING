<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">导航栏名字</block>
        </cu-custom>
        <view class="container"></view>
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
