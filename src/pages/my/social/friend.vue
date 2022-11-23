<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-09 09:48:55
 * @FilePath: \sport-planing\src\pages\my\social\friend.vue
 * @Description: 我的好友
 * 
 * 
-->
<template>

    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">好友</block>
        </cu-custom>
        <view class="container">
            <tui-searchbar radius="20px" placeholder="输入用户名、昵称查找" @click="handleSearch"></tui-searchbar>
            <view class="follow-box" v-for="(item, index) in pageList" :key="index">
                <view class="follow-section">
                    <view class="left-box">
                        <view class="avatar cu-avatar radius margin-left" style="background-image: url(https://s1.ax1x.com/2022/05/27/XmKJZ8.jpg)"></view>
                        <view class="info-box">
                            <view class="name">风起云涌</view>
                            <text class="follow-u">关注了您</text>
                            <view class="date">2018年6月注册</view>
                        </view>
                    </view>
                    <view class="right-box">
                        <view class="foolow-btn">互相关注</view>
                    </view>
                </view>
            </view>
            <zz-page-status :loading="loading" :length="pageList.length" :isCenter="true" :total="total"></zz-page-status>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            total: -1,
            pageList: [], // 分页列表
            pageNum: 1,
            pageSize: 10,
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        /**
         * type: add:加载更多  init:重新加载列表数据
         * stopPullDown:是否在加载完成时下拉刷新
         */
        async loadData(type, stopPullDown = false) {
            if (type === 'init') {
                this.pageList = [];
                this.pageNum = 1;
                this.total = -1;
            }
            if (this.loading || this.pageList.length === this.total || this.total === 0) {
                return;
            }
            this.total = 0
            // this.loading = true;
            // const req1 = {
            //     $url: 'page',
            //     page: this.pageNum,
            //     size: this.pageSize
            // }
            // this.zz.req(req1).then(({ pagination, list }) => {
            //     this.total = pagination.total; // 赋值total
            //     this.pageNum++;
            //     this.pageList = this.pageList.concat(list)
            //     this.loading = false;
            //     if (stopPullDown) {
            //         this.zz.toast("刷新成功", 1000)
            //         uni.stopPullDownRefresh();
            //     }
            // });
        },
        // 页面查询接口
        handleSearch() {

        }
    }
};
</script>

<style>
page {
    background-color: #ffffff;
}

body {
    background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
.container {
    // padding-top: 12rpx;
    padding-bottom: 24rpx;
    background-color: #ffffff;
    .follow-box {
        padding: 0 24rpx 24rpx 24rpx;
        .follow-section {
            border-bottom: 1px solid #e2e2e2;
            display: flex;
            justify-content: space-between;
            padding-bottom: 24rpx;
            .left-box {
                display: flex;
                flex-direction: row;
                align-items: center;
                .avatar {
                    margin-right: 24rpx;
                }
                .info-box {
                    display: flex;
                    flex-direction: column;
                    padding-top: 10rpx;
                    .name {
                        color: $color-black;
                        // font-weight: bold;
                        font-size: 36rpx;
                        margin-bottom: 5rpx;
                    }

                    .follow-u {
                        // margin-left: rpx;
                        margin-bottom: 5rpx;
                        width: 8em;
                        // width: calc(4em + 20rpx);
                        padding: 5rpx 10rpx;
                        border-radius: 50rpx;
                        font-size: 16rpx;
                        color: $color-black;
                        // font-weight: bold;
                        text-align: center;
                        background-color: #e2e2e2;
                        color: $color-black;
                    }

                    .date {
                        font-size: 28rpx;
                        color: $color-gray;
                    }
                }
            }
            .right-box {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                margin-top: 20rpx;
                .foolow-btn {
                    width: 160rpx;
                    height: 60rpx;
                    line-height: 60rpx;
                    border: 1px solid;
                    text-align: center;
                    border-radius: 10rpx;
                    color: $zts-green;
                }
            }
        }
    }
}
</style>
