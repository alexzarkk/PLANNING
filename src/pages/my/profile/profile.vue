<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-29 10:58:13
 * @FilePath: \sport-planing\src\pages\my\profile\profile.vue
 * @Description:  个人主页
 * 
 * 
-->
<template>
    <!-- <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">个人主页</block></cu-custom> -->
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
                    <view v-if="isMy" @click="editProfile">编辑</view>
                    <!-- <view v-else @click="showMore">
                            更多
                        </view> -->

                    <zz-z-popups v-model="isPopShow" :pop-data="morePopList" :x="348" :y="35" placement="top-end" @tapPopup="tapPopup"></zz-z-popups>
                </view>
                <!-- 左下角昵称 -->
                <view v-if="userInfo" class="name-box">{{ userInfo.nickName }}</view>
                <!-- 右下角头像 -->
                <view class="avatar-box">
                    <view v-if="userInfo" @click="previewHeadImg" class="cu-avatar round lg margin-left" :style="[{ backgroundImage: 'url(' + userInfo.headImg + ')' }]">
                        <!-- :class="index % 2 == 0 ? 'cuIcon-female bg-pink' : 'cuIcon-male bg-blue'" -->
                        <view class="cu-tag badge cuIcon-male bg-blue"></view>
                    </view>
                </view>
            </view>
            <!-- 关注/粉丝   +  个性签名 -->
            <view class="info-box padding-tb flex flex-direction justify-between align-start">
                <view class="flex response  align-center justify-between">
                    <view class="flex align-center margin-tb">
                        <view class="flex align-center" @click="openPage('/pages/my/social/follow')">
                            <view class="text-df margin-lr">关注</view>
                            <view class="text-xl text-bold">{{ person.follow||0 }}</view>
                        </view>
                        <view class="flex align-center" @click="openPage('/pages/my/social/fans')">
                            <view class="text-df margin-lr">粉丝</view>
                            <view class="text-xl text-bold">{{ fans }}</view>
                        </view>
                    </view>
                    <view v-if="!isMy" class="flex justify-center padding-lr padding-right">
                        <button v-if="followObj.isFollow" style="width:350rpx;height:50rpx;" class="cu-btn radius response bg-gray bottom-btn" @click="followUser()">
                            <text v-if="followObj.loading" class="cuIcon-loading2 cuIconfont-spin"></text>取消关注
                        </button>
                        <button v-else style="width:350rpx; height:50rpx;" class="cu-btn radius response bg-green bottom-btn" @click="followUser()">
                            <text v-if="followObj.loading" class="cuIcon-loading2 cuIconfont-spin"></text>
                            <text class="cuIcon-add"></text>
                            关注
                        </button>
                    </view>

                </view>
                <view>
                    <view v-if="userInfo && userInfo.desc" class="flex align-center">
                        <view class="margin-lr" style="width:2em;">签名</view>
                        <view>{{ userInfo.desc }}</view>
                    </view>
                </view>
                <!-- v-if="!isMy" -->

            </view>
        </view>
        <!-- 发布数据统计 -->
        <view class="flex align-center justify-between padding bg-white margin-top-sm">
            <view v-for="(item, index) in countList" :key="index" class="flex flex-direction align-center">
                <view class="text-black text-df margin-bottom-xs">{{ item.title }}</view>
                <view class="text-green text-xl text-bold">{{ item.value }}</view>
            </view>
        </view>
        <!-- 动态 -->

        <view class="margin-top">
            <!-- <view class="title-bar text-xxl padding-left bg-white padding-tb">动态（3）</view> -->
            <view class="title-bar text-xxl padding-left bg-white padding-tb">动态</view>
        </view>
        <view v-if="userInfo">
            <!-- <push-card v-if="" :details="item" :header="false" :articleId="articleId"></push-card> -->
            <push :userId="userInfo._id"></push>
        </view>

        <!-- <view class="bg-white solid-bottom" @click="openPage('/pages/my/social/pushDetails')">
                <view class="flex align-end padding-left">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">28</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm padding-left"><text class="round bg-gray padding-lr margin-left text-bold">08:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title padding-left">上传了一条轨迹“2022-02-28”</view>
                    <zz-grid-pic :imgCount="6"></zz-grid-pic>
                    <view class="padding">
                        <zz-line-card></zz-line-card>
                    </view>
                </view>
            </view>

            <view class="bg-white padding solid-bottom">
                <view class="flex align-end">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">20</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm"><text class="round bg-gray padding-lr margin-left text-bold">15:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title">图片</view>
                    <view class="push-content">
                        <image src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg" />
                    </view>
                </view>
            </view>

            <view class="bg-white padding solid-bottom">
                <view class="flex align-end padding">
                    <text class="text-xxl margin-right-xs text-bold" style="font-size: 2.4rem; letter-spacing: 2px">20</text>
                    <text>2月</text>
                </view>
                <view class="margin-top-sm"><text class="round bg-gray padding-lr margin-left text-bold">15:30:59</text></view>
                <view class="margin-top-xs push-wrapper">
                    <view class="push-title">视频</view>
                    <view class="push-content">
                        <image src="https://s1.ax1x.com/2022/06/24/ji7ipq.jpg" />
                    </view>
                </view>
            </view> -->

        <!-- <tui-nomore text="没有更多了"></tui-nomore> -->
        <view style="height: 100rpx; width: 750rpx"></view>
    </view>
