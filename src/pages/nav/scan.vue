<template>
	<view>
		<mumu-get-qrcode @success='qrcodeSucess' @error="qrcodeError" ></mumu-get-qrcode>
	</view>
</template>
<script>
	import mumuGetQrcode from '@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue'
	export default {
		components: {
			mumuGetQrcode
		},
		methods: {
			qrcodeSucess(data) {
				uni.setStorageSync('scanCode', data)
				uni.navigateBack()
				// uni.showModal({
				// 	title: '成功',
				// 	content: data,
				// 	success: () => {
				// 		uni.navigateBack({})
				// 	}
				// })
			},
			qrcodeError(err) {
				uni.showModal({
					title: '摄像头授权失败',
					content: '摄像头授权失败，请检测当前浏览器是否有摄像头权限。',
					success: () => {
						uni.navigateBack({})
					}
				})
			}
		}
	}
</script>
