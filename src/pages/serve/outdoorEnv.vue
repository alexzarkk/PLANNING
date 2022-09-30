<template>
	<view>
		<web-view :webview-styles="webviewStyles" :progress="true" src="https://z.szs.run/repo/009.html"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
				    progress: {
				        color: '#FF3333'
				    }
				}
			}
		},
		methods: {
			
		}
	}
</script>