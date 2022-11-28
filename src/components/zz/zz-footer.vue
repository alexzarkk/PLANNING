<template>
    <view class="tui-footer-class tui-footer">
        <view class="tui-footer-link">
            <navigator class="tui-link" hover-class="tui-link-hover" :hover-stop-propagation="true" :url="url">{{sys.name}}</navigator>
        </view>
        <view class="tui-footer-copyright flex flex-direction">

            <!-- #ifdef H5-ZLB -->
            <text class="text-sm text-gray">本服务由{{sys.copyright}}提供</text>
            <text class="margin-top-xs text-sm text-gray">
                服务咨询热线：
                <text class="text-bold text-blue" @click="call">{{sys.tel}}</text>
            </text>
            <!-- #endif -->

            <!-- #ifndef H5-ZLB -->
            <text class="text-sm text-gray">{{sys.copyright}}</text>
            <text class="margin-top-xs text-sm text-gray">
                服务咨询热线：
                <text class="text-bold text-blue" @click="call">{{sys.tel}}</text>
            </text>
            <!-- #endif -->

        </view>
    </view>
</template>

<script>
import { sys } from '@/comm/bd'
export default {
    data() {
        return {
            sys,
            url: "/pages/comm/about"
        }
    },
    methods: {
        call() {
            ZWJSBridge.phoneCall({
                "corpId": sys.tel
            }).then(res => {
                console.log("调用电话成功============",res)
            }).catch(err => {
                console.log("调用电话失败============",err)
            })
            // uni.makePhoneCall({
            //     phoneNumber: sys.tel,
            //     success: (res) => { },
            //     fail: (err) => { }
            // })
        }
    }
}
</script>

<style scoped>
.tui-footer {
    width: 100%;
    overflow: hidden;
    padding: 30rpx 24rpx;
    box-sizing: border-box;
    background-color: transparent;
}

.tui-fixed {
    position: fixed;
    z-index: 9999;
    bottom: 0;
    left: 0;
}

.tui-footer-link {
    color: #596d96;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
}

.tui-link {
    position: relative;
    padding: 0 18rpx;
    line-height: 1;
}

.tui-link::before {
    content: ' ';
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: 1px solid #d3d3d3;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
}

.tui-link:last-child::before {
    border-right: 0 !important;
}

.tui-link-hover {
    opacity: 0.5;
}

.tui-footer-copyright {
    font-size: 1.2rem;
    color: #a7a7a7;
    line-height: 1;
    text-align: center;
    padding-top: 16rpx;
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
