<template>

    <view>
        <view class="fixed text-white" :style="'opacity:' + (1 - headOpacity)">
            <cu-custom :isBack="true">
                <block slot="backText"></block>
                <block slot="content"></block>
            </cu-custom>
        </view>
        <view class="fixed" :style="'opacity:' + headOpacity">
            <cu-custom :isBack="true" bgColor="bg-green">
                <block slot="backText"></block>
                <block slot="content">{{ kml.name }}</block>
            </cu-custom>
        </view>

        <block v-if="loading">
            <tui-loading :fixed="true" :index="3" type="green"></tui-loading>
        </block>
        <block v-else>
            <block v-if="kml.imgs.length">
                <swiper class="screen-swiper round-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
                    <swiper-item v-for="(pic, index) in kml.imgs" :key="index" :data-index="index" @tap.stop="viewImg(kml.imgs, index)">
                        <image :src="pic" mode="aspectFill"></image>
                    </swiper-item>
                </swiper>
            </block>
            <block v-else>
                <view class="bg-gray cu-bar"></view>
            </block>

            <!-- 采集员/绘制人信息-->
            <block v-if="kml.userInfo">
                <view class=" padding-tb-xs">
                    <view class="flex align-center">
                        <view class="basis-xs">
                            <view class="padding-lr" @click="userInfo">
                                <view class="cu-avatar xl round" :style="'background-image:url('+(kml.userInfo.headImg||bd.sys.logo)+')'"></view>
                            </view>
                        </view>
                        <view class="basis-xl">
                            <view class="flex align-center justify-between">
                                <view @click="userInfo">
                                    <view>
                                        <text class="text-xl text-bold">{{ kml.userInfo.name||kml.userInfo.nickName }}</text>
                                    </view>
                                    <view class="padding-top-xs">
                                        <text class="text-sm text-gray">{{ kml.userInfo.desc||bd.sys.desc }}</text>
                                    </view>
                                </view>
                                <view class="padding-right">
                                    <button class="cu-btn round line-green sm" @click="follow">
                                        <text class="cuIcon-add">关注</text>
                                    </button>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </block>

            <!-- 线路的基本信息 -->
            <view class="bg-white solid-top solid-bottom flex flex-direction padding-top">
                <view class="text-xl padding-top">
                    <block v-if="kml.type==9">
                        <view class="bg-blue mybadge-left">{{ dict.kmlType[kml.type].label +'-'+ dict.kmlSt[kml.status].label }}</view>
                        <view class="bg-orange mybadge">{{ dict.kmlGrade[kml.grade || 1].label }}</view>
                    </block>
                    <block v-else>
                        <view class="bg-grey mybadge-left">{{ kml.dept }}</view>
                        <view class="bg-orange mybadge">{{ dict.kmlType[kml.type].label }}</view>
                    </block>
                    <text class="margin-left text-black text-bold">{{ kml.name }}</text>
                </view>

                <!-- <tui-divider width="60%" :height="40" :gradual="true"></tui-divider> -->

                <view class="padding-tb-xs bg-white text-gray text-right flex justify-between align-center">
                    <text class="margin-left text-sm text-gray">{{ kml.type==99? dict.kmlGrade[kml.grade].label : zz.time2Date(kml.createTime,'Y-M-D h:m') }}</text>
                    <zz-user-event :ui="false" :obj="kml" @act="userEvent" @share="zhouweiShare"></zz-user-event>
                </view>
            </view>
            <block v-if="kml.type == 99">
                <view class="bg-white padding-sm flex flex-wrap justify-center">
                    <view class="basis-sub">
                        <button class="cu-btn round block lines-orange lg" @click="href('/pages/comm/kml?_id='+kml.kmlId)">原始采集数据</button>
                    </view>
                </view>
            </block>

            <block v-if="kml.type == 9">
                <!-- 线路长度和爬升下降距离 -->
                <view class="padding bg-olive" v-if="kml.info">
                    <view class="padding-tb flex justify-around align-center text-center text-grey bg-yellow light shadow">
                        <view class="flex flex-direction solid-right padding-right-xs length-wrapper">
                            <view class="text-xxl text-orange">{{ (kml.info.len / 1000).toFixed(2) }}</view>
                            <view class="bg-orange cu-tag badge margin-right-sm badge-block">km</view>
                            <view class="margin-top-sm text-red">长度</view>
                        </view>
                        <view class="solid-right padding-right flex align-center flex-direction">
                            <view class="text-lg margin-top-xs text-blue nav">
                                <text class="cuIcon-top" />
                                {{ kml.info.top }}
                                <text class="cuIcon-down" />
                                {{ kml.info.bottom }} m
                            </view>
                            <view class="text-blue margin-top-sm">海拔</view>
                        </view>
                        <view class="flex flex-direction align-center">
                            <view class="text-lg margin-top-xs text-blue nav">↑{{ kml.info.up }} ↓{{ kml.info.down }} m</view>
                            <view class="text-green margin-top-sm">累计</view>
                        </view>
                    </view>
                </view>
                <view class="solid-bottom flex flex-direction padding">
                    <block v-if="kml.desc">
                        <view class="pre-line text-gray">{{ kml.desc }}</view>
                    </block>

                    <view class="padding-top-sm flex align-center" v-if="kml.ways">
                        <view class="basis-xs text-center">
                            <text class="text-brown">途经</text>
                        </view>
                        <view class="basis-xl">
                            <text class="text-dark">{{ kml.ways }}{{ kml.ways }}</text>
                        </view>
                    </view>
                    <view class="padding-top-xs flex align-center">
                        <view class="basis-xs text-center">
                            <text class="text-brown">时间</text>
                        </view>
                        <view class="basis-xl">
                            <text class="text-gray">{{ zz.time2Date(kml.startTime,'Y-M-D h:m') +' — '+ zz.time2Date(kml.endTime,'M-D h:m') }}</text>
                        </view>
                    </view>
                    <view class="padding-top-xs flex align-center">
                        <view class="basis-xs text-center">
                            <text class="text-brown">耗时</text>
                        </view>
                        <view class="basis-xl">
                            <text class="text-gray">{{ zz.formatDuring((kml.duration/60) * 1000,true) }}</text>
                        </view>
                    </view>
                </view>

                <!-- 使用路线 -->
                <view style="width: 380rpx" :style="{ top: customBar + 'px', left: '200rpx' }" class="padding-tb flex flex-direction justify-center align-center sticky-button-box">
                    <button style="width: 280rpx" class="shadow cu-btn bg-green lg round" @click="useLine">
                        <text class="zzIcon-distfill margin-right-sm" />
                        使用路线
                    </button>
                </view>

                <view class="cu-bar bg-white solid-bottom">
                    <view class="action">
                        <text class="cuIcon-titles text-blue"></text>
                        景观元素
                    </view>
                </view>
                <!-- 景观元素 -->
                <view class="padding-lr bg-white solid-bottom">
                    <view class="grid text-center col-1">
                        <view class="bg-white">
                            <view class="flex align-center">
                                <view class="flex-treble padding-xs radius">
                                    <view class="flex flex-wrap align-center">
                                        <view class="padding-xs" v-for="(x, idx) in kml.element" :key="idx">
                                            <view class="cu-tag bg-green round lg">{{ dict.trail_element[x]?dict.trail_element[x].label:'?' }}</view>
                                            <!-- <view class="cu-tag" :class="'bg-green'">{{ dict.trail_element[x].label }}</view> -->
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 体验评分 -->
                <view id="tabto0" class="bg-white">
                    <view class="cu-bar solid-bottom">
                        <view class="action">
                            <text class="cuIcon-titles text-blue"></text>
                            印象评分
                        </view>
                    </view>
                    <view class="solid-bottom padding-tb-sm">
                        <block v-for="(e, idx) in zz.toArr(dict.trail_ip)" :key="idx">
                            <view class="cu-list menu bg-white sm-border card-menu">
                                <view class="flex padding-xs align-center">
                                    <view class="margin-xs radius flex align-center" style="column-gap: 20rpx">
                                        <text class="cuIcon-btn text-olive"></text>
                                        <view class="text-grey" style="min-width: 4em">{{ e.label }}</view>
                                        <tui-rate :current="kml.score[idx]" :disabled="true"></tui-rate>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
            </block>

            <block v-if="kml.start">
                <zz-kml-nav class="solid-top" :kml="kml"></zz-kml-nav>
            </block>

            <view class="cu-bar bg-white solid">
                <view class="action">
                    <text class="cuIcon-titles text-blue"></text>
                    线路概览
                </view>
            </view>
            <!-- 地图组件 -->

            <view id="zmap" :class="current==-1?'':'sticky-box'" :style="[{ top: customBar + 'px' }]">
                <zz-map :cur="cur" :line="kml.t1" :point="kml.t2" :refKml="refKml" :winH="mapHeight"></zz-map>
            </view>

            <view class="solid-bottom" :class="current==-1?'':'sticky-box'" :style="[{ top: current==-1?0:(customBar+mapHeight) + 'px' }]">
                <tui-collapse :index="0" :current="current" :disabled="!kml.t1.length" @click="change3">
                    <template v-slot:title>
                        <tui-list-cell :hover="true">
                            <text class="zzIcon-dist text-blue"></text>
                            <text class="padding-left-sm">轨迹
                                <text class="text-gray text-sm margin-lr-sm">{{kml.line.num+'条 '+kml.line.len/1000+'km'}}</text>
                            </text>
                        </tui-list-cell>
                    </template>
                    <template v-slot:content>
                        <scroll-view :scroll-y="true" :style="'height: '+scrollWin[0]+'px;'">
                            <view id="tab0" class="bg-gray padding-sm">
                                <view class="cu-list">
                                    <block v-for="(t1, index) in kml.t1" :key="index">
                                        <view class="cu-item solid-top line-wrapper light" :class="'bg-' + (t1._id==cur._id? 'blue' : 'white')">
                                            <view class="content padding-tb-xs" @click="active(t1)">
                                                <view>
                                                    <text class="cuIcon-link margin-lr-sm"></text>
                                                    {{ t1.name }}
                                                </view>
                                                <view class="text-gray text-sm">
                                                    <text class="cuIcon-infofill margin-lr-sm"></text>
                                                    长度
                                                    <text class="text-orange margin-right-xs">{{ t1.info.len }}</text>
                                                    海拔
                                                    <text class="cuIcon-top text-orange">{{ t1.info.top }}</text>
                                                    <text class="cuIcon-down text-orange margin-right-xs">{{ t1.info.bottom }}</text>
                                                    累计 ↑
                                                    <text class="text-orange">{{ t1.info.up }}</text>
                                                    ↓
                                                    <text class="text-orange">{{ t1.info.down }}</text>
                                                </view>
                                            </view>
                                            <view class="mybadge cu-tag" :style="'background:'+dict.prop[t1.t2].color"><text class="text-black">{{ dict.prop[t1.t2].text }}</text></view>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </scroll-view>
                    </template>
                </tui-collapse>
            </view>
            <view :class="current==-1?'':'sticky-box'" :style="[{ top: current==-1?0:((customBar+mapHeight+45)+(current==0?scrollWin[0]:0)) + 'px' }]">
                <tui-collapse :index="1" :current="current" :disabled="!kml.t2.length" @click="change3">
                    <template v-slot:title>
                        <tui-list-cell :hover="true">
                            <text class="cuIcon-location text-blue"></text>
                            <text class="padding-left-sm">坐标
                                <text class="text-gray text-sm margin-lr-sm">{{kml.t2.length+'个'}}</text>
                            </text>
                        </tui-list-cell>
                    </template>
                    <template v-slot:content>
                        <scroll-view :scroll-y="true" :style="'height: '+ scrollWin[1] +'px;'">
                            <view id="tab1" class="bg-gray">
                                <view class="cu-list menu-avatar padding-sm">
                                    <block v-for="(t2, idx) in kml.t2" :key="idx">
                                        <view class="cu-item solid-top" :style="'background:'+(t2._id==cur._id?'#cce6ff':'#FFF')">
                                            <view class="cu-avatar lg" :style="'background-image:url('+icon[t2.t2]+')'" @click="active(t2)"></view>
                                            <view class="content" @click="active(t2)">
                                                <view class="text-grey">
                                                    <view class="text-dark text-bold">{{t2.sn||t2.name}}</view>
                                                    <view class="padding-left-xs text-grey text-xs">{{dict.prop[t2.t2].text}}</view>
                                                </view>
                                                <view class="text-gray text-sm flex">
                                                    <view class="text-cut">
                                                        <text class="cuIcon-info text-grey margin-right-xs"></text>
                                                        {{t2.desc||t2.curTime||t2.curName}}
                                                    </view>
                                                </view>
                                            </view>
                                            <view class="action" @click="active(t2, idx)">
                                                <text class="cuIcon-pic text-grey" v-if="t2.imgs.length">{{ t2.imgs.length }}</text>
                                                <text class="cuIcon-record text-grey" v-if="t2.video"></text>
                                                <view class="text-grey text-xs">详情</view>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                            </view>
                        </scroll-view>
                    </template>
                </tui-collapse>
            </view>

            <!-- 评论留言 -->
            <!-- <zz-blog :blog="blog"></zz-blog> -->
            <zz-blog class="solid" :ver="ver" :tid="kml._id" :tt="100"></zz-blog>
            <!-- <tui-scroll-top :scrollTop="scrolled"></tui-scroll-top> -->
            <zz-footer />

        </block>
    </view>
