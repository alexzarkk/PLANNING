<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-28 15:31:20
 * @FilePath: \sport-planing\src\pages\my\social\follow.vue
 * @Description: 我的关注
 * 
 * 
-->
<template>

    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">关注</block>
        </cu-custom>
        <view class="container">
            <!-- <tui-searchbar radius="20px" placeholder="输入用户名、昵称查找" @click="handleSearch"></tui-searchbar> -->
            <view v-for="(item, index) in userList" :key="index" class="follow-box" @click="openProfile(item)">
                <view class="follow-section">
                    <view class="left-box">
                        <view class="avatar cu-avatar radius margin-left" :style="{ backgroundImage: 'url(' + item.userInfo.headImg + ')' }"></view>
                        <view class="info-box">
                            <view class="name">{{ item.userInfo.nickName }}</view>
                            <!-- <text class="follow-u">关注了您</text> -->
                            <!-- <view class="date">2018年6月注册</view> -->
                            <view v-if="item.desc" class="desc">{{ item.desc }}</view>
                        </view>
                    </view>
                    <view class="right-box" @click.stop="followUser(item,index)">
                        <view v-if="item.isLink" class="foolow-btn">互相关注</view>
                        <view v-else>
                            <view v-if="item.isFollow" class="foolow-btn">正在关注</view>
                            <view v-else class="foolow-btn">关注</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <zz-page-status :loading="loading" :length="userList.length" :is-center="true" :total="total" @open="goHome"></zz-page-status>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            total: -1,
            userList: [], // 我关注的列表
            pageNum: 1,
            pageSize: 20,
            userId:''
        };
    },
    onLoad(option) {
        const userId = option.userId; // 查看别人的关注
        if(userId){
            this.userId = userId
        }else{
            this.userId = this.zz.getAcc()._id
        }
        this.loadData();
    },
    methods: {
        // 我的关注
        // async loadData() {
        //      this.zz.req({
        //             $url: 'user/ue/page',
        //             t:60,  // 事件：关注
        //             tt:60, // 对象: 用户
        //             uid:this.zz.getAcc()._id  // 查看我的关注
        //         }).then((res) => {
        //             console.log("获取到的我的关注列表",res)
        //             this.userList = res.list
        //         });
        // },
        /**
         * type: add or init
         */
        async loadData(type, stopPullDown) {
            if (type === 'init') {
                this.userList = [];
                this.pageNum = 1;
                this.total = -1;
            }
            if (this.loading || this.userList.length === this.total) {
                return;
            }
            this.loading = true;
            const req1 = {
                $url: '/user/ue/page',
				ui:true,
                t: 60, // 事件：关注
                tt: 60, // 对象: 用户
                page: this.pageNum,
                size: this.pageSize,
                my:true
            }
            this.zz.req(req1).then(({ pagination, list }) => {
                // console.log(list);
                this.total = pagination.total; // 赋值total
                this.pageNum++;
                list = list.map(res => {
                    res.isFollow = true
                    return res
                })
                this.userList = this.userList.concat(list)
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
        // 打开个人主页
        openProfile(user) {
            this.zz.profile(user.tid)
        },
        handleSearch() {

        },
        goHome() {
            uni.switchTab({
                url: '/pages/index/index'
            });
        },
        async followUser(item, index) {  // 关注或者取消关注
            // this.userList[index].isLink = !this.userList[index].isLink
            await this.zz.userEvent(60, 60, this.userList[index]).then(res => {
                console.log("关注或取消关注用户===", res)
                //  原始值 isLink的话,取消关注则取消isLink
                // 恢复关注则恢复isLink
                // 如果isLink 是false 的话,则不需要改变
            })
        }
    },
    onPullDownRefresh() {
        this.loadData('init', true)
    },
    onReachBottom() {
        this.loadData('add')
    }
};
</script>

<style lang="scss">
page {
    background-color: #ffffff;
}

body {
    background-color: #ffffff;
}
</style>
<style lang="scss" scoped>
.container {
    padding-top: 24rpx;
    // padding-bottom: 24rpx;
    background-color: #ffffff;
    // min-height: calc(100vh - 200rpx);
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
                        font-size: 32rpx;
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
