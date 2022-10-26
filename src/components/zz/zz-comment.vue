<template>
    <!-- 
    name:评论组件
    date:
    update:
    author:
    desc:
    评论组件设计
    主评论：
        {
            _id:
            userId:
            tid:
            createTime:
            content:
            imgs:
            like: 点赞数量
        }

        子评论:
            {
                _id:
                userId:评论人的id  查询出头像和昵称
                pid: 主评论的 _id
                pid:回复人的id
                rName:回复人的昵称
                rAvatar:回复人的头像
                content:  评论内容
                imgs:  评论的图片
                like: 点赞数量
            }
            查询主评论 tid=XXX
            查询子评论tid = .... & pid = ... 
            有pid的加入到children
            XXX回复 XXX(蓝色字):内容
 -->
    <view>
        <view class="cu-bar bg-white solid-top">
            <view class="action">
                <text class="cuIcon-titles text-orange"></text>
                最新评论
            </view>
            <!-- <view class="action"><switch :class="isCard ? 'checked' : ''" :checked="isCard ? true : false" @change="IsCard"></switch></view> -->
        </view>
        <view class="cu-list menu-avatar comment solids-top">
            <view v-for="(item,index) in commentList" :key="index" class="cu-item">
                <view class="cu-avatar round" :style="'background-image:url('+item.userInfo.headImg+')'" @click="openProfile(item)"></view>
                <view class="content">
                    <!-- 主评论 -->
                    <view class="flex justify-between response">
                        <view class="text-grey text-bold" @click="openProfile(item)">{{ item.userInfo.nickName }}</view>
                        <view v-if="item.isMy" @click="moreAction(item)">
                            <text class="cuIcon-moreandroid"></text>
                        </view>
                    </view>
                    <view class="text-black text-content text-df" @click="commentDetails(item)">{{ item.content }}</view>
                    <!-- 子评论 -->
                    <view v-if="item.children &&item.children.length > 0" class="bg-gray padding-sm radius margin-top-sm text-sm">
                        <view v-for="(commentInfo,cIndex) in item.children.slice(0,2)" :key="cIndex" class="flex">
                            <view class="text-blue">{{ commentInfo.userInfo.nickName }}</view> <text>：</text>
                            <view class="flex-sub">{{ commentInfo.content }}</view>
                        </view>
                        <view v-if="item.children && item.children.length>2" class="text-blue" @click="commentDetails(item)">
                            查看{{ item.children.length }}条评论
                        </view>
                    </view>
                    <view class="margin-top-sm flex justify-between">
                        <view class="text-gray text-df">{{ item.createTime }}</view>
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
            <!-- 加载状态 -->
            <zz-page-status :total="total" :needStatus="false" :length="commentList.length" msg="还没有评论"></zz-page-status>
        </view>
        <view v-if="showFooter" class="solid-top">
            <zz-footer />
        </view>
        <!-- 底部评论操作条 -->
        <view class="comment-bar" style="bottom:0;">
            <view class="cu-bar input comment-bar-wrapper">
                <view class="search-form round">
                    <input v-model="comment" :disabled="true" :adjust-position="false" :placeholder="replayInfo" class="solid-bottom" maxlength="50" cursor-spacing="10" confirm-type="send" type="text" @click="inputFocus">
                </view>
                <view class="action text-df" @click="contentComment">
                    <text class="cuIcon-comment text-grey margin-rgiht-xs"></text>
                    <text>{{ total=== -1 ? '0' : total }}</text>
                </view>
                <view class="action text-df" @click="userEvent(30,10)">
                    <text v-if="details.isLike" class="cuIcon-appreciatefill text-orange margin-rgiht-xs"></text>
                    <text v-else class="cuIcon-appreciate text-grey margin-rgiht-xs"></text>
                    <text>{{ details.like }}</text>
                </view>
                <view class="action text-df" @click="userEvent(40,10)">
                    <text v-if="details.isFavor" class="cuIcon-favorfill text-orange margin-rgiht-xs"></text>
                    <text v-else class="cuIcon-favor text-grey margin-rgiht-xs"></text>
                    <text>{{ details.favor }}</text>
                </view>
                <view class="action text-df" @click="shareActive">
                    <text class="cuIcon-share text-grey"></text>
                </view>
            </view>
        </view>
        <view v-show="activeComment" class="comment-bar" :style="{bottom:btnBottom +'px'}">
            <view class="flex padding-lr padding-tb-sm align-center justify-between">
                <view class="text-sm text-gray">评论</view>
                <button :class="comment===''?'bg-gray':'bg-orange'" class="cu-btn text-sm" @tap="sendComment">发布</button>
            </view>
            <tui-textarea v-model="comment" isCounter :placeholder="replayInfo" :adjust-position="false" :focus="activeComment" minHeight="100rpx" height="100rpx" @keyboardheightchange="textareaKeyboardHeightChange"></tui-textarea>
        </view>
        <view style="height:100rpx;"></view>
        <!-- 单挑评论的相应操作
                如果是自己的评论则  删除操作
                别人的评论则是   举报 | 加入黑名单
             -->
        <tui-actionsheet :show="isMyMenuShow" :item-list="myMenuList" @click="confirmMyMenu" @cancel="isMyMenuShow = false"></tui-actionsheet>
        <tui-actionsheet :show="isOtherMenuShow" :item-list="otherMenuList" @click="confirmOtherMenu" @cancel="isOtherMenuShow = false"></tui-actionsheet>
        <!-- 确认删除对话框 -->
        <zz-cu-modal :loading="false" :show="isDeleteShow" title="提示" @confirm="confirmDelete" @cancel="isDeleteShow=false">
            <view class="padding bg-white">删除评论后将不可恢复，是否继续?</view>
        </zz-cu-modal>
        <!-- 登录确认框 -->
        <zz-cu-modal :loading="false" :show="isLoginShow" title="提示" @confirm="openPage('/pages/comm/account/login',{back:true},false)" @cancel="isLoginShow=false">
            <view class="padding bg-white">当前未登录，点击确定去登录</view>
        </zz-cu-modal>

        <tui-loading v-show="loading"></tui-loading>
    </view>
