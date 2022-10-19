<template>
<page-meta root-font-size="10px"></page-meta>
    <view class="bg-white">
        <!-- #ifndef APP-PLUS -->
        <view class="fixed text-white" :style="'opacity:' + (1 - headOpacity)">
            <cu-custom :is-back="true">
                <block slot="backText" />
                <block slot="content" />
            </cu-custom>
        </view>
        <view class="fixed" :style="'opacity:' + headOpacity">
            <cu-custom :is-back="true" bg-color="bg-green">
                <block slot="backText" />
                <block slot="content">
                    线路详情
                </block>
            </cu-custom>
        </view>
        <!-- #endif -->

        <block v-if="trail">
            <swiper
                class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
                duration="500"
            >
                <swiper-item v-for="(pic, idx) in trail.imgs" :key="idx" :data-index="idx" @tap.stop="bannerView">
                    <image :src="pic" mode="aspectFill" />
                </swiper-item>
            </swiper>

            <view class="solid-bottom padding-sm flex align-start">
                <view class="">
                    <view class="text-xl padding">
                        <text class="text-black text-bold solid-bottom">
                            {{ trail.name }}
                        </text>
                        <view v-for="(item, idx) in trail.region" :key="idx" class="bg-blue mybadge-left" :style="'left:' + idx * 90 + 'rpx'">
                            {{ item }}
                        </view>
                        <view v-if="trail.kml.loop < 500" class="bg-green mybadge">
                            环线
                        </view>
                        <view v-else class="bg-orange mybadge">
                            穿越
                        </view>
                    </view>
                    <view class="padding-lr flex align-start justify-center">
                        <text class="content text-brown">
                            途经
                        </text>
                        <text class="padding-left text-black">
                            {{ trail.path.join('—') }}
                        </text>
                    </view>
                </view>
            </view>
			<!-- <view class="padding-tb-xs text-gray text-right flex justify-between align-center"> -->
				<!-- <text class="margin-left text-sm text-gray">{{ zz.time2Date(trail.createTime,'Y-M-D h:m') }}</text> -->
				<zz-user-event :obj="trail" @act="userEvent"></zz-user-event>
			<!-- </view> -->
            <view class="padding bg-green">
                <view class="padding flex text-center text-grey bg-orange light shadow">
                    <view class="flex flex-sub flex-direction solid-right solid-left">
                        <view class="text-xxl text-orange">
                            {{ zz.math(trail.kml.len / 1000, 2) }}
                        </view>
                        <view class="bg-orange cu-tag badge margin-right-sm">
                            km
                        </view>
                        <view class="margin-top-sm">
                            长度
                        </view>
                    </view>
                    <view class="flex flex-sub flex-direction solid-right">
                        <view v-if="trail.kml.up == trail.kml.down" class="text-lg margin-top-xs text-blue">
                            ↑↓{{ trail.kml.down }} m
                        </view>
                        <view v-else class="text-lg margin-top-xs text-blue nav">
                            ↑{{ trail.kml.up }} ↓{{ trail.kml.down }} m
                        </view>
                        <view class="margin-top-sm text-blue">
                            累计上下
                        </view>
                    </view>
                    <view class="flex flex-sub flex-direction solid-right">
                        <view class="text-xxl text-green">
                            {{ zz.formatDuring(trail.kml.time*1000) }}
                        </view>
                        <view class="margin-top-sm text-green">
                            预计耗时
                        </view>
                    </view>
                </view>
            </view>

            <view class="grid text-center col-1">
                <view class="bg-white">
                    <view class="flex solid-bottom padding-xs align-center">
                        <view class="bg-grey padding-sm margin-xs radius">
                            风格类型
                        </view>
                        <view class="flex-treble bg-gray padding-xs radius">
                            <view class="flex flex-wrap">
                                <view v-for="(item, idx) in trail.type" :key="idx" class="padding-xs">
                                    <view class="cu-tag" :class="'bg-blue'">
                                        {{ dict.trail_type[item].label }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bg-white">
                    <view class="flex solid-bottom padding-xs align-center">
                        <view class="bg-grey padding-sm margin-xs radius">
                            景观元素
                        </view>
                        <view class="flex-treble bg-gray padding-xs radius">
                            <view class="flex flex-wrap align-center">
                                <view v-for="(item, idx) in trail.element" :key="idx" class="padding-xs">
                                    <view class="cu-tag" :class="'bg-green'">
                                        {{ dict.trail_element[item] ? dict.trail_element[item].label : item }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- #ifdef APP-PLUS || H5 -->

            <!-- :style="{top:'240rpx',left:0}" -->
            <view v-if="trail._kml" style="width: 350rpx" :style="{ top: customBar + 44 + 'px', left: '200rpx' }" class="padding-tb flex flex-direction justify-center align-center sticky-button-box">
                <button style="min-width: 280rpx" class="shadow cu-btn bg-green lg round" @click="useLine">
                    <text class="zzIcon-distfill margin-right-sm" />
                    使用路线
                </button>
            </view>
            <!-- #endif -->
            <view v-if="trail.video.url" id="tvideo">
                <view class="cu-card case no-card">
                    <view class="padding-top-xs shadow">
                        <view class="bg-video flex align-center" style="height: 422rpx">
                            <video
                                id="myVideo" autoplay :src="trail.video.url" :muted="ismute" :show-fullscreen-btn="true"
                                :show-mute-btn="true" :show-play-btn="true" object-fit="cover"
                            />
                        </view>
                    </view>
                    <view v-if="trail.video.desc" class="padding-xs text-cut bg-gray text-grey text-right">
                        {{ trail.video.desc }}
                    </view>
                </view>
            </view>

            <view class="pre-line text-content padding-lr">
                <text class="cuIcon-title text-black" />
                {{ trail.desc }}
            </view>

            <view class="radius">
                <!-- #ifdef APP-PLUS || H5 -->
                <block v-if="trail._kml">
                    <zz-map ref="zmap" :pms="trail._kml.children" @mapDone="mdone = true" />
                    <zz-kml-nav :kml="trail._kml" />
                </block>
                <block v-else>
                    <tui-loadmore :fixed="false" :index="3" type="green" />
                </block>
                <!-- #endif -->

                <!-- #ifdef MP -->
                <zz-kml-map v-if="trail._kml.children" :kml="trail._kml" :nav="true" @kmlMap="kmlMap" />
                <!-- #endif -->
            </view>

            <view class="sticky-box bg-cyan margin-top" :style="[{ top: customBar + 'px' }]">
                <scroll-view class="nav text-center" scroll-x scroll-with-animation>
                    <view
                        v-for="(item, idx) in tabList" :id="item.id" :key="idx" class="cu-item text-lg" :class="item.sight ? 'cur text-bold  text-red' : ''"
                        @tap="moveTo"
                    >
                        {{ item.name }}
                    </view>
                </scroll-view>
            </view>

            <view id="tabto0">
                <view class="cu-bar bg-gray solid-bottom margin-top">
                    <view class="action">
                        <text class="cuIcon-rank text-orange" />
                        印象评分
                    </view>
                </view>
                <view v-for="(item, idx) in trail.ip" :key="idx" class="cu-list menu sm-border card-menu">
                    <view class="flex solid-bottom padding-xs align-center">
                        <view class="margin-xs radius">
                            <text class="cuIcon-btn text-olive" />
                            <text class="text-grey">
                                {{ dict.trail_ip[idx + 1].label }}
                            </text>
                        </view>
                        <view class="flex-treble padding-xs radius">
                            <!-- <view class="flex flex-wrap"> -->
                            <tui-grade :score="item" disabled :size="16" active="#ff7900" :width="24" />
                            <!-- </view> -->
                        </view>
                    </view>
                </view>
                <view class="cu-bar bg-gray solid-bottom margin-top">
                    <view class="action">
                        <text class="cuIcon-fork text-blue" />
                        路况结构
                    </view>
                </view>
                <view class="margin-lr-xs grid margin-bottom margin-top text-center col-4">
                    <view v-for="(item, idx) in trail.condition" :key="idx" class="padding-tb-sm" :class="'bg-' + dict.trail_condition[idx + 1].color">
                        {{ dict.trail_condition[idx + 1].label }}
                    </view>
                </view>
                <view class="margin-lr-xs bg-white">
                    <view class="cu-progress striped active">
                        <view v-for="(item, idx) in trail.condition" :key="idx" :class="'bg-' + dict.trail_condition[idx + 1].color" :style="'width:' + item + '%'">
                            <view v-if="item > 0">
                                {{ item }}%
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view id="tabto1">
                <view class="cu-bar bg-gray solid-bottom margin-top">
                    <view class="action">
                        <text class="cuIcon-pic text-blue" />
                        途经描述
                    </view>
                </view>
                <view class="padding-lr-sm padding-top-sm solid-top">
                    <wxParse :content="trail.content" />
                </view>
            </view>
            <view id="tabto2">
                <view class="cu-bar bg-gray solid-bottom margin-top">
                    <view class="action">
                        <text class="cuIcon-explore text-orange" />
                        途经/周边 兴趣点介绍
                    </view>
                </view>
                <view v-if="poi.length">
                    <zz-poi-list :data-list="poi" />
                </view>
                <view v-else>
                    <view class="padding flex justify-center">
                        <text class="text-gray">
                            暂无相关信息...
                        </text>
                    </view>
                </view>
            </view>

            <view id="tabto3">
                <!-- 留言评论 START -->
                <!-- <view class="cu-bar bg-gray solid-bottom margin-top">
                    <view class="action">
                        <text class="cuIcon-message text-orange"></text>
                        {{ trail.name }}
                    </view>
                    <view class="action"><text class="margin-left-xs text-df">评论/反馈</text></view>
                </view> -->
                <!-- 留言评论 END -->
                <!-- 留言评论 START -->
                <!-- <view class="bg-gray"> -->
                <zz-blog ref="comment" :tid="trail._id" :is-can-reply="isWriter" />
                <!-- </view> -->
                <!-- 留言评论 END -->
            </view>

            <tui-divider />
            <tui-scroll-top :scroll-top="scrolled" />
			<zz-footer/>
        </block>
        <block v-else>
            <tui-loading :fixed="true" :index="3" type="green" />
        </block>

        <!-- #ifdef APP-PLUS -->
        <!-- 返回到轨迹记录的按钮 -->
        <!-- <back-to-line-track></back-to-line-track> -->
        <!-- #endif -->
    </view>
</template>

<script>
// import backToLineTrack from '@/components/backToLineTrack.vue'
// import { comm } from '@/comm/libs/mapbox/mbtool'

export default {
    components: {
        // backToLineTrack
    },

    data() {
        return {
            id: '',
            isWriter: false,  // 当前登录人是否是本详情作者
            mdone: false,
            platform: this.platform,
            dict: uni.getStorageSync('sys_dict'),
            customBar: this.CustomBar,
            statusBar: this.StatusBar,
            winHeight: this.WinHeight,
            headOpacity: 0,
            scrolled: 0,
            videoContext: null,
            videoBottom: 0,
            videoTop: 0,

            ismute: false,

            stickBarHeight: 0,
            load: true,

            // ver: 0,
            trail: null,
            pics: [],
            poi: [],

            tabList: [
                {
                    id: 0,
                    name: '指数信息',
                    sight: true
                },
                {
                    id: 1,
                    name: '线路描述',
                    sight: false
                },
                {
                    id: 2,
                    name: '兴趣点',
                    sight: false
                },
                {
                    id: 3,
                    name: '评论',
                    sight: false
                }
            ],
            curTab: 0,
            isTabTap: false
        };
    },
    onLoad({ id }) {
        this.id = id || uni.getStorageSync('lineTrackId')
        this.loadData()
    },
    onShow() {

    },
    onHide() {
        if (this.mdone) this.$refs.zmap.exec({ m: 'stopLoc' })
        if (this.videoContext) this.videoContext.pause()
        // this.trail = null
    },
    methods: {
        async loadData() {
            this.trail = null
            let _id = this.id
            this.trail = await this.zz.req({ $url: 'public/trail/info', _id })
            // console.log('获取到的线路的信息', this.trail);
            const userInfo = this.zz.getAcc()
            if (this.trail.userId === userInfo._id) {
                this.isWriter = true
            }
            this.zz.req({ $url: 'public/kml/info', _id: this.trail.kmlId, plain: true }).then(e => {
                this.trail._kml = e
                // console.log('kml================info==============', this.trail);
            })
            if (!this.trail.poi) {
                this.trail.poi = await this.zz.req({ $url: 'public/zz/near', kmlId: this.trail.kmlId, tar: 'poi', type: [4004, 4006, 4010, 4012], dist: 5000 });
            }
            let poi = [];
            for (let s of this.trail.poi) {
                poi.push(await this.zz.req({ $url: 'public/poi/info', _id: s._id || s }));
            }
            this.poi = poi;
			
			// console.log(poi);
            uni.$on('newComment'+_id, (params) => {
                // console.log('评论更新了', params);
                this.$refs.comment.init(); // 刷新评论列表
            });
        },
        useLine() {
            if (this.mdone) this.$refs.zmap.exec({ m: 'stopLoc' })
			
			return this.zz.href('/pages/nav/navApp', { kml: this.trail._kml, tmt: 0 }, 1, null, 'redirectTo')
			// #ifdef APP-PLUS
			this.zz.href('/pages/nav/navApp', { kml: this.trail._kml, tmt: 0 }, 1, null, 'redirectTo')
			// #endif
			
			// #ifndef APP-PLUS
			this.zz.href('/pages/nav/navH5', { kml: this.trail._kml, tmt: 0 }, 1)
			// #endif
            
        },
        //获取文字信息
        moveTo: function (e) {
            this.isTabTap = true;
            for (let k = 0; k < this.tabList.length; k++) {
                this.tabList[k].sight = this.tabList[k].id == e.target.id;
            }
            const tabheight = this.customBar + this.stickBarHeight - 1; //tab 栏的高度
            // console.log(tabheight+'|'+i+"|______________current_____________"+this.scrolled) //验证输出一下当前的滚动高度
            uni.createSelectorQuery()
                .select('#tabto' + e.target.id)
                .boundingClientRect((data) => {
                    uni.pageScrollTo({
                        scrollTop: data.top + this.scrolled - tabheight,
                        duration: 200,
                        complete: () => {
                            setTimeout(() => {
                                this.isTabTap = false;
                            }, 500);
                        }
                    });
                }).exec()
        },
        kmlMap: function (id) {
            this.zz.href('/pages/planning/map?name=' + encodeURI(this.trail.name));
        },
        bannerView: function (e) {
            this.zz.viewIMG(
                this.trail.imgs.map((e) => e.url),
                e.currentTarget.dataset.idx
            );
        },
        imgView: function (img) {
            this.zz.viewIMG([img], 0);
        },
        href(h) {
            this.zz.href(h);
        },
        userEvent(t) {
            this.zz.userEvent(t, 40, this.trail)
        }
    },
    onBackPress(event) {
        return false;
    },
    //监听滚动信息，并保存页面的滚动高度 this.scrolled
    onPageScroll: function (e) {
        this.scrolled = e.scrollTop;
        if (e.scrollTop <= 160) {
            this.headOpacity = e.scrollTop / 160;
        } else if (e.scrollTop > 160) {
            this.headOpacity = 1;
        }
        if (!this.stickBarHeight) {
            uni.createSelectorQuery()
                .select('.sticky-box')
                .boundingClientRect((data) => {
                    if (data.height) {
                        this.stickBarHeight = data.height;
                    }
                })
                .exec();
        }

        if (this.trail && this.trail.video.url) {
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
        if (this.load) {
            for (let i = 0; i < this.tabList.length; i++) {
                uni.createSelectorQuery()
                    .select('#tabto' + i)
                    .boundingClientRect((data) => {
                        this.tabList[i].top = data.top + e.scrollTop;
                        this.tabList[i].bottom = data.bottom + e.scrollTop;
                    })
                    .exec();
            }
            if (this.trail.video.url) {
                uni.createSelectorQuery()
                    .select('#tvideo')
                    .boundingClientRect((data) => {
                        this.videoBottom = data.bottom + e.scrollTop - this.customBar;
                        this.videoTop = data.top + e.scrollTop - this.customBar;
                    })
                    .exec();
            }
            this.load = false;
        }
        if (!this.isTabTap) {
            let scrollTop = e.scrollTop + (this.customBar + this.stickBarHeight);
            for (let i = 0; i < this.tabList.length; i++) {
                this.tabList[i].sight = scrollTop > this.tabList[i].top && scrollTop < this.tabList[i].bottom;
            }
        }
    },
    onShareAppMessage(res) {
        return {
            title: this.trail.title,
            path: '/pages/share?path=/pages/planning/detail&id=' + this.trail._id
        };
    }
};
</script>

<style>
page {
    z-index: 1;
}
.fixed {
    filter: alpha(Opacity=60);
    opacity: 1;
    position: absolute;
    z-index: 999;
}

.mybadge-left {
    /* border-radius: 200rpx; */
    position: absolute;
    top: -16rpx;
    left: -10rpx;
    font-size: 1.3rem;
    padding: 0rpx 10rpx;
    height: 38rpx;
    color: #ffffff;
}
/* */

.sticky-button-box {
    position: sticky;
    /* position: -webkit-sticky; */
    /* top: 240rpx; */
    /* left:200rpx; */
    /* margin-left: -375rpx; */
    z-index: 999;
}
</style>
