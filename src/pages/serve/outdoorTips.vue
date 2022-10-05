<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true" ><block slot="content">户外知识</block></cu-custom>

		<block v-for="(e,i) in list" :key="i">
			<tui-list-cell arrow>
				<slot>
					<view class="padding-left-sm text-grey" @click="href(e[1])"> {{e[0]}}</view>
				</slot>
			</tui-list-cell>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				['1.1 什么是户外运动？', '001.html'],

				['1.2 户外运动与不同人群', '002.html'],

				['1.3 户外运动与风险控制', '003.html'],

				['1.4 户外运动与身体保护', '004.html'],

				['1.5 户外运动与方位判断', '005.html'],

				['1.6 户外运动与天气', '006.html'],

				['1.7 户外运动与水', '007.html'],

				['1.8 户外运动与食品', '008.html'],

				['1.9 户外运动与环境环保', '009.html'],

				['1.10 户外运动与山野安全须知', '010.html'],

				['1.11 户外运动与徒步旅行安全须知', '011.html'],

				['1.12 户外运动与水上运动安全须知', '012.html'],

				['1.13 户外运动与高海拔安全须知', '013.html'],

				['1.14 一次完整的出行规划', '014.html']
			]
		};
	},
	methods: {
		href(u){
			this.zz.href('/pages/comm/webView?url=https://z.szs.run/repo/'+u)
		}
	}
};
</script>

<style></style>
