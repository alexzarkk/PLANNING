<template>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">mapbox</block>
		</cu-custom>
		<block v-if="!loading">
			<zz-map :pms="kml.children" :winH="winH" @add2bl="add2bl"></zz-map>
		</block>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				loading: true,
				// winH: 600,
				winH: this.WinHeight,
				kml: {},
				line: [],
				point: [],
				center: [],
				gon: []
			}
		},
		onLoad() {
			this.loadData()
		},
		mounted() {
			
		},
		methods: {
			
			//三都 622c331943315700013877e7
			//笔架山 628a3dd2c9881500011de64b
			// 60cda51ff183a00001e4399f
			// 笔架山 15
			// 62b7fa05fd3e320001e9debd  台州市域
			// 62b919aa7696a80001ca757f 天台
			
			async loadData(){
				this.kml = await this.zz.req({ $url: 'public/kml/info', _id: '62b7fa05fd3e320001e9debd', plain: true });
				this.loading = false
				// console.log('kml：',this.line, this.point);
			},
			href(u){ this.zz.href(u)},
			
			async add2bl(e){
				
				let o = uni.getStorageSync('_2bl'+e.pid)
				
				console.log(o);
				let t1 = this.zz.clone(o.line[e.i])
				
				console.log(e,t1);
				delete t1.info
				delete t1.t2
				t1.t2 = 110
				t1.kmlId = this.kml._id
				
				// await this.zz.req({ $url: 'public/placemark/add', ...t1 }, true)
				this.loadData()
			}
		}
	}
</script>

<style>
</style>
