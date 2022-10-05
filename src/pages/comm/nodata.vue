<template>
	<view>
		<cu-custom bgColor="bg-dark" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">{{title}}</block>
		</cu-custom>
		
		<view class="cu-bar"></view>
		<tui-no-data :imgWidth="300" :imgHeight="300" :fixed="true" :imgUrl="bd.imgs.nodata" />
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
			this.title = option.title||''
		},
		methods: {
			
		}
	}
</script>

<style>
page {
    background-color: #ffffff;
}

</style>