</template>

<script>

import xss from 'xss'

export default {
    props: {
        // 帖子的id
        tid: {
            type: String,
            default: ''
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        details: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isMy: false,
            isLoginShow: false, // 登录modal提示
            isLogin: false,
            total: -1,
            loading: false, // 页面加载动画
            activeComment: false, // 是否拉起input
            btnBottom: 0, // input距离页面底部的距离
            userInfo: {}, // 当前评论用户信息
            commentList: [], // 评论列表
            // 回复对象 { pid:}
            replyObj: {
                name: ''
            },
            comment: '', // 评论input V-model
            isMyMenuShow: false, // 展示菜单    自己的评论
            isOtherMenuShow: false, // 打开别人的评论菜单
            currentComment: null, // 当前操作的评论
            isDeleteShow: false, // 删除评论的确认框展示
            myMenuList: [
                // 对自己的评论的操作列表
                {
                    text: '删除',
                    color: '#2B2B2B',
                    cmd: 'del'
                }
            ],
            otherMenuList: [
                // 对他人的评论的操作列表
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
            if (this.isLogin) {
                if (this.replyObj.rName) {
                    return '回复' + this.replyObj.rName + '：';
                } else {
                    return '我说两句..';
                }
            } else {
                return '登录后可评论'
            }
        }
    },
    watch: {
        commentList(newVal, oldVal) {
            this.$emit("commentChange", newVal)  // 评论变化
        }
    },
    mounted() {
        let _this = this;
        this.userInfo = this.zz.getAcc();
        // console.log('用户信息========', this.userInfo);
        if (this.userInfo) {
            this.isLogin = true
        }
        // 软键盘弹起的时候弹起input框
        // uni.onKeyboardHeightChange((res) => {
        //     console.log("软键盘弹起=========", res)
        //     _this.btnBottom = res.height;
        // });
        uni.$on("commentLogin", () => {
            this.isLogin = true
            this.userInfo = this.zz.getAcc()
            // this.activeComment = true
        })
        this.loadData();
    },
    beforeDestroy() {
        uni.offKeyboardHeightChange((event) => {
            // console.log("键盘监听事件取消", event)
        })
        // console.log("销毁")
    },
    methods: {
        // 加载评论信息
        async loadData(status) {
            if (status === 'init') {
                this.commentList = [];
            }
            // this.loading = true;
            const requestParams = {
                $url: 'public/blog/list',
                tid: this.tid
            };
            this.zz.req(requestParams).then((res) => {
                this.commentList = res.map(comment => {
                    comment.isMy = comment.userId === this.userInfo._id
                    return comment
                });
                this.total = this.commentList.length
            }).catch((err) => {
                console.error("评论 fail=======", err)
                this.total = 0
            }).finally(() => {
                // this.loading = false;
            });
        },
        // 查看评论信息
        commentDetails(item) {
            this.zz.href('/pages/my/social/commentDetails', {
                commentId: item._id,
                tid: this.tid
            });
        },
        // 发送评论   1秒钟的节流
        sendComment() {
            // console.log("发送评论=====", this.comment)
            if (!this.comment || this.loading) {
                return;
            }
            this.loading = true;
            let requestParams = {
                $url: 'user/blog/add',
                content: xss(this.comment)
            };
            if (this.replyObj.pid) {
                requestParams.pid = this.replyObj.pid; // 主评论ID
            } else {
                requestParams.tid = this.tid; // 对内容的回复
            }
            // const now = this.zz.time2Date(false, 'obj').full;
            const now = this.zz.time2Date(false, 'Y-M-D h:m:s');
            this.zz.req(requestParams).then((res) => {
                // 评论成功以后由前端首先加入数据
                if (this.replyObj.pid) {  // 子评论
                    const mainComment = this.commentList.find((comment) => {
                        return comment._id === this.replyObj.pid;
                    });
                    mainComment.children.push({
                        rName: this.userInfo.nickName,
                        content: xss(this.comment),
                        userInfo: this.userInfo
                    });
                } else {
                    const comment = {
                        _id: res.id,
                        children: [],
                        content: xss(this.comment),
                        like: 0,
                        status: 0,
                        tid: this.tid,
                        userId: this.userInfo._id,  // 前端参数使用
                        userInfo: this.userInfo,
                        createTime: now,
                        isMy: true
                    };
                    this.commentList.unshift(comment);  // 前端插入列表
                }
                this.total = this.commentList.length
                this.comment = '';
                this.zz.toast('评论成功~', 1000);
            }).catch((err) => {
                console.error('评论失败======', err);
            }).finally(() => {
                this.activeComment = false
                this.loading = false;
            });
        },
        openProfile(item) {
            // console.log('用户信息=======',item);
            this.zz.href(`/pages/my/profile/profile?id=${item.userInfo._id}`)
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
        openPage(url, value, verify = true) {
            this.isLoginShow = false
            this.zz.href(url, value, verify);
        },
        // 点赞 收藏等事件
        userEvent(t, tt) {
            this.$emit("userEvent", {
                t,
                tt
            })
        },
        shareActive() {
            this.zz.toast("分享暂未开启", 1000)
        },
        // 删除当前操作的评论
        confirmDelete() {
            const requestParams = {
                $url: 'user/blog/delete',
                _id: this.currentComment._id,
                tid: this.tid // 用来刷新缓存列表
            };
            this.zz.req(requestParams).then((res) => {
                const index = this.commentList.findIndex((item) => {
                    return item._id === this.currentComment._id;
                });
                if (index === -1) {
                    console.error('没有找到删除对象');
                } else {
                    this.commentList.splice(index, 1);
                }
                this.total = this.commentList.length
                this.zz.toast('评论已删除', 1000);
                this.isDeleteShow = false;
                this.contentComment()
            });
        },
        // 对当前主评论回复
        contentComment() {
            if (!this.isLogin) {
                this.zz.showLoginModal()
                // this.isLoginShow = true
            } else {
                // 对内容的评价没有回复的具体的人
                this.replyObj = {};
                this.activeComment = !this.activeComment;
            }
        },
        replayComment(item) {
            if (!this.isLogin) {
                this.zz.showLoginModal()
            } else {
                // console.log('回复对象=======', item);
                this.replyObj = {
                    pid: item._id,
                    rName: item.userInfo.nickName
                };
                // console.log("回复对象==========", this.replyObj)
                this.activeComment = !this.activeComment;
            }
        },
        likeComment(item) {
            // 给评论点赞
            let target = this.commentList.find((comment) => {
                return comment._id === item._id;
            });
            this.zz.userEvent(30, 2, target)
        },
        inputFocus(event) {
            // this.userInfo = this.zz.getAcc()
            if (!this.isLogin) {
                // this.isLoginShow = true
                this.zz.showLoginModal()
            } else {
                this.activeComment = true
            }
        },
        textareaKeyboardHeightChange(event) {
            // console.log("多行文本的键盘高度变化", event)
            if (event.height === 0) {
                // this.btnBottom = 0;
                this.activeComment = false;
            } else {
                this.btnBottom = event.height;
            }
        },
        // keyboardheightchange(event) {
        //     console.log("键盘高度变化=====", event)
        //     if (event.target.height === 0) {
        //         console.log("键盘收回")
        //         this.activeComment = false;
        //     } else {
        //          console.log("键盘弹起")
        //         this.btnBottom = event.target.height;
        //     }
        // },
        hideKeyboard() {
            uni.hideKeyboard()
        }
    }
};
</script>

<style lang="scss" scoped>
.comment-bar {
    border-top: 1px solid #e2e2e2;
    background-color: #ffffff;
    // background-color: aqua;
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

.cu-bar .search-form + .action {
    margin-right: 0px;
}
</style>
