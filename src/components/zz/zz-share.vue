<template>
	<view>
		
	</view>
</template>

<script>
import appShare, { closeShare } from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare';
export default {
	props: {
		basicUrl: {
			type: String,
			default: 'https://zts.5618.co/h5/#/pages/share'
		},
		path: {
			type: String,
			default: ''
		},
		_id: {
			type: String
		},
		title: {
			type: String,
			default: '环浙步道'
		},
		content: {
			type: String,
			default: '来自【环浙步道】app的分享'
		},
		bgImg: {
			type: String,
			default: 'https://zts.5618.co/repo/shareLogo.png'
		},
	},
	data() {
		return {
		}
	},

	mounted() {
	},
	methods: {
		
		
		
		shareLine(cur) {
			// console.log(cur);
			let shareData = {
				shareUrl: 'https://zts.5618.co/h5/#/pages/share?path=/pages/comm/kml&_id=' + cur._id,
				shareTitle: cur.name,
				shareContent: '' + cur.user + '\n' + (cur.desc || cur.createTime),
				shareImg: 'https://zts.5618.co/repo/shareLogo.png',
				appWebUrl: 'https://zts.5618.co/h5/#/pages/share?path=/pages/comm/kml&_id=' + cur._id
			};
			// 调用
			let shareObj = appShare(shareData, res => {
				console.log('分享成功回调', res);
				// 分享成功后关闭弹窗
				// 第一种关闭弹窗的方式
				closeShare();
			});
			setTimeout(() => {
				// 第二种关闭弹窗的方式
				shareObj.close()
			}, 5000);
		}
	}
};
</script>