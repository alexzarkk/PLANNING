<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-28 15:31:13
 * @FilePath: \sport-planing\src\pages\my\social\fans.vue
 * @Description: 我的粉丝
 * 
 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bg-color="bg-ztsgreen" :is-back="true">
            <block slot="content">粉丝</block>
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
                    <view class="right-box" @click.stop="followUser">
                        <view v-if="!item.isLink" class="foolow-btn">关注</view>
                        <view v-else class="foolow-btn">互相关注</view>
                    </view>
                </view>
            </view>
        </view>
        <zz-page-status :loading="loading" :length="userList.length" :is-center="true" :total="total" msg="暂时还没有人关注你"></zz-page-status>
    </view>
</template>

<script>
export default {
    data() {
        return {
            loadStatus: 'loadmore', // 加载状态 none:不显示加载  loadmore:可以继续加载  nomore:没有更多了   loading:正在加载
            isEmpty: false, // 没有数据
            pageNum: 1,
            pageSize: 10,
            userList: [], // 我关注的列表
            total: -1
        };
    },
    onLoad() {
        this.loadData();
    },
    methods: {
        async loadData(type, stopPullDown) {
            const req1 = {
                $url: '/user/ue/page',
				ui: 1,
                t: 60, // 事件：关注
                tt: 60, // 对象: 用户
                tid: this.zz.getAcc()._id, // 查看我的关注
                page: this.pageNum,
                size: this.pageSize
            }
            if (type === 'init') {
                this.userList = [];
                this.pageNum = 1;
                this.total = -1;
            }
            if (this.loading || this.userList.length === this.total) {
                return;
            }
            this.loading = true;
            this.zz.req(req1).then(({ pagination, list }) => {
                this.total = pagination.total; // 赋值total
                this.pageNum++;
                this.userList = this.userList.concat(list)
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
        openProfile(user) {
            // console.log('user=========', user);
            this.zz.profile(user._id)
            // this.zz.href(`/pages/my/profile/profile?id=${user._id}`)
        },
        handleSearch(event) {
            // console.log("处理搜索", event)
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
        // async followUser() {
        // const ueRes = await this.zz.userEvent(60, 60, this.details, 'userId');  // 这里修改isFollow
        // try {
        //     if (this.details.isFollow) {
        //         this.zz.toast('关注成功~', 1000);
        //     } else {

        //         this.zz.toast('已取消关注', 1000);
        //     }
        // } catch (error) {
        //     console.error('取消关注失败==', error);
        // }
        // },
    },
    onPullDownRefresh() {
        this.loadData('init', true)
    },
    onReachBottom() {
        this.loadData('add')
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
    padding-top: 24rpx;
    // padding-bottom: 24rpx;
    background-color: #ffffff;
    .follow-box {
        padding: 0rpx 24rpx 24rpx 24rpx;
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
                        font-size: 1.6rem;
                        margin-bottom: 5rpx;
                    }

                    .follow-u {
                        // margin-left: rpx;
                        margin-bottom: 5rpx;
                        width: 8em;
                        // width: calc(4em + 20rpx);
                        padding: 5rpx 10rpx;
                        border-radius: 50rpx;
                        font-size: 0.8rem;
                        color: $color-black;
                        // font-weight: bold;
                        text-align: center;
                        background-color: #e2e2e2;
                        color: $color-black;
                    }

                    .date {
                        font-size: 1.4rem;
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
