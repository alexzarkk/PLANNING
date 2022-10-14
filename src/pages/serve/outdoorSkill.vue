<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true" ><block slot="content">户外技巧</block></cu-custom>
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
				['3.1 徒步', '029.html'],
				['3.2 跑步', '030.html'],
				['3.3 爬山', '031.html'],
				['3.4 骑行', '032.html'],
				['3.5 露营', '033.html'],
				['3.6 溯溪', '034.html'],
				['3.7 探洞', '035.html'],
				['3.8 定向运动', '036.html'],
				['3.9 冲浪运动', '037.html']
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
