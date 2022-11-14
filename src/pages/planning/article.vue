<template>
    <page-meta root-font-size="10px"></page-meta>
    <view class="bg-white">
        <!-- #ifndef APP-PLUS -->
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="backText"></block>
            <block slot="content">
                环浙步道
            </block>
        </cu-custom>
        <!-- #endif -->
        <!-- 文章 -->
        <view v-if="article._id" class="cu-item shadow">
            <view class="padding-top padding-lr flex align-center">
                <view class="text-xl">
                    <text class="text-black text-bold">
                        {{ article.title }}
                    </text>
                </view>
            </view>
            <view class="padding-top padding-lr solid-bottom text-sm padding-bottom-sm flex justify-between">
                <view @click.stop="openProfile">
                    <text class="text-grey">
                        {{ article.author || article.origin || article.userInfo.nickName }}
                    </text>
                    <text class="margin-left-sm text-gray">
                        {{ article.createTime }}
                    </text>
                </view>
                <view class="margin-right-xs" @click="viewClick()">
                    <text class="cuIcon-attention margin-right-xs"></text>
                    <text class="text-sm text-gray margin-right-xs">
                        {{ article.view }}
                    </text>
                </view>
            </view>
            <!-- 视频 -->
            <view v-if="article.video && article.video.url" id="tvideo">
                <view class="cu-card case no-card">
                    <view class="padding-top-xs shadow">
                        <view class="bg-video flex align-center" style="height: 400rpx">
                            <video id="myVideo" loop :src="article.video.url" :autoplay="true" :muted="false" :show-fullscreen-btn="true" :show-mute-btn="true" :show-play-btn="true" object-fit="cover"></video>
                        </view>
                    </view>
                    <view v-if="article.video.desc" class="padding-tb-xs bg-gray text-right">
                        <text class="text-cut text-sm text-grey margin-right-sm">
                            {{ article.video.desc }}
                        </text>
                    </view>
                </view>
            </view>
            <view v-else-if="article.cover && article.cover.url">
                <view class="cu-card case no-card">
                    <view class="cu-item shadow">
                        <view class="image">
                            <image class="radius" :src="article.cover.url" mode="widthFix" @tap="imgView(article.cover.url)"></image>
                        </view>
                    </view>
                </view>
                <view class="text-gray text-sm text-right padding-top-xs padding-lr">
                    <view>
                        <text class="margin-lr-xs"></text>
                        {{ article.cover.info }}
                    </view>
                </view>
            </view>
            <view class="cu-item shadow">
                <view class="padding-lr-sm padding-top-sm solid-top">
                    <wxParse class="richText" :content="article.content"></wxParse>
                </view>
            </view>
            <!-- #ifdef APP -->
            <zz-comment v-if="article._id" ref="comment" :tid="article._id" :details="article" :show-footer="true" @userEvent="commentEvent"></zz-comment>
            <!-- #endif -->
            <!-- #ifdef H5-ZLB -->
            <zz-blog v-if="article._id" ref="blogComment" :tid="article._id" :is-can-reply="false" />
            <!-- #endif -->
            <view class="padding-sm flex flex-direction solid-bottom"></view>
            <!-- <tui-scroll-top v-if="!isComment" :bottom="500" :top="300" :right="70" :scroll-top="scrolled"></tui-scroll-top> -->
        </view>
    </view>
</template>

<script>

export default {
    data() {
        return {
            bd: this.bd,
            scrolled: 0,
            article: {},
            isWriter: false
            // isComment: false
        };
    },
    onLoad: async function ({ id } = q) {
        const eventName = 'newComment' + id
        console.warn("文章页面监听评论更新--------", eventName)
        uni.$on(eventName, (params) => {
            // console.log('评论更新了', params);
            console.log("this.$refs.blogComment------", this.$refs.blogComment)
            this.$refs.blogComment.init(); // 刷新评论列表
        });

        this.article = await this.zz.req({ $url: 'public/article/info', _id: id }, true)
        setTimeout(() => {
            this.zz.userEvent(20, 10, this.article)
        }, 100)
    },
    onHide() {
        if (this.videoContext) this.videoContext.pause();
    },
    methods: {
        openProfile() {
            // let pages = getCurrentPages(); //获取所有页面栈实例列表
            // let prevPage = pages[pages.length - 2]; //上一页页面实例
            // if (prevPage) {
            //     console.log("页面栈===", pages, prevPage)
            //     console.log("路由信息", prevPage.route)
            //     console.log("路由参数", prevPage.options)
            // if (prevPage.route === 'pages/my/profile/profile' || prevPage.route === 'pages/my/profile/sysProfile') {  // 上一级是文章
            //     uni.navigateBack({
            //         delta: 1
            //     });
            //     return;
            // }
            // }
            this.zz.profile(this.article.userInfo._id)
        },
        imgView: function (url) {
            this.zz.viewIMG([url], 0);
            // this.zz.viewIMG(this.article.imgs.map((e) => e.url),idx);
        },
        shareActive() {
            this.zz.toast("分享暂未开启", 1000)
        },
        // 监听  UE事件
        commentEvent(params) {
            this.zz.userEvent(params.t, params.tt, this.article)
        },

        scrollToTop() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        },
    },
    onPageScroll: function (e) {
        // #ifdef APP-PLUS
        this.$refs.comment.hideKeyboard(); // 页面滚动时,评论区放下键盘
        // #endif

        this.scrolled = e.scrollTop;
        if (this.article.video.url) {
            if (!this.videoContext) {
                uni.createSelectorQuery()
                    .select('#tvideo')
                    .boundingClientRect((data) => {
                        this.videoBottom = data.bottom - this.CustomBar;
                        this.videoTop = data.top - this.CustomBar;
                    })
                    .exec();
                this.videoContext = uni.createVideoContext('myVideo');
            } else {
                if (e.scrollTop >= this.videoBottom) {
                    this.videoContext.pause();
                } else if (e.scrollTop <= this.videoTop) {
                    this.videoContext.play();
                }
            }
        }
    },
    onShareAppMessage(res) {
        return {
            title: this.article.title,
            path: '/pages/share?path=/pages/planning/article&id=' + this.article._id
        };
    }
};
</script>

<style lang="scss" scoped>
.wxParse {
    .p {
        text-indent: 2em;
    }
}
</style>
