<template name="basics">
	<view>
		<view class="UCenter-bg">
			<!--用户信息-->
			<view class="flex justify-start margin-top padding-top" style="height: 100%;">
				<block v-if="!isLogin">
					<view class="margin-top-xs flex align-center padding-xl content" @tap="href('./wxLogin')">
						<view class="cu-avatar radius"><text class="cuIcon-people"></text></view>
						<view class="padding-left">
							 <!-- #ifndef H5-ZLB -->
                            <!-- #ifdef APP-PLUS || H5 -->
                            <text>注册/登录</text>
                            <!-- #endif -->
                            <!-- #endif -->

                            <!-- #ifdef H5-ZLB -->
                            <text>授权/登录</text>
                            <!-- #endif -->
						</view>
						<view class="margin-left-xs cuIcon-right"></view>
					</view>
				</block>
				<block v-else>
					<view class="margin-top-xs new_class">
						<view class="flex align-center padding-xl cu-list">
							<view class="cu-bar">
								<!-- <view class="cu-avatar round shadow lg" :style="'background-image:url(' + user.ava + ')'"></view> -->
								<view
									:style="'background-image:url(' + user.ava + ')'"
									style="height: 112rpx;width: 112rpx; border-radius: 56rpx;   background-size: cover;"
								></view>
								<view class="text-white padding-left">
									<view class="text-xl margin-right">{{ user.name }}</view>
									<view class="text-xl margin-right" style="display: flex; align-items: center;margin-top: 12rpx;">
										<view class="new_zyz_hy" @click="href('/pages/subPackages/coupon/card', true)">
											<image
												style="width: 24rpx;height: 24rpx;"
												src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fb41164a-2f7b-434d-a985-757ed85d35c5/95a5190a-dd0f-42c7-868b-7dd1a4d75b61.png"
											></image>
											<view style="margin: 0 12rpx 0 10rpx;">会员</view>
											<view class="cuIcon-xiangyoudan" style="font-size: 16rpx;"></view>
										</view>
										<view class="new_zyz_hy" @click="href('/pages/subPackages/volunteer/volunteer', true)">
											<image
												style="width: 24rpx;height: 24rpx;"
												src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fb41164a-2f7b-434d-a985-757ed85d35c5/2604ab3a-3141-4e30-bcd5-0fec36f6d3f5.png"
											></image>
											<view style="margin: 0 12rpx 0 10rpx;">志愿者</view>
											<view class="cuIcon-xiangyoudan" style="font-size: 16rpx;"></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>

		<view class="bg-white" style="margin: 20rpx;border-radius: 8rpx;">
			<view class=" flex text-center text-grey" style="padding: 30rpx 0;">
				<view class="flex flex-sub flex-direction" @tap="href('/pages/subPackages/order', true)">
					<view class="text-xxl text-purple"><view class="cuIcon-formfill" style="color: #0477B3; font-size: 60rpx;"></view></view>
					<view class=" color">支付订单</view>
				</view>
				<view class="flex flex-sub flex-direction " @tap="href('/pages/subPackages/coupon/card', true)">
					<view class="text-xxl text-orange"><view class="cuIcon-card" style="color:#7F59B6;  font-size: 60rpx;"></view></view>
					<view class=" color">会员卡</view>
				</view>
				<view class="flex flex-sub flex-direction " @tap="href('/pages/subPackages/coupon/coupon', true)">
					<view class="text-xxl text-orange"><view class="cuIcon-redpacket_fill" style="color:#E54D42;  font-size: 60rpx;"></view></view>
					<view class=" color">优惠券</view>
				</view>
				<view class="flex flex-sub flex-direction" @tap="href('/pages/subPackages/news/collect', true)">
					<view class="text-xxl text-orange"><view class="cuIcon-favorfill" style="color:#F37B1D;  font-size: 60rpx;"></view></view>
					<view class=" color">我的收藏</view>
				</view>
			</view>
		</view>

		<view class="bg-white" style="margin: 20rpx; padding: 28rpx 28rpx 40rpx;border-radius:8rpx ;">
			<view style="color: #999999;font-size: 1.4rem;">常用功能</view>
			<view style="display: flex;align-items: center;flex-wrap: wrap;">
				<view v-for="(item, index) in chydata" :key="index" style="width: 25%; text-align: center;margin: 32rpx 0 0;" @click="todetails(index)">
					<view :class="item.icon" style="color: #0477B3;font-size: 50rpx;"></view>
					<view style="color: #666666;font-size: 1.3rem;margin-top: 16rpx;">{{ item.name }}</view>
				</view>
			</view>
		</view>

		<view class="bg-gray" style="margin: 20rpx; border-radius:8rpx ; overflow: hidden;">
			<view class="cu-list menu shadow-lg radius solid">
				<view class="cu-item arrow" @tap="href('/pages/my/doc/privacy')">
					<view class="content">
						<text class="cuIcon-edit" style="color: #0477B3;font-size: 1.5rem;"></text>
						<text class="text-grey" style="color: #666666; font-size: 1.3rem;">隐私政策</text>
					</view>
				</view>
				<view class="cu-item arrow" @tap="href('/pages/my/doc/protocol')">
					<view class="content">
						<text class="cuIcon-evaluate" style="color: #0477B3;font-size: 1.5rem;"></text>
						<text class="text-grey" style="color: #666666;font-size: 1.3rem;">服务协议</text>
					</view>
				</view>
			</view>
			
			<view class="cu-tabbar-height"></view>
			<tui-footer :loginTip.sync="loginTip" :copyright="bd.sys.footer.content" :fixed="false" :navigate="bd.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {},
			bd: this.bd,
			CustomBar: this.CustomBar,
			isLogin: false,
			loginTip: false,
			top: 0, //标题图标距离顶部距离
			opcity: 0,
			scrollTop: 0.5,
			chydata: [
				{
					name: '赛事记录',
					icon: 'cuIcon-upstage'
				},
				{
					name: '活动记录',
					icon: 'cuIcon-selection'
				},
				{
					name: '服务记录',
					icon: 'cuIcon-calendar'
				},
				{
					name: '体测报告',
					icon: 'cuIcon-like'
				},
				{
					name: '个人设置',
					icon: 'cuIcon-peoplelist'
				},
				{
					name: '意见反馈',
					icon: 'cuIcon-notice'
				},
				{
					name: '我的培训',
					icon: 'cuIcon-idcard'
				}
			]
		};
	},
	onLoad: function(options) {
		this.loginTip = !this.zz.isLogin();
	},
	onShow() {
		// console.log('isLogin -----------------', this.zz.isLogin());
		this.isLogin = this.zz.isLogin();
		if (this.isLogin) {
			this.user = this.zz.getAcc();
		}
	},
	methods: {

		init: async function() {},
		href(url, verify) {
			if (url == '/pages/my/task/task' || url == '/pages/my/task/err' || url == '/pages/my/task/feedback') {
				this.zz.toast('功能开发中，敬请期待！');
				return;
			}
			this.zz.href(url, verify);
		},
		setting: function() {
			// console.log('setting');
			uni.navigateTo({
				url: '../test/1/1'
			});
		},
		todetails(index) {
			switch (index) {
				case 0:
					uni.navigateTo({
						url: '/pages/my/event/event'
					});
					break;
				case 1:
					uni.navigateTo({
						url: '/pages/subPackages/membershipCard/mylist'
					});
					break;
				case 2:
					uni.navigateTo({
						url: '/pages/subPackages/volunteer/record'
					});
					break;
				case 3:
					uni.navigateTo({
						url: '/pages/physiqueMonitoring/report'
					});
					break;
				case 4:
					uni.navigateTo({
						url: '/pages/my/set/set'
					});
					break;
				case 5:
					uni.navigateTo({
						url: '/pages/common/feedback?path=my'
					});
					break;
				case 6:
					uni.navigateTo({
						url: '/pages/subPackages/train/myLst'
					});
					break;
			}
		}
	}
};
</script>

