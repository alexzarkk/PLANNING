<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<view class="cu-bar bg-green search foot">
			<view class="search-form round">
				<text class="cuIcon-search"/>
				<input type="text" placeholder="搜索地名/路线 …" confirm-type="search" v-model="searchKey" @blur="searchTap"></input>
			</view>
			<view class="action text-white" @click="searchTap">
				<text class="cuIcon-search"></text>
				<view class="margin-left-xs">搜索</view>
			</view>
		</view>
		
		<map :style="'width: 100%;height:'+screenHeight+'px'"
			:latitude="latitude"
			:longitude="longitude"
			:scale="scale"
			:markers="markers"
			:polyline="polylines"
			:enable-3D="enable3D"
			:show-location="showLocation"
			:show-compass="showCompass"
			:enable-overlooking="enableOverlooking"
			:enable-zoom="enableZoom"
			:enable-scroll="enableScroll"
			:enable-rotate="enableRotate"
			:enable-satellite="enableSatellite"
			:enable-traffic="enableTraffic"
			:controls="controls"
			@controltap="controltap"
			@regionchange="mpEvt"
		></map>
		
		<view class="cu-modal bottom-modal" :class="modal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{searchKey}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<scroll-view scroll-y class="scrollView" :style="{height:scrollH +'px'}" >
					<view class="">
						<block v-if="searchRes.length>0">
							<view class="cu-list menu sm-border ">
								<block v-for="(m, idx) in searchRes" :key="idx">
									<view class="cu-item">
										<view class="content padding-tb-sm" @click="setCenter(m,16)">
											<view>
												<text class="">{{m.title}}</text>
												<text class="text-gray text-sm padding-left">{{m.dist/1000}}km</text>
											</view>
											<view class="text-gray text-sm flex justify-start">
												<text class="">{{m.addr.formatted_address}}</text>
											</view>
										</view>
										<view class="action">
											<button class="cu-btn sm bg-green shadow" @tap="goHere(m)">导航</button>
										</view>
									</view>
								</block>
							</view>
						</block>
						<block v-else>
							<block v-if="searching"><tui-loadmore></tui-loadmore></block>
							<block v-else><tui-nomore :text="'无匹配数据'"></tui-nomore></block>
						</block>
					</view>
				</scroll-view>
			</view>
		</view>
		<zz-loc ref="loc"></zz-loc>
	</view>
</template>
<script>
import { getDist } from "@/comm/geotools.js"

