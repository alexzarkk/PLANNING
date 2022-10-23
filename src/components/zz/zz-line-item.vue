<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-17 12:59:16
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-23 15:36:38
 * @FilePath: \sport-planing\src\components\zz\zz-line-item.vue
 * @Description: 
 * 

瀑布流子组件

 * 
-->
<template>
    <view v-if="lineData.kml" @click="openDetails" class="line-card" style="margin-bottom: 20rpx">
        <!-- <image class="image" :src="lineData.cover" mode="widthFix"></image> -->
        <tui-lazyload-img class="image" mode="widthFix" :src="lineData.cover || ''"></tui-lazyload-img>
        <view class="line-content-box">
            <view class="icon-wrapper">
                <view :class="'zzIcon-z' + (lineData.type[0]||110) + ' icon'"></view>
                <!-- <view :class="'zzIcon-sport-' + icon() + ' icon'"></view> -->
            </view>
            <view class="line-content-box-one">
                <view class="title text-cut text-lg">{{ lineData.name }}</view>
            </view>
            <view class="line-content-box-two">
                <view class="len text-grey text-sm">{{ (lineData.kml.len / 1000).toFixed(2) }}km</view>
                <view class="up-down text-grey text-sm">↑{{ lineData.kml.up }}↓{{ lineData.kml.down }}m</view>
            </view>
            <view class="line-content-box-three">
                <view class="time text-green text-sm">
                    <text class="cuIcon-time margin-right-xs"></text>
                    {{ zz.formatDuring(lineData.kml.time*1000) }}
                </view>
            </view>
            <view class="line-content-box-tag">
                <view v-if="isRound" class="cu-tag bg-orange">环线</view>
                <view v-else class="cu-tag bg-green">穿越</view>
            </view>
        </view>
    </view>
</template>

<script>
	
import { dist, math } from '@/comm/geotools'
export default {
    data() {
        return {
            zz: this.zz,
            isRound: false
        };
    },
    props: {
        lineData: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    created() {
        try {
            if (dist(this.lineData.kml.start, this.lineData.kml.end) < 500) {
                this.isRound = true;
            }
        } catch (error) {}
    },
    mounted() {
		console.log(this.lineData);
	},
    methods: {
        openDetails() {
            // console.log('打开详情');
            uni.navigateTo({
                url: '/pages/planning/detail?id=' + this.lineData._id
            });
        },
        icon() {
			// console.log(this.lineData);
            const icon = [110, 112, 114, 116, 118, 122][math(Math.random() * 10, 0)];
            return icon || 110;
        }
    }
};
</script>

<style lang="scss" scoped>
.line-card {
    width: 345rpx;
    // padding-bottom: 40rpx;
    border-radius: 20rpx;
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    // margin-bottom: 20rpx;
    // padding-bottom: 20rpx;
    .image {
    }

    .line-content-box {
        display: flex;
        flex-direction: column;
        row-gap: 20rpx;
        padding: 12rpx;
        .icon-wrapper {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 20rpx;
            left: 20rpx;
            background-color: #ffffff;
            border-radius: 50%;
            .icon {
                font-size: 2rem;
            }
        }

        &-one {
            display: flex;
            flex-direction: row;
            align-items: center;

            .title {
                font-size: 1.6rem;
                // font-weight: 600;
            }
        }

        &-two {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid #e2e2e2;
            padding-bottom: 20rpx;

            .len {
                width: 100rpx;
                background-color: $zts-green;
                border-radius: 50rpx;
                padding: 5rpx 0;
                text-align: center;
                color: #ffffff;
            }
        }

        &-three {
        }

        &-tag {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>
