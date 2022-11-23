<template>
    <view>
        <view class="cu-bar bg-white solid-bottom response" :class="top ? 'sticky-box' : ''" :style="'top:' + top + 'px'">
            <view class="flex align-center padding-lr justify-between response">
                <view class="margin-right">
                    <text class="cuIcon-titles text-orange"></text>
                    <text>留言评论</text>
                </view>
                <view class="light round text-sm" @click="writeComment">
                    <text class="cuIcon-post text-blue">写留言</text>
                </view>
            </view>
        </view>
        <block v-if="list.length">
            <view class="padding" v-for="(obj, idx) in list" :key="idx">
                <view class="padding-lr solid-bottom bg-white radius">
                    <view class="cu-item">
                        <!-- 主评论 -->
                        <view class="cu-list menu-avatar">
                            <view class="cu-item">
                                <view class="cu-avatar round lg" :style="'background-image:url(' + obj.userInfo.headImg + ');'"></view>
                                <view class="content flex-sub">
                                    <view>{{ obj.userInfo.nickName }}</view>
                                    <view class="text-gray text-sm flex justify-between">
                                        {{ obj.createTime.substring(0, 16) }}
                                    </view>
                                </view>
                                <view v-if="userInfo._id === obj.userId" @click="moreAction(obj)" class="text-xl">
                                    <text class="cuIcon-moreandroid"></text>
                                </view>
                            </view>
                        </view>
                        <view class="text-content margin-xs padding-tb">
                            {{ obj.content }}
                        </view>
                        <block v-if="obj.imgs && obj.imgs.length">
                            <view class="grid grid-square flex-sub radius" :class="obj.imgs.length > 3 ? 'col-3' : 'col-' + obj.imgs.length">
                                <view class="bg-img" v-for="(p, index) in obj.imgs" :key="index" @tap="imgView(obj.imgs, index)">
                                    <image :src="p" mode="aspectFill"></image>
                                </view>
                            </view>
                        </block>
                        <view class="text-gray text-df padding-bottom padding-top-xs flex align-center justify-between">
                            <view @click="likeComment(obj)">
                                <text class="cuIcon-appreciate margin-lr-xs" :class="obj.isLike ? 'text-red' : ''"></text>
                                <text>{{ obj.like || 0 }}</text>
                            </view>
                            <view v-if="isCanReply">
                                <view class="cu-tag radius text-blue margin-right" @click="replyComment(obj)">回复</view>
                            </view>
                        </view>
                        <!-- 子评论 -->
                        <block v-if="obj.children">
                            <block v-for="(c, idxx) in obj.children" :key="c._id">
                                <view class="cu-list menu-avatar comment solid-top">
                                    <view class="cu-item">
                                        <view class="cu-avatar round" :style="'background-image:url(' + c.userInfo.headImg + ');'"></view>
                                        <view class="content">
                                            <view class="text-grey flex justify-between">
                                                <text>{{ c.user }} （作者）</text>
                                                <text class="text-sm">{{ c.createTime.substring(0, 16) }}</text>
                                            </view>
                                            <!-- pre-line -->
                                            <view class="text-gray text-content text-df margin-top-sm">
                                                {{ c.content }}
                                            </view>
                                            <view class="text-gray text-df text-right padding-xs" @click="likeComment(c)">
                                                <text class="cuIcon-appreciate margin-lr-xs" :class="c.isLike ? 'text-red' : ''"></text>
                                                {{ c.like || 0 }}
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </block>
                    </view>
                </view>
            </view>
        </block>
        <block v-else>
            <view class="padding flex justify-center bg-white">
                <!-- <tui-no-data :fixed="false" :imgUrl="bd.imgs.nodata">...</tui-no-data> -->
                <tui-no-data :imgWidth="300" :imgHeight="300" :fixed="false" :imgUrl="bd.imgs.nodata" />
            </view>
        </block>
        <!-- 删除弹框 -->
        <tui-actionsheet :show="isMyMenuShow" :item-list="myMenuList" @click="confirmMyMenu" @cancel="isMyMenuShow = false"></tui-actionsheet>
        <!-- 确认删除对话框 -->
        <zz-cu-modal :isLoading="loading" :show="isDeleteShow" title="提示" @confirm="confirmDeleteComment" @cancel="isDeleteShow = false">
            <view class="padding bg-white">删除评论后将不可恢复，是否继续?</view>
        </zz-cu-modal>
        <!-- 登录确认框 -->
        <zz-cu-modal :loading="false" :show="isLoginShow" title="提示" @confirm="openPage('/pages/comm/account/login',{back:true},false)" @cancel="isLoginShow=false">
            <view class="padding bg-white">当前未登录，点击确定去登录</view>
        </zz-cu-modal>
    </view>
