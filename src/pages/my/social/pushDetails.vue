<template>
    <!-- 动态详情
    1. 轨迹
    2. 视频
    3. 图片

 -->
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true">
            <block slot="content">
                <view v-if="details && details.tagList">
                    {{ details.tagList[0].label }}详情
                </view>
                <view v-else>
                    动态详情
                </view>
            </block>
			<!-- #ifdef APP-PLUS -->
			<view slot="right" v-if="userInfo && !loading && userInfo._id == details.userInfo._id">
			    <view class="padding-right" @click="showMoreAction">
			        <text class="cuIcon-moreandroid"></text>
			    </view>
			</view>
			<!-- #endif -->
        </cu-custom>
        <view class="container" :style="'min-height:calc(100vh - '+CustomBar+'px)'">
            <!-- 头像 + 昵称 + 时间 + 关注 -->
            <view class="cu-card dynamic" :class="isCard ? 'no-card' : ''">
                <view class="cu-item shadow">
                    <view class="cu-list menu-avatar">
                        <view class="cu-item">
                            <view v-if="details && details.userInfo && details.userInfo.headImg" @click="openProfile" class="cu-avatar round lg" :style="'background-image:url(' + details.userInfo.headImg + ')'"></view>
                            <view v-else class="cu-avatar round lg" @click="openProfile" style="background-image:url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/01acf825-4f59-4592-8034-295d16e69c7e.png)"></view>
                            <view class="content flex-sub" @click="openProfile">
                                <view v-if="isReady">
                                    {{ details.userInfo.nickName || details.author }}
                                </view>
                                <view v-if="isReady" class="text-gray text-sm flex justify-between">
                                    {{ details.dateInfo }}
                                    <!-- {{ details.dateInfo.year }}年{{ details.dateInfo.month }}月{{ details.dateInfo.day }}日 -->
                                </view>
                            </view>
							
							<template v-if="!loading">
								<view v-if="!isMy" class="padding-right">
									<button v-if="details.isFollow" class="cu-btn line-ztsgreen" @click="followUser">
										取消关注
									</button>
									<button v-else class="cu-btn bg-ztsgreen" @click="followUser">
										关注
									</button>
								</view>
								<view v-else>
									<!-- #ifdef H5 -->
									<text class="cuIcon-delete" @click="showMoreAction"></text>
									<!-- #endif -->
								</view>
							</template>
                        </view>
                    </view>
                    <!-- <view class="padding-top"> -->
                    <view v-if="details && details.type && details.type.includes(60)" class="cu-item shadow">
                        <view class="padding-lr-sm padding-top-sm solid-top">
                            <wxParse class="richText" :content="details.content"></wxParse>
                        </view>
                    </view>
                    <view v-else class="text-content">
                        <view class="padding-top">
                            {{ details.content }}
                        </view>
                    </view>

                    <!-- </view> -->
                    <!-- <view v-if="details.imgs && details.imgs.length > 0" class="grid flex-sub padding-lr" :class="isCard ? 'col-3 grid-square' : 'col-1'"> -->
                    <zz-grid-pic v-if="details.imgs && details.imgs.length > 0" :width="210" :img-list="details.imgs"></zz-grid-pic>
                    <!-- <view
                            class="bg-img"
                            :class="isCard ? '' : 'only-img'"
                            style="background-image: url(https://s1.ax1x.com/2022/05/27/XmK1Mt.jpg)"
                            v-for="(item, index) in isCard ? 9 : 1"
                            :key="index"
                        ></view> -->
                    <!-- </view> -->
                    <view v-if="details.kml" class="padding">
                        <zz-line-card></zz-line-card>
                    </view>

                    <!-- 标签 -->
                    <view v-if="details.tagList && details.tagList.length > 0" class="padding-lr tag-box">
                        <view v-for="(tag, index) in details.tagList" :key="index" class="cu-tag radius" :class="'bg-' + tag.color">
                            {{ tag.label }}
                        </view>
                    </view>
                    <view class="text-gray text-sm flex padding">
                        <view class="margin-right text-xl" @click="likePush">
                            <text v-if="details.isLike" class="cuIcon-appreciatefill text-orange margin-lr-xs"></text>
                            <text v-else class="cuIcon-appreciate margin-lr-xs"></text>
                            {{ details.like }}
                        </view>
                        <view class="margin-right text-xl" @click="handleComment()">
                            <text class="cuIcon-message margin-lr-xs"></text>
                            {{ details.comment || 0 }}
                        </view>
                        <view class="margin-right text-xl">
                            <text class="cuIcon-share margin-lr-xs"></text>
                            {{ details.share }}
                        </view>
                        <view class="margin-right text-xl" @click="handleFavor()">
                            <text v-if="details.isFavor" class="cuIcon-favorfill text-orange margin-lr-xs"></text>
                            <text v-else class="cuIcon-favor margin-lr-xs"></text>
                            {{ details.favor }}
                        </view>
                    </view>
                    <!-- 点赞、 评论 、 转发 、 收藏 -->
                    <!-- <view class="line-operation-box">
                        <view class="line-operation" @click="handleOption(item)" v-for="(item, index) in opeartionList" :key="index">
                            <view class="operation-icon" :class="'cuIcon-' + item.iconName"></view>
                            <view class="operation-title">{{ item.title }}</view>
                        </view>
                    </view> -->
                    <zz-comment v-if="details._id" ref="comment" :tid="details._id" :details="details" @commentChange="commentChange" @userEvent="commentEvent"></zz-comment>
                </view>
            </view>

            <!-- <view class="comment-bar" :style="{bottom:btnBottom+'px'}">
                <view class="cu-bar input">
                    <view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg);"></view>
                    <view class="action">
                        <text class="cuIcon-roundaddfill text-grey"></text>
                    </view>
                    <input @focus="inputFocus" :adjust-position="false" class="solid-bottom" maxlength="300" cursor-spacing="10"></input>
                    <view class="action">
                        <text class="cuIcon-emojifill text-grey"></text>
                    </view>
                    <button class="cu-btn bg-green shadow-blur">发送</button>
                </view>
            </view>
            <view style="height:100rpx;"></view> -->
            <!-- <zz-blog></zz-blog> -->
            <!-- 九宫格图片 -->
            <!-- 分享的线路信息 -->
            <!-- 底部的评论框 -->
            <!-- 我的评论和热门评论 -->

            <tui-actionsheet :show="isMyMenuShow" :item-list="myMenuList" @click="confirmMyMenu" @cancel="isMyMenuShow = false"></tui-actionsheet>
            <!-- 确认删除对话框 -->
            <zz-cu-modal :loading="false" :show="isDeleteShow" title="提示" @confirm="confirmDelete" @cancel="isDeleteShow = false">
                <view class="padding bg-white">
                    删除后将不可恢复，是否继续?
                </view>
            </zz-cu-modal>
        </view>
    </view>
