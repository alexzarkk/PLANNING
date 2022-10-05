<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">评论详情</block>
        </cu-custom>
        <view class="container">
            <!-- 主评论 -->
            <view class="padding bg-white flex justify-between margin-bottom-sm" style="position:relative;">
                <view class="flex">
                    <view class="margin-right">
                        <view v-if="isReady" class="cu-avatar round lg" :style="'background-image:url(' + details.userInfo.headImg + ')'" @click="openProfile(details)"></view>
                    </view>
                    <view class="flex flex-direction flex-start padding-top">
                        <view class="flex justify-between align-center">
                            <view v-if="isReady" @click="openProfile(details)">{{ details.userInfo.nickName }}</view>
                        </view>
                        <view class="margin-bottom">
                            <view v-if="isReady" class="padding-top">{{ details.content }}</view>
                        </view>
                        <view class="margin-bottom-xs">
                            <view v-if="isReady" style="width:550rpx;" class="text-gray text-sm flex justify-between align-center">
                                <view class="margin-right">
                                    {{ details.createTime }}
                                </view>
                                <view class="flex align-center">
                                    <view class="cu-tag radius margin-right" @click="replayComment(details)">回复</view>
                                    <view class="flex">
                                        <view class="margin-right-xs">
                                            <text v-if="!details.isLike" class="cuIcon-appreciate text-gray" @click="likeComment(details)"></text>
                                            <text v-else class="cuIcon-appreciatefill text-orange" @click="likeComment(details)"></text>
                                        </view>
                                        <text v-show="details.like>0" class="padding-right" :class="details.isLike?'text-orange':''">{{ details.like }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="more-action" @click="moreAction(details)">
                    <text class="cuIcon-moreandroid"></text>
                </view>
            </view>
            <view class="cu-bar bg-white solid-bottom">
                <view v-if="isReady" class="action">
                    <text class="cuIcon-title text-blue "></text>
                    评论 ({{ details.children.length }})
                </view>
            </view>
            <view v-for="(item) in details.children" :key="item._id" style="position:relative;" class="padding bg-white flex justify-between">
                <view class="flex">
                    <view class="margin-right">
                        <view v-if="isReady" class="cu-avatar round" :style="'background-image:url(' + item.userInfo.headImg + ')'"></view>
                    </view>
                    <view class="flex flex-direction flex-start padding-top-xs">
                        <view class="flex align-center">
                            <view v-if="isReady" class="margin-right-xs">{{ item.userInfo.nickName }}</view>
                            <view class="margin-right-xs text-gray" @click="replayComment(item)">回复</view>
                            <view @click="userProfile(item.rid)">{{ item.rName }}</view>
                        </view>
                        <view class="margin-bottom">
                            <view v-if="isReady" class="padding-top">{{ item.content }}</view>
                        </view>
                        <view class="margin-bottom-xs">
                            <view v-if="isReady" style="width:550rpx;" class="text-gray text-sm flex justify-between align-center">
                                <view>
                                    {{ item.createTime }}
                                </view>
                                <view class="flex align-center">
                                    <view class="cu-tag radius margin-right" @click="replayComment(item)">回复</view>
                                    <view class="flex">
                                        <view class="margin-right-xs">
                                            <text v-if="!item.isLike" class="cuIcon-appreciate text-gray" @click="likeComment(item)"></text>
                                            <text v-else class="cuIcon-appreciatefill text-orange" @click="likeComment(item)"></text>
                                        </view>
                                        <text v-show="item.like>0" class="padding-right" :class="item.isLike?'text-orange':''">{{ item.like }}</text>
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
            <!-- 底部评论条 -->
            <view class="comment-bar" :style="{bottom:btnBottom+'px'}">
                <view class="cu-bar input comment-bar-wrapper">
                    <view class="image">
                        <view class="cu-avatar round" :style="'background-image:url('+userInfo.headImg+')'"></view>
                    </view>
                    <!-- <view class="action">
                        <text class="cuIcon-roundaddfill text-grey"></text>
                    </view> -->
                    <input
                        v-model="comment" :focus="activeComment" :adjust-position="false" :placeholder="replayInfo" class="solid-bottom"
                        maxlength="50" cursor-spacing="10" @keyboardheightchange="keyboardheightchange"
                    >
                    <!-- <view class="action">
                        <text class="cuIcon-emojifill text-grey"></text>
                    </view> -->
                    <button class="cu-btn bg-green shadow-blur" :disabled="loading" @click="sendComment">发送</button>
                </view>
            </view>

            <!-- 单挑评论的相应操作
                如果是自己的评论则  删除操作
                别人的评论则是   举报 | 加入黑名单
             -->
            <tui-actionsheet :show="isMyMenuShow" :item-list="myMenuList" @click="confirmMyMenu" @cancel="isMyMenuShow = false"></tui-actionsheet>
            <tui-actionsheet :show="isOtherMenuShow" :item-list="otherMenuList" @click="confirmOtherMenu" @cancel="isOtherMenuShow = false"></tui-actionsheet>
            <zz-cu-modal :loading="false" :show="isDeleteShow" title="提示" @confirm="confirmDeleteComment" @cancel="isDeleteShow=false">
                <view class="padding bg-white">删除评论后将不可恢复，是否继续?</view>
            </zz-cu-modal>
            <tui-loading v-show="loading"></tui-loading>
            <view style="height: 100rpx; width: 750rpx"></view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            activeComment: false, // 是否拉起input
            loading: false,
            isDeleteShow: false, // 删除确认框控制
            userInfo: {},
            commentId: null, // 当前主评论id
            btnBottom: 0, // 评论条弹起的高度
            isCard: true, // 是否需要两边留白
            isReady: false, // 是否已经从服务器加载好数据
            details: {}, // 从服务器获取的页面的信息
            replyObj: {
                name: ''
            },
            comment: '',
            tid: '', // 评论的内容的主ID
            isMyMenuShow: false, // 展示菜单    自己的评论
            isOtherMenuShow: false, // 打开别人的评论菜单
            currentComment: null, // 当前操作的评论
            myMenuList: [
                {
                    text: '删除',
                    color: '#2B2B2B',
                    cmd: 'del'
                }
            ],
            otherMenuList: [
                {
                    text: '举报',
                    color: '#2B2B2B',
                    cmd: 'report'
                },
                {
                    text: '加入黑名单',
                    color: '#2B2B2B',
                    cmd: 'block'
                }
            ]
        };
    },
    computed: {
        // 回复的信息 placeholder  回复XXX:
        replayInfo() {
            if (this.replyObj.rName) {
                return '回复' + this.replyObj.rName + '：';
            } else {
                return '';
            }
        }
    },
    onLoad({ v }) {
        this.userInfo = this.zz.getAcc();
        const option = this.zz.getParam(v);
        this.tid = option.tid;
        this.commentId = option.commentId;
        this.loadData(option.commentId);
        const _this = this;
        // 软键盘弹起的时候弹起input框
        uni.onKeyboardHeightChange((res) => {
            _this.btnBottom = res.height;
        });
    },
    methods: {
        async loadData(commentId) {
            const requestParams = {
                $url: 'public/blog/info',
                _id: commentId
            };
            this.zz.req(requestParams).then((res) => {
                this.details = res;
                this.isReady = true;
                this.replyObj = {
                    pid: this.details._id,  // 对当前的一级评论回复
                    rid: this.details.userInfo._id,  // 一级评论的用户id
                    rName: this.details.userInfo.nickName  // 一级评论的用户 昵称
                };
            });
        },
        inputFocus() { },
        openProfile(item) {
            // console.log('用户信息=======', item);
            this.zz.href(`/pages/my/profile/profile?id=${item.userInfo._id}`)
        },
        replayComment(item) {
            // console.log("回复的评论", item)
            this.replyObj = {
                pid: this.details._id,  // pid 也就是评论的 一级评论的id
                rid: item.userInfo._id,  // 回复的用户的 id
                rName: item.userInfo.nickName  // 回复的用户的昵称
            };
            // console.log("回复对象==========", this.replyObj)
            this.activeComment = !this.activeComment;
        },
        async likeComment(item) {
            if (item._id === this.commentId) {
                this.zz.userEvent(30, 2, this.details)
                // 主评论点赞
            } else {
                // 给子评论点赞
                let target = this.details.children.find((comment) => {
                    return comment._id === item._id;
                });
                if (!target) {

                } else {
                    const ue = await this.zz.userEvent(30, 2, target)
                    const cIndex = this.details.children.findIndex(res => {
                        return res._id === target._id
                    })
                    if (cIndex === -1) {
                        console.error("评论点赞状态更新失败")
                    } else {
                        this.$set(this.details.children[cIndex], "isLike", target.isLike)
                    }
                }



            }
            setTimeout(() => {
                uni.$emit('modifyComment');
            }, 500)

        },
        // 发送评论
        sendComment() {
            if (!this.comment || this.loading) {
                return;
            }
            this.loading = true;
            let requestParams = {
                $url: 'user/blog/add',
                content: this.comment,
                pid: this.replyObj.pid,  // 一级评论的id,用来查询当前评论下的所有评论
                rid: this.replyObj.rid  // 回复人的_id 用来查询个人资料
            };
            this.zz.req(requestParams).then((res) => {
                const now = this.zz.time2Date(false, 'Y-M-D h:m:s');
                // console.log("获取到的时间", now)
                this.details.children.unshift({
                    _id: res.id,
                    like: 0,
                    isLike: false,
                    userInfo: this.userInfo,
                    userId: this.userInfo._id,  // 前端使用
                    rid: this.replyObj.rid,
                    rName: this.replyObj.rName,
                    content: this.comment,
                    createTime: now
                });
                uni.$emit('modifyComment');
                this.comment = '';
                this.zz.toast('评论成功~', 1000);
            })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 打开评论的操作菜单
        moreAction(item) {
            this.currentComment = item;
            // 如果userId是自己，则表示当前是自己的评论
            if (item.userId === this.userInfo._id) {
                this.isMyMenuShow = true; // 我的评论
                // this.isOtherMenuShow = true;
            } else {
                this.isOtherMenuShow = true;
            }
        },
        // 我的评论菜单确认
        confirmMyMenu({ cmd }) {
            // 删除评论后将不可恢复，是否继续
            if (cmd === 'del') {
                // 删除
                this.isMyMenuShow = false;
                this.isDeleteShow = true;
            }
        },
        confirmOtherMenu({ cmd }) {
            if (cmd === 'report') {
                // 举报
            }

            if (cmd === 'block') {
                // 加入黑名单
            }
        },
        // 删除当前操作的评论
        confirmDeleteComment() {
            const requestParams = {
                $url: 'user/blog/delete',
                _id: this.currentComment._id,
                tid: this.tid // 用来刷新缓存列表
            };
            this.zz.req(requestParams).then((res) => {
                const index = this.details.children.findIndex((item) => {
                    return item._id === this.currentComment._id;
                });
                if (index === -1) {
                    console.error('没有找到删除对象');
                } else {
                    this.details.children.splice(index, 1);
                }
                uni.$emit('modifyComment', {
                    msg: '详情页子评论'
                });
                this.zz.toast('评论已删除', 1000);
                if (this.currentComment._id === this.commentId) {
                    setTimeout(() => {
                        uni.navigateBack({ delta: 1 });
                    }, 500);
                }
                this.isDeleteShow = false;
            });
        },
        // 键盘的高度控制
        keyboardheightchange(event) {
            if (event.target.height === 0) {
                this.activeComment = false;
            }
        },
    },
    onPageScroll() {
        uni.hideKeyboard()
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #f1f1f1;
}

.more-action {
    position: absolute;
    top: 50rpx;
    right: 50rpx;
}

.comment-bar {
    border-top: 1px solid #e2e2e2;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 750rpx;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .image {
        padding-top: 15rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &-wrapper {
        height: 100rpx;
        align-items: center;
    }
}
</style>
