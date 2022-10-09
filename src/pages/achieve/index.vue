<!-- 首页模板 -->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="false" :home="false">
            <block slot="backText"></block>
            <block slot="content">
                <!-- <text class="text-white">{{ bd.sys.name }}</text> -->
                <text class="text-white">运动浙江 户外天堂</text>
            </block>
        </cu-custom>

        <!--搜索框-->
        <view class="cu-bar bg-ztsblue search fixed" id="searchBar" :style="[{ top: customBar + 'px' }]">
            <view class="action text-white solid round padding-xs" @click="openChangeRegion">
                <!-- <button class="cu-btn xs line-white round shadow" @tap="mapView"> -->
                <text class="cuIcon-locationfill"></text>
                <text class="text-df">奉化区</text>
                <text class="margin-left-xxs cuIcon-triangledownfill"></text>
                <!-- </button> -->
            </view>
            <view class="search-form round">
                <text class="cuIcon-search" />
                <input type="text" placeholder="搜索地名/路线 …" :disabled="true" confirm-type="search" @click="openSearch" v-model="searchKey" />
            </view>
            <!-- @click="searchTap" -->
            <view class="action text-white" @click="modalName = 'push'">
                <text class="cuIcon-add"></text>
                <view class="margin-left-xs">发布</view>
            </view>
        </view>
        <!-- 发布的对话框 -->
        <view class="cu-modal" :class="modalName == 'push' ? 'show' : ''" @click="modalClick">
            <view class="cu-dialog">
                <!-- <view class="cu-bar bg-white justify-end">
                    <view class="content">Modal标题</view>
                    <view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
                </view>
                <view class="padding-xl">Modal 内容。</view> -->
                <view class="flex justify-evenly align-center">
                    <view>动态</view>
                    <view>话题</view>
                </view>
            </view>
        </view>

        <view id="tvideo" class="cu-bar"></view>

        <block v-if="trailData.tStyle">
            <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="600">
                <swiper-item v-for="(item, index) in trailData.tStyle[3].list" :key="index" @tap="swiperNav(index)">
                    <image :src="item.cover" mode="aspectFill"></image>
                </swiper-item>
            </swiper>
        </block>

        <!-- 关于奉化健身步道 -->
        <view class="cu-bar bg-white solid-bottom" @tap="about('5eb69f446f49e7004daf7b67')">
            <view class="action">
                <text class="cuIcon-titles text-blue text-lg"></text>
                关于奉化健身步道
            </view>
            <view class="action"><view class="cuIcon-right"></view></view>
        </view>

        <view class="cu-list grid col-3">
            <view class="cu-item" v-for="(item, index) in cuIconList" :key="index" @tap="about(item.id)">
                <view :class="['cuIcon-' + item.cuIcon, 'text-' + item.color]"></view>
                <text>{{ item.name }}</text>
            </view>
        </view>
        <block v-if="trailData.hotList">
            <view class="radius">
                <view class="margin-top-xs cu-bar bg-white solid-bottom">
                    <view class="action">
                        <text class="cuIcon-titles text-orange"></text>
                        人气路线
                    </view>
                    <view class="action" @tap="href('/pages/planning/list?key=1')">
                        <text class="text-gray text-sm">更多</text>
                        <text class="cuIcon-right text-gray"></text>
                    </view>
                </view>
                <scroll-view scroll-x class="bg-white nav text-center" scroll-with-animation>
                    <view class="flex">
                        <block v-for="(t1, index) in trailData.hotList" :key="index">
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
        </block>

        <!-- 赛事活动 -->
        <view class="cu-bar bg-white solid-top margin-top">
            <view class="action">
                <text class="cuIcon-titles text-ftorange"></text>
                赛事活动
            </view>
            <view class="action" @click="href('/pages/event/event')">
                <text class="text-gray text-sm">更多</text>
                <text class="cuIcon-right text-gray"></text>
                <!-- <view class="cuIcon-right"></view> -->
            </view>
        </view>
        <swiper
            class="card-swiper"
            interval="5000"
            duration="800"
            indicator-color="#8799a3"
            indicator-active-color="#0081ff"
            :indicator-dots="true"
            :circular="true"
            :autoplay="true"
        >
            <swiper-item v-for="(item, index) in swiperList" :key="index" :class="cardCur == index ? 'cur' : ''" @tap="href('/pages/event/detail/detail')">
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
        <!-- <view class="bg-white padding-sm solid" style="margin: 20rpx;border-radius: 8rpx;">
			<view class=" flex text-center text-grey" style="padding: 30rpx 0;">
				<block v-for="(item, index) in serve" :key="index">
					<view class="flex flex-sub flex-direction" @click="href(item.url?'/pages/serve/'+item.url+'?tar=f&sn=000&loc=121.402022,29.658711':'/pages/serve')">
						<view class="text-xxl text-purple">
							<view :class="'cuIcon-' + item.icon + ' text-' + item.color"></view>
						</view>
						<view class="text-bold" :class="'text-'+item.color"> {{item.name }} </view>
					</view>
					
				</block>
			</view>
		</view> -->

        <view
            class="bg-img padding-top"
            style="background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/362a6b36-f1d9-451c-bd16-d4ee9643894c.gif'); height: 333rpx"
            @tap="href('/pages/mall/special')"
        >
            <view class="flex justify-end padding-top"><view class="cu-tag bg-pink text-right">当季热销</view></view>
            <view class="padding-xl text-white">
                <view class="padding-xs text-xxl text-bold">奉 化 水 蜜 桃</view>
                <view class="padding-xs text-df">沉醉江南的味道</view>
            </view>
        </view>

        <tui-divider :gradual="true" :gradualColor="gradualColor">步道动态</tui-divider>

        <news-page :stickyHeight="getStickyHeight"></news-page>
        <!-- <tui-tabs :tabs="articleTabs" :currentTab="currentTab" itemWidth="50%" :stickyTop="100" @change="tabChnage"></tui-tabs> -->
        <!-- :style="[{ top: customBar + searchBarHeight + 'px',background:red }]"   :style="{'top':'40px'}"-->
        <!-- 吸顶标题栏 -->
        <!-- <view class="solid-bottom news-sticky-box" :style="{top:getStickyHeight}">
            <scroll-view scroll-x class="bg-white nav ">
                <view class="flex text-center">
                    <view
                        class="cu-item flex-sub"
                        :class="index == currentTab ? 'text-orange cur text-bold' : ''"
                        v-for="(item, index) in articleTabs"
                        :key="index"
                        @tap="tabSelect"
                        :data-id="index"
                    >
                        {{ item.name }}
                    </view>
                </view>
            </scroll-view>
        </view> -->

        <!-- 推荐动态模块 -->
        <!-- <view id="recommend" class="moment-box padding">
            <view class="header-bar">
                <view class="avatar-box">
                    <view
                        class="cu-avatar round df margin-right-xs"
                        :style="[{ backgroundImage: 'url(' + 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg' + ')' }]"
                    >
                        <view class="cu-tag badge cuIcon-male bg-blue"></view>
                    </view>
                    <view class="avatar-name-time" @click="testLogin">
                        <text class="text-df text-black">花开花落</text>
                        <text class="text-grey text-xs">8小时前</text>
                    </view>
                </view>
                <view class="like-box">
                    <button class="cu-btn sm line-blue">
                        <text class="cuIcon-add"></text>
                        关注
                    </button>
                </view>
            </view>

            <view class="content-box">
                <view class="text-box text-cut-2 padding-bottom">发布了一条动态</view>
                <view class="image-box">
                    <image
                        mode="aspectFill"
                        style="width: 33%; height: 200rpx"
                        v-for="(item, idx) in 9"
                        :key="idx"
                        :src="'https://fhty.976m.org/bdfh/img/0 (' + (idx + 1) + ').JPG'"
                    ></image>
                </view>
            </view>

            <view class="info-bar">
                <view class="location-box cu-tag round">
                    <text class="cuIcon-locationfill"></text>
                    地点
                </view>
                <text class="text-grey text-xs">拍摄于：2022-04-04</text>
            </view>

            <view class="footer-bar">
                <view class="tag-box">
                    <view class="cu-tag line-yellow margin-right-xs sm">动态</view>
                    <view class="cu-tag line-yellow sm">精选</view>
                </view>
                <view class="watch-box">
                    <view class="watch-box-item">
                        <text class="cuIcon-attention text-df"></text>
                        <text>8.0w</text>
                    </view>
                    <view class="watch-box-item">
                        <text class="cuIcon-comment text-df"></text>
                        <text>13</text>
                    </view>
                    <view class="watch-box-item">
                        <text class="cuIcon-like text-df"></text>
                        <text>2</text>
                    </view>
                </view>
            </view>
        </view>
        <view id="news"><news></news></view>
        <view id="moment" class="padding solid-top solid-bottom" style="padding: 20rpx 24rpx">
            <view class="flex align-center padding-tb-sm">
                <view class="flex flex-direction">
                    <view style="width: 500rpx" class="padding-lr-xs text-bold text-black text-df text-cut-2">运单热身的重要性</view>
                    <view style="width: 500rpx" class="pre-line padding-lr-xs text-dark text-sm text-cut-2">
                        热身是确保你发挥最大能力和最大化避免损伤最有效的方式之一，一个有效的热身应该在5分钟以上，包括全身...
                    </view>
                </view>
                <image mode="aspectFill" src="https://fhty.976m.org/bdfh/img/0 (10).JPG" style="height: 160rpx; width: 200rpx"></image>
            </view>
            <view class="flex justify-between align-center">
                <view class="cu-tag sm line-yellow margin-right-xs">资讯</view>
                <view class="watch-box">
                    <text>青蜂侠</text>
                    <view class="watch-box-item">
                        <text class="cuIcon-attention text-df"></text>
                        <text>8.0w</text>
                    </view>
                    <view class="watch-box-item">
                        <text class="cuIcon-comment text-df"></text>
                        <text>13</text>
                    </view>
                </view>
            </view>
        </view> -->
        <!-- 
        <view id="topic">
            <card
                :title="'提升登山能力的小妙招'"
                :content="'今天，和同事计划着天气暖和了去爬泰山，同事们纷纷说自己的体力不行，担心爬不上去，其实小编也有这个担心，平时上下六层楼梯都气喘吁吁的，更何况是那么高的泰山的，想着上下坐缆车也就失去了爬山的乐趣和意义，不如增强体力，究竟该怎样增强体力呢，小编询问了相'"
            ></card>
            <card
                :title="'徒步的好处'"
                :content="'现在的人们越来越注重健康，会通过各种方式增强自身的体质。徒步行走便是一种非常健康以及受欢迎的运动方式。研究表明，人体的各种解剖结构、生理机能、心肺的形成、人体骨骼、肌肉位置等方面最适合步行。'"
            ></card>
        </view> -->

        <!-- <map  longitude="120" latitude="30" :circles="true"></map> -->
        <!-- <tui-fab :btnList="btnList" :left="50" :right="0" :bottom="300" :maskClosable="true" bgColor="#1d50a2" @click="pushClick"></tui-fab> -->
        <tui-scroll-top :scrollTop="scrollTop"></tui-scroll-top>
        <tui-footer :copyright="bd.sys.footer.content" :fixed="false" :navigate="bd.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>
    </view>
