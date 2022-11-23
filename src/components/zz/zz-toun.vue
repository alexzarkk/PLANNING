<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-16 14:50:11
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-26 13:35:04
 * @FilePath: \sport-planing\src\components\zz\zz-toun.vue
 * @Description:   
 
 * 打卡点 组件
 
 
 * 
 * 
-->
<template>
    <view class="container">
        <view
            class="to-box shadow shadow-lg"
            :style="{
                backgroundImage:
                    'linear-gradient( to left ,rgba( 29,80,162, 1) 0%,rgba( 29,80,162, 0.9) 30%,rgba( 29,80,162, 0.4) 42%,rgba( 29,80,162, 0.1) 60%,rgba(0, 0, 0, 0) 100%), url(' +
                    tounData.cover +
                    ')'
            }"
        >
            <view class="left-box">
                <view class="sport">
                    <text :class="'zzIcon-sport-' + icon() + ' icon'"></text>
                </view>
                <view class="distance">{{ (tounData.kml.len / 1000).toFixed(1) }}km</view>
                <view class="clock-num">
                    <text class="text-bold text-df">{{ tounData.kml.points.length }}</text>
                    个打卡点
                </view>
                <view class="info-box">
                    <view class="name text-cut">{{ tounData.name }}</view>
                    <view class="desc text-cut">{{ tounData.desc }}</view>
                </view>
            </view>
            <view class="right-box">
                <button @click="openClock(tounData)" class="cu-btn round btn bg-orange">去挑战</button>
                <view class="num">
                    已完成
                    <text style="marrgin-left: 4rpx" class="text-bold">30</text>
                    人
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        tounData: {
            type: Object
        }
    },
    computed: {
        getNum() {
            return (Math.random() * 500).toFixed(0);
        }
    },
    created() {},
    mounted() {
        // console.log('每个item的data', JSON.parse(JSON.stringify(this.tounData)));
        this.icon();
    },
    data() {
        return {};
    },
    methods: {
        // 打卡去打卡的页面
        openClock(item) {
            // console.log('打卡的线路信息', item);
            uni.navigateTo({
                url: '/pages/event/clockList?id=' + item._id,
				fail: (err) => {
					console.error("err======",err)
				}
            });
        },
        icon() {
            return [110, 112, 114, 116, 118, 122, 310, 313, 314][this.zz.math(Math.random() * 10, 0)] || 110;
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    .to-box {
        padding: 24rpx;
        height: 180rpx;
        border-radius: 24rpx;
        margin-bottom: 40rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-shadow: 5px 5px 1px 1px #e2e2e2;
        background-position: 50% 50%;
        .left-box {
            display: flex;
            flex-direction: row;
            // align-items: center;
            position: relative;
            .sport {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 20rpx;
                .icon {
                    font-size: 60rpx;
                }
            }
            .distance {
                position: absolute;
                top: 110rpx;
                left: 0px;
                font-size: 24rpx;
                padding: 0 10rpx;
                background-color: #ffffff;
                border-radius: 24rpx;
                color: #848283;
            }

            .clock-num {
                text-align: center;
                width: 160rpx;
                position: absolute;
                top: 108rpx;
                left: 120rpx;
                font-size: 16rpx;
                padding: 0rpx 10rpx;
                background-color: $zts-green;
                border-radius: 24rpx;
                color: #ffffff;
            }

            .info-box {
                .name {
                    font-size: 28rpx;
                    color: #fff;

                    width: 300rpx;
                }

                .desc {
                    color: #fff;
                    font-size: 24rpx;
                    width: 300rpx;
                }
            }
        }
        .right-box {
            width: 160rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            .btn {
                margin-bottom: 20rpx;
            }

            .num {
                color: #fff;
                font-size: 24rpx;
            }
        }
    }
}
</style>