</template>

<script>
// import zzBlog from '../../../components/zz/zz-blog.vue';
// import ZzComment from '../../../components/zz/zz-comment.vue';
export default {
    // components: { zzBlog, ZzComment },
    data() {
        return {
            isMy: false,
			loading: true,
            userInfo: null,
            CustomBar: this.CustomBar,
            btnBottom: 0,
            isCard: true,
            details: {
                isLike: false
            },
            isReady: false,
            opeartionList: [
                {
                    title: '点赞',
                    iconName: 'appreciate'
                },
                {
                    title: '评论',
                    iconName: 'comment'
                },
                {
                    title: '收藏',
                    iconName: 'favor'
                },
                {
                    title: '分享',
                    iconName: 'share'
                }
            ],
            title: '',
            isMyMenuShow: false,
            isDeleteShow: false, // 删除评论的确认框展示
            myMenuList: [
                // 对自己的评论的操作列表
                {
                    text: '删除',
                    color: '#2B2B2B',
                    cmd: 'del'
                }
            ]
        };
    },
    onLoad({ id, v }) {
        if (id) {
            this.loadData(id)
        } else {
            const params = this.zz.getParam(v);
            if (params._id) {
                this.loadData(params._id);
            }
        }
        this.userInfo = this.zz.getAcc()
    },
    onShow() {
        uni.$on('modifyComment', (params) => {
            // 在评论详情页面更新了评论
            this.$refs.comment.loadData('init');
        });
    },
    methods: {
        async loadData(momentId) {
            let tagList = []
            const req1 = {
                $url: 'public/zz/dict',
                tar: ['article']
            }
            await this.zz.req(req1).then(({ article }) => {
                tagList = article
                // console.log("标签列表====",tagList)

            })
            const req2 = {
                $url: 'public/moment/info',
                _id: momentId
            };
			this.loading = true
            this.zz.req(req2).then((res) => {
				this.loading = false
                this.details = res;
                this.details.dateInfo = this.zz.time2Date(res.createTime, 'CN-ymd');
                if (this.details.type) {
                    const tagArr = this.details.type
                    this.details.tagList = tagArr.map(tag => {
                        return tagList.find(item => {
                            return item.value == tag
                        })
                    })
                }
                if (this.details.userInfo._id === this.userInfo._id) {
                    this.isMy = true
                }
                this.isReady = true;
                console.log("详情================", this.details)
            });
        },
        openProfile() {
            this.zz.profile(this.details.userInfo._id)
        },
        // 动态点赞
        async likePush() {
            // this.details.isLike = !this.details.isLike
            const ueRes = await this.zz.userEvent(30, 10, this.details);
        },
        // 收藏动态
        async handleFavor() {
            const ueRes = await this.zz.userEvent(40, 10, this.details);
        },
        async followUser() {
            try {
                const ueRes = await this.zz.userEvent(60, 60, this.details, 'userId');  // 这里修改isFollow
                if (this.details.isFollow) {
                    // 关注成功
                    this.zz.toast('关注成功~', 1000);
                } else {

                    this.zz.toast('已取消关注', 1000);
                }
            } catch (error) {
                console.error('取消关注失败==', error);
            }
        },
        showMoreAction() {
            this.isMyMenuShow = true; // 我的评论
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
        handleComment() {
            this.$refs.comment.contentComment(); // 切换到对内容的评论
        },
        // 处理点赞 评论 等信息
        handleOption(item) {
            if (item.iconName === 'comment') {
                this.$refs.comment.contentComment(); // 切换到对内容的评论
            }
        },
        detail() { },
        inputFocus(event) {
        },
        confirmDelete() {
            const requestParams = {
                $url: 'user/moment/delete',
                _id: this.details._id
            };
            this.zz
                .req(requestParams)
                .then((res) => {
                    this.zz.toast('删除成功');
                    uni.$emit("pushChange")
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1000);
                })
                .finally(() => {
                    this.isDeleteShow = false;
                });
        },
        // 评论更新
        commentChange(commentList) {
            // this.details.comment = commentList.length
            this.$set(this.details, "comment", commentList.length)
        },
        commentEvent(params) {
            this.zz.userEvent(params.t, params.tt, this.details)
        },
    },
    onPageScroll() {
        this.$refs.comment.hideKeyboard(); // 页面滚动时
    }
};
</script>

<style lang="scss" scoped>
.container {
    background-color: #ffffff;
}

.comment-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 750rpx;
}

.line-info-box {
    display: flex;
    flex-direction: row;
    margin-top: 20rpx;
    // 轨迹信息
    border: 1px solid #e2e2e2;
    border-radius: 20rpx;
    .line-info-image {
        width: 160rpx;
        height: 160rpx;
    }
}

.line-operation-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 140rpx;
    border-bottom: 1px solid #e2e2e2;

    border-top: 1px solid #e2e2e2;

    .line-operation {
        display: flex;
        flex-direction: column;
        align-items: center;

        .operation-icon {
            margin-bottom: 10rpx;
            color: $zts-green;
            font-size: 2rem;
        }
        .operation-title {
            color: $zts-green;
        }
    }
}
</style>
