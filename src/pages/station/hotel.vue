<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">特色民宿</block>
		</cu-custom>
		
		<block v-if="list.length>0">
		
			<tui-divider :gradual="true" :gradualColor="gradualColor">民宿推介</tui-divider>
			<card-bgimg :list="list" :btn="true" @change="change"></card-bgimg>
			
		</block>
		
		<view class="padding-tb solid-top" v-if="list.length>10">
			<tui-footer :copyright="bd.sys.footer.content" :fixed="false" :navigate="bd.sys.footer.navigate" tui-footer-class="tui-custom"></tui-footer>
		</view>
		
		<tui-scroll-top :scrollTop="scrolled"></tui-scroll-top>
		<zz-loc ref="loc"></zz-loc>
	</view>
</template>

<script>
	import cardBgimg from '@/components/zzxb/card-bgimg.vue'
	export default {
		components:{ cardBgimg },
		data() {
			return {
				gradualColor: ['red', '#4a67d6'],
				scrolled: 0,
				current: -1,
				list:[]
				
			}
		},
		onLoad:async function(option) {
			this.loading = true
			let list = await this.zz.req({$url: 'public/poi/list', deptId: bd.sys.code, type: 4012 })
			// console.log('tab.list ----->', list);
			await this.$refs.loc.onLoc(list)
			this.list = list
			this.loading = false
		},
		onPageScroll: function(e){
			this.scrolled = e.scrollTop
		},
		methods: {
			change(o,i){this.list[i]=o;this.scrolled++}
		},
		onShareAppMessage(res) {
			if(res.target){
				let id = res.target.dataset.id
				let title = res.target.dataset.title
				return {
				    title: title,
				    path: '/pages/share?path=/pages/about/city/poi/poi&id='+id
				}
			} else {
				return {
					title: '发现奉化 - 民宿',
					path: '/pages/share?path=/pages/about/city/hotel/hotel',
				}
			}
		}
	}
</script>

<style>

</style>
