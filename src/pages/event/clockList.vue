<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-14 13:24:48
 * @FilePath: \sport-planing\src\pages\event\clockList.vue
 * @Description: 自助打卡赛 - 打卡列表
 * 

 https://s1.ax1x.com/2022/05/27/Xe6Nsx.jpg 已完成图标

https://s1.ax1x.com/2022/05/27/Xehzbn.png  已打卡图标

 https://s1.ax1x.com/2022/05/27/XecTAO.png 起点

https://s1.ax1x.com/2022/05/27/Xecq9H.png  终点

https://s1.ax1x.com/2022/05/27/XegQC4.png  坐标点

 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view class="container">
        <cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">打卡列表</block></cu-custom>
        <view>
            <!-- 地图 -->
            <view class="radius">
                <!-- #ifdef APP-PLUS || H5 || APP -->
                <!-- <zz-mapbox v-if="trail.kml.children" :kml="trail.kml"></zz-mapbox> -->
                <zz-map v-if="isMapReady" :line="trail.kml.lines" :point="trail.kml.points" @fullscreen="fullscreen"></zz-map>
                <!-- <zz-map v-if="isMapReady" :line="trail.kml.lines" :point="trail.kml.points" :winH="240"></zz-map> -->
                <!-- :kml="trail.kml" -->
                <!-- <zz-kml-nav></zz-kml-nav> -->

                <!-- #endif -->
                <!-- #ifdef MP -->
                <!-- <zz-kml-map v-if="trail.kml.children" :kml="trail.kml" :nav="true" @kmlMap="kmlMap"></zz-kml-map> -->
                <!-- #endif -->
            </view>
            <!-- v-if="trail.kml && trail.kml.points && trail.kml.points.length > 0" -->
            <view class="clock-list" v-if="isMapReady">
                <view class="clock-item" @click="gotoClock(item)" v-for="(item, index) in trail.kml.points" :key="index">
                    <!-- 已打卡标志 -->
                    <image v-if="item.isClock" class="complete-image" src="https://s1.ax1x.com/2022/05/27/Xehzbn.png" mode="aspectFit" />
                    <view class="wrapper">
                        <view class="image-wrapper">
                            <image v-if="item._id === 'startPoint'" class="image" src="https://s1.ax1x.com/2022/05/27/XecTAO.png" mode="aspectFit"></image>
                            <image v-if="item._id === 'endPoint'" class="image" src="https://s1.ax1x.com/2022/05/27/Xecq9H.png" mode="aspectFit"></image>
                            <!-- <image v-if="item._id.length > 12" class="image" src="https://s1.ax1x.com/2022/05/27/XegQC4.png" mode="aspectFit"></image> -->
                            <view v-if="item._id.length > 12" class="order-wrapper">{{ index }}</view>
                        </view>
                        <view class="info-wrapper">
                            <text class="main-title">{{ item.name }}</text>
                            <view v-if="item._id === 'startPoint'">
                                <text v-if="item.isClock" class="sub-title text-gray">开始时间:09:12</text>
                                <text v-else class="sub-title text-gray">暂未打卡</text>
                            </view>
                            <view v-else-if="item._id === 'endPoint'">
                                <text v-if="item.isClock" class="sub-title text-gray">结束时间:09:12</text>
                                <text v-else class="sub-title text-gray">暂未打卡</text>
                            </view>
                            <view v-else>
                                <!-- 00:{{ index + 2 }}:{{ 14 }} -->
                                <text v-if="item.isClock" class="sub-title text-gray">耗时{{ item.timeShow }}</text>
                                <text v-else class="sub-title text-gray">暂未打卡</text>
                            </view>
                        </view>
                    </view>
                    <view class="text-gray"><text class="cuIcon-right"></text></view>
                </view>
            </view>

            <!-- 平分的tab -->
            <!-- <scroll-view scroll-x class="bg-white nav">
                <view class="flex text-center">
                    <view
                        class="cu-item flex-sub"
                        :class="index == TabCur ? 'text-ztsgreen cur' : ''"
                        v-for="(item, index) in tabList"
                        :key="index"
                        @tap="tabSelect"
                        :data-id="index"
                    >
                        {{ item.title }}({{ item.list.length }})
                    </view>
                </view>
            </scroll-view> -->
            <!-- 
<view v-for="(item,index) in tabList" :key="index">
    
