<script module="_mapbox" lang="renderjs">
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	// import AMapLoader from '@amap/amap-jsapi-loader'
	import { CompassControl, TerrainControl, FullscreenControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { trans } from '@/comm/geotools.js'
	import { amapKey } from '@/comm/bd'
	
	import '@/comm/libs/mapbox/mapbox.css'
	// import '@/comm/libs/mapbox/draw/mapbox-gl-draw.css'
	
	const geolocation = {
		getCurrentPosition(_onSuccess){
			uni.getLocation({
				success(c){
					_onSuccess({coords:c})
				}
			})
		},
		watchPosition(_onSuccess){
			if(window.wid) clearInterval(window.wid)
			uni.getLocation({
				success(c){
					_onSuccess({coords:c})
					window.wid = setTimeout(()=> { geolocation.watchPosition(_onSuccess) }, 3999)
					return window.wid
				}
			})
		},
		clearWatch(wid){
			clearInterval(wid||window.wid)
		}
	}
			
export default {
	data() {
		return {
			map: null,
			self: null,
			geolocate: {},
			key: {
				mb: 'pk.eyJ1IjoiYWxleHphcmtrIiwiYSI6ImNrcWdzNXdrcjI3NmEyb3F0cmVzd291amcifQ.tPuMJfthzboYHg3MzbKtKw',
				tdt: '70ede380913047ef13bc4dc92ff4f75b',
				amap: amapKey
			},
			
			settings: {
				style: 'mapbox://styles/alexzarkk/ckqt2gqrc650n17nw67q4glqu',
				container: 'mbContainer',
				center: [121,29],
				zoom: 15,
				minZoom: 3,
				maxZoom: 20,
				pitch: 0,
				maxPitch: 0
			}
			
		}
	},
	async mounted() {
		mapboxgl.accessToken = this.key.mb
		window.mbAct = this.mbAct
		this.newMb()
		
		window.addEventListener("popstate", (e)=> {
			// console.log('popstate.back <<<<<<<<<<<')
			window.removeEventListener('resize', this.resize)
			// this.stopLoc()
		}, false)
	},
	methods: {
		resize(e){
			let ct = document.getElementById('mbContainer')
			ct.style[e==1?'width':'height'] = document.body.clientHeight+'px'
			ct.style[e==1?'height':'width'] = document.body.clientWidth+'px'
			this.map.resize()
		},
		async newMb(){
			let map = new mapboxgl.Map(this.settings)
			
			map.addControl(new CompassControl(), 'bottom-right')
			// map.addControl(new LocationControl(), 'bottom-left')
			this.geolocate = new mapboxgl.GeolocateControl({
				positionOptions: { enableHighAccuracy: true, timeout: 10000, geocode: false },
				trackUserLocation: true,
				showUserHeading: true,
				
				// #ifdef APP-PLUS
				geolocation: plus.geolocation
				// #endif
				 
				// #ifdef H5
				geolocation
				// #endif
			})
			
			map.addControl(this.geolocate, 'bottom-left')
			this.geolocate.on('geolocate', _p => {
				console.log('A geolocate event has occurred.', _p.timestamp ,_p.coords.longitude, _p.coords.latitude, _p.coords.altitude)
			})
			
			map.sid = 'default'
			map.pm = {}
			map.nav = {r:{}}
			map._2p = []
			this.map = map
		},
		
		init(self,si,ct,isf,ctrl,t=1) {
			
			let map = this.map
			
			if(t==1) {
				this.self = self
				// this.isf = isf
				// map.sysInfo = si
				
				ctrl = new TerrainControl(isf, map.sid, si.platform)
				map.addControl(ctrl, 'top-left')
				map.addControl(new FullscreenControl(isf), 'top-right')
			}
			
			// #ifdef APP-PLUS
			if(isf) {
				const setTop = (x) => { for (let s of x) { s.style.marginTop = (si.safeArea.top-6)+'px' } }
				setTop(document.getElementsByClassName('mapboxgl-ctrl-top-right'))
				setTop(document.getElementsByClassName('mapboxgl-ctrl-top-left'))
				// plus.screen.lockOrientation('landscape-primary')
				// this.resize(si.platform=='android'?1:0)
				this.resize(0)
				
			}
			//????????????
			if(plus.networkinfo.getCurrentType()<=1 && t>0) {
				let style = comm.getStorage('mbStyle')
				if(style) {
					map.setStyle(style)
					return this.init(self,si,ct,isf,ctrl,0)
				}
				
				t++
				if(t>20) {
					// alert('????????????????????????????????????')
					uni.showToast({
						icon:"error",
						title:'????????????????????????????????????'
					})
				} else {
					console.info('????????????????????????')
					setTimeout(()=>{
						map.remove()
						this.newMb()
						this.init(self,si,ct,isf,ctrl,t)
					}, 10000)
				}
				return
			}
			// #endif
			
			 
			// #ifdef H5
			map.resize()
			if(isf) {
				this.resize()
				window.addEventListener('resize', this.resize)
			}
			// #endif
			
			const evt = (e) =>{
				let _c = (c)=>{return [mbtool.fixNum(c.lng), mbtool.fixNum(c.lat)]},
					center = _c(map.getCenter()),
					zoom = mbtool.fixNum(map.getZoom(), 0),
					bounds = map.getBounds(),
					_ne = _c(bounds.getNorthEast()),
					_sw = _c(bounds.getSouthWest())
					
				return { event: e.type, center, zoom, _ne, _sw }
			}
			if(ct){
				map.setZoom(14)
				map.setCenter(map.sid=='amap'? trans([ct[0],ct[1]]): [ct[0],ct[1]])
			}else{
				map.setZoom(6.5)
			}
			map.on('click', (e) => {
				self.callMethod('mbClick', [mbtool.fixNum(e.lngLat.lng), mbtool.fixNum(e.lngLat.lat)])
			})
			// map.on('rotateend', ()=>{ })
			
			//simple_select direct_select  draw_line_string  draw_polygon  draw_point
			// this.draw = new MapboxDraw({ displayControlsDefault: false,
			// 							// defaultMode: 'draw_polygon',
			// 							})
										
			// map.on('draw.create', e => {
			// 	console.log('draw.create', e);
			// })
			// map.on('draw.delete', e => {
			// 	console.log('draw.delete', e);
			// })
			// map.on('draw.update', e => {
			// 	console.log('draw.update', e);
			// })
			// map.addControl(this.draw)
		
			for (let k in icon) {
				map.loadImage(icon[k], (x,m)=>{ map.addImage(k, m) })
			}
			
			map.on('load', (e) => {
				ctrl.done()
				map.init = true
				self.callMethod('mapDone', true)
				comm.setStorage('mbStyle', map.getStyle())
				
				// this.geolocate.trigger()
			})
			map.on('moveend', (e) => {
				mbtool.on(map)
				self.callMethod('mbEvent', evt(e))
			});
			map.on('zoomend', () => {
				mbtool.on(map)
			})
		},
		
		async updateData({exec=null, sysInfo={}, center=null, pms=null, line=[], point=[], gon=[], isf=false}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, sysInfo, center, isf)
			
			// console.log('updateData:=======================', center,point,line);
			// console.log('updateData.old:====',ov);
			
			mbtool.setKml(this.map, pms, line, point, gon)
		},
		
		onLoc(){ this.geolocate.trigger() },
		// stopLoc(){ comm.stopWatch() },
		fit(e){ mbtool.setActive(this.map,e) },
		setKml(e) { mbtool.setKml(this.map, null, e.line, e.point, e.gon, 0) },
		runx(e){ mbtool.run(this.map,e) },
		getAround(e){ mbtool.getAround(this.map,null,e) },
		mbAct(e){
			if(this[e.act]) {
				this[e.act](e.e)
			} else {
				this.self.callMethod('mapDo', e)
			}
		}
	}
}
</script>

