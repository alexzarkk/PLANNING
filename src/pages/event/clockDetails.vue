<!--
 * @Author: InsHomePgup
 * @Date: 2022-05-15 09:35:01
 * @LastEditors: InsHomePgup
 * @LastEditTime: 2022-05-26 16:27:00
 * @FilePath: \sport-planing\src\pages\event\clockDetails.vue
 * @Description: 
 * 
 * 
-->
<template>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="content">人气打卡点</block>
        </cu-custom>
        <view class="container">
            <!-- 图标 -->
            <view class="wrapper">
                <view class="image-wrapper">
                    <image class="image" src="https://s1.ax1x.com/2022/05/26/XEHqnH.png" mode="aspectFit"></image>
                </view>
                <view class="text-xxl text-bold text-ztsgreen">已在打卡范围内</view>
                <view class="text-xl text-ztsgreen">打卡点 - 常照</view>
                <view>
                    已有
                    <text class="text-ztsgreen text-xl margin-lr-xs">257人</text>
                    打卡
                </view>
                <view class="out-round" @click="clock">
                    <view class="in-round">
                        <view class="time">{{ currentTime }}</view>
                        <view class="clock">立即打卡</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 打卡成功对话框 -->
        <view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''">
            <view class="cu-dialog">
                <!-- <view class="bg-img" style="background-image: url('https://ossweb-img.qq.com/images/lol/web201310/skin/big91012.jpg'); height: 200px">
                    <view class="cu-bar justify-end text-white">
                        <view class="action" @tap="hideModal">
                            <text class="cuIcon-close"></text>
                        </view>
                    </view>
                </view> -->
                <view class="success-wrapper">
                    <view class="icon-wrapper">
                        <text class="cuIcon-roundcheckfill text-green"></text>
                    </view>
                    <view class="clock-success">打卡成功</view>
                    <view class="time">
                        {{ currentTime }}
                    </view>

                    <view class="order">
                        本打卡点
                        <text class="text-ztsgreen text-bold">第258</text>
                        位
                    </view>
                </view>
                <view class="cu-bar bg-white">
                    <view class="action margin-0 flex-sub solid-left" @tap="backToList">确定</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    onLoad() {
        this.loadData();
        let now = new Date();
        let hour = now.getHours();
        let min = now.getMinutes();
        // console.log('当前的时间', hour, min);
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        this.currentTime = `${hour} : ${min}`;
    },
    onReady() {},
    data() {
        return {
            modalName: null,
            currentTime: ''
        };
    },
    methods: {
        async loadData() {},
        clock() {
            this.modalName = 'Image';
        },
        hideModal() {
            this.modalName = null;
        },
        backToList() {
            this.modalName = null;
            uni.navigateBack();
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 40rpx;
        .image-wrapper {
            height: 400rpx;
            width: 750rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .image {
                width: 200rpx;
                height: 200rpx;
            }
        }

        .out-round {
            width: 480rpx;
            height: 480rpx;
            background-color: #f37b1d;
            border-radius: 50%;
            position: relative;
            margin-top: 100rpx;
        }

        .in-round {
            position: absolute;
            top: 30rpx;
            left: 30rpx;
            width: 420rpx;
            height: 420rpx;
            background-color: #ffffff;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .time {
                font-size: 72rpx;
                margin-bottom: 40rpx;
                font-weight: bold;
            }
            .clock {
                font-size: 2rem;
            }
        }
    }
}

.cu-dialog {
    width: 600rpx;
}

.success-wrapper {
    height: 700rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 40rpx;
    .icon-wrapper {
        margin-top: 80rpx;
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
    }
}
</style>
