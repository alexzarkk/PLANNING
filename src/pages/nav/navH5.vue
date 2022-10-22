<script module="_mapbox" lang="renderjs">
	import mapboxgl from '!mapbox-gl/dist/mapbox-gl'
	import MapboxDraw from '@/comm/libs/mapbox/draw/mapbox-gl-draw'
	import mbtool from '@/comm/libs/mapbox/mbtool.js'
	import comm from '@/comm/comm'
	import icon from '@/comm/libs/icon'
	import { CompassControl, TerrainControl, FullscreenControl } from '@/comm/libs/mapbox/ctrl/index.js'
	import { trans,fixNum } from '@/comm/geotools.js'
	import '@/comm/libs/mapbox/mapbox.css'
	
	// import {temp} from '@/comm/test/locationModule'
	
export default {
	data() {
		return {
			map: null,
			self: null,
			
			key: {
				mb: 'pk.eyJ1IjoiYWxleHphcmtrIiwiYSI6ImNrcWdzNXdrcjI3NmEyb3F0cmVzd291amcifQ.tPuMJfthzboYHg3MzbKtKw',
				tdt: '70ede380913047ef13bc4dc92ff4f75b'
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
			// #ifdef H5
			const geolocation = {
				getCurrentPosition(_onSuccess){
					uni.getLocation({
						success(c){
							_onSuccess({coords:c})
						}
					})
				},
				// watchPosition(_onSuccess){
				// 	temp.t ++
				// 	_onSuccess({
				// 		timestamp: Date.now(),
				// 		coords: {
				// 			longitude: temp.coord[temp.coord.length-temp.t][0],
				// 			latitude: temp.coord[temp.coord.length-temp.t][1],
				// 			altitude: temp.coord[temp.coord.length-temp.t][2]
				// 		}
				// 	})
					
				// 	window.wid = setTimeout(()=> { 
				// 		if(temp.t==temp.coord.length) temp.t = 0
				// 		geolocation.watchPosition(_onSuccess) 
				// 	}, 3999)
					
				// 	return window.wid
				// },
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
			// #endif
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
			map.addControl(new CompassControl(), 'bottom-right')
			
			map.sid = 'default'
			map.pm = {}
			map.nav = {r:{}}
			map._2p = []
			this.map = map
		},
		
		init(self,si,ct,ctrl,t=1) {
			
			let map = this.map
			
			if(t==1) {
				this.si = si
				this.self = self
				ctrl = new TerrainControl(true, map.sid, si.platform)
				map.addControl(ctrl, 'top-left')
			}
			this.setTop(10 + si.statusBarHeight)
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
				
				document.getElementsByClassName('mapboxgl-ctrl-geolocate')[0].style.display = 'none'
				this.geolocate.on('geolocate', _p => {
					// console.log(_p);
					this.self.callMethod('onLocating', [fixNum(_p.coords.longitude), fixNum(_p.coords.latitude), ~~(_p.coords.altitude || 0), (~~_p.timestamp||Date.now())])
				})
			})
			map.on('moveend', (e) => {
				mbtool.on(map)
				self.callMethod('mbEvent', evt(e))
			});
			map.on('zoomend', () => {
				mbtool.on(map)
			})
		},
		
		async updateData({exec=null, sysInfo={}, center=null, pms=null, line=[], point=[], gon=[]}, ov, self) {
			if(exec) return this[exec.m](exec.e)
			let map = this.map
			if (!map) return
			if (!map.init) return this.init(self, sysInfo, center)
			mbtool.setKml(this.map, pms, line, point, gon, 0)
		},
		
		trigger(on){
			this.setTop(((on?42:0) + this.si.statusBarHeight))
			this.onLoc()
		},
		onLoc(){ this.geolocate.trigger() },
		fit(e){ mbtool.setActive(this.map,e) },
		setKml(e) { mbtool.setKml(this.map, null, e.line, e.point, e.gon, 0) },
		fly2(e){this.map.flyTo({center: this.map.sid=='amap'? trans(e.coord):e.coord, zoom:16})},
		runx(e){ mbtool.run(this.map,e) },
		getAround(e){ mbtool.getAround(this.map,null,e) },
		setLine(e){
			console.log('map.setLine',  e);
			let map = this.map
			const darw = (coord, id, t2, name)=>{
				if(coord.length<2) return mbtool.removeObj(map, id)
				
				if(map.getSource(id)) {
					this[id].data.geometry.coordinates = coord
					map.getSource(id).setData(this[id].data)
				} else {
					let line = {
						t1: 1,
						_id: id,
						t2,
						coord,
						name
					}
					this[id] = mbtool.createGeo(line, map.sid)
					map.addSource(id, this[id])
					map.addLayer(mbtool.layerLine(line))
				}
			}
			
			if(e.coord) {
				darw(e.coord,'recLine', 190, '记录中')
			}
			
			if(e.line) {
				darw(e.line,'cpLine', 192, '目标打卡点')
			}
		},
		setPoi(e){
			console.log('map.setPoisetPoisetPoisetPoi',e);
			if(e.add) mbtool.setPoint(this.map, e.add)
			if(e.del) mbtool.removeObj(this.map, e.del)
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
<page-meta root-font-size="10px"></page-meta>
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

		<image v-if="locating" class="back-img loading" :style="'top:'+(stH+312)+'px;'"></image>
		<image v-else @click="controltap('position')" src="@/static/position.png" class="back-img" :style="'top:'+(stH+310)+'px;'"></image>
		<image @click="controltap('scan')" src="@/static/scan.png" class="back-img" :style="'top:'+(stH+(onRec?60:100))+'px;'"></image>
		
		<block v-if="!onRec">
			<image @click="controltap('back')" src="@/static/back.png" class="back-img" :style="'top:'+(stH+20)+'px;'"></image>
			<view class="start-f" v-if="mdone">
				<view class="start-btn" @click="start">
					<text class="start-btn-name">开始记录</text>
				</view>
			</view>
		</block>
		<block v-else>
			<image @click="controltap('camera')" src="@/static/camera.png" class="back-img" :style="'top:'+(stH+130)+'px;'"></image>
			<!-- #ifndef H5-ZLB -->
			<image @click="controltap('v')" src="@/static/video.png" class="back-img" :style="'top:'+(stH+200)+'px;'"></image>
			<!-- #endif -->
			<fab :tim="tim" @info="info" @stop="stop" @onPuase="onPuase" />
		</block>
		
	</view>
</template>

<script>
const tts = {speak(){}}
import { uniqId, bearing, getDist, getLocation, calData, fixNum } from '@/comm/geotools'
import { toDist, scan } from '@/comm/nav'

import icon from '@/comm/libs/icon'
import comm from '@/comm/comm'
import sync from '@/comm/sync'

import fab from './components/fab'

export default {
	components: { fab },
	data() {
		return {
			sysInfo: uni.getStorageSync('sysInfo'),
			winH: 0,
			stH: 0,
			kml: {children:[]},
			tmt: 0,
			cp: {},
			cps: [],
			way: {},
			minDist: 60,
			
			mapHeight: 0,
			center: [121,30],  //121.53537, 29.64611
			scale: 15,
			point: [],
			line: [],
			onRec: false,
			puase: false,
			tim: {H:0, M:0, S:0, MS:0},
			rec: {},
			
			timer: null,
			lock: false,
			
			// isConn: true,
			locating:false,
			mdone: false,
			mb: {},
			ver: 0,
			video: null
		}
	},
	
	async onLoad({v}) {
		this.stH = this.sysInfo.statusBarHeight + 60
		this.mapHeight = this.winH
		uni.removeStorageSync('cur_loc_wgs84')
		
		if(v) {
			let { kml, tmt = 0 } = this.zz.getParam(v)
			
			this.kml = kml
			this.tmt = tmt
			for (let s of kml.children) {
				if(s.t1==1) {
					this.way = s
					s.t2 = 199
				}
				if(s.t1==2) {
					if(tmt) this.cps.push(s)
					s.t2 = 201
				}
			}
			
			//设定地图center
			// let p = this.point[0]
			// if(!p) p = this.way.coord[0]
			this.center = this.way.coord[0]
		} else {
			await this.getLoc(true)
		}
		
		//是否赛事
		if(this.tmt) {
			// this.start()
		}else{
			this.zz.req({$fn:'sync' + this.zz.rndInt(0,4), $url:'/user/rec/sync',get:1}).then(e=>{
				console.log(e);
				if(e&&(e.rec.point.length||e.rec.coord.length)&&!uni.getStorageSync('nav_rec'+this.tmt)) {
					uni.setStorageSync('nav_rec'+this.tmt, e.rec)
					uni.setStorageSync('nav_T_tim'+this.tmt, [e.tim.MS, e.tim.S, e.tim.M, e.tim.H])
				}
			})
		}
		await this.around(this.center)
		console.log(this.cps)
	},
	async onShow() {
		let poi = uni.getStorageSync('nav_poi')
		if (poi) {
			uni.removeStorageSync('nav_poi')
			let idx = this.rec.point.findIndex(e=>e._id==poi._id)
			if(idx==-1) {
				this.rec.point.push(poi)
				this.fly(poi.coord)
			}else{
				this.rec.point.splice(idx,1,poi)
			}
			poi.editble = 1
			this.exec({m:'setPoi', e:{add:[poi]} })
			this.setRec()
			sync.go()
		}
		let qr = uni.getStorageSync('scanCode')
		if(qr) {
			uni.removeStorageSync('scanCode')
			let p = await scan(uni.getStorageSync('cur_loc_wgs84'),{text:qr})
			this.scaned(p)
		}
	},
	onBackPress() { return this.onRec },
	mounted() { this.setProp() },
	methods: {
		setProp() {
			if(this.mdone) {
				this.mb = {
					ver: this.ver++,
				    center: this.center,
					pms: this.kml.children
				}
			} else {
				this.mb = {
				    sysInfo: this.sysInfo,
				    center: this.center,
				}
			}
		},
		exec({m,e}){ this.mb = {exec:{m,e}} },
		mapDone(e) {
			this.mdone = e
			this.setProp()
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
					this.this.zz.viewIMG(e.imgs,e.idx)
					break;
				case 'viewVideo':
					this.video = e.url
					break;
				case 'chgStyle':
					this.this.zz.toast(e.e)
					this.setProp()
					if(this.onRec) {
						setTimeout(()=> {
							this.exec({m:'setPoi', e:{add:this.rec.point} })
						}, 200)
					}
					break
				default:
					this.markertap(e)
					break;
			}
		},
		mbEvent(e) { this.lock = false },
		setRec(){uni.setStorageSync('nav_rec'+this.tmt, this.rec)},
		async around(c){
			if(!this.tmt) {
				this.cps = await comm.around(c)
			}
		},
		async getLoc(ct,c){
			if(!c){
				this.locating = true
				let {coord} = await getLocation()
				this.locating = false
				c = coord
			}
			if(ct) this.fly(c)
			this.lock = true
		},
		fly(c){ this.exec({m:'fly2', e:{coord:c}}) },
		stop(){
			let rec = this.rec
			this.onRec = false
			this.exec({m:'trigger', e:0})
			uni.removeStorageSync('cur_loc_wgs84')
			if(rec.coord.length<10 && !rec.point.length) return this.zz.modal('本次记录太短了！')
			
			rec.info = calData(rec.coord)
			this.setRec()
			this.zz.href('/pages/nav/save',{tmt: this.tmt}, 1, null, 'redirectTo')
		},
		clock(){
			let tim = this.tim
			this.timer = setInterval(()=>{
			  tim.MS += 1000
			   if(tim.MS >= 1000) {
					tim.MS = 0
					tim.S += 1
			   }
			   if(tim.S >= 60) {
					tim.S = 0
					tim.M += 1
			   }
			   if(tim.M >= 60) {
					tim.M = 0
					tim.H += 1
			   }
			   uni.setStorageSync('nav_T_tim'+this.tmt, [tim.MS, tim.S, tim.M, tim.H])
			}, 1000)
		},
		async start(){
			// #ifndef H5-ZLB
				//提示下载app
				// const [_, ask] = await uni.showModal({
				// 	title: '提示',
				// 	content: '环浙步道app！',
				// 	cancelText: '去设置',
				// 	confirmText: '不再提醒'
				// })
				// if (ask.cancel) {
				// 	return locationModule.gotoNativePage()
				// } else {
				// 	uni.setStorageSync('dontAskAndroid',1)
				// }
			// #endif
			
			let init = () => {
					uni.removeStorageSync('nav_rec'+this.tmt)
					sync.add({$url:'/user/rec/sync',init:1,startTime:rec.startTime})
				},
				tim = {H:0, M:0, S:0, MS:0},
				rec = {
					startTime: this.zz.now(),
					stopTime: 0,
					endTime: 0,
					t: {},
					point:[],
					coord:[],
					line: []
				}
				
			// 安卓设备需要主动开启后台定位
			const [_, ask] = await uni.showModal({
				title: '提示',
				content: '为确保轨迹正常记录，请勿退出页面或关闭屏幕！',
				// cancelText: '知道了',
				confirmText: '知道了'
			})
			
			// 查询本地是否有未完成的轨迹记录
			let nav_rec = uni.getStorageSync('nav_rec'+this.tmt)
			if (nav_rec) {
				if(this.zz.now() > (nav_rec.startTime + 1000*60*60*24 * 89)){
					init()
				}else{
					const [_, res] = await uni.showModal({
						title: "是否继续上次轨迹记录?",
						content: "取消后，上次记录将会被删除！"
					})
					if (res.confirm) {
						rec = nav_rec
						let T = uni.getStorageSync('nav_T_tim'+this.tmt)
						tim.MS = T[0]
						tim.S = T[1]
						tim.M = T[2]
						tim.H = T[3]
					} else { //删除缓存和数据库
						init()
					}
				}
			} else { //新建
				init()
			}
			
			rec.kmlId = this.kml._id || 0
			rec.tmt = this.tmt
			this.tim = tim
			this.rec = rec
			this.onRec = true
			this.clock()
			this.exec({m:'trigger',e:1})
		},
		onLocating(c1){
			uni.setStorageSync('cur_loc_wgs84', c1)
			console.log('onLocating ---------->', c1)
			//保持地图中心
			if (this.lock) this.fly(c1)
			
			if(this.onRec&&!this.puase) {
				let	rec = this.rec,
					tim = this.tim,
					cps = this.cps,
					size = rec.coord.length,
					say = () => {
						if (tim.H && !rec.t['t'+tim.H]) {
							rec.t['t'+tim.H] = 1
							delete rec.t['t'+(tim.H-1)]
							tts.speak('您已运动' + tim.H + '小时，累计距离' + rec.info.len + '米，爬升' + rec.info.up + '米，下降' + rec.info.down + '米')
						}
						if (rec.info.len > 980) {
							for (var i = 0; i < 12; i++) {
								let g = i + rec.info.len
								if (g % 1000 == 0 && !rec.t['l'+g]) {
									rec.t['l'+g] = 1
									delete rec.t['l'+(g-1)]
									let d = calData(rec.point)
									tts.speak('您已运动' + (g / 1000) + '公里，累计爬升' + rec.info.up + '米，下降' + rec.info.down + '米')
									break
								}
							}
						}
					},
					keepSync = (len)=>{
						// 刷新附近cps
						if((!len||len%77==0) && !rec.t['y'+len]) {
							rec.t['y'+len] = 1
							delete rec.t['y'+(len-77)]
							comm.on(c1)
							console.log('刷新cpscpscpscpscpscps');
						}
						// 更新打卡点距离
						if(!this.tmt && (!len||len%55==0) && !rec.t['x'+len]) {
							rec.t['x'+len] = 1
							delete rec.t['x'+(len-55)]
							this.around(c1)
						}
						
						// 打卡提醒 
						if((!len||len%6==0) && !rec.t[len] &&cps.length) {
							rec.t[len] = 1
							delete rec.t[len-6]
							
							toDist(c1, cps, this.tmt? this.way.coord:null)
							cps.sort(this.zz.compare('dist'))
							
							//找未扫过的最近的一个
							const getUnscaned=(log,i=0)=>{
								let scaned = log[cps[i]._id]
								if (!scaned || (this.zz.now() - scaned[scaned.length-1]) > 1000*60*60*24) {
									return cps[i]
								} else {
									i++
									if(i<cps.length) return getUnscaned(log,i)
								}
							}
							
							let p = getUnscaned(uni.getStorageSync('user_scan_log')||{temp:[]})
							
							// console.log(p,'checkcps .............',cps,rec.line);
							if(p) {
								this.cp = p
								if(p.dist <= 500) {
									rec.line[1] = p.coord
								} else {
									if(rec.line[1]) rec.line[1].splice(1,1)
									// setTimeout(()=>{
									// 	this.exec({m:'setPoi', e:{del:this.cp._id } })
									// }, 50);
								}
								if(p.dist <= this.minDist) {
									//显示打卡点
									setTimeout(()=>{ 
										this.exec({m:'setPoi', e:{ add:[{ ...p,name: p._id, t2:90 }] } })
									}, 100)
									
									if(!rec.t[p._id]) {
										rec.t[p._id] = true
										tts.speak('您已到达'+(p.sn||p.name||p._id)+'附近，'+(this.tmt?'请扫码步道柱二维码完成打卡':'您可以扫码步道柱二维码完成足迹打卡'))
									}
								}
							}
						}
						
						// 同步服务器数据
						if(len&&len%10==0&&!rec.t['z'+len]) {
							rec.t['z'+len] = 1
							delete rec.t['z'+(len-10)]
							let task = {$url: '/user/rec/sync', coord:[], len, tim: this.tim, stopTime: rec.stopTime}
							for (var i = (len-10); i < len; i++) {
								task.coord.push(rec.coord[i])
							}
							sync.add(task)
						}
					}
				
				rec.line[0] = c1
				
				if (!size) {
					rec.coord.push(c1)
					keepSync(0)
				}else{
					let c2 = rec.coord[size-1],
						len = getDist(c1[0], c1[1], c2[0], c2[1], c1[2], c2[2])
					
					//大于6m 小于60m/每秒 判断有效
					if(len>=6 && (len/((c1[3]-c2[3])*1000) < 60)) {
						rec.coord.push(c1)
						
						// 去除漂移点
						if (size > 2) {
							let r1 = rec.coord[size - 3],
								r2 = rec.coord[size - 2],
								r3 = rec.coord[size - 1],
								
								b1 = bearing(r2, r1),
								b2 = bearing(r2, r3)
												
							if (~~Math.abs(b1 - b2) < 15) {
								rec.coord.splice(size - 2, 1)
								console.info('去除漂移------1',b1,b2, ~~Math.abs((b1-b2)))
							}
						}
					}
					keepSync(rec.coord.length)
				}
				rec.info = calData(rec.coord)
				say()
				this.setRec()
				this.exec({m:'setLine', e:{coord:rec.coord,line:rec.line}})
				console.info(rec)
			}
		},
		async controltap(t) {
			if(t=='back') {
				uni.navigateBack()
			}
			if(t=='scan') {
				// #ifdef H5-ZLB || APP-PLUS
				let p = await scan()
				return this.scaned(p)
				// #endif
				uni.navigateTo({ url:'/pages/nav/scan', animationType:"slide-in-bottom" })
			}
			if(t=='position') {
				this.getLoc(1)
			}
			if(t=='v' || t=='camera') {
				let e = t=='v'? await this.zz.chooseVideo({}) : await this.zz.chooseImage({})
				if(e) {
					let poi = {
							_id: uniqId(),
							name: '',
							t1: 2,
							t2: t=='v'? 60:50,
							coord: uni.getStorageSync('cur_loc_wgs84'),
							desc: '',
							time: this.zz.time2Date(),
							imgs: t=='v'? []:e,
							video: t=='v'? e:null
						}
					this.zz.href('/pages/nav/point', poi, 1, 'slide-in-right')
				}
			}
		},
		scaned(p){
			if(p) {
				if(this.rec.line[1]) this.rec.line.splice(1,1)
				this.rec.t[p._id] = 1
				this.fly(p.coord)
				this.exec({m:'setPoi', e:{del: this.cp._id, add:[p]} })
			}
		},
		
		onPuase(e){
			console.log('onPuase', e);
			this.puase = e
			let r = this.rec
			if(e){
				r.name = this.zz.time2Date()
				r.endTime = this.zz.now()
				clearInterval(this.timer)
			} else {
				r.stopTime += this.zz.now() - r.endTime
				this.clock()
			}
			this.setRec()
		},
		
		async markertap(e) {
			let rec = this.rec,
				idx = rec.point.findIndex(x => x._id == e.id)
				
			if(idx!=-1) {
				let poi = rec.point[idx]
				// 编辑
				if (e.act == 'edit') {
					this.zz.href('/pages/nav/point', poi, 1, 'slide-in-right')
				}
				
				//删除
				if (e.act == 'del') {
					const [_, m] = await uni.showModal({
						title: '确认要删除吗？',
						content: '删除将无法恢复！'
					})
					if (m.confirm) {
						for (let filePath of poi.imgs) {
							this.zz.removeFile(filePath)
						}
						if(poi.video) {
							this.zz.removeFile(poi.video.tempFilePath)
						}
						rec.point.splice(idx, 1)
						this.setRec()
						sync.add({$url:'/user/rec/sync',xp:[poi._id]})
						this.exec({m:'setPoi', e:{del: e.id} })
					}
				}
			}else{
				//非采集坐标
			}
		},
		
		info() {
			if(this.rec.info) uni.navigateTo({ url:'/pages/nav/info', animationType:"slide-in-top" })
		}
	}
};

</script>
<style>
.start-f {
	position: fixed;
	bottom: 100rpx;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0);
	z-index: 1;
}

.start-btn-name {
	font-size: 14px;
	font-weight: 500;
	color: #ffffff;
}
.start-btn {
	width: 400rpx;
	height: 80rpx;
	background-color: #0081ff;
	box-shadow: 0 30upx 20upx rgba(0, 0, 0, 0.2);
	display: flex;
	border-radius: 40rpx;
	align-items: center;
	justify-content: center;
	flex-direction: row;
}
	
.back-img {
	position: fixed;
	left: 6px;
	width: 42px;
	height: 42px;
	border-radius: 50%;
}
.loading {
	/* background-color: #ffffff; */
	width: 38px;
	height: 38px;
	left: 8px;
}
</style>
