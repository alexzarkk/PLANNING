<template>
	<!-- 
			@name:组件模板文件
			@desc：用于新建组件
			@import:
			import xxx from "@/components/ab-components/xxx.vue"
			@date：2020-11-01
			@author: 
	 -->
	<view>
		<!-- @btnTouchstart="btnTouchstart" @btnTouchend="btnTouchend" -->
		<drag-button :isDock="true" :existTabBar="true" @btnClick="btnClick"  @btnTouchstart="btnTouchstart" @btnTouchend="btnTouchend"/>
	</view>
</template>

<script>
import dragButton from '@/components/drag-button/drag-button.vue';

export default {
	components: {
		dragButton
	},
	props: {},
	created() {},
	mounted() {
		uni.getStorageSync("dragConf")
	},
	data() {
		return {};
	},
	methods: {
		btnClick() {
			uni.navigateTo({
				url:'/pages/planning/lineTrack'
			})
		},
		btnTouchstart(){},
		btnTouchend(event){
			// console.log("移动完成",event)
		}
	}
};
</script>

<style lang="scss" scoped></style>
