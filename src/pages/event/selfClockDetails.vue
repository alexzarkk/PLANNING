<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-06-14 14:40:31
 * @FilePath: \sport-planing\src\pages\event\selfClockDetails.vue
 * @Description: 
 * 
 * 
-->
<template>
<page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">自助打卡</block>
        </cu-custom>
        <view class="container">
            <!-- 地图 -->
            <view class="radius">
                <!-- #ifdef APP-PLUS || H5 -->
                <zz-map v-if="isMapReady && trail && trail.kml" ref="zzmbox" :line="trail.kml.lines" :point="trail.kml.points" @fullscreen="fullscreen"></zz-map>
                <!-- <zz-mapbox v-if="trail.kml.children" :kml="trail.kml"></zz-mapbox> -->
                <!-- v-if="trail.kml.lines" :line="trail.kml.lines" :point="trail.kml.points" -->
                <!-- v-if="isMapReady" :line="trail.kml.lines" :point="trail.kml.points"  -->
                <!-- <zz-map v-if="isMapReady" :line="trail.kml.lines" :point="trail.kml.points" :winH="500"></zz-map> -->
                <!-- :kml="trail.kml" -->
                <!-- <zz-kml-nav></zz-kml-nav> -->
                <!-- #endif -->
                <!-- #ifdef MP -->
                <zz-kml-map v-if="trail&&trail.kml && trail.kml.children" :kml="trail.kml" :nav="true" @kmlMap="kmlMap"></zz-kml-map>
                <!-- #endif -->
            </view>
            <!-- <view class="info-box">
                <view>当前位置:</view>
                <view>目标位置:</view>
                <view>距离:</view>
            </view> -->
            <!-- 打卡点距离信息 -->
            <view class="warning-message bg-orange light">
                <!-- <text class="warning-message-text" v-if="loc">当前位置：{{ loc[0] }},{{ loc[1] }}</text>
			<text class="warning-message-text">目标位置：{{ Number(pm.coord[0]).toFixed(6) }},{{ Number(pm.coord[1]).toFixed(6) }}</text> -->
                <text class="warning-message-text">当前位置：121.426833,29.675277</text>
                <text class="warning-message-text">目标位置：120.549082,27.882264</text>
                <!-- <text :class="distance<=150?'success-message-text':'danger-message-text'" style="font-size: 1.8rem; font-weight: bold;">距离：{{ distance }}m</text> -->
                <text class="text-df text-bold" :class="distance <= 150 ? 'success-message-text' : 'danger-message-text'">距离：{{ distance }}m</text>
                <text class="text-df text-bold" :class="distance <= 150 ? 'success-message-text' : 'danger-message-text'">已在打卡范围内</text>
                <button class="cu-btn round response bg-ztsgreen lg" @click="getClock" :disabled="isNotClock">打卡</button>
            </view>
            <!-- <view>
                打卡点照片:
                <image src=""></image>
            </view> -->
            <!-- 起点打卡成功对话框 -->

            <view v-if="isMapReady" class="cu-modal" :class="modalName === 'start' ? 'show' : ''">
                <view class="cu-dialog">
                    <view class="success-wrapper">
                        <view class="icon-wrapper">
                            <text class="cuIcon-roundcheckfill text-green"></text>
                        </view>
                        <view class="clock-success">起点打卡成功</view>
                        <view class="time">
                            已开始计时，快快全速前进吧~
                            <!-- 已用时 -
                            <text class="text-ztsgreen">15:38</text> -->
                        </view>
                        <view class="local">
                            下一个打卡点 -
                            <text class="text-ztsgreen">常照</text>
                        </view>
                        <view class="order">
                            打卡:
                            <text v-if="trail && trail.kml" class="text-xxl text-ztsgreen">{{ pointIndex + 1 }}</text>
                            {{ trail.kml.points.length }}
                            <!-- 本打卡点
                        <text class="text-ztsgreen text-bold">第258</text>
                        位 -->
                        </view>
                    </view>
                    <view class="cu-bar bg-white">
                        <view class="action margin-0 flex-sub solid-left" @tap="backToList">确定</view>
                    </view>
                </view>
            </view>

            <view class="cu-modal" :class="modalName == 'end' ? 'show' : ''">
                <view class="cu-dialog">
                    <view class="success-wrapper">
                        <view class="icon-wrapper">
                            <text class="cuIcon-roundcheckfill text-green"></text>
                        </view>
                        <view class="clock-success">恭喜，完成挑战</view>
                        <view class="time">
                            总用时 -
                            <text class="text-ztsgreen">15:38</text>
                        </view>
                        <!-- <view class="local">
                            打卡点 -
                            <text class="text-ztsgreen">常照</text>
                        </view> -->
                        <view class="order">
                            确定返回上一级领取证书
                            <!-- 打卡:
                            <text class="text-xxl text-ztsgreen">6</text>
                            /6 -->
                        </view>
                    </view>
                    <view class="cu-bar bg-white">
                        <view class="action margin-0 flex-sub solid-left" @tap="backToList">确定</view>
                    </view>
                </view>
            </view>

            <!-- 打卡成功对话框
            
            <view class="bg-img" style="background-image: url('https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg'); height: 200px">
                    <view class="cu-bar justify-end text-white">
                        <view class="action" @tap="hideModal">
                            <text class="cuIcon-close"></text>
                        </view>
                    </view>
                </view> 
             -->
            <view v-if="isMapReady" class="cu-modal" :class="modalName === 'point' ? 'show' : ''">
                <view class="cu-dialog">
                    <view class="success-wrapper">
                        <view class="icon-wrapper">
                            <text class="cuIcon-roundcheckfill text-green"></text>
                        </view>
                        <view class="clock-success">打卡成功</view>
                        <view class="time">
                            已用时 -
                            <text class="text-ztsgreen">15:38</text>
                        </view>
                        <view class="local">
                            下一个打卡点 -
                            <text class="text-ztsgreen">{{ nextPoint.name }}</text>
                        </view>
                        <view v-if="trail && trail.kml && trail.kml.points" class="order">
                            打卡:
                            <text class="text-xxl text-ztsgreen">{{ pointIndex + 1 }}</text>
                            {{ trail.kml.points.length }}
                            <!-- 本打卡点
                        <text class="text-ztsgreen text-bold">第258</text>
                        位 -->
                        </view>
                    </view>
                    <view class="cu-bar bg-white">
                        <view class="action margin-0 flex-sub solid-left" @tap="backToList">确定</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    onLoad(option) {
        this.loadData(option.id);
    },
    onReady() {},
    data() {
        return {
            pointIndex: 0, // 当前打卡点的索引
            modalType: 'point', // 打卡点模式  默认普通打卡点
            pointInfo: null, // 当前的打卡点的信息
            nextPoint: {
                name: ''
            }, // 下一个打卡点的信息
            modalName: '', // 当前展示的
            isNotClock: false,
            distance: 137, //到打卡点的距离
            isMapReady: false,
            trail: null
        };
    },
    methods: {
        async loadData(lineTrackId) {
            this.pointInfo = uni.getStorageSync('currentClockPoint');

            if (this.pointInfo._id === 'startPoint') {
                // 起点打卡
                this.modalType = 'start';
            }

            if (this.pointInfo._id === 'endPoint') {
                // 起点打卡
                this.modalType = 'end';
            }
            this.trail = await this.zz.req({ $url: 'public/trail/info', _id: lineTrackId });
            let kml = await this.zz.req({ $url: 'public/kml/info', _id: this.trail.kmlId, plain: true, trans: 'gcj02' });
            this.trail.kml.lines = kml.children.filter((e) => e.t1 == 1);
            this.trail.kml.points = kml.children.filter((e) => e.t1 == 2); // 打卡点
            const trail = uni.getStorageSync('clockResultTrail');
            if (trail) {
                this.trail = trail;
                const pointList = this.trail.kml.points;
                this.pointIndex = pointList.findIndex((point) => {
                    return point._id === this.pointInfo._id;
                });
                if (this.modalType === 'point') {
                    // 找到当前打卡点的下一个打卡点
                    this.nextPoint = pointList[this.pointIndex + 1];
                }
            }
            this.isMapReady = true;
        },
		fullscreen(){
			
		},
        getClock() {
            this.modalName = this.modalType;
			if(!this.trail.kml.points[this.pointIndex]){
				this.trail.kml.points[this.pointIndex] = {}
			}
            this.trail.kml.points[this.pointIndex].isClock= true;
            if (this.modalType === 'start') {
                // 起点打卡成功，开始计时
                this.$store.dispatch('recordTime');
            }
            if (this.modalType === 'point') {
                // 普通打卡点打卡
                let time = this.$store.state.timeCount.timeCount;
                this.trail.kml.points[this.pointIndex].timeShow = `${time.hour}:${time.minute}:${time.second}`;
            }

            if (this.modalType === 'end') {
                this.$store.dispatch('endRecord');
            }
            uni.setStorageSync('clockResultTrail', this.trail);
        },
        backToList() {
            this.modalName = '';
            uni.navigateBack();
            uni.setStorageSync('isAllClock', true);
        }
    }
};
</script>

<style lang="scss" scoped>
.warning-message {
    height: 400rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20rpx;
    padding: 0 40rpx;
    padding-top: 20px;
    background-color: #fde6d2;
}

.warning-message-text {
    font-size: 14;
    margin-bottom: 10px;
    color: #f37b1d;
}

.danger-message-text {
    font-size: 14;
    margin-bottom: 10px;
    color: #ff0000;
}

.success-wrapper {
    height: 700rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 40rpx;
    .icon-wrapper {
        margin-top: 40rpx;
        font-size: 200rpx;
    }

    .time {
        font-size: 1.8rem;
    }

    .clock-success {
        color: $zts-green;
        font-size: 72rpx;
    }

    .order {
        font-size: 1.8rem;
    }
}
</style>
