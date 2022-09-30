<template>
	<view>
		<cu-custom bgColor="bg-ztsblue"
			:isBack="true">
			<block slot="backText"></block>
			<block slot="content">授权登录</block>
		</cu-custom>

		<!-- <view class="cu-bar"> </view> -->

		<view class="cu-bar bg-blue">
			<view class="action sub-title">
				<text class="text-xl text-bold text-blue">{{ bd.sys.name }}</text>
				<text class="text-ABC text-blue">about</text>
				<!-- last-child选择器-->
			</view>
		</view>

		<view class="padding flex justify-center">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/10302430-afc5-11ea-8a36-ebb87efcf8c0.png"
				mode="aspectFill"
				class="login-logo"></image>
		</view>

		<view class="padding flex justify-center">
			<text>授权您的微信登录小程序</text>
		</view>

		<view class="uni-btn-v">
			<!-- #ifdef APP-PLUS || MP-ALIPAY || MP-TOUTIAO -->
			<button type="primary"
				@click="getUserInfo">获取用户信息</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ -->
			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg"
					type="primary"
					open-type="getUserProfile"
					@click="mpGetUserInfo"
					@getuserinfo="mpGetUserInfo">
					登录
				</button>
			</view>
			<!-- #endif -->
			<!-- H5测试时用 -->
			<!-- <view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg" type="primary"  open-type="getUserInfo" @getuserinfo="mpGetUserInfo">登录</button>
			</view>
			 -->
		</view>
		<view class="padding flex flex-direction">
			<view class="flex justify-center text-sm">登录即代表同意 </view>
			<view class="padding flex justify-center text-sm">【{{ bd.sys.name }}】的用<text
					class="text-blue margin-left-xs"
					@tap="protocol">户服务协议、隐私政策</text>
			</view>
		</view>
	</view>
</template>

<script>
	var thiz;
	export default {
		data() {
			return {
				bd: this.bd,
				user: {},
				token: "",
			};
		},
		onLoad() {
			thiz = this;
			this.token = thiz.zz.getToken();
			// this.validateToken()
			uni.getUserProfile({
				desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true,
					});
				},
			});
		},
		methods: {
			protocol() {
				return;
				uni.navigateTo({
					url: "",
				});
			},
			getCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: "weixin",
						success(e) {
							if (e.code) {
								resolve(e.code);
							} else {
								reject(new Error("微信登录失败"));
							}
						},
						fail(e) {
							reject(new Error("微信登录失败"));
						},
					});
				});
			},
			// 获取用户信息 API 在小程序可直接使用，在 5+App 里面需要先登录才能调用
			getUserInfo() {
				uni.getUserInfo({
					provider: this.loginProvider,
					success: (result) => {
						console.log("getUserInfo success", result);
						this.hasUserInfo = true;
						this.userInfo = result.userInfo;
					},
					fail: (error) => {
						console.log("getUserInfo fail", error);
						let content = error.errMsg;
						if (~content.indexOf("uni.login")) {
							content = "请在登录页面完成登录操作";
						}
						// #ifndef APP-PLUS
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting["scope.userInfo"];
								if (!authStatus) {
									uni.showModal({
										title: "授权失败",
										content: "需要获取您的用户信息，请在设置界面打开相关权限",
										success: (res) => {
											if (res.confirm) {
												uni.openSetting();
											}
										},
									});
								} else {
									uni.showModal({
										title: "获取用户信息失败",
										content: "错误原因" + content,
										showCancel: false,
									});
								}
							},
						});
						// #endif
						// #ifdef APP-PLUS
						uni.showModal({
							title: "获取用户信息失败",
							content: "错误原因" + content,
							showCancel: false,
						});
						// #endif
					},
				});
			},
			mpGetUserInfo(result) {
				const thiz = this;
				uni.getUserProfile({
					desc: "用于完善会员资料",
					success(res) {
						thiz.zz.req({
								url: "updateUser",
								data: res.userInfo,
								loadng: true,
								isVerify: false,
							})
							.then((x) => {
								console.log(x);
								if (x.code == 1000) {
									thiz.zz.setAcc(x.data);
									uni.navigateBack({
										delta: 1,
									});
								}
							});
					},
				});
			},
		},
	};
</script>

<style>
	.login-logo {
		width: 160rpx;
		height: 160rpx;
		border-radius: 100rpx;
	}
</style>
