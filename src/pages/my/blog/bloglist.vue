<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">评论留言</block>
		</cu-custom>
		
		<tui-no-data :fixed="true" :imgUrl="bd.imgs.nodata">暂无数据</tui-no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
