<template>
    <!-- 
    name: 记录的线路的卡片显示
 -->
    <view class="container">
        <!-- 卡片模式 -->
        <view class="line-card-box" @click="openDetails">
            <view class=" line-sport-type-box record-time-box flex align-center justify-between padding-tb">
                <view class="flex align-center">
                    <view style="font-size:70rpx;" class="margin-right-sm" :class="'zzIcon-z'+details.t3"></view>
                    <view>
                        <text class="record-time-box-title">名称:</text>
                        <text class="record-time-box-value text-cut">{{ details.name }}</text>
                    </view>
                </view>
                <view class="padding-right text-xxl" @click="userEvent(40,44)">
                    <text v-if="details.isFavor" class="cuIcon-favorfill text-yellow"></text>
                    <text v-else class="cuIcon-favor"></text>
                </view>
                <!-- <view class="text-black text-sm">
                        {{ getTypeName }}
                    </view> -->
            </view>
            <view v-if="details">
                <view v-show="cardMode" class="flex align-center">
                    <!-- <view class="flex align-center line-sport-type-box">
                    <tui-lazyload-img width="100%" height="370rpx" src="https://fhty.976m.org/bdfh/img/0%20(1).JPG"></tui-lazyload-img>
                </view> -->
                    <view class=" basis-sm flex  align-center justify-around line-info-box line-info-column-box">
                        <view class="line-info-item line-info-item-col">
                            <text class="line-info-item-title">类型</text>
                            <text class="line-info-item-value">{{ getTypeName }}</text>
                        </view>
                        <view class="line-info-item">
                            <text class="line-info-item-title">海拔</text>
                            <text v-if="details.coord" class="line-info-item-value">{{ details.coord[2] }}米</text>
                        </view>
                        <view class="line-info-item line-info-item-col">
                            <text class="line-info-item-title">照片数量</text>
                            <text v-if="details.imgs" class="line-info-item-value">{{ details.imgs.length }}张</text>
                        </view>
                    </view>
                    <view class="basis-lg">
                        <!-- <image v-if="details.imgs[0]" class="response radius cover" :style="'background-image:url(' + details.imgs[0] + ')'" mode="aspectFill" @error="imageError"></image> -->
                        <tui-lazyload-img
                            v-if="details.imgs[0]" width="100%" height="220rpx" radius="10rpx" mode="aspectFill"
                            :src="details.imgs[0] || ''" @click="previewImage" @error="imageError"
                        ></tui-lazyload-img>
                        <view v-else class="video-box">
                            <video  class="point-video" :src="details.video.url" @error="videoError"></video>
                        </view>
                        <view class="flex align-center avatar-box" @click="openProfile">
                            <!-- <view class="cu-avatar radius margin-right" :style="'background-image:url(' + user.headImg + ')'"></view> -->
                            <!-- <view>户外人</view> -->
                            <view class="cu-avatar radius margin-right" :style="'background-image:url(' + userInfo.headImg + ')'"></view>
                            <view>{{ userInfo.nickName }}</view>
                        </view>
                    </view>
                </view>
                <view v-show="!cardMode" class="flex  align-center line-info-box">
                    <view class="line-info-item">
                        <text class="line-info-item-title">类型</text>
                        <text class="line-info-item-value">照片点</text>
                    </view>
                    <view class="line-info-item">
                        <text class="line-info-item-title">海拔</text>
                        <text v-if="details.coord" class="line-info-item-value">{{ details.coord[2] }}米</text>
                    </view>
                    <view class="line-info-item">
                        <text class="line-info-item-title">照片数量</text>
                        <text v-if="details.imgs" class="line-info-item-value">{{ details.imgs.length }}张</text>
                    </view>
                </view>
            </view>

            <view class="record-time-box">
                <text class="record-time-box-title">坐标:</text>
                <text v-if="details && details.coord" class="record-time-box-value">{{ `${details.coord[0]},${details.coord[1]}` }}</text>
            </view>
            <view class="record-time-box">
                <text class="record-time-box-title">记录时间:</text>
                <!-- <text class="record-time-box-value">2022-05-23 14:24:30</text> -->
                <text class="record-time-box-value">{{ details.time }}</text>
            </view>
            <view v-if="!cardMode" class="flex align-center avatar-box">
                <view class="cu-avatar radius margin-right" :style="'background-image:url(' + userInfo.headImg + ')'"></view>
                <view>{{ userInfo.nickName }}</view>
            </view>
        </view>
        <!-- 列表模式 -->
        <!-- <view class="line-card-box" v-else>
            <view class="flex align-center line-sport-type-box">
                <view class="sport-icon" :class="'zzIcon-z118'"></view>
                <view class="flex flex-direction line-name-sport">
                    <view class="line-name-sport-name">兴趣点名称</view>
                    <view class="line-name-sport-sport">类型</view>
                </view>
            </view>
            <view class="flex  align-center line-info-box">
                <view class="line-info-item">
                    <text class="line-info-item-title">类型</text>
                    <text class="line-info-item-value">照片点</text>
                </view>
                <view class="line-info-item">
                    <text class="line-info-item-title">海拔</text>
                    <text class="line-info-item-value">118米</text>
                </view>
                <view class="line-info-item">
                    <text class="line-info-item-title">照片数量</text>
                    <text class="line-info-item-value">3张</text>
                </view>
            </view>
            <view class="record-time-box">
                <text class="record-time-box-title">坐标:</text>
                <text class="record-time-box-value">121.3123,30.12312</text>
            </view>
            <view class="record-time-box">
                <text class="record-time-box-title">记录时间:</text>
                <text class="record-time-box-value">2022-05-23 14:24:30</text>
            </view>
        </view> -->
    </view>
