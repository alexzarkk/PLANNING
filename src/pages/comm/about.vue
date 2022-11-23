<template>

	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">{{sys.name}}</block>
		</cu-custom>
		<view class="padding flex flex-direction justify-center">
			<view class="text-center"><image src="https://zts.5618.co/repo/logo-1024x1024.png"></image></view>
			
			<!-- #ifndef APP-PLUS -->
			<view class="padding flex flex-direction align-center">
				<button class="cu-btn lg round lines bg-blue response" @tap="downloadApp">
					<view class="text-ztsblue">【环浙步道】APP下载</view>
				</button>
			</view>
			<!-- #endif -->
			
			<!-- #ifdef APP-PLUS -->
			<text class="padding text-center text-gray">当前版本：{{sys.version +' '+ sys.versionCode}}</text>
			<view class="margin-top-sm padding-left text-gray">当前版本未内部开发测试版本，部分页面和功能尚未启用</view>
			<view class="padding-lr-xl flex flex-direction align-center">
				<button class="cu-btn lg round lines bg-blue response" @tap="checkVersion">
					<view class="text-dark">检查更新</view>
				</button>
			</view>
			<!-- #endif -->
			
			<view class="padding">
				<text>【{{sys.name}}】</text>
				是一款户外运动类工具APP，提供浙江省范围的健身步道及相关的自然人文、体育旅游等信息服务，提供户外线路导航和GPS轨迹记录等功能。
			</view>
			
			<view class="margin-top-sm padding-left text-grey text-sm text-center">{{sys.copyright}} </view>
			<view class="margin-top-xs text-sm text-gray text-center">
				咨询反馈：
				<text class="text-centertext-bold text-blue" @click="call">{{sys.tel}}</text>
				<view>
					邮箱：
					<text class="text-centertext-bold text-blue" @click="copymail">86698736@qq.com</text>
				</view>
			</view>
		</view>
		
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
		
		
		<view class="padding-lr text-grey">
			<view class="padding flex flex-direction" @tap="zz.href('/pages/comm/feedback?path=about',true)">
				<button class="cu-btn bg-grey lg">建议反馈</button>
			</view>
		</view>
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
		checkVersion(){
			uni.showLoading({})
			checkUpdate().then(res=>{
				uni.hideLoading()
				if(this.sys.versionCode >= res.result.version) {
					// console.log('checkVersion -------',this.zz,this.sys.versionCode, res.result.version);
					this.zz.modal('已经是最新版本')
				}
			})
		},
		downloadApp(){
			window.open('https://zts.5618.co/repo/zts_run.html',"_blank")
		},
		call(){
			uni.makePhoneCall({
			    phoneNumber: bd.sys.tel,
			    success: (res) => { },
			    fail: (err) => { }
			})
		},
		copymail(){
			uni.setClipboardData({
			    data: '86698736@qq.com',
			    showToast: false,
			    success: ()=>{
					this.zz.toast('复制成功~')
			    }
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