export default {
	computed: {
		screenHeight() {
			return this.WinHeight + this.CustomBar
		}
	},
	data() {
		return {
			kml:{},
			png: this.bd.sys.png,
			loc:{},
			qqmapsdk:null,
			searchKey: '',
			searching: false,
			searchRes:[],
			modal: false,
			scrollH:200,
			
			markers:[],
			polylines:[],
			
			latitude: 29.65513,
			longitude: 121.40667,
			
			scale: 12,

			showLocation: true,
			showCompass: false,
			enable3D: true,
			enableOverlooking: false,
			enableZoom: true,
			enableScroll: true,
			enableRotate: false,
			enableSatellite: true,
			enableTraffic: false,
			controls: [
					{
						id: 1,
						position: {
							left: 10,
							top: 52,
							width: 42,
							height: 42
						},
						iconPath: '../../static/back.png',
						clickable: true
					},
					{
						id: 2,
						position: {
							left: 10,
							top: 124,
							width: 42,
							height: 42
						},
						iconPath: '../../static/position.png',
						clickable: true
					}
				]
		};
	},

	async onLoad() {
		let kml
		let polyline = uni.getStorageSync('kml_polyline')
		if(this.zz&&this.zz.isLive&&!this.zz.isLive(polyline)) {
			kml = {polyline:[], point:[], place:[]}
			const setMarker = e => {
				let ll = e.loc.split(',')
				kml[e.p].push({
					id: e.id,
					latitude: Number(ll[1]),
					longitude: Number(ll[0]),
					title: e.name,
					zIndex: '1',
					iconPath: this.png+e.p+'.png',
					rotate: 0,
					width: 26,
					height: 26,
					anchor: { x: 0.5, y: 1 },
					callout: {
						content: e.name,
						padding: 4,
						borderRadius: 4,
						color: (e.p=='place'?'#002d3b':'#ff2f7f'),
						bgColor: (e.p=='place'?'#aaffff':'#aaff7f'),
						display: 'BYCLICK'
					}
				})
			}
			
			// await this.req({url:'976', data: {action:'kml', args:{ dist: 40, ele: false}},loadding:true}).then(res=>{
				
				await uni.request({ url:'https://976m.org/GoAction_kml.do?dist=40&ele=false',
					header: { 'content-type': 'application/json', },
					method: 'GET'
				}).then(res=>{
					
				console.log( res[1].data.data)
				let e = res[1].data.data
				for (let i = 0; i < e.kml.length; i++) {
					let s = e.kml[i]
					let lineString = {
										points: [],
										color: s.color,
										width: s.width*1,
										arrowLine: true
									}
					
					let line = s.c.split(' ')
					for (let x of line) {
						let ll = x.split(',')
						if(ll.length>1) lineString.points.push({latitude: Number(ll[1]), longitude: Number(ll[0])})
					}
					if(lineString.points.length>0) kml.polyline.push(lineString)
				}
				for (var i = 0; i < e.place.length; i++) {
					let s = e.place[i]
					setMarker({
						id: 'p'+i,
						name: s.name,
						loc: s.loc,
						p: 'place'
					})
				}
				for (let k in e.point) {
					setMarker({
						id: k,
						name: k,
						loc: e.point[k],
						p: 'point'
					})
				}
				uni.setStorageSync('kml_polyline', kml.polyline)
				uni.setStorageSync('kml_point', kml.point)
				uni.setStorageSync('kml_place', kml.place)
			})
		} else {
			let point = uni.getStorageSync('kml_point')
			let place = uni.getStorageSync('kml_place')
			kml = {polyline, point, place}
		}
		this.kml = kml
		this.getAround(this.longitude, this.latitude, this.scale)
		this.getLoc()
	},
	methods:{
		hideModal(){ this.modal = false },
		async searchTap(){
			if(this.searchKey=='') return
			if(this.searching) return
			this.searching = true
			this.modal = true
			this.searchRes = []
			let mark = []
			for (let s of this.kml.place) {
				if(s.title.includes(this.searchKey)){
					mark.push(s)
				}
			}
			for (let s of mark) {
				if(!s.addr) s.addr = await this.zz.reGeo(s)
				s.dist = this.zz.geo.getDist(this.loc.coord[0],this.loc.coord[1], s.longitude,s.latitude)
			}
			mark.sort(this.zz.compare('dist', true))
			
			if (mark.length>0) {
				this.setCenter(mark[0], 16)
			}
			this.searching = false
			this.searchRes = mark
			// console.log(mark)
		},
		setCenter(e,s){
			this.scale = s
			this.longitude = e.longitude||e.coord[0]
			this.latitude = e.latitude||e.coord[1]
		},
		goHere(e){
			uni.openLocation({
				longitude: e.longitude,
				latitude: e.latitude,
				name: e.title,
				address: e.address
			})
		},
		async controltap({ detail: { controlId: id } }) {
			if (id == 1) {
				uni.navigateBack({ })
			}
			if (id == 2) {
				this.getLoc(true)
			}
		},
		async getLoc(center){
			this.loc = await this.$refs.loc.curLoc()
			if(center) this.setCenter(this.loc,12)
		},
		
		mpEvt(e){
			if(e.type=='end') {
				if(this.excu) return
				const {detail} = e
				this.getAround(detail.centerLocation.longitude, detail.centerLocation.latitude, detail.scale)
			}
		},
		getAround(lon, lat, scale){
			this.excu = true
			let kml = this.kml, line = [], mark = []
			if(scale<12) {
				for (let s of kml.polyline) {
					if(s.width==4) line.push(s)
				}
			} else {
				for (let s of kml.polyline) {
					let around = false, between = 120
					
					const totalpage = Math.ceil(s.points.length / between)
					for (let i = 0; i < totalpage; i++) {
						let c = s.points[i*between]
						if(getDist(c.longitude,c.latitude, lon,lat) < 110000/scale){
							around = true
							break
						}
					}
					if(around) line.push(s)
				}
			}
			if(scale>14) {
				for (let s of kml.place) {
					if(getDist(s.longitude,s.latitude, lon,lat) < 4000){
						s.callout.display = scale>15? 'ALWAYS': 'BYCLICK'
						mark.push(s)
					}
				}
			}
			if(scale>15.5) {
				for (let s of kml.point) {
					if(getDist(s.longitude,s.latitude, lon,lat) < 2500){
						s.callout.display = scale>16? 'ALWAYS': 'BYCLICK'
						mark.push(s)
					}
				}
			}
			this.polylines = line
			this.markers = mark
			this.excu = false
			// console.log(this.polylines)
		}
		
	},
	onShareAppMessage(res) {
		return {
		  title: '奉化健身步道',
		  path: '/pages/share?path=/pages/planning/mapView'
		}
	}
};
</script>
<style>
	.fixed {
		filter:alpha(Opacity=60);
		position: absolute;
		z-index: 999;
	}
	.scrollView {
		width: 100%;
		z-index: 999;
	}
	
</style>
