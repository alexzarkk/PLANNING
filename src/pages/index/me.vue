<template name="basics">
    <view>
        <view class="UCenter-bg">
            <!-- 右上角信息 -->
            <view class="setting-icon" @click="href('/pages/my/social/message/msgList')">
                <view class="cuIcon-messagefill text-green">
                    <!-- <view class="cu-tag badge">3</view> -->
                </view>
            </view>
            <!--用户信息-->
            <view class="flex justify-start margin-top padding-top-xl">
                <template v-if="!isLogin">
                    <view class="margin-top flex align-center padding content" @tap="href('/pages/comm/account/login',{},false)">
                        <view class="cu-avatar radius">
                            <text class="cuIcon-people"></text>
                        </view>
                        <view class="padding-left">
                            <!-- #ifdef APP-PLUS || H5 -->
                            <text>注册/登录</text>
                            <!-- #endif -->

                            <!-- #ifdef H5-ZLB -->
                            <text>授权/登录</text>
                            <!-- #endif -->
                        </view>
                        <view class="margin-left-xs cuIcon-right"></view>
                    </view>
                </template>
                <template v-else>
                    <view class="margin-top" @click="openProfile()">
                        <!-- href('/pages/my/profile/profile') -->
                        <view class="flex align-center padding cu-list">
                            <view class="cu-bar">
                                <view class="cu-avatar round shadow lg" :style="'background-image:url(' + user.headImg + ')'"></view>
                                <view class="text-white padding-left">
                                    <text class="text-xl margin-right">
                                        {{ user.nickName }}
                                    </text>
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </view>
            <view class="padding margin-top-sm flex text-center">
                <view v-for="(item, index) in socialList" :key="index" class="flex flex-sub flex-direction solid-right" @click="href(item.path)">
                    <view class="text-df text-bold text-orange">
                        {{ item.title }}
                    </view>
                    <view class="margin-top-sm">
                        <text class="text-bold text-white">
                            {{ item.value }}
                        </text>
                    </view>
                </view>
            </view>
        </view>

        <view class="padding flex text-center text-grey bg-white">
            <!-- <view class="flex flex-sub flex-direction solid-right" @tap="href('/pages/my/event/event')">
                <view class="text-xxl text-purple">
                    <view class="cuIcon-activity"></view>
                </view>
                <view class="margin-top-sm">
                    赛事|活动
                </view>
            </view>
            <view class="flex flex-sub flex-direction solid-right" @tap="href('/pages/my/planning/planning')">
                <view class="text-xxl text-blue">
                    <view class="cuIcon-global"></view>
                </view>
                <view class="margin-top-sm">
                    预约|行程
                </view>
            </view> -->
            <view class="flex flex-sub flex-direction solid-right" @tap="href('/pages/my/favor/favor')">
                <view class="text-xxl text-orange">
                    <view class="cuIcon-favorfill"></view>
                </view>
                <view class="margin-top-sm">
                    收藏|喜欢
                </view>
            </view>
            <view class="flex flex-sub flex-direction" @tap="href('/pages/my/blog/blog')">
                <view class="text-xxl text-orange">
                    <view class="cuIcon-edit"></view>
                </view>
                <view class="margin-top-sm">
                    <!-- 帖子| -->
                    我的评论
                </view>
            </view>
        </view>
        <view class="cu-list menu shadow-lg radius solid">
            <!-- <view class="cu-item margin-top" @click="openScan()"> -->
            <!-- <view class="cu-item margin-top" @tap="href('/pages/test/index',{},false)">
                <view class="content">
                    <text class="cuIcon-scan" />
                    <text class="text-grey">
                        扫一扫
                    </text>
                </view>
            </view> -->

            <view class="cu-item" @tap="href('/pages/my/outdoor/line')">
                <view class="content">
                    <text class="cuIcon-fork"></text>
                    <text class="text-grey">
                        我的轨迹
                    </text>
                </view>
            </view>
            <view class="cu-item" @tap="href('/pages/my/outdoor/point')">
                <view class="content">
                    <text class="cuIcon-footprint"></text>
                    <text class="text-grey">
                        我的兴趣点
                    </text>
                </view>
            </view>
            <!-- <view class="cu-item" @tap="href('/pages/my/outdoor/picture')">
                <view class="content">
                    <text class="cuIcon-pic"></text>
                    <text class="text-grey">我的相册</text>
                </view>
            </view> -->
            <view class="cu-item" @tap="href('/pages/my/discover')">
                <view class="content">
                    <text class="cuIcon-discover"></text>
                    <text class="text-grey">
                        我的动态
                    </text>
                </view>
            </view>

            <view class="cu-item margin-top" @tap="href('/pages/my/set/settings',{},false)">
                <view class="content">
                    <text class="cuIcon-settings"></text>
                    <text class="text-grey">
                        设置
                    </text>
                </view>
            </view>
        </view>
        <!-- 更换封面modal -->
        <view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
            <view class="cu-dialog">
                <view>更换主页封面</view>
            </view>
        </view>
        <view class="cu-bar"></view>
        <tui-footer :copyright="bd.sys.footer.content" :fixed="false" :navigate="bd.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>
        <!-- <tui-footer :copyright="bd.sys.footer.content" :fixed="false" tui-footer-class="tui-custom"></tui-footer> -->
    </view>
