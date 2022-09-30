<template>
    <!-- 
    name:数据统计的swiper组件
 -->
    <view class="data-swiper">
        <swiper class="swiper" :current="current" :indicator-dots="false" @change="swiperChange">
            <swiper-item class="swiper-item" v-for="(item,index) in dataList" :key="index">
                <view class="title">{{item.title}}</view>
                <view class="swiper-content">
                    <view v-if="item.copy" class="title-sm">{{item.item}}</view>
                    <view v-else class="title">{{item.item}}</view>
                    <view v-if="item.unit" class="sub-title">{{item.unit}}</view>
                    <view v-if="item.copy" class="copy" @click="copyLocation(item.item)">
                        <text class="cuIcon-copy"></text>
                    </view>
                </view>
            </swiper-item>
        </swiper>
        <view class="view-indicator">
            <view v-for="(item,index) in dataList.length" :key="index" class="view-indicator-item" :class="current === index ? 'active' : ''"></view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            current: 0
        };
    },
    mounted() { },
    methods: {
        swiperChange(event) {
            this.current = event.detail.current
        },
        copyLocation(c) {
			// let e = c.split(',')
            uni.setClipboardData({
                // data: JSON.stringify({ longitude: e[0], latitude: e[1] }),
                data: c,
                showToast: false,
                success: ()=>{
					this.zz.toast('复制成功~')
                }
            })
        },
    }
};
</script>

<style lang="scss" scoped>
.data-swiper {
    // justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    .swiper {
        width: 750rpx;
        margin-bottom: 10rpx;
        .swiper-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .title {
                margin: 20rpx 0 20rpx 0;
                font-size: 32rpx;
                color: #222222;
            }

            .swiper-content {
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                justify-content: center;
                .title {
                    font-size: 122rpx;
                    font-weight: 600;
                }
                .title-sm {
                    font-size: 42rpx;
                    font-weight: 600;
                }

                .sub-title {
                    font-size: 42rpx;
                    margin-left: 10rpx;
                    margin-bottom: 50rpx;
                }
                .copy {
                    font-size: 48rpx;
                    margin-bottom: 10rpx;
                    margin-left: 20rpx;
                }
            }
        }
    }

    .view-indicator {
        display: flex;
        flex-direction: row;
        align-items: center;
        &-item {
            width: 32rpx;
            height: 8rpx;
            margin: 0 6rpx;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 15rpx;
        }

        .active {
            background-color: $zts-green;
        }
    }
}
</style>