</template>

<script>

export default {
    name: 'zzBlog',
    data() {
        return {
            isLogin: false,
            isLoginShow: false,
            isDeleteShow: false,
            isMyMenuShow: false,
            myMenuList: [
                // 对自己的评论的操作列表
                {
                    text: '删除',
                    color: '#2B2B2B',
                    cmd: 'del'
                }
            ],
            currentComment: null,
            loading: false,
            list: [],
            userInfo: null
        };
    },
    props: {
        top: {
            type: Number,
            default: 0
        },
        tid: [String], // 目标内容ID
        tt: {
            type: Number, // 目标内容的数据库类型
            required: true
        },
        tar: [String],
        isCanReply: {
            type: Boolean
        }
    },
    mounted() {
        this.userInfo = this.zz.getAcc();
        if (this.userInfo) {
            this.isLogin = true
        }
        uni.$on("commentLogin", () => {
            this.isLogin = true
            this.userInfo = this.zz.getAcc()
        })
        this.init();
    },
    methods: {
        async init() {
            this.list = []
            this.list = await this.zz.req({ $url: '/public/blog/list', tid: this.tid })
        },
        // 跳转到编写评论的页面
        writeComment() {
            this.zz.href(`/pages/my/blog/edit?tid=${this.tid}&tt=${this.tt}`, null, 1);
        },
        // 作者回复评论
        replyComment(item) {
            // console.log('回复的评论对象', item);
            this.zz.href('/pages/my/blog/edit?pid=' + item._id);
        },
        // 点赞评论
        async likeComment(item) {
            // console.log('点赞', JSON.parse(JSON.stringify(item)));
            const ue = await this.zz.userEvent(30, 2, item);
        },
        href(h) {
            this.zz.href(h);
        },
        userEvent(t, p, o) {
            this.zz.userEvent(t, p, o);
            this.page = this.zz.clone(this.page);
        },
        imgView: function (img, idx) {
            this.zz.viewIMG(img, idx);
        },
        moreAction(item) {
            this.currentComment = item;
            this.isMyMenuShow = true; //作者 || 我的评论
        },
        openPage(url, value, verify = true) {
            this.isLoginShow = false
            this.zz.href(url, value, verify);
        },
        confirmMyMenu({ cmd }) {
            // 删除评论后将不可恢复，是否继续
            if (cmd === 'del') {
                // 删除
                // console.log('删除当前的评论', this.currentComment);
                this.isMyMenuShow = false;
                this.isDeleteShow = true;
            }
        },
        // 删除当前操作的评论
        confirmDeleteComment() {
            this.loading = true;
            // console.log('删除当前的评论', this.currentComment);
            const requestParams = {
                $url: '/user/blog/delete',
                _id: this.currentComment._id,
                tid: this.tid // 用来刷新缓存列表
            };
            this.zz
                .req(requestParams)
                .then(() => {
                    const index = this.list.findIndex((item) => {
                        return item._id === this.currentComment._id;
                    });
                    if (index === -1) {
                        console.error('没有找到删除对象');
                    } else {
                        this.list.splice(index, 1);
                    }
                    this.zz.toast('评论已删除', 1000);
                    this.isDeleteShow = false;
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.cu-list + .cu-list {
    margin-top: 0px;
}
</style>
