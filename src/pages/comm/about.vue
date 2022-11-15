<template>
    <page-meta root-font-size="10px"></page-meta>
    <view>
        <cu-custom bgColor="bg-ztsblue" :isBack="true">
            <block slot="backText"></block>
            <block slot="content">{{sys.name}}</block>
        </cu-custom>
        <view class="padding flex flex-direction justify-center">
            <view class="text-center">
                <image src="https://zts.5618.co/repo/logo-1024x1024.png"></image>
            </view>

            <!-- #ifndef APP-PLUS -->
            <!-- #ifndef H5-->
            <view class="padding flex flex-direction align-center">
                <button class="cu-btn lg round lines bg-blue response" @tap="downloadApp">
                    <view class="text-ztsblue">【环浙步道】APP下载</view>
                </button>
            </view>
            <!-- #endif -->
            <!-- #endif -->

            <!-- #ifdef APP-PLUS -->
            <text class="padding text-center text-gray">当前版本：{{sys.version +' '+ sys.versionCode}}</text>
            <view class="margin-top-sm padding-left text-gray" v-if="bd.isDev">当前版本未内部开发测试版本，部分页面和功能尚未启用</view>
            <view class="padding-lr-xl flex flex-direction align-center">
                <button class="cu-btn lg round lines bg-blue response" @tap="checkVersion">
                    <view class="text-dark">检查更新</view>
                </button>
            </view>
            <!-- #endif -->

            <view class="padding">
                <!-- <text>【{{sys.name}}】</text> -->
                环浙步道服务应用是由浙江省体育局指导，宁波市奉化区文化和广电旅游体育局建设，面向公众提供建设步道数据服务，提供步道线路查询、步道动态检索、步道周边信息查询、运动轨迹记录、步道标距柱打卡等个性化服务。
                <!-- 是一款健身步道相关户外工具APP，提供浙江省范围的健身步道信息服务，及相关的自然人文、体育旅游等资源信息；提供户外轨迹导航和GPS记录轨迹记录功能。 -->
            </view>

            <view class="margin-top-sm padding-left text-grey text-sm text-center">{{sys.copyright}} </view>
            <view class="margin-top-xs text-sm text-gray text-center">
                服务咨询热线：
                <text class="text-centertext-bold text-blue" @click="call">{{sys.tel}}</text>
            </view>
        </view>

        <!-- #ifndef H5-ZLB -->
        <!-- <view class="cu-bar bg-gray margin-top-sm solid-top">
			<view class="action">
				<text class="cuIcon-titles text-grey"></text>
				<text class="text-grey">【技术联系】</text>
			</view>
		</view>
		<view class="padding-lr text-grey pre-line margin-top-sm">
			邮箱: 86698736@qq.com
		</view>
		<view class="padding-lr text-grey pre-line margin-top-sm">
			电话: 13216685888
		</view>
		<view class="padding-lr text-grey pre-line margin-top-sm">
			联系人: 徐小辉
		</view> -->
        <!-- #endif -->
        <!-- <view class="padding-lr text-grey">
            <view class="padding flex flex-direction" @tap="zz.href('/pages/comm/feedback?path=about',true)">
                <button class="cu-btn bg-grey lg">建议反馈</button>
            </view>
        </view> -->
        <view class="cu-tabbar-height"></view>
    </view>
</template>
<script>
import checkUpdate from "@/uni_modules/uni-upgrade-center-app/utils/check-update"

import bd from '@/comm/bd'
export default {
    data() {
        return {
            sys: bd.sys
        };
    },
    onLoad() {
        // #ifdef APP-PLUS
        Object.assign(this.sys, plus.runtime)
        // #endif
        // console.log(this.sys)
    },
    methods: {
        checkVersion() {
            uni.showLoading({})
            checkUpdate().then(res => {
                uni.hideLoading()
                if (this.sys.versionCode >= res.result.version) {
                    // console.log('checkVersion -------',this.zz,this.sys.versionCode, res.result.version);
                    this.zz.modal('已经是最新版本')
                }
            })
        },
        downloadApp() {
            window.open('https://zts.5618.co/repo/zts_run.html', "_blank")
        },
        call() {
            uni.makePhoneCall({
                phoneNumber: bd.sys.tel,
                success: (res) => { },
                fail: (err) => { }
            })
        }
    }
};
</script>
<style>
image {
    width: 360rpx;
    height: 360rpx;
    border-radius: 12rpx;
}
</style>
