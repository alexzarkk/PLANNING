<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">{{sys.name}}</block>
		</cu-custom>
		<view class="padding flex flex-direction justify-center">
			<view class="text-center"><image src="https://zts.5618.co/repo/logo-1024x1024.png"></image></view>
			
			<!-- #ifdef APP-PLUS -->
			<text class="padding text-center text-gray">当前版本：{{sys.version +' '+ sys.versionCode}}</text>
			<view class="margin-top-sm padding-left text-gray">当前版本未内部开发测试版本，部分页面和功能尚未启用</view>
			<view class="padding-lr-xl flex flex-direction align-center">
				<button class="cu-btn lg round lines bg-blue response" @tap="checkVersion">
					<view class="text-dark">检查更新</view>
				</button>
			</view>
			<!-- #endif -->
			<view class="padding margin-top-sm">
				<text>【{{sys.name}}】</text>
				是一款健身步道相关户外工具APP，提供浙江省范围的健身步道信息服务，及相关的自然人文、体育旅游等资源信息；提供户外轨迹导航和GPS记录轨迹记录功能。
			</view>
			
			<view class="margin-top-sm padding-left text-grey text-sm">{{sys.footer.content}} </view>
		</view>
		
		<!-- #ifndef H5-ZLB -->
		<view class="cu-bar bg-gray margin-top-sm solid-top">
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
		</view>
		<!-- #endif -->
		
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
export default {
	data() {
		return {
				sys: this.bd.sys
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
