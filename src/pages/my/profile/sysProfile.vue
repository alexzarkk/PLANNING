
<template>
    <!-- 系统账户Profile -->
    <view>
        <view class="container">
            <!-- 顶部 -->
            <view class="header-box">
                <view class="background-image">
                    <!-- 导航栏 -->
                    <view class="nav-bar" :style="{ paddingTop: statusBar * 2 + 'rpx', height: statusBar * 2 + 100 + 'rpx' }" :class="isNavActive ? 'bg-ztsblue' : ''">
                        <view class="flex align-center" @click="backPage">
                            <text class="cuIcon-back"></text>
                            <view v-if="userInfo&&isNavActive" class="margin-left">{{ userInfo.nickName }}</view>
                        </view>
                    </view>
                    <!-- 左下角昵称 -->
                    <view v-if="userInfo" class="name-box">{{ userInfo.nickName }}</view>
                    <!-- 右下角头像 -->
                    <view class="avatar-box">
                        <view v-if="userInfo" class="cu-avatar round lg margin-left" :style="[{ backgroundImage: 'url(' + userInfo.headImg + ')' }]">
                            <view class="cu-tag badge cuIcon-male bg-blue"></view>
                        </view>
                    </view>
                </view>
                <!-- 关注/粉丝   +  个性签名 -->
                <view class="info-box padding-bottom">
                    <view class="follow-fans-box flex margin-tb">
                        <view class="follow flex" @click="openPage('/pages/my/social/follow')">
                            <view class="text-df margin-lr">关注</view>
                            <view class="text-xl text-bold">{{ person.follow||0 }}</view>
                        </view>
                        <view class="fans flex" @click="openPage('/pages/my/social/fans')">
                            <view class="text-df margin-lr">粉丝</view>
                            <view class="text-xl text-bold">{{ fans }}</view>
                        </view>
                    </view>
                    <view>
                        <view v-if="userInfo && userInfo.desc" class="flex">
                            <view class="margin-lr">签名</view>
                            <view>{{ userInfo.desc }}</view>
                        </view>
                    </view>
                    <view class="response padding" @click="followUser">
                        <button v-if="followObj.isFollow" class="cu-btn bg-ztsgreen response">
                            <!-- <text class="cuIcon-add"></text> -->
                            <text v-if="followObj.loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                            取消关注
                        </button>
                        <button v-else class="cu-btn bg-ztsgreen response">
                            <!-- <text class="cuIcon-add"></text> -->
                            <text v-if="followObj.loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                            关注
                        </button>
                    </view>
                </view>
            </view>
            <view class="margin-top">
                <view class="title-bar text-xxl padding-left bg-white padding-tb">文章</view>
            </view>
            <!-- 系统账户,文章 -->
            <view v-for="(item,index) in pageList" :key="index">
                <push-card :details="item" :header="false" :articleId="articleId"></push-card>
            </view>
            <zz-page-status :loading="loading" :length="pageList.length" :total="total"></zz-page-status>
            <!-- <view style="height: 100rpx; width: 750rpx"></view> -->
        </view>
    </view>
</template>

