<template>
	<view>
		<nav-h5 ref="map" :center="center" :pms="kml.children" :rec="rec"></nav-h5>
		<mumu-get-qrcode ref="scan" @success='qrcodeSucess'></mumu-get-qrcode>
		
		<image @click="controltap('position')" src="@/static/position.png" class="back-img" :style="'top:'+(stH+310)+'px;'"></image>
		<image @click="controltap('scan')" src="@/static/scan.png" class="back-img" :style="'top:'+(stH+(onRec?60:100))+'px;'"></image>
		
		<block v-if="!onRec">
			<image @click="controltap('back')" src="@/static/back.png" class="back-img" :style="'top:'+(stH+20)+'px;'"></image>
			<view class="start-f">
				<view class="start-btn" @click="start">
					<text class="start-btn-name">开始记录</text>
				</view>
			</view>
		</block>
		<block v-else>
			<!-- <block v-if="!puase"> -->
				
				<image @click="controltap('camera')" src="@/static/camera.png" class="back-img" :style="'top:'+(stH+130)+'px;'"></image>
				<image @click="controltap('v')" src="@/static/video.png" class="back-img" :style="'top:'+(stH+200)+'px;'"></image>
			<!-- </block> -->
			<fab :tim="tim" @info="info" @stop="stop" @onPuase="onPuase" />
		</block>
		
	</view>
</template>

<script>
const tts = {}
import navH5 from './components/nav-h5'
import mumuGetQrcode from '@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue'
import { locationModule, uniqId, bearing, getDist, getLocation, calData, clone, trans, fixNum } from '@/comm/geotools'
import { createEle, toDist, scan, on, around } from '@/comm/nav'
import icon from '@/comm/libs/icon'
import comm from '@/comm/comm'
import sync from '@/comm/sync'
import zz from '@/comm/zz'

import fab from './components/fab'