</template>
<script>
import { loadData } from '@/comm/test/util.js';

import news from './component/news.vue';
import card from './component/card.vue';

import newsPage from '../station/news.vue';

export default {
    components: {
        news,
        card,
        newsPage
    },
    computed: {
        getStickyHeight() {
            const height = (this.customBar || 0) + (this.searchBarHeight || 0) + 'px';
            return height;
        }
    },
    data() {
        return {
            modalName: '', // modal
            bd: this.bd,
            isTopBottomLoad: true,
            scrolled: 0,
            currentTab: 0,
            customBar: this.CustomBar,
            statusBar: this.StatusBar,
            mainHeight: this.WinHeight,
            winW: this.WinWidth,
            btnList: [
                {
                    bgColor: '#16C2C2',
                    //名称
                    text: '动态',
                    //字体大小
                    fontSize: 28,
                    //字体颜色
                    color: '#fff'
                },
                {
                    bgColor: '#64B532',
                    //名称
                    text: '话题',
                    //字体大小
                    fontSize: 28,
                    //字体颜色
                    color: '#fff'
                }
            ],
            articleTabs: [
                {
                    name: '推荐',
                    boxName: 'recommend'
                },
                {
                    name: '视频',
                    boxName: 'video'
                },
                {
                    name: '游记',
                    boxName: 'travels'
                },
                {
                    name: '动态',
                    boxName: 'moment'
                },
                {
                    name: '资讯',
                    boxName: 'news'
                },
                {
                    name: '廉政',
                    boxName: 'topic'
                }
            ],

            searchKey: '',
            ismute: false,
            cuIconList: [
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
            ],

            scrollTop: 0, //返回顶部
            everpagenumber: 5,
            searchBarHeight: -1,
            stickBarHeight: -1,
            stickBarPosition: -1,

            cardCur: 0,
            // currentTab: 1, //预设当前项的值
            scrollLeft: 0, //tab标题的滚动条位置

            trailData: { regionData: [], hotList: [] },
            gradualColor: ['red', '#4a67d6'],
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
        };
    },

    async onLoad(option) {
        // const info = 	uni.getSystemInfoSync()
        // console.log("获取到的设备信息",info)
        // #ifdef APP-PLUS
        // console.log("启动了APP")
        // let nav = await uni.getSubNVueById('navNvue')
        // console.log("查找子窗体")
        // #endif
        // #ifdef H5-ZLB
        //  打开 以后 通过goto返回到页面来读取ticket
        // console.log('获取到的url参数', option);
        let ticket = this.getQueryVariable('ticket');

        // console.log('获取到的ticket', ticket);
        // console.log('H5-ZLB尝试登录==================================================');
        const sUserAgent = window.navigator.userAgent.toLowerCase();
        // console.log('当前的应用标志==============sUserAgent========================', sUserAgent);
        /**
         * ticket = getQueryVariable("ticket")
         */
        // if (!ticket) {
        // 	const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1; // 浙里办APP
        // 	const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1; //浙里办支付宝小程序
        // 	const host = location.origin;
        // 	console.log('当前页面的URL============host===========', host);
        // 	if (bIsDtDreamApp) {
        // 		let url = `https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=fhtyh5&goto=${host}`;
        // 		console.log('浙里办拼接的url===========', url);
        // 		// 浙里办获取ticket
        // 		location.href = url;
        // 		// location.href = `https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=fhty&go=${host}`;
        // 	}
        // 	if (bIsAlipayMini) {
        // 		let url = `https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=fhtyh5&goto=${host}`;
        // 		console.log('支付宝小程序拼接的url===========', url);
        // 		// 浙里办获取ticket
        // 		location.href = url;
        // 	}
        // } else {
        // 	// 有ticket 去后台登录
        // 	// userId nickName  token
        // }

        // #endif

        let trailData = uni.getStorageSync('trailData');
        if (!trailData) trailData = await loadData.call(this);
        this.trailData = trailData;

        // const pages = getCurrentPages()
        // const currentPage = pages[pages.length - 1]
        // console.log("获取到的页面",currentPage.route)
    },
    onReady() {
        uni.createSelectorQuery()
            .select('#searchBar')
            .boundingClientRect((e) => {
                this.searchBarHeight = e.height;
            })
            .exec();
        uni.createSelectorQuery()
            .select('#tvideo')
            .boundingClientRect((e) => {
                this.videoBottom = e.bottom - this.customBar;
                this.videoTop = e.top - this.customBar;
            })
            .exec();
        this.videoContext = uni.createVideoContext('myVideo');
        uni.createSelectorQuery()
            .select('#stickBar')
            .boundingClientRect((e) => {
                this.stickBarHeight = this.height;
                this.stickBarPosition = this.top - this.stickBarHeight - this.searchBarHeight - this.statusBar;
            })
            .exec();
        this.mainHeight = this.WinHeight - this.customBar - this.statusBar - this.stickBarHeight - 80;
    },
    methods: {
        // cuModalClick
        modalClick(){
            // console.log('点击===');
            this.modalName = ''
        },
        // 悬浮按钮操作  0:动态 1 话题
        pushClick({ index }) {
            // console.log('悬浮按钮点击', index);
            if (index === 0) {
                // 跳转到发送 动态
                this.zz.href('/pages/my/social/writePush');
            }
        },
        openSearch() {
            uni.navigateTo({
                url: '/pages/index/homeSearch'
            });
        },
        // 打开地区选择器
        openChangeRegion() {
            uni.navigateTo({
                url: '/pages/comm/region'
            });
        },
        testLogin() {},
        getQueryVariable(variable) {
            // console.log('getQueryVariable========', variable);
            // console.log('getQueryVariable==========url=================', window.location);
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        },
        tabSelect(e) {
            this.currentTab = e.currentTarget.dataset.id;
            let boxName = this.articleTabs[this.currentTab].boxName;
            const tabheight = this.customBar + this.stickBarHeight - 1; //tab 栏的高度
            uni.createSelectorQuery()
                .select('#' + boxName)
                .boundingClientRect((data) => {
                    if (data) {
                        // - tabheight
                        uni.pageScrollTo({
                            scrollTop: data.top + this.scrolled - 180,
                            duration: 300,
                            complete: () => {}
                        });
                    }
                })
                .exec();
        },
        tabChnage({ index }) {
            // console.log('tabChange======', index);
            this.currentTab = index;
        },
        openPage(name, params) {
            // tar=z&sn=317&loc=121.15678,29.68996,201'
            // this.$Router.push({
            // 	name: name,
            // 	params: params
            // });
        },
        cardChange(e) {
            this.cardCur = e.detail.current;
        },
        // 滚动切换标签样式
        swichNav(e) {
            let cur = e.currentTarget.dataset.current;
            this.currentTab = cur;
            this.scrollLeft = (cur - 1) * 60;
            uni.pageScrollTo({ scrollTop: this.stickBarPosition, duration: 200 });
        },
        userEvent(e) {
            // let o = this.trailData.regionData[this.currentTab].list[e.idx]
            // this.zz.userEvent(e.t, e.tt, o)
        },
        swiperNav(e) {
            // console.log(e);
            this.detail(this.trailData.tStyle[3].list[e]._id);
        },
        detail(id) {
            this.href('/pages/planning/detail?id=' + id);
        },
        about(id) {
            this.href('/pages/planning/article?id=' + id);
        },
        moreHot() {
            this.href('/pages/planning/list?key=1');
        },
        searchTap() {
            // console.log('扫码===========');
            // uni.showToast({
            //     title: '扫码========='
            // });
            // this.href('/pages/comm/test');
            // if (!this.searchKey) {
            // 	return;
            // }
            // this.href('/pages/planning/list?key=' + encodeURI(this.searchKey));
        },
        mapView() {
            this.href('/pages/planning/mapView');
        },
        href(u, e) {
            this.zz.href(u, e);
        }
    },
    onPageScroll: function (e) {
        this.scrollTop = e.scrollTop;
        this.scrolled = e.scrollTop;
        let _this = this;
        let scrollTop = e.scrollTop + (this.customBar + this.stickBarHeight);
        if (this.isTopBottomLoad) {
            for (let i = 0; i < this.articleTabs.length; i++) {
                uni.createSelectorQuery()
                    .select('#' + this.articleTabs[i].boxName)
                    .boundingClientRect((data) => {
                        if (data) {
                            _this.articleTabs[i].top = data.top + e.scrollTop;
                            _this.articleTabs[i].bottom = data.bottom + e.scrollTop;
                        }
                    })
                    .exec();
            }
            this.isTopBottomLoad = false;
        }
        for (let i = 0; i < this.articleTabs.length; i++) {
            if (this.articleTabs[i].top && this.articleTabs[i].bottom) {
                // console.log("当前滚动的高度==================",scrollTop)
                // console.log("当前元素的top",this.articleTabs[i].top)
                // console.log("当前元素的bottom",this.articleTabs[i].bottom)
                // if(scrollTop>this.articleTabs[i].top && scrollTop<this.articleTabs[i].bottom){
                // 	this.currentTab = i
                // }else{
                // 	this.currentTab = 0
                // }
            }
        }
        if (e.scrollTop >= this.videoBottom) {
            this.videoContext.pause();
        } else if (e.scrollTop <= this.videoTop) {
            this.videoContext.play();
        }
    },
    onShareAppMessage(res) {
        return {
            title: this.title,
            path: '/pages/share?path=/pages/planning/index'
        };
    }
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

// page {
// 	padding-top: 90rpx;
// }

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
    font-size: 1rem;
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
    font-size: 26px;
}
</style>
