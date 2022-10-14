<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true" >
			<block slot="content">{{title}}</block>
		</cu-custom>
		
		<view class="cu-bar"></view>
		<tui-no-data :fixed="false" :imgUrl="bd.imgs.nodata">暂无数据</tui-no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bd: this.bd,
				title:''
				
			}
		},
		onLoad(option) {
			this.title = option.title
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