<script>
import pushCard from '@/components/news/push-card'
// import zzZPopups from '../../../components/zz/zz-z-popups.vue';
export default {
    components: { pushCard },
    data() {
        return {
            articleId:'',
            person: {
                fans: 0,  // 粉丝
                follow: 0,  // 关注
                exercise: 0, // 活动
                event: 0, //  赛事
                push: 0, //  帖子
                rec: 0,  // 轨迹
                poi: 0, //  兴趣点 
                imgs: 0  // 照片
            },
            profileId: '',  // 当前的主页的用户id
            followObj: {
                isFollow: null,  // 是否关注当前用户
                loading: false, // 关注的时候加载
            },
            isPopShow: false,
            follow: 0,  // 当前用户的关注的数量
            fans: 0, // 当前用户的粉丝数量
            userInfo: null,  // 用户的信息
            statusBar: this.StatusBar,  // 状态栏高度
            scrollTop: 0.5,  // 滚动位置记录
            morePopShow: false,
            moreX: 0,
            moreY: 0,
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
            loading: false,  // 数据加载状态
            total: -1,  // 服务器 分页 total
            pageList: [], // 分页列表
            pageNum: 1,  // 页码
            pageSize: 10,  // 数量
        };
    },
    computed: {
        isNavActive() {
            // 是否展示有色导航栏
            return this.scrollTop > 180
        }
    },
    async onLoad(option) {
        // let pages = getCurrentPages(); //获取所有页面栈实例列表
        // let prevPage = pages[pages.length - 2]; //上一页页面实例
        // console.log("页面栈===", pages, prevPage)
        // console.log("路由信息",prevPage.route)
        // console.log("路由参数",prevPage.options)
        // if(prevPage.route === 'pages/planning/article'){  // 上一级是文章
        //     this.articleId = prevPage.options.id
        // }
        this.profileId = option.id
        const req1 = {
            $url: 'public/user/info',
            userId: this.profileId
        }
        await this.zz.req(req1).then(async (res) => {
            this.userInfo = res
            this.checkLogin()
        }).catch(err => {
            console.error('public/user/info===========', err);
        })
        this.zz.req({
            $url: 'public/person/info',
            _id: this.profileId
        }).then((res) => {
            // console.log('获取到的profile 信息========', res);
            this.person = Object.assign(this.person, res)
        });
        this.loadData('init');
    },
    async onShow() {
        if (this.userInfo) {
            this.checkLogin()
        }
    },
    methods: {
        async checkLogin() {
            const myUserInfo = this.zz.getAcc()
            try {
                if (myUserInfo._id) {  // 已登录
                    const req = {
                        $url: 'user/ue/isFollow',
                        tid: this.userInfo._id
                    }
                    this.followObj._id = this.userInfo._id  //  用于关注和取消关注的用户id
                    this.followObj.isFollow = await this.zz.req(req)  // 获取是否关注
                }
            } catch (error) {
                console.error("查询关注失败======", error)
            }
        },
        async loadData(type, stopPullDown = false) {
            if (type === 'init') {
                this.pageList = [];
                this.pageNum = 1;
                this.total = -1;
            }
            if (this.loading || this.pageList.length === this.total || this.total === 0) {
                return;
            }
            this.loading = true;
            // 获取动态列表
            this.zz.req({
                $url: 'public/moment/page',
                userId: this.profileId,  // 可能是自己的主页也可能是别人的主页
                page: this.pageNum,
                size: this.pageSize
            }).then(({ pagination, list }) => {
                this.total = pagination.total; // 赋值total
                this.pageNum++;
                this.pageList = this.pageList.concat(list)
                this.loading = false;
                if (stopPullDown) {
                    this.zz.toast("刷新成功", 1000)
                    uni.stopPullDownRefresh();
                }
            });
        },
        // 关注当前的用户
        async followUser() {
            if (this.followObj.loading) {
                return;
            }
            this.followObj.loading = true
            await this.zz.userEvent(60, 60, this.followObj).then(res => {
                if (this.followObj.isFollow) {
                    this.zz.toast("关注成功", 1000)
                } else {
                    this.zz.toast("已取消关注", 1000)
                }
            }).catch(err => { this.followObj.loading = false })
            this.followObj.loading = false
        },
        // 返回上一级
        backPage() {
            // console.log('backPage===');
            uni.navigateBack(1);
        }
    },
    onReachBottom() {
        this.loadData('add')
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        // 重点，用到滑动切换必须加上
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

.solid-bottom {
    border-bottom: 1px solid #f1f1f1;
}

.container {
    .header-box {
        background-color: #ffffff;
        .background-image {
            position: relative;
            background-image: url('https://fhty.976m.org/bdfh/img/0%20(5).JPG');
            background-size: 100% 100%;
            height: 420rpx;
            .nav-bar {
                width: 750rpx;
                height: 100rpx;
                position: fixed;
                top: 0;
                left: 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 0 20rpx;
                color: #ffffff;
                z-index: 20;
                font-size: 1.8rem;
            }

            .name-box {
                position: absolute;
                bottom: 50rpx;
                left: 50rpx;
                color: #ffffff;
                font-size: 42rpx;
            }

            .avatar-box {
                position: absolute;
                right: 100rpx;
                bottom: -20rpx;
            }
        }
    }
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

.bottom-bar {
    margin-top: 100rpx;
    position: fixed;
    z-index: 10;
    bottom: 0;
    width: 750rpx;
    height: 100rpx;
    background-color: #ffffff;
    align-items: center;
    .bottom-btn {
        width: 300rpx;
        font-size: 1.8rem;
    }

    .send {
        border: 1px solid #e2e2e2;
    }
}

.grid-image {
    width: 210rpx;
    height: 210rpx;
}

.text-spacing {
    letter-spacing: 1px;
}

.push-wrapper {
    // .push-title {
    // }

    .push-content {
        margin-top: 10rpx;
    }
}
</style>
