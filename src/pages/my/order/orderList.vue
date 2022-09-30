<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-17 15:39:06
 * @FilePath: \sport-planing\src\pages\template\template.vue
 * @Description: 订单列表
 * 
 * 
-->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">订单列表</block>
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
.container {
}
</style>