</template>

<script>
export default {
    data() {
        return {
            modalName: '',
            // user: { ava: this.bd.sys.logo, name: '智慧小步' }, // 已登录用户信息
            user: null,
            bd: this.bd, // APP相关信息
            CustomBar: this.CustomBar,
            isLogin: false, // 是否登录
            loginTip: false,

            top: 0, //标题图标距离顶部距离
            opcity: 0,
            scrollTop: 0.5,
            socialList: [
                // 社交信息
                {
                    title: '好友',
                    key: 'friend',
                    value: 0,
                    path: '/pages/my/social/friend'
                },
                // {
                //     title: '队伍',
                //     key: 'team',
                //     value: 0,
                //     path: '/pages/my/social/team'
                // },
                {
                    title: '关注',
                    key: 'follow',
                    value: 0,
                    path: '/pages/my/social/follow'
                },
                {
                    title: '粉丝',
                    key: 'fans',
                    value: 0,
                    path: '/pages/my/social/fans'
                }
            ],
            order: [
                // 订单信息
                {
                    name: '待付款',
                    icon: 'pay',
                    num: 0,
                    st: 1
                },
                {
                    name: '待发货',
                    icon: 'present',
                    num: 0,
                    st: 2
                },
                {
                    name: '待收货',
                    icon: 'deliver',
                    num: 0,
                    st: 3
                },
                {
                    name: '评价',
                    icon: 'mark',
                    num: 0,
                    st: 4
                },
                {
                    name: '售后',
                    icon: 'refund',
                    num: 0,
                    st: 6
                }
            ],
            elements: [],
            serve: [
                {
                    name: '救援求助',
                    icon: 'SOS',
                    url: 'sos',
                    route: 'planningServeSos',
                    color: 'red'
                },
                {
                    name: '报备留踪',
                    icon: 'dist',
                    url: 'declare',
                    route: 'planningServeDeclare',
                    color: 'orange',
                    very: 1
                },
                {
                    name: '天气预报',
                    icon: 'sun',
                    color: 'yellow',
                    url: 'weather',
                    route: 'planningServeWeather'
                },
                {
                    name: '周边信息',
                    icon: 'map',
                    color: 'blue',
                    url: 'around',
                    route: 'planningServeAround'
                }
                // {
                // 	name: '领队服务',
                // 	icon: 'tutor2',
                // 	color: 'green',
                // 	url: 0
                // },
                // {
                // 	name: '教育培训',
                // 	icon: 'reward',
                // 	color: 'pink',
                // 	url: 0
                // }
            ]
        };
    },
    // onLoad: function (options) {
    //     this.loadData()
    // },
    onShow() {
        this.user = this.zz.getAcc()
        this.loadData()
    },
    methods: {
        // 初始化加载数据
        loadData() {
            const token = this.zz.getToken()
            if (token) {
                this.isLogin = true
                this.zz.req({
                    $url: 'user/person/info'
                }).then(res => {
                    // console.log("个人统计数据", res)
                    this.socialList.find(res=>res.key ==='follow').value = res.follow || 0
                    this.socialList.find(res=>res.key ==='fans').value = res.fans || 0
                    // this.socialList[2].value = res.follow || 0
                    // this.socialList[3].value = res.fans || 0
                })
            } else {
                this.isLogin = false
            }
        },
        openProfile() {
            this.href('/pages/my/profile/profile')
        },
        href(url, value, verify = true) {
            this.zz.href(url, value, verify);
        },
        openScan() {
            uni.scanCode({
                success: (res) => {
                    // console.log("扫码成功===", res)
                },
                fail: (err) => {
                    console.error("扫码失败===", err)
                }
            })
        }
    },
    onBackPress() { return true }
};
</script>

<style lang="scss" scoped>
.UCenter-bg {
    // background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9d702f50-9906-11ea-8bd0-2998ac5bbf7e.jpg');
    // background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/57a5a3f0-99f2-11ea-a30b-e311646dfaf2.jpg');
    // background-image: url('https://zts.5618.co/repo/bg/newfhzx.jpg');
    // background-image: url('https://zts.5618.co/repo/bg/myBG.jpeg');
    // background-image: url('https://s1.ax1x.com/2022/07/05/jtDeNq.png');
    background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/2dfd31d0-95ec-11ea-a30b-e311646dfaf2.jpeg');
    background-size: cover;
    height: 470rpx;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    /* justify-content: flex-start; */
    /* padding-top: 10rpx; */
    overflow: hidden;
    position: relative;
    color: #fff;
    font-weight: 300;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

    .setting-icon {
        position: absolute;
        right: 20px;
        top: 50px;
        font-size: 60rpx;
        // width: 50rpx;
        // height: 50rpx;
        // background-color: red;
    }
}

.UCenter-bg button {
    opacity: 0.8;
}

.UCenter-bg image {
    width: 200rpx;
    height: 200rpx;
}

.UCenter-bg .gif-wave {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 99;
    mix-blend-mode: screen;
    height: 100rpx;
}
</style>