export default {
	components: { fab ,navH5, mumuGetQrcode },
	data() {
		return {
			sysInfo: uni.getStorageSync('sysInfo'),
			winH: 0,
			stH: 0,
			kml: {children:[]},
			tmt: 0,
			cps: [],
			way: {},
			minDist: 60,
			
			amap: null,
			mapHeight: 0,
			center: [121,30],  //121.53537, 29.64611
			scale: 15,
			point: [],
			line: [],
			onRec: false,
			puase: false,
			tim: {H:0, M:0, S:0, MS:0},
			nav: {line:[], point:[]}, // 基础
			rec: {line:[], point:[]},
			
			timer: null,
			lock: false,
			
			// isConn: true,
		}
	},
	computed: {
		lines() {
			return [...this.nav.line, ...this.line, ...this.rec.line]
		},
		points() {
			return [...this.nav.point, ...this.point]
		}
	},
	async onLoad({v}) {
		this.winH = this.sysInfo.windowHeight
		this.stH = this.sysInfo.statusBarHeight + 60
		this.mapHeight = this.winH
		
		if(v) {
			let { kml, tmt = 0 } = zz.getParam(v)
			
			this.kml = kml
			this.tmt = tmt
			for (let s of kml.children) {
				if(s.t1==1) {
					this.way = s
					this.line.push(createEle(s,1))
				}
				if(s.t1==2) {
					if(tmt) this.cps.push(s)
					this.point.push(createEle(s,1))
				}
			}
			
			//设定地图center
			let p = this.point[0]
			if(!p) p = this.line[0].points[0]
			this.center = [p.longitude, p.latitude]
			
		} else {
			await this.onLoc(true)
		}
		
		//是否赛事
		if(this.tmt) {
			// this.start()
		}else{
			zz.req({$fn:'sync', $url:'/user/rec/sync',get:1}).then(e=>{
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
	// #ifdef APP-PLUS
	onReady() { this.amap = uni.createMapContext('amap', this) },
	// #endif
	async onShow() {
		let poi = uni.getStorageSync('nav_poi')
		if (poi) {
			uni.removeStorageSync('nav_poi')
			let idx = this.rec.point.findIndex(e=>e._id==poi._id)
			if(idx==-1) {
				this.rec.point.push(poi)
				this.point.push(createEle(poi))
				this.fly(poi.coord)
			}else{
				this.rec.point.splice(idx,1,poi)
				this.point.splice(this.point.findIndex(e=>e.id==poi._id),1,createEle(poi))
			}
			this.setRec()
			sync.go()
		}
	},
	onBackPress() { return this.onRec },
	
	methods: {
		setRec(){uni.setStorageSync('nav_rec'+this.tmt, this.rec)},
		async onchg(e){ this.lock = false; on.call(this) },
		async around(c){
			if(!this.tmt) {
				this.cps = await comm.around(c)
			}
		},
		async onLoc(ct,c){
			if(!c){
				let {coord} = await getLocation()
				c = trans(coord)
				uni.setStorageSync('cur_loc_gcj02', c)
			}
			if(ct) this.fly(c)
			this.lock = true
		},
		fly(c){
			if(this.amap) {
				this.amap.moveToLocation({
					longitude: c[0],
					latitude: c[1],
					success: (e)=>{
						setTimeout(()=>{
							this.scale = this.scale==17? 17.01:17
						}, 555)
					}
				})
			}else{
				this.$refs.map.exec({m:'fly', e:{coord:c}})
			}
		},
		
		stop(){
			let rec = this.rec
			this.onRec = false
			locationModule.stopLocation()
			
			// #ifdef APP-PLUS
			this.$scope.$getAppWebview().setStyle({'popGesture':'close'})
			// #endif
			
			if(rec.coord.length<10 && !rec.point.length) return zz.modal('本次记录太短了！')
			zz.href('/pages/nav/save',{tmt: this.tmt}, 1, null, 'redirectTo')
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
			// plus.geolocation.clearWatch(plus.wid)
			
			let pt = (e) => { return {longitude: e[0], latitude: e[1]} },
				init = () => {
					uni.removeStorageSync('nav_rec'+this.tmt)
					sync.add({$url:'/user/rec/sync',init:1,startTime:rec.startTime})
				},
				tim = {H:0, M:0, S:0, MS:0},
				rec = {
					startTime: zz.now(),
					stopTime: 0,
					endTime: 0,
					t: {},
					point:[],
					coord:[],
					line: [{
							width: 8,
							arrowLine: true,
							points: []
						}]
				},
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
				}
			
			// 安卓设备需要主动开启后台定位
			if (this.sysInfo.platform == 'android' && uni.getStorageSync('dontAskAndroid')=='') {
				const [_, ask] = await uni.showModal({
					title: '提示',
					content: '为确保轨迹在熄屏后的持续记录，请授权手机的电池和后台运行权限！',
					cancelText: '去设置',
					confirmText: '不再提醒'
				})
				if (ask.cancel) {
					return locationModule.gotoNativePage()
				} else {
					uni.setStorageSync('dontAskAndroid',1)
				}
			}
			
			// 查询本地是否有未完成的轨迹记录
			let nav_rec = uni.getStorageSync('nav_rec'+this.tmt)
			if (nav_rec) {
				if(zz.now() > (nav_rec.startTime + 1000*60*60*24 * 89)){
					init()
				}else{
					const [_, res] = await uni.showModal({
						title: "是否继续上次轨迹记录?",
						content: "取消后，上次记录将会被删除！"
					})
					if (res.confirm) {
						rec = nav_rec
						for (let s of rec.point) {
							this.point.push(createEle(s))
						}
						rec.line = [{
								width: 8,
								arrowLine: true,
								points: []
							}]
						for (let s of rec.coord) {
							rec.line[0].points.push(pt(s))
						}
						
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
			
			if(this.cps.length && !rec.line[1]) {
				rec.line[1] = {
								weight: 1,
								color: '#00ff7f',
								dottedLine: true,
								points: []
							}
							// pt(trans(this.cps[0].coord))
			}
			
			rec.kmlId = this.kml._id || 0
			rec.tmt = this.tmt
			this.tim = tim
			this.rec = rec
			this.clock()
			this.onRec = true
			
			// #ifdef APP-PLUS
			this.$scope.$getAppWebview().setStyle({'popGesture':'none'}) //ios有效
			// #endif
			
			locationModule.startLocation({
					intervalTime: 5000,
					distanceFilter: 5,
					notifyTip: '持续定位中',
					notifyTitle: '环浙步道',
					sysName: '环浙步道'
				}, (xiaoming)=>{
					console.log(xiaoming);
					if (xiaoming.success) {
						// console.log('xiaoming --------',xiaoming);
						let _p = xiaoming.data,
							c1 = [fixNum(_p.longitude), fixNum(_p.latitude), ~~_p.altitude||0, _p.timestamp || zz.now(), fixNum(_p.speed||0,2)],
							line = rec.line[0],
							size = rec.coord.length
						
						if(rec.line[1]) rec.line[1].points[0] = pt(c1)
						uni.setStorageSync('cur_loc_gcj02', c1)
						
						if(!this.puase) {
							if (!size) {
								size++
								this.onLoc(true,c1)
								rec.coord.push(c1)
								line.points.push(pt(c1))
							}else{
								let c2 = rec.coord[size-1],
									len = getDist(c1[0], c1[1], c2[0], c2[1], c1[2], c2[2])
								
								//大于6m 小于60m/每秒 判断有效
								if(len>=6 && (len/((c1[3]-c2[3])*1000) < 60)) {
									size++
									rec.coord.push(c1)
									line.points.push(pt(c1))
									
									// 去除漂移点
									if (size > 2) {
										let r1 = rec.coord[size - 3],
											r2 = rec.coord[size - 2],
											r3 = rec.coord[size - 1],
											
											b1 = bearing(r2, r1),
											b2 = bearing(r2, r3)
															
										if (~~Math.abs(b1 - b2) < 15) {
											rec.coord.splice(size - 2, 1)
											line.points.splice(size - 2, 1)
											size--
										}
										console.info('去除漂移------1',b1,b2, ~~Math.abs((b1-b2)))
									}
								}
								
								//保持地图中心
								if (this.lock) this.amap.moveToLocation({ longitude: c1[0], latitude: c1[1] })
							}
							
							// 打卡提醒 
							if((!size || size%6==0) && !rec.t[size]) {
								rec.t[size] = 1
								delete rec.t[size-6]
								
								toDist(trans(c1, 'gcj02towgs84'), this.cps, this.tmt? this.way.coord:null)
								this.cps.sort(zz.compare('dist'))
								
								let p = this.cps[0]
								
								// console.log(p,'checkcps .............',this.cps);
								
								if(rec.line[1]) {
									if(p.dist <= 500) {
										rec.line[1].points[1] = pt(trans(p.coord))
									} else {
										if(rec.line[1].points[1]) rec.line[1].points[1].splice(1,1)
									}
								}
								if(p.dist <= this.minDist && !rec.t[p._id]) {
									rec.t[p._id] = true
									tts.speak('您已到达'+(p.sn||p.name||p._id)+'附近，'+(this.tmt?'请扫码步道柱二维码完成打卡':'您可以扫码步道柱二维码完成足迹打卡'))
									this.point.push(createEle(p,1, icon[90]))
								}
							}
							
							// 刷新cps
							if(size%99==0 && !rec.t['y'+size]) {
								rec.t['y'+size] = 1
								delete rec.t['y'+(size-99)]
								comm.on(trans(c1, 'gcj02towgs84'))
							}
							
							//更新打卡点
							if(!this.tmt && size%101==0 && !rec.t['x'+size]) {
								rec.t['x'+size] = 1
								delete rec.t['x'+(size-101)]
								this.around(trans(c1, 'gcj02towgs84'))
							}
							
							// 更新服务器数据
							if(size%10==0 && !rec.t['z'+size]) {
								rec.t['z'+size] = 1
								delete rec.t['z'+(size-10)]
								let task = {$url: '/user/rec/sync', coord:[], size, tim: this.tim, stopTime: rec.stopTime}
								for (var i = (size-10); i < size; i++) {
									task.coord.push(rec.coord[i])
								}
								sync.add(task)
							}
							
							rec.info = calData(rec.coord)
							say()
							this.setRec()
							console.info(rec)
						}
					} else {
						zz.toast('GPS定位失败，信号弱！')
					}
				}
			)
		},
		
		async controltap(t) {
			if(t=='back') {
				uni.navigateBack()
			}
			if(t=='scan') {
				// #ifdef APP-PLUS
					let p = await scan(trans(uni.getStorageSync('cur_loc_gcj02'), 'gcj02towgs84'))
					this.scaned(p)
				// #endif
				// #ifndef APP-PLUS
					this.$refs.scan.createMsk()
					this.$refs.scan.openScan()
				// #endif
			}
			if(t=='position') {
				this.onLoc(1)
			}
			if(t=='v' || t=='camera') {
				let e = t=='v'? await zz.chooseVideo({}) : await zz.chooseImage({})
				if(e) {
					let {coord} = await getLocation(),
						poi = {
								_id: uniqId(),
								name: '',
								t1: 2,
								t2: t=='v'? 60:50,
								coord: trans(coord),
								desc: '',
								time: zz.time2Date(),
								imgs: t=='v'? []:e,
								video: t=='v'? e:null
							}
					zz.href('/pages/nav/point', poi, 1, 'slide-in-right')
				}
			}
		},
		scaned(p){
			if(p) {
				if(this.rec.line[1]) this.rec.line.splice(1,1)
				
				this.rec.t[p._id] = 1
				this.point.splice(this.point.findIndex(x => x.id == p._id), 1)
				this.point.push(createEle(p,1))
				this.fly(trans(p.coord))
			}
		},
		qrcodeSucess(p) {
			this.scaned(p)
			uni.showModal({
				title: '成功',
				content: p,
				success: () => {
					uni.navigateBack({})
				}
			})
		},
		onPuase(e){
			console.log('onPuase', e);
			this.puase = e
			let r = this.rec
			if(e){
				r.name = zz.time2Date()
				r.endTime = zz.now()
				clearInterval(this.timer)
			} else {
				r.stopTime += zz.now() - r.endTime
				this.clock()
			}
			this.setRec()
		},
		
		async markertap(e) {
			let rec = this.rec,
				point = this.point,
				idx = rec.point.findIndex(x => x._id == e.detail.markerId)
				
			if(idx!=-1) {
				let poi = rec.point[idx]
				const [_,r] = await uni.showActionSheet({ itemList: ['编辑', '删除'] })
				if(r) {
					// 编辑
					if (r.tapIndex == 0) {
						zz.href('/pages/nav/point', poi, 1, 'slide-in-right')
					}
					
					//删除
					if (r.tapIndex == 1) {
						const [__, m] = await uni.showModal({
							title: '确认要删除吗？',
							content: '删除将无法恢复！'
						})
						if (m.confirm) {
							for (let filePath of poi.imgs) {
								zz.removeFile(filePath)
							}
							if(poi.video) {
								zz.removeFile(poi.video.tempFilePath)
							}
							rec.point.splice(idx, 1)
							point.splice(point.findIndex(x => x.id == e.detail.markerId), 1)
							this.setRec()
							sync.add({$url:'/user/rec/sync',xp:[poi._id]})
						}
					}
				}
			}else{
				//非采集坐标
			}
		},
		mapTap(e) {
			
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
	bottom: 80rpx;
	left: 0;
	right: 0;
	flex-direction: row;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0);
	z-index: 1;
}

.start-btn-name {
	font-size: 1.4rem;
	font-weight: 500;
	color: #ffffff;
}
.start-btn {
	width: 400rpx;
	height: 80rpx;
	background-color: #0081ff;
	box-shadow: 0 30rpx 20rpx rgba(0, 0, 0, 0.2);
	
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
}
</style>