</template>

<script>
export default {
    props: {
        details: {
            type: Object,
            default: () => {
                return {}
            }
        },
        userInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {
            isPreview: false,
            cardMode: true,
            dict: uni.getStorageSync('sys_dict')
        };
    },
    computed: {
        getTypeName() {
            const type = this.details.t3
            const obj = this.dict.trail_element[type]
            return obj.label || ''
        },
        isFavor() {
            return this.details.isFavor
        }
    },
    watch: {
        isFavor(val) {
            console.log('favor---------', val, this.details);
        }
    },
    mounted() {
    },
    methods: {
        // 打开用户主页
        openProfile() {
            this.clickStop()
            console.log("用户详情=========")
        },
        // 打开坐标点详情
        openDetails() {
            if (this.isPreview) {
                return;
            }
            this.$emit("pointDetails", this.details)
        },
        // 用户操作
        userEvent(t, tt) {
			this.clickStop()
            this.$emit("userEvent", {
                t,  // 收藏
                tt  // 兴趣点
            })
        },
        previewImage({ index }) {
            this.clickStop()
            this.zz.viewIMG(this.details.imgs, index)
        },
        // 除查看详情的其他操作,阻止页面跳转
        clickStop() {
            this.isPreview = true
            setTimeout(() => {
                this.isPreview = false
            }, 500)
        },
        imageError() {
            this.cardMode = false
        },
        videoError(e) {
            console.log('视频加载错误', e);
        }
    }
};
</script>

<style lang="scss" scoped>


.line-card-box {
    background-color: #ffffff;
    border-radius: 20rpx;
    width: 690rpx;
    margin: 20rpx auto;
    padding: 20rpx;
    .line-sport-type-box {
        height: 120rpx;
        border-bottom: 1px solid #e2e2e2;
        .sport-icon {
            font-size: 70rpx;
            margin-right: 20rpx;
        }

        .line-name-sport {
            &-name {
                color: #232323;
                font-size: 32rpx;
                font-weight: bold;
            }

            &-sport {
                color: #4e4e4e;
                font-size: 24rpx;
            }
        }
    }
    .line-info-column-box {
        // width: 375rpx;
        height: 400rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .cover {
        height: 220rpx;
        // margin-bottom: 20rpx;
    }

.video-box{
    overflow: hidden;

.point-video {
        width: 400rpx;
        height: 220rpx;
    }
}
    

    .line-info-box {
        // height: 120rpx;
        padding: 30rpx 0;
        .line-info-item-col {
            height: 110rpx;
        }
        .line-info-item {
            width: 200rpx;
            // height: 110rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            &-title {
                font-size: 24rpx;
                color: #858585;
            }

            &-value {
                font-size: 36rpx;
                font-weight: bold;
                color: #282828;
            }
        }
    }

    .avatar-box {
        height: 100rpx;
    }
}

.record-time-box {
    &-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-right: 20rpx;
    }

    &-value {
        font-size: 28rpx;
    }
}
</style>
