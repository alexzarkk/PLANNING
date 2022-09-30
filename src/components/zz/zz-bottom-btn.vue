<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-27 14:51:43
 * @FilePath: \sport-planing\src\components\zz\zz-bottom-btn.vue
 * @Description: 沉底按钮
 * 
 * 
-->
<template>
    <view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action text-grey">
                <view class="cuIcon-questionfill"></view>
                帮助
            </button>
            <view @click="confirm()" class="bg-ztsblue submit cuIcon-check">查看成绩</view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        // leftColor: {
        //     type: String
        // },
        rightColor: {
            type: String
        }
    },
    data() {
        return {};
    },
    created() {},
    mounted() {},
    methods: {
        confirm() {
			// console.log("bottom-btn-confirm=========")
            this.$emit('confirm');
        }
    }
};
</script>

<style lang="scss" scoped></style>
