<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-28 10:43:55
 * @FilePath: \sport-planing\src\pages\my\social\team.vue
 * @Description: 我的队伍
 * 
 * 
-->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">我的队伍</block>
            <block slot="right">
                <view class="padding-right text-xl">
                    <text class="cuIcon-scan"></text>
                </view>
            </block>
        </cu-custom>
        <view class="container">
            <view class="cu-list menu-avatar" @click="createTeam">
                <view class="cu-item">
                    <view class="cu-avatar round lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)"></view>
                    <!-- class="content" -->
                    <view class="content">
                        <view class="text-black">
                            <text class="text-xxl">创建队伍</text>
                        </view>
                    </view>
                    <view class="action">
                        <text class="cuIcon-right"></text>
                    </view>
                </view>
            </view>

            <view class="cu-list menu-avatar">
                <view class="cu-item" @click="openSetting">
                    <view class="cu-avatar round lg" style="background-image: url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)"></view>
                    <!-- class="content" -->
                    <view class="content padding-tb">
                        <view class="text-black">
                            <!-- padding-tb -->
                            <view class="flex flex-direction justify-betweeen align-start">
                                <text class="text-xl">sweet</text>
                                <text class="text-df">
                                    当前有
                                    <text class="text-red">0</text>
                                    人在线
                                </text>
                                <text class="text-df">队长:InsHomePgup</text>
                            </view>
                        </view>
                    </view>
                    <view class="action">
                        <text class="cuIcon-right"></text>
                    </view>
                </view>
            </view>
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
        async loadData() {},
        createTeam(){
            // this.zz.toast("功能暂未开放。")
            this.zz.href("/pages/my/social/teamCreate")
        },
        openSetting(){
            this.zz.href("/pages/my/social/teamSetting")
        }
    }
};
</script>

<style lang="scss" scoped>

page {
    background: #f1f1f1;
}

body {
    background: #f1f1f1;
}

.cu-list.menu-avatar > .cu-item{
height: 160rpx;
}
</style>