<style>
page {
	background-color: #f0f0f0;
}

.UCenter-bg {
	background-image: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/9d702f50-9906-11ea-8bd0-2998ac5bbf7e.jpg');
	/* background-image: url(../../static/images/quan/my_bg.png); */
	background-size: cover;
	height: 360rpx;
	display: flex;
	flex-direction: column;
	/* align-items: center; */
	/* justify-content: flex-start; */
	/* padding-top: 10rpx; */
	overflow: hidden;
	position: relative;
	color: #fff;
	font-weight: 300;
	text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
}

.color {
	color: #333333;
	font-size: 1.4rem;
	margin-top: 16rpx;
}

.new_class {
	height: 100%;
	display: flex;
	align-items: center;
	width: 100%;
}

.new_zyz_hy {
	display: flex;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.3);
	justify-content: space-between;
	font-size: 1rem;
	padding: 4rpx 10rpx;
	border-radius: 20rpx;
	margin-right: 20rpx;
}

.UCenter-bg button {
	opacity: 0.8;
}

.UCenter-bg image {
	width: 200rpx;
	height: 200rpx;
}

.UCenter-bg .gif-wave {
	position: absolute;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 99;
	mix-blend-mode: screen;
	height: 100rpx;
}

.page {
	height: 100vh;
}

.nav-list {
	display: flex;
	flex-wrap: wrap;
	padding: 20px 20rpx 0px;
	justify-content: space-between;
}

.nav-li {
	padding: 30rpx;
	border-radius: 12rpx;
	width: 45%;
	margin: 0 2.5% 40rpx;
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}

.nav-li::after {
	content: '';
	position: absolute;
	z-index: -1;
	background-color: inherit;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: -10%;
	border-radius: 10rpx;
	opacity: 0.2;
	transform: scale(0.9, 0.9);
}

.nav-li.cur {
	color: #fff;
	background: rgb(94, 185, 94);
	box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}

.nav-title {
	font-size: 1.6rem;
	font-weight: 300;
}

.nav-title::first-letter {
	font-size: 2rem;
	margin-right: 4rpx;
}

.nav-name {
	font-size: 1.4rem;
	text-transform: Capitalize;
	margin-top: 20rpx;
	position: relative;
}

.nav-name::before {
	content: '';
	position: absolute;
	display: block;
	width: 40rpx;
	height: 6rpx;
	background: #fff;
	bottom: 0;
	right: 0;
	opacity: 0.5;
}

.nav-name::after {
	content: '';
	position: absolute;
	display: block;
	width: 100rpx;
	height: 1px;
	background: #fff;
	bottom: 0;
	right: 40rpx;
	opacity: 0.3;
}

.nav-name::first-letter {
	font-weight: bold;
	font-size: 1.8rem;
	margin-right: 1px;
}

.nav-li text {
	position: absolute;
	right: 30rpx;
	top: 30rpx;
	font-size: 52rpx;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
}

.text-light {
	font-weight: 300;
}

@keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40rpx);
	}

	100% {
		transform: translateY(0px);
	}
}

@-webkit-keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40rpx);
	}

	100% {
		transform: translateY(0px);
	}
}
</style>
