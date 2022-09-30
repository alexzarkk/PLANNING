<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">导航栏名字</block></cu-custom>
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
    // created() {},
    mounted() {},
    onShow() {},
    methods: {
        async loadData() {}
    },
    // 下拉刷新
    onReachBottom() {},
    // 页面滚动
    onPageScroll() {},
    // 分享页面
    onShareAppMessage() {}
};
</script>

<style lang="scss" scoped>
</style>
