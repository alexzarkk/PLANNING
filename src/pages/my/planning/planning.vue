<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">预约行程</block>
		</cu-custom>
		
		<view class="cu-bar"></view>
		<tui-no-data :fixed="true" :imgWidth="300" :imgHeight="300" :imgUrl="bd.imgs.nodata"></tui-no-data>
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
page {
    background-color: #ffffff;
}
body{
    background-color: #ffffff;
}

</style>