<template>
    <view>
        <view id="mbContainer" :style="{ height: winH + 'px', width: '100%' }" :prop="mb" :change:prop="_mapbox.updateData"></view>
		
		<view class="cu-modal" :class="video ? 'show' : ''">
		    <view class="cu-dialog">
		        <view class="cu-bar bg-white justify-end">
		            <view class="content">?????????</view>
		            <view class="action" @tap="video=null"><text class="cuIcon-close text-red"></text></view>
		        </view>
		       <video v-if="video" id="myVideo" :src="video" controls></video>
		    </view>
		</view>
    </view>
</template>
<script>
	
export default {
    name: 'zzMap',
    data() {
        return {
			mdone: false,
			mb: {},
			ver: 0,
			sysInfo: {},
			isFullscreen: false,
			video: null
        };
    },
    props: {
		pms: {
            type: Array,
            default: () => {
                return null
            }
        },
        line: {
            type: Array,
            default: () => {
                return []
            }
        },
        point: {
            type: Array,
            default: () => {
                return []
            }
        },
        gon: {
        	type: Array,
        	default: () => {
        	    return []
        	}
        },
		center: {
		    type: Array,
		    default: () => {
		        return []
		    }
		},
		cur: {
		    type: Object,
		    default: () => {
		        return {}
		    }
		},
		refKml: {
		    type: Object,
		    default: () => {
		        return {}
		    }
		},
        winH: {
            type: Number,
            default: 400
        }
    },
    watch: {
        line(e, o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        point(e, o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        gon(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        cur(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'fit', e} }
        },
        refKml(e, o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'setKml', e} }
        },
        winH(e, o) {
			this.exec({m:'resize'})
            this.setProp()
        }
    },
	
    mounted() {
		this.sysInfo = uni.getStorageSync('sysInfo')
		this.isFullscreen = this.winH == this.sysInfo.windowHeight
		if(!this.center.length) {
			if(this.pms) {
				let t=this.pms[0]
				this._center = t.t1==1? t.coord[0]:t.coord
			} else if(this.line.length) {
				this._center = this.line[0].coord[0]
			} else if(this.point.length) {
				this._center = this.point[0].coord
			}
		}else {
			this._center = this.center
		}
        this.setProp()
    },
    methods: {
        setProp() {
			if(this.mdone) {
				this.mb = {
					ver: this.ver++,
				    center: this._center,
					pms: this.pms,
				    line: this.line,
				    point: this.point,
				    gon: this.gon
				}
				if(this.refKml.line) {
					setTimeout(()=> {this.exec({m:'setKml', e:this.refKml})}, 3500)
				}
			} else {
				this.mb = {
				    sysInfo: this.sysInfo,
					isf: this.isFullscreen,
				    center: this._center,
				}
			}
        },
		exec({m,e}){
			this.mb = {exec:{m,e}}
		},
        mapDone(e) {
			this.mdone = e
			this.setProp()
            this.$emit('mapDone', e)
        },
		mbClick(e) {
			// console.log('mapbox.mbClick: ',e);
			this.$emit('mbClick', e);
		},
		mbEvent(e){
			// console.log('mapbox.mbEvent: ',e);
		},
		mapDo(e) {
			// console.log('mapDo ------ >', e)
			switch (e.act){
				case 'loading':
					uni.showLoading({ mask:true })
					break;
				case 'hideloading':
					uni.hideLoading()
					break;
				case 'viewImg':
					this.zz.viewIMG(e.imgs,e.idx)
					break;
				case 'viewVideo':
					this.video = e.url
					break;
				case 'chgStyle':
					this.zz.toast(e.e)
					this.setProp()
					break;
				case 'fullscreen':
					if(e.e) {
					// if(this.isFullscreen) {
						// #ifdef APP-PLUS
						plus.screen.lockOrientation('portrait-primary')
						// #endif
						
						uni.navigateBack()
					} else {
						this.zz.href('/pages/comm/mapboxFullscreen', {pms: this.pms, line:this.line, point:this.point, gon:this.gon, refKml:this.refKml},0,'slide-in-bottom')
					}
					break;
				default:
					this.$emit(e.act, e)
					break;
			}
		}
    }
};
</script>

<style lang="scss"></style>
