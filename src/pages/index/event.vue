<template>
    <page-meta :root-font-size="globalData.zlbCfg.fontSize">
    </page-meta>
    <view>
        <view class="UCenter-bg">
            <!-- 右上角信息 -->
            <view class="setting-icon" @click="loadData(1)">
                <button class="cu-btn cuIcon">
                    <text class="bg-green round" :class="num.tCount<tNum?'cuIcon-loading2 cuIconfont-spin':'cuIcon-refresh'"></text>
                </button>
            </view>
            <!-- #ifdef APP-PLUS -->
            <view class="status-mask"></view>
            <!-- #endif -->

            <view class="flex justify-start margin-top padding-top-xl">
                <block v-if="!user">
                    <view class="margin-top flex align-center padding content" @tap="zz.href('/pages/comm/account/login',{back:true})">
                        <view class="cu-avatar radius">
                            <text class="cuIcon-people" />
                        </view>
                        <view class="padding-left">

                            <!-- #ifndef H5-ZLB -->
                            <!-- #ifdef APP-PLUS || H5 -->
                            <text>注册/登录</text>
                            <!-- #endif -->
                            <!-- #endif -->

                            <!-- #ifdef H5-ZLB -->
                            <text>授权/登录</text>
                            <!-- #endif -->
                        </view>
                        <view class="margin-left-xs cuIcon-right" />
                    </view>
                </block>
                <block v-else>

                    <view class="margin-top padding flex align-center content" @tap="zz.href('/pages/my/profile/profile')">
                        <view class="cu-avatar radius" :style="'background-image:url(' + user.headImg + ')'"></view>
                        <view class="padding-left">{{ user.nickName }}</view>
                    </view>

                </block>
            </view>
            <!-- <view v-if="addr" class="padding-left">
				<text class="cuIcon-locationfill "></text>
				<text>{{addr.formatted_address}}</text>
			</view> -->
            <view class="flex text-center margin-top-xs">
                <view v-for="(item, index) in recInfoList" :key="index" class="flex flex-sub flex-direction" @click="zz.href(item.path,null,1)">
                    <view class="text-df text-bold text-orange">
                        {{ item.title }}
                    </view>
                    <view class="margin-top-sm">
                        <text class="text-bold text-white">
                            {{ num[item.k] }}
                        </text>
                    </view>
                </view>
            </view>
            <image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/8bc9ef00-9903-11ea-b244-a9f5e5565f30.gif" mode="scaleToFill" class="gif-wave"></image>
        </view>
        <!-- <zz-map ref="zmap" :pms="trail._kml.children"></zz-map> -->
        <view class="padding flex align-end text-center text-grey bg-white shadow-warp">
            <view class="text-orange flex flex-sub flex-direction solid-right" @click="zz.href('/pages/comm/nodata',null,1)">
                <view class="flex align-end justify-center">
                    <view class="text-xxl">{{num.poi}}</view>
                    <view class="text-df text-gray">/</view>
                    <view class="text-sm">{{num.tCount}}</view>
                </view>
                <view class="margin-top-sm">
                    <text class="zzIcon-zuji text-bold"></text>
                    足迹
                </view>
            </view>
            <view class="text-blue flex flex-sub flex-direction solid-right">
                <view class="text-xxl">{{num.event}}<text class="text-xs padding-left-xs">次</text></view>
                <view class="margin-top-sm">
                    <text class="zzIcon-jiangbei text-bold padding-xxs"></text>
                    完赛
                </view>
            </view>
            <view class="text-green flex flex-sub flex-direction">
                <view class="text-xxl">{{num.top}} <text class="text-xs padding-left-xs">次</text></view>
                <view class="margin-top-sm">
                    <text class="zzIcon-targetcircle text-bold"></text>
                    登顶
                </view>
            </view>
        </view>

        <view class="event-card">
            <view class="bg-image radius">
                <view v-for="(item,index) in menu" :key="index" class="event-btn-item" :class="index<3?'border-bottom-grey':''">
                    <view class="flex flex-direction justify-center align-center event-btn" @click="href(index)">
                        <view class="text-xl">{{item.name}}</view>
                        <view class="padding-top-xs text-sm text-gray">{{item.text}}</view>
                        <!-- <text class="cuIcon-titles">扫码</text> -->
                    </view>
                </view>
            </view>
        </view>
        <view class="flex justify-center margin-sm text-grey">
            <text class="zzIcon-sport-110 margin-lr-xxs"></text>
            <text class="text-sm">用脚步丈量步道，用激情登顶山峰</text>
        </view>

        <!-- </scroll-view> -->
    </view>
