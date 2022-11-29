<template>
	<view>
		<view class="cu-list menu bg-white">
			<view class="cu-item" v-for="(e, i) in entrance" :key="i">
				<view class="content padding-tb-sm text-cut">
					<view>
						<text class="cuIcon-activity margin-right-xs "></text>
						<view class="text-cut text-dark" style="width:500rpx">{{e.title}}：{{e.addr}}</view>
					</view>
					<view class="text-gray text-sm" v-if="e.dist">
						<text class="margin-right-xs"></text>
						距你当前距离 {{e.dist?zz.math(e.dist/1000,2):0}} km
					</view>
				</view>
		
				<!-- <view class="action" @tap="openLocation(e)">
					<view class="flex flex-direction padding-tb-sm">
						<button class="cu-btn round bg-red shadow sm">
							<text class="cuIcon-forward margin-right-xs"></text>
							地图
						</button>
						<text class="text-gray text-xs margin-top-xs">地图查看/导航</text>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
import { trans, dist, uniqId } from '@/comm/geotools'

export default {
	data() {
		return {
			entrance: []
		};
	},
	props: {
		kml: {
			type: Object,
			default: () => { return {}}
		},
		coord: {
			type: Array,
			default: () => { return []}
		},
	},
	watch: {
	    kml(v, o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(v)) this.init()
	    }
	},
	
	mounted: function(){
		this.init()
	},
	methods: {
		init: async function() {
			let kml= this.kml, start, arr=[]
			const setEnt = async(c,title)=>{
				let coord = trans(c),
					e = await this.zz.reGeo(coord)
				arr.push({
					id: uniqId(),
					title,
					addr: e.formatted_address,
					coord,
				})
				return e
			}
			
			if(this.coord.length) {
				let c = this.coord
				start = await setEnt(c[0], c.length==1?'地址':'起点')
				if(dist(c[0],c[c.length-1]) > 1000) {
					await setEnt(c[c.length-1], '终点')
				}
			} else {
				if(kml.start) {
					start = await setEnt(kml.start, '起点')
					if(kml.loop>1000) await setEnt(kml.end, '终点')
				}
				if(kml.place) await setEnt(kml.place, '地址')
			}
			
			// await this.$refs.loc.onLoc(arr)
			this.entrance = arr
			this.$emit('addr', start)
		},
		async openLocation(e) {
			uni.openLocation({
				longitude: e.coord[0],
				latitude: e.coord[1],
				name: e.addr,
				// address: e.addr
			})
		}
	}
}
</script>

<style>
</style>