</template>

<script>
import icon from '@/comm/libs/icon.js';
import { reArr } from '@/comm/geotools';

import appShare, { closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare';


export default {
    data() {
        return {
            bd: this.bd,
            cur: {},
            dict: uni.getStorageSync('sys_dict'),
            winH: this.WinHeight,
            platform: this.platform,
            customBar: this.CustomBar,
            mapHeight: this.WinHeight * 0.4,

            scrolled: 0,
            loading: true,
            headOpacity: 0,

            icon,
            kml: {},
            refKml: {},

            ver: 0,
            current: -1,
            scrollWin: [0, 0]
        }
    },
    async onLoad({ _id, sn, v } = q) {
        if (v) {
            this.kml = this.zz.getParam(v)
        } else {
            this.kml = await this.zz.req({ $url: 'public/kml/info', _id, plain: true, chart: true })
        }
        uni.setNavigationBarTitle({ title: this.kml.name })

        this.loading = false

        if (this.kml.type == 99) {
            setTimeout(async () => {
                this.refKml = await this.zz.req({ $url: 'public/layout/around', _id: this.kml.t1[0]._id })
            }, 3500)
        }
        console.log(this.kml);
    },
    mounted() { },
    onShow() { this.ver = uni.getStorageSync('VER') || 0 },
    methods: {
        active(e, idx) {
            this.cur = e
            if (idx != undefined) {
                this.zz.href('/pages/comm/point', { kml: this.kml, refKml: this.refKml, idx })
            }
        },
        href(e) { this.zz.href(e) },
        viewImg(p, i) { if (p && p.length) this.zz.viewIMG(p, i) },

        change3(e) {
            if (!this.scrollWin[0]) {
                const setS = (i) => {
                    let validH = this.winH - this.mapHeight - 45 * (i + 1) - this.customBar
                    uni.createSelectorQuery().select('#tab' + i).boundingClientRect((x) => {
                        if (x) {
                            this.scrollWin[i] = x.height > validH ? validH : x.height
                        }
                    }).exec()
                }
                setS(0)
                setS(1)
            }

            this.isTabTap = true
            setTimeout(() => {
                uni.createSelectorQuery().select('#zmap').boundingClientRect((x) => {
                    uni.pageScrollTo({
                        scrollTop: x.top + this.scrolled - this.customBar,
                        duration: 100,
                        complete: () => {
                            setTimeout(() => { this.isTabTap = false }, 100)
                        }
                    })
                }).exec()
            }, 300)
            // this.current = this.current == e.index ? -1 : e.index
            setTimeout(() => { this.current = (this.current == e.index ? -1 : e.index) }, 10);
        },
        userEvent(t) {
            this.zz.userEvent(t, this.kml.type == 99 ? 99 : 100, this.kml)
        },
        userInfo() {
            this.zz.profile(this.kml.userId)
        },
        async follow() {
            const ueRes = await this.zz.userEvent(60, 60, this.kml.userInfo)
            if (this.kml.userInfo.isFollow) {
                this.zz.toast('关注成功~')
            } else {
                this.zz.toast('已取消关注')
            }
        },
        useLine() {
            let url = '/pages/nav/nav'

            // #ifdef H5
            url += 'H5'
            // #endif

            // #ifdef APP-PLUS
            url += 'App'
            // #endif
            let t200 = this.kml.t2.filter(e => e.t2 == 200)
            this.zz.href(url, { kml: { ...this.kml, children: [...this.kml.t1, ...t200] } }, 1)
        },
        // 执行分享
        zhouweiShare() {
            let cur = this.kml;
            const params = `path=/pages/comm/kml&_id=${this.kml._id}`
            let shareData = {
                shareUrl: `https://zts.5618.co/h5/#/pages/share?${params}`,
                shareTitle: cur.name,
                shareContent: cur.desc || '我分享了一条线路快来看看~',
                shareImg: 'https://zts.5618.co/repo/shareLogo.png',
                appId: "wx5043dab28d7cf44c",
                type: 0,
                appWebUrl: `https://zts.5618.co/h5/#/pages/share?${params}`
            };
            // 调用
            let shareObj = appShare(shareData, res => {
                console.log("分享成功回调", res);
                // 分享成功后关闭弹窗
                // 第一种关闭弹窗的方式
                closeShare();
            });
            setTimeout(() => {
                // 第二种关闭弹窗的方式
                shareObj.close();
            }, 5000);
        }
    },
    onPageScroll(e) {
        if (!this.isTabTap) {
            this.scrolled = e.scrollTop
            if (e.scrollTop <= 160) {
                this.headOpacity = e.scrollTop / 160
            } else if (e.scrollTop > 160) {
                this.headOpacity = 1
            }
        }
    }
};
</script>

<style lang="scss" scoped>
page {
    background-color: #ffffff;
}
body {
    background-color: #ffffff;
}

.fixed {
    filter: alpha(Opacity=60);
    // -moz-opacity: 1;
    position: absolute;
    z-index: 999;
}

.mybadge {
    position: absolute;
    top: 0rpx;
    right: 0rpx;
    font-size: 26rpx;
    padding: 0rpx 10rpx;
    height: 38rpx;
    .round {
        border-radius: 200rpx 0 0 200rpx;
    }
}

.mybadge-left {
    border-radius: 0 200rpx 200rpx 0;
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    font-size: 26rpx;
    padding: 0rpx 10rpx;
    height: 38rpx;
}

.length-wrapper {
    position: relative;
    min-width: 6em;
    padding-right: 50rpx;

    .badge-block {
        right: -10rpx;
        position: absolute;
    }
}
.sticky-button-box {
    position: sticky;
    z-index: 999;
}
</style>