</view> -->
            <!-- <tui-list-view v-if="TabCur === 0" color="#777">
                <tui-list-cell @click="gotoClock(item)" v-for="(item, index) in tabList[0].list" :key="index" class="clock-list" arrow>
                    <view class="clock-list-item flex align-center">
                        <image class="image" src="/static/images/marker-icon.png" mode="aspectFit" />
                        <view class="clock-list-item-info-wrapper">
                            <view class="text-df">{{ item.name }}</view>
                            <view class="text-gray text-sm">距离：{{ getRandom() }}米</view>
                        </view>
                    </view>
                </tui-list-cell>
            </tui-list-view>
            <view v-if="TabCur === 0 && tabList[0].list.length === 0" class="empty-box">
                <image style="width: 500rpx" src="https://s1.ax1x.com/2022/05/26/XE466s.png" mode="aspectFit" />
                <view class="text text-gray text-sm">已完成全部打卡</view>
                <view class="padding response"><button class="cu-btn bg-ztsgreen response lg">查看成绩</button></view>
            </view> -->

            <!-- <tui-list-view v-if="TabCur === 1 && tabList[1].list.length > 0" color="#777">
                <tui-list-cell v-for="(item, index) in tabList[1].list" :key="index" class="clock-list" arrow>
                    <view class="clock-list-item flex align-center">
                        <image class="image" src="/static/images/marker-icon.png" mode="aspectFit" />
                        <view class="clock-list-item-info-wrapper">
                            <view class="text-df">{{ item.name }}</view>
                            <view class="text-gray text-sm">
                                <text class="margin-right-sm">已打卡</text>
                                <text>打卡时间:10:23</text>
                            </view>
                        </view>
                    </view>
                </tui-list-cell>
            </tui-list-view> -->
            <!-- <view v-if="TabCur === 1 && tabList[1].list.length === 0" class="empty-box">
                <image style="width: 500rpx" src="https://s1.ax1x.com/2022/05/26/XE466s.png" mode="aspectFit" />
                <view class="text text-gray text-sm">暂无已打卡</view>
                <view class="text text-gray margin-top">快去打卡吧~</view>
            </view> -->
        </view>
        <view class="cu-bar bg-white tabbar border shop foot">
            <button class="action text-grey">
                <view class="cuIcon-questionfill"></view>
                帮助
            </button>
            <!-- <view >
               
            </view> -->
            <view v-if="recordStatus === 0" class="bg-ztsblue submit cuIcon-activity">前往起点挑战本线路</view>
            <!-- <view v-else> -->
            <view v-if="recordStatus === 2" @click="gotoResult()" class="bg-ztsblue submit cuIcon-check">查看成绩</view>
            <view v-if="recordStatus === 1" class="bg-ztsgreen submit">
                <text class="cuIcon-countdown margin-right-xs"></text>
                耗时：{{ timeCount.hour }}:{{ timeCount.minute }}:{{ timeCount.second }}
            </view>
            <!-- </view> -->
        </view>
        <!-- <zz-bottom-btn @confirm="gotoResult"></zz-bottom-btn> -->
    </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
    onShow() {
        if (this.isMapReady) {
            this.getList();
        }
    },
    onShow() {
        this.loadData();
    },
    onLoad(option) {
        // console.log('store------state', this.$store.state.timeCount);

        uni.getLocation({
            isHighAccuracy: true,
            success: (localtion) => {
                // console.log('H5获取定位===', localtion);
            }
        });
        this.loadData(option.id, true);
        this.lineTrackId = option.id;
    },
    onReady() {
        this.getRandom();
    },
    computed: {
        ...mapState({
            timeCount: (state) => {
                return state.timeCount.timeCount;
            },
            recordStatus: (state) => {
                return state.timeCount.recordStatus;
            }
        })
    },
    data() {
        return {
            seconds: 0, // 挑战开始的秒
            timer: null,
            isEnd: false,
            lineTrackId: '',
            isMapReady: false,
            trail: null,
            TabCur: 0,
            tabList: [
                { title: '未打卡', list: [] },
                { title: '已打卡', list: [] }
            ]
        };
    },
    methods: {
        async loadData(lineTrackId, refresh) {
            try {
                const clockResultTrail = uni.getStorageSync('clockResultTrail');
                if (clockResultTrail) {
                    this.trail = clockResultTrail;
                } else {
                    if (!lineTrackId) {
                        return;
                    }
                    this.trail = await this.zz.req({ $url: 'public/trail/info', _id: lineTrackId });
                    let kml = await this.zz.req({ $url: 'public/kml/info', _id: this.trail.kmlId, plain: true, trans: 'gcj02' });
                    this.trail.kml.lines = kml.children.filter((e) => e.t1 == 1);
                    let startCoord = this.trail.kml.lines[0].coord[0]; // 起点坐标
                    let len = this.trail.kml.lines[0].coord.length;
                    let endCoord = this.trail.kml.lines[0].coord[len - 1]; // 终点坐标
                    this.trail.kml.points = kml.children.filter((e) => e.t1 == 2); // 打卡点
                    let startPoint = {
                        _id: 'startPoint',
                        t1: 2,
                        t2: 200,
                        coord: startCoord,
                        name: '起点',
                        imgs: [],
                        curTime: '2022-04-18 14:00',
                        kmlId: '625cfe760a84cf0001232535',
                        createTime: '2022-04-18 14:00:22',
                        updateTime: '2022-04-18 14:00:22'
                    };
                    let endPoint = {
                        _id: 'endPoint',
                        t1: 2,
                        t2: 200,
                        coord: endCoord,
                        name: '终点',
                        imgs: [],
                        curTime: '2022-04-18 14:00',
                        kmlId: '625cfe760a84cf0001232535',
                        createTime: '2022-04-18 14:00:22',
                        updateTime: '2022-04-18 14:00:22'
                    };
                    this.trail.kml.points.unshift(startPoint);
                    this.trail.kml.points.push(endPoint);
                    // console.log('获取到的trail的信息', this.trail);
                    uni.setStorageSync('clockResultTrail', this.trail);
                }
                if (refresh) {
                    clockResultTrail.kml.points.forEach((point) => {
                        point.isClock = false;
                        point.timeShow = '';
                    });
                    uni.setStorageSync('clockResultTrail', this.trail);
                }
                this.isMapReady = true;
                // console.log('isMapReady======', this.isMapReady);
            } catch (error) {
                //TODO handle the exception
                console.error('LoadData error========', error);
            }
            // console.log('打卡点列表', JSON.parse(JSON.stringify(this.trail.kml.points)));
            this.getList();
        },
        gotoResult() {
            uni.navigateTo({
                url: '/pages/event/clockResult',
                success: (res) => {
                    // console.log('跳转成功了==', res);
                },
                fail: (error) => {
                    console.error('跳转失败===', error);
                }
            });
        },
        getList() {
            try {
                let isAllClock = uni.getStorageSync('isAllClock');
                // console.log('获取到的打卡状态', isAllClock);
                if (isAllClock) {
                    this.tabList[0].list = [];
                    this.tabList[1].list = this.trail.kml.points;
                    uni.setStorageSync('isAllClock', false);
                } else {
                    this.tabList[0].list = [this.trail.kml.points[0]];
                    // console.log('获取到的线路信息', this.trail);
                    this.tabList[1].list = this.trail.kml.points.slice(1, this.trail.kml.points.length);
                }
            } catch (error) {
                console.error('getList Error=========', error);
            }
        },
        // 去打卡界面  item:当前打卡的点的信息
        gotoClock(item) {
            // console.log('当前的打卡点', item);
            uni.setStorageSync('currentClockPoint', item); // 当前的打卡点
            // uni.navigateTo({
            //     url: '/pages/event/clockDetails'
            // });
            uni.navigateTo({
                url: '/pages/event/selfClockDetails?id=' + this.trail._id
            });
        },
        getRandom() {
            let max = 10000;
            let min = 100;
            let dis = (Math.random() * (max - min)).toFixed(2);
            // console.log('随机数', (Math.random() * (max - min)).toFixed(2));
            return dis;
        },
        tabSelect(event) {
            // console.log("")
            this.TabCur = event.currentTarget.dataset.id;
        },
        fullscreen() {}
    }
};
</script>

