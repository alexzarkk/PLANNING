<template>

	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true"><block slot="content">户外安全</block></cu-custom>

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
				['2.1 野外求救', '015.html'],

				['2.2 户外创伤及心肺复苏的处理', '016.html'],

				['2.3 户外常用药品及其用途', '017.html'],

				['2.4 运动脱臼', '018.html'],

				['2.5 户外踝关节扭伤', '019.html'],

				['2.6 冻伤', '020.html'],

				['2.7 抽筋', '021.html'],

				['2.8 水泡与老茧', '022.html'],

				['2.9 咬伤、蜇伤', '023.html'],

				['2.10 中暑和热昏厥', '024.html'],

				['2.11 落水', '025.html'],

				['2.12 脱水&失温', '026.html'],

				['2.13 高山病', '027.html'],

				['2.14 哽塞', '028.html']
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
