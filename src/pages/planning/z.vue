<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true" ><block slot="content">环浙步道</block></cu-custom>
		<web-view :webview-styles="webviewStyles" src="https://z.szs.run/z.html?z=-1&o=W0000"></web-view>
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