<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">mapbox</block>
		</cu-custom>
		<!-- <zz-map :winH="winH"></zz-map> -->
		
		<button class="cu-btn round bg-ztsgreen" @click="getLoc">getLoc</button> 
		<button class="cu-btn round bg-ztsgreen" @click="watch">watch</button> 
		<v-html v-if="center">
			{{JSON.stringify(center)}}
		</v-html>
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				winH: 400,
				kml: {},
				line: [],
				point: [],
				center: null,
				cur: null,
				gon: []
			}
		},
		onLoad() {},
		mounted() {},
		methods: {
			getLoc(){
				window.amapGeo.getCurrentPosition((_,e)=>{
					this.center = [e.position.getLng(), e.position.getLat(), ~~(e.altitude || 0)]
					this.cur = {
						_id:'curposi',
						t1:2,
						t2:200,
						coord: e.position,
						name:'当前位置'
					}
				})
			},
			watch(){
				window.amapGeo.watchPosition((_,e)=>{
					this.center = e
					this.cur = {
						_id:'curposi',
						t1:2,
						t2:200,
						coord: e.position,
						name:'当前位置'
					}
				})
			},
			
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
		}
	}
</script>

<style>
</style>
