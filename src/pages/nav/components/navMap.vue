<script module="_mapbox" lang="renderjs">
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	import { CompassControl, LocationControl, TerrainControl, FullscreenControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { trans } from '@/comm/geotools.js'
	import { amapKey } from '@/comm/zz'
	
	import '@/comm/libs/mapbox/mapbox.css'
	
export default {
	data() {
		return {
			map: null,
			self: null,
			
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
				minZoom: 5,
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
			this.stopLoc()
		}, false)
	},
	methods: {
		resize(e){
			let ct = document.getElementById('mbContainer')
			ct.style[e==1?'width':'height'] = document.body.clientHeight+'px'
			ct.style[e==1?'height':'width'] = document.body.clientWidth+'px'
			this.map.resize()
		},
		setTop(e){
			const top = (x) => { for (let s of x) { s.style.marginTop = e+'px' } }
			top(document.getElementsByClassName('mapboxgl-ctrl-top-right'))
			top(document.getElementsByClassName('mapboxgl-ctrl-top-left'))
		},
		newMb(){
			let map = new mapboxgl.Map(this.settings)
			
			map.addControl(new CompassControl(), 'bottom-right')
			// map.addControl(new LocationControl(), 'bottom-left')
			
			map.sid = 'default'
			map.pm = {}
			map.nav = {r:{}}
			map._2p = []
			this.map = map
			
		},
		init(self,si,ct,ctrl,t=1) {
			
			let map = this.map
			
			if(t==1) {
				this.self = self
				ctrl = new TerrainControl(true, map.sid, si.platform)
				map.addControl(ctrl, 'top-left')
			}
			this.setTop(0)
			this.resize(0)
				
			//无网重试
			if(!comm.hadNet()) {
				let style = comm.getStorage('mbStyle')
				if(style) {
					map.setStyle(style)
					return this.init(self,si,ct,ctrl,0)
				}
				
				t++
				if(t>20) {
					uni.showToast({
						icon:"error",
						title:'网络连接失败，请稍后重试'
					})
				} else {
					console.info('超时重载！！！！')
					setTimeout(()=>{
						map.remove()
						this.newMb()
						this.init(self,si,ct,ctrl,t)
					}, 10000)
				}
				return
			}
			map.resize()
			window.addEventListener('resize', this.resize)
			
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
		
			for (let k in icon) {
				map.loadImage(icon[k], (x,m)=>{ map.addImage(k, m) })
			}
			map.on('load', (e) => {
				ctrl.done()
				map.init = true
				self.callMethod('mapDone', true)
				comm.setStorage('mbStyle', map.getStyle())
				// this.onLoc()
			})
		},
		
		async updateData({exec=null, sysInfo={}, center=null, pms=null, line=[], point=[], gon=[]}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, sysInfo, center)
			
			// console.log('map.inited...')
			// console.log('updateData:=======================', center,point,line);
			// console.log('updateData.old:====',ov);
			if(!pms) {
				this.map.on('moveend', (e) => {
					mbtool.on(map)
				});
				this.map.on('zoomend', () => {
					mbtool.on(map)
				});
			}
			mbtool.setKml(this.map, pms, line, point, gon)
		},
		
		onLoc(){ mbtool.onLoc(this.map) },
		stopLoc(){ comm.stopWatch() },
		fit(e){ mbtool.setActive(this.map,e) },
		setKml(e) { mbtool.setKml(this.map, null, e.line, e.point, e.gon, 0) },
		runx(e){ mbtool.run(this.map,e) },
		around(e){ mbtool.getAround(this.map,null,e) },
		fly(e){this.map.flyTo({center: this.map.sid=='amap'? trans(e.coord):e.coord, zoom:16})},
		
		record(e){
			console.log('recording --------',  e);
		},
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
        <view id="mbContainer" :style="{ height: sysInfo.windowHeight + 'px', width: '100%' }" :prop="mb" :change:prop="_mapbox.updateData"></view>
		
		<view class="cu-modal" :class="video ? 'show' : ''">
		    <view class="cu-dialog">
		        <view class="cu-bar bg-white justify-end">
		            <view class="content">短视频</view>
		            <view class="action" @tap="video=null"><text class="cuIcon-close text-red"></text></view>
		        </view>
		       <video v-if="video" id="myVideo" :src="video" controls></video>
		    </view>
		</view>
    </view>
</template>
<script>
	
export default {
    data() {
        return {
			mdone: false,
			mb: {},
			ver: 0,
			sysInfo: uni.getStorageSync('sysInfo'),
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
		rec: {
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
		onRec: {
			type: Boolean,
			default: false
		}
    },
    watch: {
        line(e,o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        point(e,o) {
			if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        gon(e,o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.setProp()
        },
        refKml(e,o) {
            if(o&&JSON.stringify(o)!=JSON.stringify(e)) this.mb = { exec: {m:'setKml', e} }
        },
		
        onRec(e,o) {e:
            if(o!=e) this.mb = { exec: {m:'setTop', e:e?42:0} }
        }
    },
	
    mounted() {
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
				    center: this._center,
				}
			}
        },
		exec({m,e}){ this.mb = {exec:{m,e}} },
        mapDone(e) {
			this.mdone = e
			this.setProp()
            this.$emit('mapDone', e)
        },
		mbClick(e) { this.$emit('mbClick', e) },
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
				default:
					this.$emit(e.act, e)
					break;
			}
		}
    }
};
</script>
<style lang="scss"></style>