</template>

<script>
import zzZPopups from '../../../components/zz/zz-z-popups.vue';
import push from '@/components/push/push.vue'
export default {
    components: { zzZPopups, push },
    data() {
        return {
            // person: {
            //     fans: 0,  // 粉丝
            //     follow: 0,  // 关注
            //     track: 0,  // 轨迹
            //     exercise: 0, // 活动
            //     event: 0, //  赛事
            //     push: 0, //  帖子
            //     photo: 0  // 兴趣点 /  照片
            // },
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
            isMy: true,  // 当前是否是我的个人主页
            userInfo: null,  // 用户的信息
            statusBar: this.StatusBar,  // 状态栏高度
            scrollTop: 0.5,  // 滚动位置记录
            morePopShow: false,
            moreX: 0,
            moreY: 0,
            avatar: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
            countList: [  // 个人的户外信息的统计
                {
                    title: '轨迹',
                    value: '0'
                },
                {
                    title: '活动',
                    value: '0'
                },
                {
                    title: '赛事',
                    value: '0'
                },
                {
                    title: '帖子',
                    value: '0'
                },
                {
                    title: '兴趣点',
                    value: '0'
                }
            ],
            morePopList: [
                // 点击更多展开的菜单
                {
                    title: '设置备注名'
                },
                {
                    title: '加好友'
                },
                {
                    title: '屏蔽消息'
                },
                {
                    title: '举报'
                }
            ],
            momentList: []
        };
    },
    computed: {
        isNavActive() {
            // 是否展示有色导航栏
            return this.scrollTop > 180
        }
    },
    async onLoad(option) {
        const myUserInfo = this.zz.getAcc()
        if ( option.id && option.id !== myUserInfo._id) {
            // 点击加载别人的个人主页
            this.profileId = option.id
            const req1 = {
                $url: 'public/user/info',
                userId: this.profileId
            }
            await this.zz.req(req1).then(async (res) => {
                // console.log("获取到的用户的个人信息", res)  // 当前是空的
                this.userInfo = res
                try {
                    if (myUserInfo._id) {  // 已登录
                        const req = {
                            $url: 'user/ue/isFollow',
                            tid: res._id
                        }
                        this.followObj._id = res._id  //  用于关注和取消关注的用户id
                        this.followObj.isFollow = await this.zz.req(req)  // 获取是否关注
                        // console.log('查询到的是否关注', this.followObj.isFollow);
                    }
                } catch (error) {
                    console.error("查询关注失败======", error)
                }

            }).catch(err => {
                console.error('public/user/info===========', err);
            })
            this.isMy = false;
        } else {
            this.userInfo = myUserInfo
            this.profileId = myUserInfo._id
            this.isMy = true;
            console.log("我的主页============================",this.profileId)
            //  我自己的主页
        }
        this.loadData();
        console.log('主页id===========', this.profileId);
    },
    methods: {
        async loadData() {
            this.zz.req({
                $url: 'user/person/info',
                _id: this.profileId
            }).then((res) => {
                // console.log('获取到的profile 信息========', res);
                this.person = Object.assign(this.person, res)
                let person = this.person
                this.countList[0].value = person.rec || 0
                this.countList[1].value = person.exercise || 0
                this.countList[2].value = person.event || 0
                this.countList[3].value = person.push || 0
                this.countList[4].value = person.poi || 0
            });
            // 获取动态列表
            this.zz.req({
                $url: 'public/moment/page',
                userId: this.profileId  // 可能是自己的主页也可能是别人的主页
            }).then((res) => {
                // console.log('我的动态列表', res);
                this.momentList = res.list;
            });
        },
        // 关注当前的用户
        followUser() {
            if (this.followObj.loading) {
                return;
            }
            this.followObj.loading = true
            this.zz.userEvent(60, 60, this.followObj).then(res => {
                // console.log("关注或者取消关注")
                if (this.followObj.isFollow) {
                    this.zz.toast("关注成功", 1000)
                } else {
                    this.zz.toast("已取消关注", 1000)
                }
                this.followObj.loading = false
            })
        },
        // 预览头像
        previewHeadImg() {
            this.zz.viewIMG([this.userInfo.headImg], 0)
        },
        // 修改头像
        // 气泡框按钮
        openPage(url) {
            this.zz.href(url);
        },
        //  点击pop
        tapPopup(event) {
            // console.log('pop click===', event);
        },
        showMore() {
            this.isPopShow = true
        },
        // 跳转到个人设置/个人信息编辑
        editProfile() {
            // console.log('编辑信息=========');
            this.zz.href('/pages/my/set/set');
        },
        // 返回上一级
        backPage() {
            // console.log('backPage===');
            uni.navigateBack(1);
        },
        onClickBtn() { }
    },

    onPageScroll(e) {
        // console.log(e)
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
    max-width: 750rpx;
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
    // justify-content: flex-end;
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
    height: calc(100rpx + env(safe-area-inset-bottom));
    background-color: #ffffff;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom);
    .bottom-btn {
        // width: 300rpx;
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
