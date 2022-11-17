<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-green" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">{{title}}</block>
        </cu-custom>
        <block v-if="loading">
            <!-- <tui-loadmore :fixed="true" :index="3" type="green"></tui-loadmore> -->
            <tui-skeleton v-if="loading" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>
        </block>
        <block v-else>
            <view class="cu-card no-card solid-bottom bg-gray">
                <view class="cu-item shadow">
                    <view class="cu-list menu-avatar ">
                        <view class="cu-item">
                            <view class="bg-white solid cu-avatar round lg" :style="'background-image:url('+poi.userInfo.headImg+');'" @tap="imgView(poi.userInfo.headImg)"></view>

                            <view class="content flex-sub">
                                <view class="title" :id="poi._id">
                                    <view class="text-cut text-lg">{{ poi.name }}</view>
                                </view>
                                <view class="text-gray text-sm flex justify-between">
                                    <view class="text-grey text-sm">
                                        位置：
                                        <text class="margin-lr-sm">{{ poi.addr||poi.name }}</text>
                                    </view>
                                    <view class="text-orange text-sm" @tap="goLocation()">
                                        <button class="cu-btn round bg-orange shadow sm">
                                            <text class="cuIcon-forward margin-right-xs"></text>
                                            地图
                                        </button>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <zz-user-event :obj="poi" @act="userEvent"></zz-user-event>
                </view>
                <view id="tvideo" v-if="poi.video&&poi.video.url">
                    <view class="cu-card case no-card">
                        <view class="shadow">
                            <view class="bg-video flex align-center" style="height: 420rpx;">
                                <video id="myVideo" loop :src="poi.video.url" :autoplay="true" :muted="false" :show-fullscreen-btn="true" :show-mute-btn="true" :show-play-btn="true" object-fit="cover">
                                </video>
                            </view>
                        </view>
                        <view class="padding-tb-xs bg-gray text-right" v-if="poi.video.desc">
                            <text class="text-cut text-sm text-grey margin-right-sm">{{poi.video.desc}}</text>
                        </view>
                    </view>
                </view>

                <view class="cu-item shadow">
                    <view class="padding-lr-sm padding-top-sm solid-top">
                        <wxParse :content="poi.content"></wxParse>
                    </view>
                </view>
            </view>
        </block>
        <block v-if="reffers.length">
            <view class="cu-bar bg-gray solid-bottom margin-top">
                <view class="action">
                    <text class="cuIcon-titles text-orange"></text> 相关路线
                </view>
            </view>
            <view class="cu-list sm-border menu" v-for="(item,index) in reffers" :key="index">
                <view class="cu-item" @tap="trailDetail(item._id)">
                    <view class="action">
                        <text class="cuIcon-title text-dark margin-right-xs"></text>
                    </view>
                    <view class="content">
                        <text class="text-grey margin-right-xs"> {{item.name}}</text>
                    </view>
                    <view class="action">
                        <text class="cuIcon-right text-gray margin-right-xs"></text>
                    </view>
                </view>
            </view>

            <zz-blog :ver="ver" :tid="poi._id"></zz-blog>
        </block>
        <tui-divider></tui-divider>
        <tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
        <zz-footer />

        <block v-if="tabbar">
            <view class="cu-tabbar-height"></view>
            <!--底部操作栏-->
            <view class="cu-bar bg-white tabbar border shop foot">
                <!-- <button class="action" open-type="contact" v-if="poi.contact">
				<view class="cuIcon-service text-green"></view>
				咨询
			</button> -->
                <view class="action" open-type="contact" @tap="call_" v-if="poi.contact">
                    <view class="cuIcon-phone text-green"></view>
                    咨询
                </view>
                <view class="action text-orange" @tap="goLocation()">
                    <view class="cuIcon-location"></view> 导航
                </view>
                <view class="action" :class="poi.isFavor?'text-orange':'text-gray'" @tap="userEvent(40,20,poi)">
                    <view class="cuIcon-favor"></view> {{poi.isFavor?'已收藏':'收藏'}}
                </view>
                <view class="bg-orange submit" @tap="order">{{btn}}</view>
            </view>
        </block>

    </view>
</template>

<script>
import { trans } from '@/comm/geotools'

export default {
    data() {
        return {
            qr: {},
            dict: uni.getStorageSync('sys_dict'),
            loading: true,
            scrolled: 0,
            ver: 0,
            title: '兴趣点',
            poi: {},
            reffers: [],
            tabbar: false,
            btn: "预 定"
        }
    },
    onLoad(qr) {
        this.qr = qr
    },
    mounted() {
        this.init()
    },
    onShow() {
        this.ver = uni.getStorageSync('VER') || 0
    },
    methods: {
        async init() {
            this.loading = true
            let poi = await this.zz.req({ $url: 'public/poi/info', _id: this.qr.id, ue: 1, ui: 1 })
            this.loading = false
            this.poi = poi
            this.reffers = await this.zz.req({ $url: 'public/zz/near', coord: poi.coord, tar: 'trail', dist: 3000 });
            console.log('this.dict---------------', this.dict, poi.level, poi.type[0]);
            // console.log('',);
            try {
                this.title = this.dict['poi_' + poi.level][poi.type[0]].text || "兴趣点"
            } catch (error) {

            }
        },
        goLocation: function (e) {
            let coord = trans(this.poi.coord)
            uni.openLocation({
                longitude: coord[0],
                latitude: coord[1],
                name: this.poi.addr || this.poi.name
            })
        },
        trailDetail(id) {
            this.zz.href('/pages/planning/detail?id=' + id)
        },
        order() {
            this.zz.toast('功能尚未启用！')
        },
        call_() {
            uni.makePhoneCall({
                phoneNumber: this.poi.contact.mobile
            })
        },
        userEvent(t) {
            console.log(this.poi);
            this.zz.userEvent(t, 20, this.poi)
        },
        imgView: function (img) { this.zz.viewIMG([img], 0) }
    },
    onPageScroll: function (e) {
        this.scrolled = e.scrollTop
        if (this.poi.video && this.poi.video.url) {
            if (!this.videoContext) {
                uni.createSelectorQuery().select('#tvideo').boundingClientRect(data => {
                    this.videoBottom = data.bottom - this.CustomBar
                    this.videoTop = data.top - this.CustomBar
                }).exec()
                this.videoContext = uni.createVideoContext('myVideo')
            } else {
                if (e.scrollTop >= this.videoBottom) {
                    this.videoContext.pause()
                } else if (e.scrollTop <= this.videoTop) {
                    this.videoContext.play()
                }
            }
        }
    },
    onShareAppMessage(res) {
        return {
            title: this.poi.name,
            path: '/pages/share?path=/pages/planning/poi&id=' + this.poi._id
        }
    }
}
</script>

<style>
</style>
