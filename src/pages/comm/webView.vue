<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',
				webviewStyles: {
                    progress: {
                        color: '#FF3333'
                    }
                }
			}
		},
		onLoad(qr) {
			this.url = qr.url
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