<style lang="scss" scoped>
.order-wrapper {
    width: 60rpx;
    height: 60rpx;
    background-color: #cf1900;
    border-radius: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: #ffffff;
}

.container {
    background-color: #f1f1f1;
    // height: 800rpx;
    min-height: calc(100vh);
}
.clock-list {
    &-item {
        height: 80rpx;
        .image {
            width: 60rpx;
            height: 60rpx;
            margin-right: 20rpx;
        }

        &-info-wrapper {
            height: 80rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}

.empty-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 600rpx;
    .text {
        font-size: 1.8rem;
    }
}

.clock-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40rpx;
    margin-bottom: 120rpx;
    .clock-item {
        width: 690rpx;
        height: 120rpx;
        border-radius: 20rpx;
        background-color: #ffffff;
        margin-bottom: 30rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
        position: relative;

        .complete-image {
            position: absolute;
            left: 520rpx;
            top: 10rpx;
            // top: -20rpx;
            // right: -400rpx;
            // bottom: -10rpx;
            width: 100rpx;
            height: 100rpx;
        }

        .wrapper {
            display: flex;
            .image-wrapper {
                width: 100rpx;
                height: 100rpx;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                border: 1px solid #e2e2e2;
                border-radius: 20rpx;
                margin-right: 20rpx;
                .image {
                    width: 80rpx;
                    height: 60rpx;
                }
            }
            .info-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 10rpx 0;
                .main-title {
                    font-size: 1.8rem;
                    font-weight: bold;
                }
                .sub-title {
                    font-size: 1.2rem;
                }
            }
        }
    }
}
</style>