</template>

<script>
import { uniqId, getLocation, trans, isSame } from '@/comm/geotools'
import comm from '@/comm/comm'
import sync from '@/comm/sync'
export default {
    data() {
        return {
            globalData: getApp().globalData,
            tNum: 99999,
            num: {
                event: 0, //  赛事
                top: 0, //  登顶
                rec: 0,  // 轨迹
                poi: 0, //  兴趣点 
                imgs: 0,// 照片
                video: 0,

                tCount: 0,
            },

            addr: null,
            user: null,
            loading: 0,

            recInfoList: [
                {
                    title: '轨迹',
                    path: '/pages/nav/rec/line',
                    k: 'rec'
                },
                {
                    title: '兴趣点',
                    path: '/pages/nav/rec/point',
                    k: 'poi'
                },
                {
                    title: '照片',
                    path: '/pages/nav/rec/picture',
                    k: 'imgs'
                },
                {
                    title: '视频',
                    path: '/pages/comm/nodata',
                    k: 'video'
                }
            ],
            menu: [
                {
                    name: '足迹',
                    url: '/pages/nav/navApp',
                    icon: 'cuIcon-upstage',
                    text: '扫码步道柱记录足迹'
                },
                {
                    name: '自助赛',
                    // url: '/pages/event/tounament',
                    url: '/pages/comm/nodata?title=自助赛',
                    icon: 'cuIcon-selection',
                    text: '打卡特定柱号路线'
                },
                {
                    name: '登顶打卡',
                    // url: '/pages/event/point',
                    url: '/pages/comm/nodata?title=登顶打卡',
                    icon: 'cuIcon-calendar',
                    text: '打卡人气山峰/兴趣点'
                },
                {
                    name: '排行榜',
                    url: '/pages/event/ranking',
                    icon: 'cuIcon-like',
                    color: 'rgba(255, 170, 0, 0.7)',
                    text: '成绩排名'
                }
            ],
        }
    },
    onShow() {
        this.loadData(!this.num.tCount)
    },
    methods: {
        async loadData(init) {
            this.user = this.zz.getAcc()
            let net = comm.hadNet()
            if (init) {
                if (!net) return this.zz.toast('没有网络~')
                for (let k in this.num) {
                    this.num[k] = 0
                }
                this.zz.req({ $url: '/public/chart/info', trSt: 50 }).then(e => {
                    this.tNum = e
                    this.numDH('tCount', e)
                })
                comm.on()
            }
            if (net) {
                if (this.user) {
                    //更新离线足迹
                    if (!this.loading) {
                        this.loading = 1
                        await sync.go()
                        let log = uni.getStorageSync('user_scan_log') || {}
                        if (log.temp) {
                            let t = this.zz.clone(log.temp)
                            for (var i = 0; i < t.length; i++) {
                                await zz.req({ $url: '/admin/comm/scan', ...t[i] }, true).then(x => {
                                    log.temp.splice(1, i)
                                    uni.setStorageSync('user_scan_log', log)
                                })
                            }
                        }
                        this.loading = 0
                    }
                    this.zz.req({ $url: '/user/person/info' }).then(e => {
                        for (let k in e) {
                            this.numDH(k, e[k])
                        }
                    })
                }
            }
        },
        numDH(k, n, i = 0, inc) {
            if (!inc) inc = Math.ceil(n / 70)
            if (this.num[k] < n && i < 70) {
                setTimeout(() => {
                    i++
                    this.num[k] += inc
                    this.numDH(k, n, i, inc)
                }, 10)
            } else {
                this.num[k] = n
            }
        },
        href(idx) { this.zz.href(this.menu[idx].url, 0, 1) },
    },
    async onPullDownRefresh() {
        await this.loadData(1)
        uni.stopPullDownRefresh()
    },
    onBackPress() { return true }
};
</script>

<style lang="scss" scoped>
@import './eventScss.scss';
</style>
