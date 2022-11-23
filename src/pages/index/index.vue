<!-- 首页模板 -->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue">
            <view slot="content">运动浙江 户外天堂</view>
        </cu-custom>
        <!--搜索框-->
        <view class="cu-bar bg-ztsblue search fixed align-center" style="height:100rpx;" id="searchBar" :style="[{ top: customBar + 'px' }]">
            <view class="action text-white round padding-xs" @click="href('/pages/comm/region')">
                <text class="cuIcon-locationfill"></text>
                <text class="text-df">{{dict?dict.deps[deptId||'330213'].name:''}}</text>
                <text class="margin-left-xxs cuIcon-triangledownfill"></text>
            </view>
            <view class="search-form round" @click="href('/pages/planning/list?key=1')">
                <!-- <view class="search-form round" @click="href('/pages/comm/search')"> -->
                <text class="cuIcon-search" />
                <input type="text" placeholder="搜索地名/路线 …" :focus="focus" :disabled="true" confirm-type="search" />
            </view>
            <view class="action text-white text-df" @click="href('/pages/my/social/writeTopic',0,1)">
                <text class="cuIcon-add"></text>
                <view class="margin-left-xs">
                    <!-- <uni-icons class="fab-circle-icon" type="circle-filled" color="#ff0000" size="42"></uni-icons> -->
                    发布
                </view>
            </view>
        </view>
        <view style="height:100rpx;"></view>
        <view id="tvideo" v-show="!hotList.length">
            <!-- #ifndef APP-PLUS -->
            <view class="cu-card case no-card">
                <view class="bg-video flex align-center" style="height: 400upx;">
                    <video id="myVideo" src="https://699d1eb1-ee53-4c66-bddd-06cda80d1231.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/2a6fea9c-08c5-45a0-b312-8a06823192cb.m4v" :autoplay="false" :muted="false" :show-fullscreen-btn="true" :show-mute-btn="true" :show-play-btn="true" object-fit="cover">
                    </video>
                </view>
            </view>
            <!-- #endif -->
			<!-- <zz-video :video="{url: 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.cdn.bspapp.com/VKCEYUGU-699d1eb1-ee53-4c66-bddd-06cda80d1231/2a6fea9c-08c5-45a0-b312-8a06823192cb.m4v'}"></zz-video> -->
        </view>

        <template v-if="hotList.length">
            <swiper class="screen-swiper square-dot" style="height:360rpx;" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="600">
                <swiper-item v-for="(item, index) in hotList" :key="index" @click="href('/pages/planning/detail?id=' + item._id)">
                    <image :src="item.cover" mode="aspectFill"></image>
                </swiper-item>
            </swiper>
        </template>

        <!-- <view class="padding" @click="changeFontSize">
            <button class="cu-btn">change font-size</button>
        </view> -->

        <!-- 关于奉化健身步道 -->
        <template v-if="deptId=='330213'">
            <view class="cu-bar bg-white solid-bottom" @click="href('/pages/planning/article?id=' + '5eb69f446f49e7004daf7b67')">
                <view class="action">
                    <text class="cuIcon-titles text-blue text-lg"></text>
                    关于奉化健身步道
                </view>
                <view class="action">
                    <view class="cuIcon-right"></view>
                </view>
            </view>
        </template>

        <view class="cu-list grid col-3">
            <view class="cu-item" v-for="(item, index) in list" :key="index" @click="href('/pages/planning/article?id=' + item.id)">
                <view :class="['cuIcon-' + item.cuIcon, 'text-' + item.color]"></view>
                <text>{{ item.name }}</text>
            </view>
        </view>
        <template v-if="hotList.length">
            <view class="radius">
                <view class="margin-top-xs cu-bar bg-white solid-bottom">
                    <view class="action">
                        <text class="cuIcon-titles text-orange"></text>
                        人气路线
                    </view>
                    <view class="action" @click="href('/pages/planning/list?key=1')">
                        <text class="text-gray text-sm">更多</text>
                        <text class="cuIcon-right text-gray"></text>
                    </view>
                </view>
                <scroll-view scroll-x class="bg-white nav text-center" scroll-with-animation>
                    <view class="flex">
                        <block v-for="(t1, index) in hotList" :key="index">
                            <view class="flex flex-direction">
                                <view class="nav-li" :style="[{ backgroundImage: 'url(' + t1.cover + ')' }]" @click="href('/pages/planning/detail?id=' + t1._id)">
                                    <view class="flex flex-direction text-left text-white text-sm" :style="[{ width: winW * 0.35 + 'px' }, { height: '42px' }]">
                                        <view class="flex justify-between">
                                            <view class="padding-lr-xs cuIcon-dist">{{ zz.math(t1.kml.len / 1000, 2) }}Km</view>
                                            <view class="mybadge cu-tag radius sm" :class="'bg-orange'">{{ '环线' }}</view>
                                        </view>
                                    </view>

                                    <view class="flex flex-direction text-white text-xs text-left">
                                        <view class="padding-lr-sm margin-tb-xs flex justify-start">
                                            <view class="cuIcon-favorfill text-orange"></view>
                                            <view class="cuIcon-favorfill text-orange"></view>
                                            <view class="cuIcon-favorfill"></view>
                                        </view>
                                    </view>
                                </view>

                                <view class="padding-tb-xs text-sm text-cut" :style="[{ width: winW * 0.35 + 'px' }]">{{ t1.name }}</view>
                            </view>
                        </block>
                    </view>
                </scroll-view>
            </view>
        </template>

        <!-- 赛事活动 -->
        <!-- <template v-if="bd.isDev&&deptId=='330213'">
            <view class="cu-bar bg-white solid-top margin-top">
                <view class="action">
                    <text class="cuIcon-titles text-ftorange"></text>
                    赛事活动
                </view>
                <view class="action" @click="href('/pages/event/event')">
                    <text class="text-gray text-sm">更多</text>
                    <text class="cuIcon-right text-gray"></text>
                </view>
            </view>
            <swiper class="card-swiper" interval="5000" duration="800" indicator-color="#8799a3" indicator-active-color="#0081ff" :indicator-dots="true" :circular="true" :autoplay="true">
                <swiper-item v-for="(item, index) in swiperList" :key="index" :class="cardCur == index ? 'cur' : ''" @click="href('/pages/event/detail/detail')">
                    <view class="swiper-item" style="height: 600rpx">
                        <view class="cu-card dynamic no-card">
                            <view class="cu-item shadow">
                                <view class="text-content text-cut text-ftorange text-xl text-bold">{{ item.name }}</view>
                                <view class="">
                                    <view class="bg-img only-img" :style="'height:320rpx; background-image:url(' + item.url + ');'">
                                        <view class="cu-tag bg-mauve">{{ item.onday }}</view>
                                        <view class="flex justify-between text-white" style="margin-top: 200rpx">
                                            <view class="content padding-lr-sm text-df text-cut">{{ item.slogan }}</view>
                                            <view class="content padding-lr-sm text-sm text-cut">{{ item.location }}</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
        </template> -->

        <view class="padding-xs">
            <view class="bg-blue light" style="margin: 20rpx; padding: 20rpx; border-radius: 8rpxs">
                <view class="text-df text-ftblue text-bold padding-tb-xs">
                    <text class="cuIcon-safe text-ftblues text-lg padding-lr-xs"></text>
                    服务与保障
                </view>
                <view class="cu-list grid col-4 solid-top solid-left solid-right">
                    <view class="cu-item" v-for="(item, index) in serve" :key="index" @click="href('/pages/serve/' + item.url)">
                        <view :class="item.type + '' + item.icon + ' text-' + item.color"></view>
                        <text class="text-bold" :class="'text-' + item.color">{{ item.name }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- <template v-if="bd.isDev&&deptId=='330213'">
            <view class="bg-img padding-top" style="background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/362a6b36-f1d9-451c-bd16-d4ee9643894c.gif'); height: 333rpx" @click="href('/pages/mall/special')">
                <view class="flex justify-end padding-top">
                    <view class="cu-tag bg-pink text-right">当季热销</view>
                </view>
                <view class="padding-xl text-white">
                    <view class="padding-xs text-xxl text-bold">奉 化 水 蜜 桃</view>
                    <view class="padding-xs text-df">沉醉江南的味道</view>
                </view>
            </view>
        </template> -->

        <tui-divider :gradual="true" :gradualColor="['red', '#4a67d6']">环浙动态</tui-divider>
        <news-home v-if="dict" ref="newsHome" :stickyHeight="getStickyHeight" :scrollTop="scrollTop" :showMore="true"></news-home>
        <tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>

        <!-- </template>
		<template v-else>
			<tui-loading :fixed="true" :index="3" type="green"></tui-loading>
		</template>
			 -->

        <view class="cu-modal" :class="showTips===true?'show':''">
            <view class="cu-dialog bg-gray">
                <view class="cu-bar bg-white justify-end">
                    <view class="content">环浙步道提示</view>
                    <view class="action" @click="showTips = false">
                        <text class="cuIcon-close text-red"></text>
                    </view>
                </view>
                <view class="padding-sm flex flex-direction justify-start">
                    <block v-for="(p,i) in appTips" :key="i">
                        <view class="padding-tb-xs text-left text-grey">
                            {{p}}
                        </view>
                    </block>
                    <view class="cu-list menu text-left text-sm text-red">
                    </view>
                </view>
                <view class="cu-bar bg-white flex justify-center">
                    <button class="cu-btn xs lines-green round" @click="showTips = false">
                        <text class="text-sm">知道了</text>
                    </button>
                </view>
            </view>
        </view>
        <!-- <zz-footer /> -->
    </view>
</template>
<script>

import news from './component/news.vue';
import card from './component/card.vue';
import newsHome from '@/components/news/news-home.vue'
import newsPage from '../station/news.vue';

export default {
    components: {
        news,
        card,
        newsPage,
        newsHome
    },
    props: {
        scrollTop: {
            type: Number,
            default: 0
        },
        hotList: {
            type: Array,
            default: () => {
                return []
            }
        },
        deptId: {
            type: [String, Number],
            default: '330213',
            required: true
        }
    },
    computed: {
        getStickyHeight() {
            return (this.customBar || 0) + (this.searchBarHeight || 0) + 'px';
        },
        list() {
            return this.deptId == '330213' ? [
                {
                    cuIcon: 'footprint',
                    color: 'mauve',
                    id: '5eb7998ce260f0004ce01c83',
                    name: '建设历史'
                },
                {
                    cuIcon: 'creativefill',
                    color: 'purple',
                    id: '5eb7a2cd33bd17004e01bb49',
                    name: '设计概述'
                },
                {
                    cuIcon: 'all',
                    color: 'mauve',
                    id: '5eb7ad06bae6ba004d1c754f',
                    name: '路况构成'
                },
                {
                    cuIcon: 'discoverfill',
                    color: 'mauve',
                    id: '5eb7b6d543f165004c6d2d4f',
                    name: '风格特色'
                },
                {
                    cuIcon: 'circlefill',
                    color: 'purple',
                    id: '5eb7b88343f165004c6d2d52',
                    name: '节点元素'
                },
                {
                    cuIcon: 'formfill',
                    color: 'mauve',
                    id: '5eb7bf2cbb3e5e004c4cb663',
                    name: '步道标识'
                }
            ] : [
                {
                    cuIcon: 'footprint',
                    color: 'mauve',
                    id: '62fd977f0575480001b9a9d6',
                    name: '建设目标'
                },
                {
                    cuIcon: 'creativefill',
                    color: 'purple',
                    id: '62fdf07de3e39a00019cef86',
                    name: '设计理念'
                },
                {
                    cuIcon: 'all',
                    color: 'mauve',
                    id: '62feddf743000a0001ab0625',
                    name: '步道系统'
                },
                {
                    cuIcon: 'discoverfill',
                    color: 'mauve',
                    id: '62ff3b43a68f4a00019b154a',
                    name: '选线定线'
                },
                {
                    cuIcon: 'circlefill',
                    color: 'purple',
                    id: '62ff4a35f866a70001bf8bb4',
                    name: '生态工法'
                },
                {
                    cuIcon: 'formfill',
                    color: 'mauve',
                    id: '630471a7612f70000143f586',
                    name: '步道标识'
                }
            ]
        }
    },
    data() {
        return {
            defaultPhoneHeight: '',
            newPhoneHeight: '',
            testText: '',
            rootFontSize: '10px',  // 根字体
            bd: this.bd, // APP相关信息
            focus: false,
            dict: uni.getStorageSync('sys_dict'),
            scrolled: 0,
            customBar: this.CustomBar,
            statusBar: this.StatusBar,
            mainHeight: this.WinHeight,
            // scrollTop: 0, //返回顶部
            searchBarHeight: -1,
            stickBarHeight: -1,
            stickBarPosition: -1,

            winW: this.WinWidth,
            showTips: false, // 是否展示当前是演示版本
            appTips: [
                '当前应用程序（App）为内部的测试版本，因此我们向您说明：',
                '1. 部分功能尚在开发中，无法正常使用',
                '2. 部分页面内容为演示数据，非正式有效',
                '3. 如您在浏览过程中发现任何问题，欢迎向我们反馈',
            ],

            ismute: false,



            cardCur: 0,

            swiperList: [
                {
                    id: 1,
                    name: '2022 足行奉化·缘结山水徒步活动-松岙站',
                    slogan: '走红色古道 品松岙蜜桔',
                    onday: '2022-04-06',
                    location: '奉化区 松岙镇',
                    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/f0fa0730-9588-11ea-9e8b-05a3242b26f2.jpeg'
                },
                {
                    id: 2,
                    name: '2022 江南168越野挑战赛',
                    slogan: '全国完赛率最高赛道',
                    onday: '2022-05-20',
                    location: '奉化区 雪窦山',
                    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/c9d17e26-96db-4945-ab31-eed2202e1f28.jpg'
                },
                {
                    id: 3,
                    name: '携手奔跑9.9公里，第三届"两岸共跑212线上赛"正在报名中',
                    slogan: '全国完赛率最高赛道',
                    onday: '2022年2月12日-2月28日',
                    location: '不限',
                    url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-996909cb-e5ca-4be8-8150-b60ae2422186/e8c88303-3096-4371-8b3c-729534e5c4d3.jpg'
                }
            ],
            serve: [
                {
                    name: '救援求助',
                    icon: 'SOS',
                    url: 'sos',
                    color: 'red',
                    type: 'zzIcon-'
                },
                {
                    name: '报备留踪',
                    icon: 'dist',
                    url: 'declare',
                    color: 'orange',
                    very: 1,
                    type: 'zzIcon-'
                },
                {
                    name: '天气预报',
                    icon: 'sun',
                    color: 'yellow',
                    url: 'weather',
                    type: 'zzIcon-'
                },
                {
                    name: '更多',
                    icon: 'cascades',
                    color: 'grey',
                    type: 'cuIcon-',
                    url: 'serve'
                }
            ]
        }
    },
    // async onLoad() {
    // 安卓键盘使用resize方案
    // window.onresize=()=>{
    //     console.log("android resize------")
    //     this.zz.toast("resize",500)
    // }
    // uni.hideTabBar()
    // ios h5键盘使用事件监听方案
    // document.body.addEventListener('focusin', () => {
    //     this.zz.toast("键盘弹起")
    // })
    // document.body.addEventListener('focusout', () => {
    //     this.zz.toast("键盘收回")
    //     this.showText = false
    // })
    // },
    // onUnload() {
    //     document.body.removeEventListener('focusin', () => {
    //         console.info('卸载键盘弹起监听器')
    //     })

    //     document.body.removeEventListener('focusout', () => {
    //         console.info('卸载键盘收回监听器')
    //     })
    // },
    created() {

    },
    mounted() {
        // this.loadData('init')  // 初始化
        // this.refreshNewsHome() // 刷新动态列表

    },
    methods: {
        dataLoaded() {
            this.$nextTick(() => {
                this.cal()
                this.refreshNewsHome()
                setTimeout(() => {
                    this.$refs.newsHome.resetHeight()  // 刷新动态的高度
                }, 500)
            })
        },
        // 刷新动态
        refreshNewsHome() {
            if (this.$refs.newsHome) {
                this.$refs.newsHome.loadData('init')
            }
        },
        cal() {
            uni.createSelectorQuery().select('#searchBar').boundingClientRect((e) => {
                this.searchBarHeight = e.height
            }).exec()

            // #ifndef APP-PLUS
            uni.createSelectorQuery().select('#tvideo').boundingClientRect((e) => {
                this.videoBottom = e.bottom - this.customBar
                this.videoTop = e.top - this.customBar
            }).exec()
            this.videoContext = uni.createVideoContext('myVideo')
            // #endif
            // uni.createSelectorQuery().select('#stickBar').boundingClientRect((e) => {
            // 	this.stickBarHeight = this.height
            // 	this.stickBarPosition = this.top - this.stickBarHeight - this.searchBarHeight - this.statusBar
            // }).exec()

            this.mainHeight = this.WinHeight - this.customBar - this.statusBar - this.stickBarHeight - 80
        },
        scrollToTop() {
            // console.log('top====================')
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        },
        // 首页触底了
        // isCanScroll = true
        handleReachBottom() {
            this.$refs.newsHome.scrollInBottom()
        },
        pause() { this.videoContext.pause() },
        href(u, e, v) { this.zz.href(u, e, v) }
    },
    // #ifndef APP-PLUS
    onHide() { this.pause() },
    // #endif
};
</script>

<style lang="scss" scoped>
.container {
    padding-bottom: env(safe-area-inset-bottom);
}

// .sticky-box{
//     position: sticky;
//     z-index: 10;
// }

.news-sticky-box {
    position: sticky;
    z-index: 10;
}

.nav-li {
    border-radius: 6rpx;
    width: 280rpx;
    margin: 0 10rpx;
    background-size: 100% 100%;
    background-position: center;
    z-index: 1;
}

.header-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .avatar-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        .avatar-name-time {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
        }
    }
}
.moment-box {
    .content-box {
        padding: 20rpx 0;

        .text-box {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .image-box {
            height: 606rpx;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;
        }
    }
    .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        .location-box {
            margin-right: 20rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

    .footer-bar {
        padding-top: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.watch-box {
    align-items: center;
    // font-size: 20rpx;
    font-size: 40rpx;
    display: flex;
    flex-direction: row;
    column-gap: 20rpx;

    &-item {
        .text-df {
            margin-right: 10rpx;
        }
    }
}

.card-swiper {
    .uni-swiper-wrapper {
        height: 600rpx !important;
    }
}

.cu-list.grid > .cu-item [class*='zzIcon'] {
    position: relative;
    display: block;
    margin-top: 10px;
    width: 100%;
    // font-size: 26px;
    font-size: 52rpx;
}

.push-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 50rpx 0;
    background-color: #ffffff;
    .push-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .text {
            margin-top: 10rpx;
        }
    }
}

.rem-12 {
    font-size: 24rpx;
}
.rem-14 {
    font-size: 28rpx;
}
.rem-16 {
    font-size: 32rpx;
}

.rem-18 {
    font-size: 36rpx;
}
</style>
