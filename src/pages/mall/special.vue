<template>

	<view>
		<!-- #ifndef APP-PLUS -->
		<cu-custom bgColor="bg-pink light" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">奉化水蜜桃</block>
		</cu-custom>
		<!-- #endif -->
		<!--TAB-->
		<view class="sticky-box cu-bar bg-white search fixed" :style="[{ top: customBar + 'px' }, { opacity: opcity }]">
			<scroll-view class="nav text-center" scroll-x scroll-with-animation>
				<view class="cu-item" :class="item.sight ? 'cur text-bold text-red' : ''" v-for="(item, index) in tabList" :key="index" :id="item.id" @tap="moveTo">
					{{ item.name }}
				</view>
			</scroll-view>
		</view>

		<view id="tvideo">
			<view class="cu-card case no-card">
				<view class="bg-video flex align-center" style="height: 339rpx;">
					<video
						id="myVideo"
						autoplay
						src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-unia9cc9/8383ba60-b889-11ea-8ff1-d5dcf8779628.mp4"
						:autoplay="true"
						:muted="false"
						:show-fullscreen-btn="true"
						:show-mute-btn="true"
						:show-play-btn="true"
						object-fit="cover"
					></video>
				</view>
				<view class="padding-xs bg-gray flex justify-around">
					<view class="basis-xl flex justify-start align-center">
						<text class="cuIcon-appreciate text-pink padding-lr-xs margin-right-xs">给奉化水蜜桃点赞</text>
						<text class="cuIcon-group text-pink ">为奉化桃农助力</text>
					</view>
					<view class="basis-xs flex justify-center solid-left" @tap="addOil"><view class="cu-tag bg-pink round">我要助力</view></view>
				</view>
			</view>
		</view>

		<view class="flex align-center">
			<view class="basis-xs margin-xs padding-xs flex flex-direction align-center solid-right">
				<text class="text-bold text-lg">{{ shareCount }}</text>
				<text class="text-sm text-grey">助力人数</text>
			</view>
			<view class="basis-xl flex justify-between align-center" @tap="href('/pages/special/shareList', false)">
				<view class="cu-avatar-group">
					<view class="cu-avatar round" v-for="(item, index) in avatar" :key="index" :style="[{ backgroundImage: 'url(' + item.avatar + ')' }]"></view>
				</view>
				<text class="cuIcon-right text-gray margin-right"></text>
			</view>
		</view>

		<view id="tab0">
			<view class="cu-bar bg-pink light solid-bottom">
				<view class="action">
					<text class="cuIcon-titles text-pink"></text>
					订购
				</view>
			</view>

			<banner-list :list="banner"></banner-list>
			<!-- <view class="padding-xs"></view> -->
		</view>

		<view id="tab1">
			<view class="cu-bar bg-pink light solid-bottom">
				<view class="action">
					<text class="cuIcon-info text-pink"></text>
					关于奉化水蜜桃
				</view>
			</view>

			<block v-for="(c, idx) in peach" :key="idx">
				<view class="cu-bar bg-orange light" v-if="idx > 0">
					<view class="action">
						<text class="cuIcon-title text-orange"></text>
						{{ c.title }}
					</view>
				</view>
				<view class="padding-lr padding-top pre-line"><wxParse :content="c.content"></wxParse></view>
			</block>
		</view>

		<view id="tab2">
			<view class="cu-bar bg-pink light solid-bottom">
				<view class="action">
					<text class="cuIcon-we text-pink"></text>
					故事...
				</view>
			</view>
			<view class="cu-card case" v-for="(p, idx) in pics" :key="idx">
				<view class="padding-lr margin-top-sm shadow">
					<view class="image"><image class="radius" :src="p.url" mode="widthFix" @tap="imgView(pics, idx)"></image></view>
					<view class="pre-line margin-top-sm text-left " v-if="p.desc">
						<text class="txt">{{ p.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<view id="tab3">
			<view class="cu-bar bg-pink light solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-community"></text>
					评论/留言
				</view>
				<view class="action" @tap="href('/pages/profile/blog/edit?tid=special&ttype=2', true)">
					<text class="cuIcon-message text-blue"></text>
					<text class="margin-left-xs text-df text-blue">写留言</text>
				</view>
			</view>
			<zzxb-blog :blog="blog"></zzxb-blog>
			<view class="padding-xs"></view>
		</view>
		<tui-divider :gradual="true" :height="60">end</tui-divider>
		<view class="padding-xs flex justify-start">
			<!--headlines-->
			<text class="text-gray">注：视频和故事来源于【奉化区融媒体中心】</text>
		</view>

		<!--底部选择层-->
		<tui-bottom-popup :show="popupShow" @close="hidePopup" @touchmove.stop.prevent>
			<view class="tui-popup-box">
				<view class="cu-dialog solid-bottom">
					<view class="cu-bar bg-white">
						<view class="action">
							<text class="cuIcon-titles text-pink "></text>
							<text class="txt">分享助力</text>
						</view>
						<view class="action" @tap="hidePopup"><text class="cuIcon-close text-gray "></text></view>
					</view>
				</view>
				<!--内容区域-->

				<!-- share -->
				<view class="padding flex justify-around">
					<view class="bg-white solid padding-top-sm">
						<button open-type="share" class="bg-white flex justify-center flex-direction">
							<view class="bg-white cu-avatar lg margin-left" :style="'background-image:url(' + bd.imgs.icon_wechat + ');'"></view>
							<view class="margin-left-xs text-df">转发给好友</view>
						</button>
					</view>
					<view class="bg-white solid padding-top-sm" @tap="getPoster">
						<button class="bg-white flex justify-center flex-direction">
							<view class="bg-white cu-avatar lg margin-left" :style="'background-image:url(' + bd.imgs.icon_moments + ');'"></view>
							<view class="text-df">分享朋友圈</view>
						</button>
					</view>
				</view>

				<view class="cu-list menu shadow-lg radius" v-if="page.agent">
					<view class="cu-item arrow" @tap="href('/pages/profile/agent/agent', true)">
						<view class="content">
							<text class="cuIcon-message text-grey"></text>
							<text class="text-grey text-df">可获得本次助力销售额的3%分享返利</text>
						</view>
						<view class="action"><text class="text-gray text-sm"></text></view>
					</view>
				</view>
				<!-- share -->
			</view>
			<view class="flex flex-direction"><button class="cu-btn rect bg-gradual-pink bigger dashed">您的转发或分享 是给我们最好的助力</button></view>
		</tui-bottom-popup>

		<!-- 分享 -->
		<tui-tips ref="toast" :top="customBar"></tui-tips>
		<view class="cu-modal" :class="posterShow ? 'show' : ''" @touchmove.stop.prevent>
			<view class="cu-dialog cu-item shadow">
				<view class="image bg-gray">
					<!-- <view class="padding-sm flex justify-between">
						<text class="text-cut text-gray">专属海报已生成，保存后可以发朋友圈了！</text>
						<text class="cuIcon-close" @tap="hideModal"></text>
					</view> -->
					<view class="bg-gray text-right"><text class="cuIcon-close" @tap="hideModal"></text></view>
					<image class="solid" :style="'height:' + (WinWidth - customBar - 100) + 'px'" :src="poster.postSrc" mode="widthFix" @tap.stop="imgView(poster.postSrc)"></image>
				</view>
				<view class="margin-top-sm flex flex-direction">
					<!-- <button class="cu-btn rect bg-grey bigger" @tap="hideModal">取 消</button> -->
					<button class="cu-btn rect bg-green bigger" @tap="saveImage">保 存</button>
				</view>
			</view>
		</view>
		<block v-if="poster.postSrc === ''">
			<view class="cu-modal">
				<!-- <zz-poster ref="zzposter"
					:sharePath="'/pages/special/special'"
					:doDraw="poster.doDraw"
					:imgSrc="poster.imgSrc"
					:Title="poster.Title"
					:TitleColor="poster.TitleColor"
					:PriceTxt="poster.PriceTxt"
					:OriginalTxt="poster.OriginalTxt"
					:OriginalTxtCut="poster.OriginalTxtCut"
					:Referrer="poster.Referrer"
					:pageTitle="poster.pageTitle"
					:shareNum="poster.shareNum"
					@success="postImg"
				></zz-poster> -->
			</view>
		</block>

		<tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
		<zz-footer/>
	</view>
</template>

<script>
// import wxParse from '@/components/uni/uParse/src/wxParse.vue'
import zzxbBlog from '@/components/zzxb/zzxb-blog.vue';
// import zzPoster from "@/components/zzxb/zz-poster.vue"
import bannerList from '@/components/zzxb/banner-list.vue';
import { peach, story } from '@/comm/test/about.js';

var thiz;
export default {
	components: { zzxbBlog, bannerList },
	data() {
		return {
			bd: this.bd,
			// #ifndef APP-PLUS
			customBar: this.CustomBar,
			// #endif
			// #ifdef APP-PLUS
			customBar: 0,
			// #endif
			WinWidth: this.WinWidth,
			page: {},
			shareCount: 0,
			stickBarHeight: -1,
			videoContext: null,
			videoBottom: 0,
			videoTop: 0,
			loginTip: false,
			current: -1,

			load: true,
			scrolled: 0,
			opcity: 0,

			tabList: [
				{
					id: 0,
					name: '订购',
					sight: true
				},
				{
					id: 1,
					name: '关于',
					sight: false
				},
				{
					id: 2,
					name: '故事',
					sight: false
				},
				{
					id: 3,
					name: '评价',
					sight: false
				}
			],

			avatar: null,
			banner: [],

			peach: peach,
			pics: story,
			blog: [],

			isTabTap: false,

			popupShow: false,
			posterShow: false,
			poster: {}
		};
	},
	onLoad: async function() {
		thiz = this;
		await this.zz.req({ $url: 'public/zz/mock', tar: 'special' }, true).then(res => {
			// console.log('res-------->', res);
			this.poster = res.poster;
			this.page = res.page;
			this.banner = res.data;
		});
		this.numDH(0, this.page.share);
		await this.zz.req({ $url: 'public/zz/mock', tar: 'userEvent' }).then(res => {
			// console.log(res);
			this.avatar = res.avatar;
		});
		// this.zz.userEvent(20,99,this.page)
	},
	onShow: function() {
		this.zz.req({ $url: 'public/zz/mock', tar: 'blogList' }).then(res => {
			// console.log(res);
			this.blog = res.data;
		});
		// this.init()

		// console.log(this.zz.timeToDate(1593949469985))
		// let seller = uni.getStorageSync('seller')
		// this.zz.toast(seller)
	},
	onHide() {
		this.videoContext.pause();
	},
	mounted() {
		uni.createSelectorQuery()
			.select('#tvideo')
			.boundingClientRect(data => {
				thiz.videoBottom = data.bottom - thiz.CustomBar;
				thiz.videoTop = data.top - thiz.CustomBar;
			})
			.exec();
		thiz.videoContext = uni.createVideoContext('myVideo');
	},

	methods: {
		numDH(i, t) {
			if (i < t && i < 60) {
				setTimeout(function() {
					(thiz.shareCount = i), i++;
					thiz.numDH(i, t);
				}, 10);
			} else {
				thiz.shareCount = t;
			}
		},
		//获取文字信息
		moveTo: function(e) {
			thiz.isTabTap = true;
			for (let k = 0; k < thiz.tabList.length; k++) {
				thiz.tabList[k].sight = thiz.tabList[k].id == e.target.id;
			}
			const tabheight = thiz.customBar + thiz.stickBarHeight - 1; //tab 栏的高度
			uni.createSelectorQuery()
				.select('#tab' + e.target.id)
				.boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data.top + thiz.scrolled - tabheight,
						duration: 300,
						complete: () => {
							setTimeout(function() {
								thiz.isTabTap = false;
							}, 500);
						}
					});
				})
				.exec();
		},

		href(h, v) {
			this.zz.href(h, v);
		},
		addOil() {
			this.popupShow = true;
			if (!this.zz.isLogin()) this.loginTip = true;
		},
		hidePopup() {
			this.popupShow = false;
		},
		hideModal() {
			this.posterShow = false;
		},
		imgView(img) {
			thiz.zz.viewIMG([img], 0);
		},
		postImg: function(postSrc, shareId) {
			if (postSrc === -1) {
				thiz.zz.toast('系统繁忙，请重新生成');
				uni.hideLoading();
				this.hideModal();
				this.poster.doDraw = false;
			} else {
				this.posterShow = true;
				this.poster.postSrc = postSrc;
				this.poster.shareId = shareId;
				uni.hideLoading();
				let options = {
					type: 'translucent',
					msg: '专属海报已生成，保存后可以发朋友圈了！',
					duration: 3200
				};
				this.$refs.toast.showTips(options);
			}
		},
		getPoster: function(e) {
			if (!this.zz.isLogin()) {
				this.hidePopup();
				return (this.loginTip = true);
			}
			if (this.poster.postSrc === '') {
				thiz.zz.request('share', { action: 'shareNum' }).then(res => {
					thiz.page.share = res.data;
					thiz.poster.shareNum = res.data;
					thiz.poster.doDraw = true;
				});
			} else {
				this.posterShow = true;
			}
			this.hidePopup();
		},
		// 保存到系统相册
		saveImage() {
			uni.saveImageToPhotosAlbum({
				filePath: this.poster.postSrc,
				success(res) {
					thiz.zz.request('share', { action: 'download', id: thiz.poster.shareId }).then(data => {
						uni.showToast({ title: '保存成功！' });
						thiz.hideModal();
						thiz.zz.userEvent(50, 99, thiz.page);

						let user = thiz.zz.getUser();
						thiz.avatar.push({ avatar: user.wxinfo.avatarUrl });
						thiz.numDH(0, thiz.page.share);
						// this.zz.modal('保存成功，是否接收分享后的下单提醒？',(e)=>{
						// 	if(e){
						// 		uni.requestSubscribeMessage({
						// 			tmplIds: [this.bd.sys.msgTemplate.new_order],
						// 			complete:(res)=>{

						// 			}
						// 		})
						// 	}
						// },true)
					});
				}
			});
		}
	},
	onPageScroll: function(e) {
		this.scrolled = e.scrollTop;

		if (thiz.stickBarHeight == -1) {
			uni.createSelectorQuery()
				.select('.sticky-box')
				.boundingClientRect(data => {
					thiz.stickBarHeight = data.height;
				})
				.exec();
		}
		if (thiz.load) {
			for (let i = 0; i < thiz.tabList.length; i++) {
				uni.createSelectorQuery()
					.select('#tab' + i)
					.boundingClientRect(data => {
						thiz.tabList[i].top = data.top + e.scrollTop;
						thiz.tabList[i].bottom = data.bottom + e.scrollTop;
						// console.log(i+"="+thiz.tabList[i].name+" top:"+thiz.tabList[i].top+" || bottom:"+thiz.tabList[i].bottom)
					})
					.exec();
			}
			uni.createSelectorQuery()
				.select('#tvideo')
				.boundingClientRect(data => {
					thiz.videoBottom = data.bottom + e.scrollTop - thiz.customBar;
					thiz.videoTop = data.top + e.scrollTop - thiz.customBar;
					// console.log(data.top + "+++++++++++++++++" +data.bottom)
				})
				.exec();
			thiz.load = false;
		}

		if (e.scrollTop >= thiz.videoBottom) {
			this.videoContext.pause();
		} else if (e.scrollTop <= thiz.videoTop) {
			this.videoContext.play();
		}
		// console.log("______________scrolled_____________"+thiz.scrolled)
		if (!thiz.isTabTap) {
			let scrollTop = e.scrollTop + (thiz.customBar + thiz.stickBarHeight);
			for (let i = 0; i < thiz.tabList.length; i++) {
				thiz.tabList[i].sight = scrollTop > thiz.tabList[i].top && scrollTop < thiz.tabList[i].bottom;
			}
		}
		let opcity = e.scrollTop / 200;
		if (this.opcity >= 1 && opcity >= 1) {
			return;
		}
		this.opcity = opcity;
	},
	onShareAppMessage(res) {
		this.hidePopup();
		let user = this.zz.getUser();
		return {
			title: '发现奉化 - 水蜜桃',
			path: '/pages/share?path=/pages/special/special&seller=' + user.id
		};
	}
};
</script>

<style>
.txt {
	color: #c26c83;
}

.mybadge {
	/* border-radius: 200rpx; */
	position: absolute;
	top: 0rpx;
	left: 0rpx;
	font-size: 26rpx;
	padding: 0rpx 6rpx;
	height: 38rpx;
	color: #ffffff;
	width: 150rpx;
}
.mybadge-r {
	/* border-radius: 200rpx; */
	position: absolute;
	top: 0rpx;
	right: -0rpx;
	font-size: 26rpx;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}

.bgimg {
	/* background-attachment:fixed; */
	background-repeat: no-repeat;
	height: 240rpx;
	/* z-index: 29 */
	/* background-size:cover; */
	/* -moz-background-size:cover; */
	/* -webkit-background-size:cover; */
}
</style>
