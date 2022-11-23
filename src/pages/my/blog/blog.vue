<template>

    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">评论</block>
        </cu-custom>
        <!-- <view class="padding bg-white  segmented-view" :style="{top:CustomBar+'px'}">
            <tui-segmented-control :values="titleList" activeColor="#8fc42f" @click="modeChange"></tui-segmented-control>
        </view> -->
        <!-- <view style="height:140rpx;width:750rpx;"></view> -->
        <view>
            <view v-if="curTab === 1">
                <view v-for="(item,index) in tabList[1].list" :key="index" class="padding bg-white flex justify-between margin-bottom-sm solid-bottom" style="position: relative">
                    <view class="flex">
                        <view class="margin-right">
                            <view class="cu-avatar round lg" :style="'background-image:url(' + userInfo.headImg + ')'"></view>
                        </view>
                        <view class="flex flex-direction flex-start padding-top">
                            <view class="flex justify-between align-center">
                                <view>{{ userInfo.nickName }}</view>
                            </view>
                            <view class="margin-bottom">
                                <view class="padding-top">{{ item.content }}</view>
                            </view>
                            <view class="margin-bottom-xs">
                                <view style="width: 550rpx" class="text-gray text-sm flex justify-between align-center">
                                    <view class="margin-right">
                                        {{ item.createTime }}
                                    </view>
                                    <view class="flex align-center">
                                        <view class="flex">
                                            <view class="margin-right-xs">
                                                <text v-if="!item.isLike" class="cuIcon-appreciate text-gray"></text>
                                                <text v-else class="cuIcon-appreciatefill text-orange"></text>
                                            </view>
                                            <text v-show="item.like > 0" class="padding-right" :class="item.isLike ? 'text-orange' : ''">{{ item.like }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="more-action" @click="moreAction(item)">
                        <text class="cuIcon-moreandroid"></text>
                    </view>
                </view>
            </view>
        </view>
        <tui-actionsheet :show="isMyMenuShow" :item-list="myMenuList" @click="confirmMyMenu" @cancel="isMyMenuShow = false"></tui-actionsheet>
        <!-- 确认删除对话框 -->
        <zz-cu-modal :loading="false" :show="isDeleteShow" title="提示" @confirm="confirmDelete" @cancel="isDeleteShow=false">
            <view class="padding bg-white">删除评论后将不可恢复，是否继续?</view>
        </zz-cu-modal>
        <zz-page-status :loading="loading" :isCenter="true" :length="tabList[curTab].list.length" :total="tabList[curTab].total"></zz-page-status>
        <!-- <view class="cu-bar"></view> -->
        <!-- <tui-no-data :fixed="false" :imgUrl="bd.imgs.nodata">暂无数据</tui-no-data> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            currentComment:null,
            isDeleteShow: false,
            isMyMenuShow: false,
            StatusBar: this.StatusBar,
            CustomBar: this.CustomBar,
            userInfo: null,  // 个人信息
            curTab: 1, // 当前的tab
            titleList: ['我的帖子', '我的评论'],  // 分段器名称
            loading: false,  // 当前的页面加载状态
            tabList: [  // tab下面的list
                {
                    pageNum: 1,
                    pageSize: 10,
                    total: -1,
                    list: []
                },
                {
                    pageNum: 1,
                    pageSize: 10,
                    total: -1,
                    list: []
                }
            ],
            myMenuList: [
                // 对自己的评论的操作列表
                {
                    text: '删除',
                    color: '#2B2B2B',
                    cmd: 'del'
                }
            ],
        };
    },
    onLoad() {
        this.userInfo = this.zz.getAcc()
        this.loadData();
    },
    methods: {
        loadData(mode) {
            if (mode === 'init') {
                this.tabList[curTab] = {
                    pageNum: 1,
                    pageSize: 2,
                    total: -1,
                    list: []
                };
            }
            let requestParams = null,
                curTab = this.curTab,
                curList = this.tabList[curTab];
            if (curList.total === 0 || this.loading || curList.list.length === curList.total) {  // 当前页面数据为空  || 正在加载则不继续加载  || 当前数据已经加载完毕
                return;
            }
            this.loading = true;
            if (curTab === 0) {
                // 评论列表
            } else if (curTab === 1) {
                requestParams = {
                    $url: 'user/blog/page',
                    page: curList.pageNum,
                    size: curList.pageSize,
                    my: true
                };
            }
            if (requestParams) {
                this.zz.req(requestParams).then(({ pagination, list }) => {
                    curList.total = pagination.total; // 赋值total
                    curList.pageNum++;
                    curList.list = curList.list.concat(list); // 拼接列表
                }).catch((err) => {
                    console.error('列表加载失败=========', err);
                }).finally(() => {
                    this.loading = false;
                });
            } else {
                curList.list = [];
                curList.total = 0;
                this.loading = false;
            }
            setTimeout(() => {
                // console.log('列表===============', JSON.parse(JSON.stringify(this.tabList)));
            }, 1000);
        },
        modeChange(event) {
            this.curTab = event.index;
            this.loadData('init');
        },
        moreAction(item) {
            this.currentComment = item;
            this.isMyMenuShow = true; // 我的评论
        },
        confirmMyMenu({ cmd }) {
            // 删除评论后将不可恢复，是否继续
            if (cmd === 'del') {
                // 删除
                this.isMyMenuShow = false;
                this.isDeleteShow = true;
            }
        },
        // 删除当前操作的评论
        confirmDelete() {
            const commentList = this.tabList[1].list
            const requestParams = {
                $url: 'user/blog/delete',
                _id: this.currentComment._id,
                tid: this.tid // 用来刷新缓存列表
            };
            this.zz.req(requestParams).then((res) => {
                const index = commentList.findIndex((item) => {
                    return item._id === this.currentComment._id;
                });
                if (index === -1) {
                    console.error('没有找到删除对象');
                } else {
                    commentList.splice(index, 1);
                }
                this.tabList[1].total = commentList.length
                this.zz.toast('评论已删除', 1000);
                this.isDeleteShow = false;
            });
        },
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
.segmented-view {
    position: fixed;
    z-index: 10;
    top: 0;
    width: 750rpx;
}
</style>
