<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-13 15:39:50
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-17 16:13:43
 * @FilePath: \sport-planing\src\pages\planning\testSwiper.vue
 * @Description: 
 * 
 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view class="container">
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">线路</block>
        </cu-custom>
        <view class="margin-top padding-sm">
            <tui-waterfall :listData="listData" :type="2" :pageSize="10">
                <!-- #ifdef MP -->
                <template slot-scope="{ entity, index }" slot="left">
                    <t-goods-item :entity="entity"></t-goods-item>
                </template>
                <template slot-scope="{ entity, index }" slot="right">
                    <t-goods-item :entity="entity"></t-goods-item>
                </template>
                <!-- #endif -->

                <!-- #ifdef APP-PLUS || H5 -->
                <template v-slot:left="slotProps">
                    <zz-line-item :lineData="slotProps.entity"></zz-line-item>
                    <!-- <t-goods-item :entity="slotProps.entity"></t-goods-item> -->
                </template>
                <template v-slot:right="sp">
                    <zz-line-item :lineData="sp.entity"></zz-line-item>
                    <!-- <t-goods-item :entity="sp.entity"></t-goods-item> -->
                </template>
                <!-- #endif -->
            </tui-waterfall>
            <!--加载loadding-->
            <tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
            <!-- <tui-nomore v-if="!pullUpOn" backgroundColor="#f7f7f7"></tui-nomore> -->
            <!--加载loadding-->
        </view>
    </view>
</template>

<script>
export default {
    onLoad() {
        this.loadData();
        const trailData = uni.getStorageSync('trailData');
        // console.log('trailData====', trailData);
        this.listData = trailData.trailData;
    },
    onReady() {},
    data() {
        return {
            loadding: false,
            listData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
        };
    },
    methods: {
        async loadData() {}
    }
};
</script>

<style lang="scss" scoped>
page {
    background-color: #f1f1f1;
}

body{
	background-color: #e2e2e2;
}

.container {
	min-height: calc(100vh - 166rpx);
	height: 100%;
	background-color: #e2e2e2;
	
}
</style>
