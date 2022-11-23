<template>

    <!-- 
			@name:我的线路
			@desc：
			@date：2022-05-15
			@author: 
	 -->
    <view>
        <cu-custom bgColor="bg-ztsgreen" :isBack="true">
            <block slot="content">我的线路</block>
        </cu-custom>
        <view class="container">
            <zz-line-track></zz-line-track>
        </view>
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
page {
    background-color: #c1c0bc;
}
body {
    background-color: #c1c0bc;
}
.container {
    min-height: calc(100vh - 166rpx);
    background-color: #c1c0bc;
}
</style>
