<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-09 10:07:33
 * @FilePath: \sport-planing\src\pages\my\set\privacy.vue
 * @Description: 
 * 
 * 
-->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">服务协议</block>
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
