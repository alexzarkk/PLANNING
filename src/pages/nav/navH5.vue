<template>
	<view>
		<map id="amap"
			:style="{width: '750rpx', height: winH + 'px' }"
			:longitude="center[0]"
			:latitude="center[1]"
			:scale="scale"
			
			:min-scale="3"
			:enable-satellite="true"
			:enable-rotate="false"
			:enable-overlooking="false"
			:show-location="true"
			
			:polyline="[...lines]"
			:markers="[...points]"
			
			@regionchange="mapchg"
			@markertap="markertap"
			@tap="mapTap"
		></map>
		
		<image @click="controltap('position')" src="@/static/position.png" class="back-img" :style="'top:'+(stH+260)+'px;'"></image>
		
		<block v-if="onRec">
			<image @click="controltap('back')" src="@/static/back.png" class="back-img" :style="'top:'+(stH+20)+'px;'"></image>
			
			<view class="start-f">
				<view class="start-btn" @click="start">
					<text class="start-btn-name">开始记录</text>
				</view>
			</view>
		</block>
		<block v-else>
			<image @click="controltap('scan')" src="@/static/scan.png" class="back-img" :style="'top:'+(stH+60)+'px;'"></image>
			<image @click="controltap('camera')" src="@/static/camera.png" class="back-img" :style="'top:'+(stH+120)+'px;'"></image>
			<image @click="controltap('video')" src="@/static/video.png" class="back-img" :style="'top:'+(stH+180)+'px;'"></image>
			
			<view class="record" :style="{ paddingTop: stH + 'px'}">
				<view class="record-title">
					<button size="mini" type="default" @click="stop">...</button>
					<view style="display: flex;flex-direction: column;">
						<text style="width: 250rpx; text-align: center; color: #55ff00; font-weight: bold;">{{ (rec.H>9?rec.H:'0'+rec.H)+':'+(rec.M>9?rec.M:'0'+rec.M)+':'+(rec.S>9?rec.S:'0'+rec.S) }}</text>
						<!-- <text style="text-align: center; color: #ff0000; font-weight: bold;">已暂停</text> -->
					</view>
					
					<button size="mini" type="primary" @click="stop">统计数据</button>
				</view>
			</view>
			
			<fab
				:icon="'circle-filled'"
				@fabStartTouch="onStartTouch"
				@fabEndTouch="onEndTouch"
			></fab>
			
			
			<!-- <tui-fab :left="10" :bgColor="'#ff007f'" :right="0" :btnList="btnList" :maskClosable="true"></tui-fab> -->
			
			<!-- <tui-actionsheet  
			  :show="showActionSheet" 
			  :item-list="itemList" 
			  @click="itemClick" 
			  @cancel="closeActionSheet">
			</tui-actionsheet> -->
		</block>
		
		<!-- <view class="mask" :style="{ height: winH + 'px' }" v-if="process > 0">
			<huihui-progress
				:originalColor="process > 0 ? '#EEEEEE' : 'rgba(103,63,63,0)'"
				:processColor="process > 0 ? '#42b983' : 'rgba(103,63,63,0)'"
				innerbgColor="#2d3038"
				:process="process"
				:startPosDegree="0"
				:radius="80"
				:barWidth="20"
			>
				<view class="statistical-end"><view class="statistical-end-before"></view></view>
			</huihui-progress>
		</view> -->
		
	</view>
</template>

<script>


const locationModule = uni.requireNativePlugin('XM_Alive_Location')
const tts = uni.requireNativePlugin("nrb-tts-plugin")
tts && tts.init({ "lang":"ZH", "country":"CN" })

import { isSame, eqCoord, bearing, getDist, trans, calData, fixNum, math } from '@/comm/geotools'
import { comm, nearOfGrid } from '@/comm/libs/mapbox/mbtool'
import zz from '@/comm/zz'
// import  from '@/comm/zuni'
import icon from '@/comm/libs/icon'
import prop from '@/comm/libs/prop'
import Ajax from '@/comm/libs/Ajax'
import { createEle, randomPoi, toDist } from '@/comm/nav'

import fab from './components/fab'

export default {
	components: { fab },
	data() {
		return {
			icon,
			prop,
			winH: 0,
			stH: 0,
			sysInfo: uni.getStorageSync('sysInfo'),
			
			onRec: false,
			process: 0,
			rec:{ line:[],
				startTime: zz.now(),
				endTime: 0,
				H:0, M:0, S:0, MS:0,
				len: 0,
				up: 0,
				down: 0,
				say: {},
			},
			nav: {
				line:[],
				point:[]
			},
			
			amap: null,
			center: [121,30],
			scale: 15,
			point:[],
			line:[],
			
			id: null,
			kml: {},
			
			cp: [],
			cur: null,
			mapHeight: 0
		};
	},
	computed: {
		lines() {
			return [...this.nav.line, ...this.line, ...this.rec.line]
		},
		points() {
			return [...this.nav.point, ...this.point]
		}
	},
	onLoad({v}) {
		
		console.log(v);
		
		this.winH = this.sysInfo.windowHeight
		this.stH = this.sysInfo.statusBarHeight
		this.mapHeight = this.winH
		
		if(v) {
			let kml = zz.getParam(v)
			this.kml = kml
			
			
			
			for (let s of kml.lines) {
				this.line.push(createEle(s))
			}
			for (let s of kml.points) {
				this.point.push(createEle(s))
			}
			
			//设定地图center
			let p = this.point[0]
			if(!p) p = this.line[0].points[0]
			this.center = [p.longitude, p.latitude]
		} else {
			this.onLoc(true)
		}
	},
	onReady() {
		this.amap = uni.createMapContext('amap', this)
	},
	onShow() {
		let poi = uni.getStorageSync('nav_poi')
		
		if(poi) {
			this.cur = null
			uni.removeStorageSync('nav_poi')
			let st1 = uni.getStorageSync('nav_checked')||[],
				idx = st1.findIndex(e=>e.time == poi.time)
			
			if(idx>-1) {
				st1[idx] = poi
			} else {
				st1.push(poi)
			}
			
			uni.setStorageSync('nav_checked', st1)
			this.listData()
		}
	},
	onBackPress() { return this.onRec }, //安卓有效
	
	methods: {
		async mapchg(e){
			console.log(e);
			const getZoom = async()=>{
				return new Promise((res) => {
					this.amap.getScale({
						success(x){ res(~~x.scale) }
					})
				})
			},
			center = async()=>{
				return new Promise((res) => {
					this.amap.getCenterLocation({
						success(x){ res(x) }
					})
				})
			},
			getXY = async()=>{
				return new Promise((res) => {
					this.amap.getRegion({
						success(x){ res(x) }
					})
				})
			}
			
			let nav = this.nav,
				ct = await center(),
				k = nearOfGrid(trans([ct.longitude, ct.latitude], 'gcj02towgs84')),
				zoom = await getZoom(),
				x = await getXY(),
				sw = x.southwest,
				ne = x.northeast,
				xy = ~~(math(~~(getDist(ne.longitude, ne.latitude, sw.longitude, sw.latitude)+(zoom>=15?8000:0))/10000,0) * 10000/0.5)||10000
			
			if (!k||isSame(nav.k,[k,zoom,xy])||nav.busy) return
			
			// console.log('setnav ...............',k,zoom,xy);
			
			nav.busy = true
			nav.k = [k,zoom,xy]
			if(zoom>19) zoom = 19
			if(zoom<9) zoom = 9
			
			let kml = comm.getStorage('sys_nav'),
				line = [],
				point = []
				
			if (!kml[k][xy+zoom]) {
				kml[k][xy+zoom] =  await Ajax({ u:'zz', data:{ url: 'on', center: k, zoom, xy }})
				comm.setStorage('sys_nav', kml)
			}
			
			for (let s of kml[k][xy+zoom].line) {
				line.push(createEle(s))
			}
			for (let s of kml[k][xy+zoom].point) {
				point.push(createEle(s))
			}
			nav.line = line
			nav.point = point
			
			nav.busy = false
		},
		checkPoint(){
			//随机生成路体采集点
			let cp = uni.getStorageSync('nav_cp')
			if(cp && (zz.now() - cp.t) > 1000*60*60*24*2) cp = null //超期	
			
			if(!cp) {
				//清理缓存
				for (let s of uni.getStorageSync('nav_checked')||[]) {
					for (let filePath of s.imgs) uni.removeSavedFile({filePath})
				}
				for (let s of ['nav_checked','nav_rec','nav_T_rec']) {
					uni.removeStorageSync(s)
				}
				
				//生成cp点
				cp = { t: zz.now(), p: this.kml.lay.status==20?[] : randomPoi(this.kml, this.id) }
				uni.setStorageSync('nav_cp', cp)
				if(cp.p.length) zz.modal('已成功生成了 '+ cp.p.length + ' 个随机检查点，请根据检查点位置采集路体照片。（三天内有效）')
			}
			this.cp = cp
			this.listData()
		},
		listData(){
			let st1 = uni.getStorageSync('nav_checked')||[],
				ls = [{ name: '待采集', ls: [] }, { name: '已采集', ls: [] }]
				
			this.point = []
			for (let s of [...this.kml.point, ...this.cp.p]) {
				
				let s1 = st1.find(e=>e._id==s._id)
				if(s1) {
					if(s1.t2<90) {
						 Object.assign(s,s1)
					} else {
						if((zz.now() - s1.time) < 1000*60*60*24*3) {
							for (let filePath of s1.imgs) {
								uni.removeSavedFile({filePath})
							}
						} else {
							Object.assign(s,s1)
						}
					}
				} else {
					s.imgs = []
					s.desc = ''
				}
				
				ls[s.st||0].ls.push(s)
				if(!s.st) this.point.push(createEle(s))
			}
			for (let s of st1) {
				if(s.t2==50||s.t2==60) ls[s.st].ls.push(s)
			}
			
			this.tabs = ls
			this.onLoc()
		},
		async onLoc(ct,c){
			if(!c){
				const [_,e] = await uni.getLocation({type:'gcj02'})
				c = [e.longitude,e.latitude,e.altitude]
			}
			console.log(c);
			if(ct) this.fly(c)
		},
		fly(c){
			this.amap.moveToLocation({
				longitude: c[0],
				latitude: c[1],
				success: (e)=>{
					setTimeout(()=>{
						this.scale = this.scale==17? 17.01:17
					}, 555)
				}
			})
		},
		act(e){
			for (let s of this.point) {
				s.callout.display = (e&&s.id==e._id?'ALWAYS':'BYCLICK')
			}
			this.point.sort(zz.compare(e?'latitude':'id'))
			
			if(e) {
				this.fly(e.coord)
				
				if(e.st) {
					zz.href('/pages/scan/nav/point', e)
				} else {
					setTimeout(()=> {this.act()},3000)
				}
			}
		},
		
		async stop(){
			const [_,a] = await uni.showModal({
				title: '确定结束本次采集？',
				content: '',
				cancelText: '否',
				confirmText: '是'
			})
			if(a.confirm) {
				// console.log('停止后台定位', this.rec, '轨迹数据')
				let rec = this.rec
				
				clearInterval(rec.timer)
				this.onRec = false
				this.cur = null,
				rec.endTime = zz.now()
				rec.line[1].points.splice(1,1)
				locationModule.stopLocation()
				this.$scope.$getAppWebview().setStyle({'popGesture':'close'})
				
				let tb = this.tabs
				if(tb[1].ls.length) {
					let my = tb[1].ls.filter(e=>e.t2==50||e.t2==60),
						done = tb[1].ls.length - my.length,
						local = uni.getStorageSync('nav_local')||[],
						coord = rec.line[0].coord,
						cur = {
							...rec,
							...this.kml, 
							progress: done / (tb[0].ls.length + done),
							time: this.cp.t, 
							list: [tb[0].ls, tb[1].ls],
							
							cur: {
								_id: this.cp.t, 
								t1: 1,
								t2: 10,
								coord,
								...calData(coord)
							}
						},
						idx = local.findIndex(e=>e.time = cur.time)
					
					if(idx>-1) {
						local[idx] = cur
					} else {
						local.push(cur)
					}
					uni.setStorageSync('nav_local', local)
					
					const [_,b] = await uni.showModal({
						title: '数据已保存到本地，是否去上传？',
						content: '也可在【首页>记录>本地>建设采集】中上传',
						cancelText: '否',
						confirmText: '是'
					})
					if (b.confirm) {
						uni.redirectTo({ url:'/pages/mine/record/local/l1' })
					}
				}
			}
		},
		
		async start(){
			let pt = (e) => { return {longitude: e[0], latitude: e[1]} },
				rec = {
					startTime: zz.now(),
					endTime: 0,
					H:0, M:0, S:0, MS:0,
					len: 0,
					up: 0,
					down: 0,
					say: {},
					
					line: [{
							coord: [],
							points: [],
							arrowLine: true,
							width: 8
						}]
				},
				say = () => {
					if (rec.H && !rec.say['t'+rec.H]) {
						rec.say['t'+rec.H] = 1
						tts.speak('您已行走' + rec.H + '小时，累计距离' + rec.len + '米，爬升' + rec.up + '米，下降' + rec.down + '米')
					}
					if (rec.len > 980) {
						for (var i = 0; i < 12; i++) {
							let g = i + rec.len
							if (g % 1000 == 0 && !rec.say[g]) {
								rec.say[g] = true
								tts.speak('您已行走' + (g / 1000) + '公里，累计爬升' + rec.up + '米，下降' + rec.down + '米')
								break
							}
						}
					}
				}
				
			if (this.sysInfo.platform == 'android') {
				// 安卓设备需要主动开启后台定位
				const [_, ask] = await uni.showModal({
					title: '提示',
					content: '为确保轨迹在熄屏后的持续记录，请授权手机的电池和后台运行权限！',
					cancelText: '去授权',
					confirmText: '我已授权'
				})
				if (ask.cancel) return locationModule.gotoNativePage()
			}
			
			//随机检查点
			
			// 查询本地是否有未完成的轨迹记录
			let nav_rec = uni.getStorageSync('nav_rec')
			if (nav_rec) {
				const [_, res] = await uni.showModal({
					title: "是否继续上次轨迹记录?",
					content: "取消后，上次记录将会被删除！"
				})
				if (res.confirm) {
					rec = nav_rec
					let T = uni.getStorageSync('nav_T_rec')
					rec.MS = T[0]
					rec.S = T[1]
					rec.M = T[2]
					rec.H = T[3]
				} else {
					uni.removeStorageSync('nav_cp')
				}
			}
			
			rec.timer = setInterval(()=>{
			   rec.MS += 1000
			   if(rec.MS >= 1000) {
					rec.MS = 0
					rec.S += 1
			   }
			   if(rec.S >= 60) {
					rec.S = 0
					rec.M += 1
			   }
			   if(rec.M >= 60) {
					rec.M = 0
					rec.H += 1
			   }
			   uni.setStorageSync('nav_T_rec', [rec.MS, rec.S, rec.M, rec.H])
			}, 1000)
			
			this.rec = rec
			this.onRec = true
			this.$scope.$getAppWebview().setStyle({'popGesture':'none'}) //ios有效
			
			locationModule.startLocation({
					intervalTime: 5000, //3秒 只对安卓有效
					distanceFilter: 5, //5m 只对ios有效
					notifyTip: '持续定位中',
					notifyTitle: '环浙采集',
					sysName: 'sysName'
				}, (xiaoming)=>{
					/*
					{
						"location": true,
						"success": true,
						"data": {
							"gpsAccuracyStatus": "未知",
							"timestamp": 1658065727147,
							"networkType": "WIFI",
							"district": "",
							"speed": 0,
							"address": "",
							"province": "",
							"city": "",
							"locationType": "Wifi定位结果",
							"provider": "lbs",
							"latitude": 29.675263,
							"cityCode": "",
							"accuracy": 100,
							"country": "",
							"longitude": 121.42682,
							"altitude": 0,
							"adCode": "",
							"satellites": 0
						},
						"msg": "返回定位信息"
					}
					 */
					
					if (xiaoming.success) {
						const _p = xiaoming.data
							
						let c1 = [fixNum(_p.longitude), fixNum(_p.latitude), ~~_p.altitude, _p.timestamp || zz.now(), fixNum(_p.speed,2)],
							line = rec.line[0],
							size = line.coord.length
							
						uni.setStorageSync('curLocation', c1)
						
						if (!size) {
							this.onLoc(true,c1)
							line.coord.push(c1)
							line.points.push(pt(c1))
						}else{
							let c2 = line.coord[size-1],
								len = getDist(c1[0], c1[1], c2[0], c2[1], c1[2], c2[2])
							
							//大于6m 小于60m/每秒 判断有效
							if(len>6 && (len/((c1[3]-c2[3])*1000) < 60)) {
								line.coord.push(c1)
								line.points.push(pt(c1))
								size++
								
								// 去除漂移点
								if (size > 2) {
									let r1 = line.coord[size - 3],
										r2 = line.coord[size - 2],
										r3 = line.coord[size - 1],
										
										b1 = bearing(r2, r1),
										b2 = bearing(r2, r3)
														
									if (~~Math.abs(b1 - b2) < 16) {
										line.coord.splice(line.coord.length - 2, 1)
										line.points.splice(line.points.length - 2, 1)
									}
									
									let info = calData(line.coord)
									rec.len = math(info.len,0)
									rec.up = info.up
									rec.down = info.down
														
									console.log('去除漂移------1',b1,b2, ~~Math.abs((b1-b2)))
								}
							}
						}
						
						console.log(rec);
						
						say()
						uni.setStorageSync('nav_rec', rec)
					} else {
						uni.showToast({
							title: '定位失败,GPS信号弱！',
							icon: 'none'
						})
					}
				}
			)
		},
		async controltap(t) {
			if(t=='scan'){
				//扫码
			}
			if(t=='position'){
				this.onLoc(1)
			}
			if(t=='video' || t=='camera'){
				let e = t=='video'? await zz.chooseVideo({}) : await zz.chooseImage({sourceType: ['camera']}) 
				if(e) {
					let	poi = {
								name:id==3? '沿途照片':'随拍视频',
								t1: 2,
								t2: id==3? 50:60,
								st: 1,
								coord: uni.getStorageSync('curLocation'),
								desc: '',
								time: zz.now(),
								imgs: id==3? e:[],
								video: id==3? null:e
							}
							
				}
			}
			if(t=='back'){
				uni.navigateBack({})
			}
		},
		onStartTouch({ index, item }) {
			if (item.type === 'end') {
				this.process = 2;
				this.touch = setInterval(() => {
					this.process += 2;
					// 长按结束本次采集事件
					if (this.process >= 100) {
						this.process = 0;
						// this.onEndThe();
						this.isPause = false;
						uni.$emit('endLocation');
						if (this.swiperCurrent === 1) {
							this.swiperCurrent = 0;
						}
						uni.navigateTo({
							url: '/pages/planning/saveLineTrack'
						});
						clearInterval(this.touch);
					}
				}, 33);
			}
		},
		onEndTouch({ index, item }) {
			this.process = 0
			clearInterval(this.touch)
		},
		
		
		mapTap(e) {},
		markertap(e) { this.$emit('markerClick', this.point.find(x => x.id == e.detail.markerId)) },
		fmtTime(t){return zz.timeToDate('M-D h:m',t)},
		viewIMG(p,i) { zz.viewIMG(p,i) },
		gotoHelp() { zz.href('/pages/mine/document/collect') },
		openFrom() {
			
			return zz.href('/pages/scan/nav/point', this.cur)
			
			if(this.cur.dist>60) {
				uni.showModal({
					title: '距离超出范围！',
					content: '当前位置离目标位置尚有'+this.cur.dist+'m',
					showCancel: false,
				})
			}else{
				zz.href('/pages/scan/nav/point', this.cur)
			}
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
	font-size: 14px;
	font-weight: 500;
	color: #ffffff;
}
.start-btn {
	width: 400rpx;
	height: 80rpx;
	background-color: #0081ff;
	box-shadow: 0 30upx 20upx rgba(0, 0, 0, 0.2);
	
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

.record {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	padding: 24rpx 10rpx;
	background: linear-gradient(to bottom, #000000 60%, rgba(255, 255, 255, 0.2) 30%);
}

.record-title {
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}




.mask {
	z-index: 99999;
	width: 750rpx;
	height: 890px;
	background-color: rgba(0, 0, 0, 0.3);
	position: absolute;
	top: 0;
	left: 0;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.statistical-end {
	width: 120rpx;
	height: 120rpx;
	background-color: #ffffff;
	box-shadow: 0px 0px 14rpx 0px rgba(6, 127, 116, 0.15);
	border-radius: 50%;
	align-items: center;
	justify-content: center;
}

.statistical-end-before {
	width: 42rpx;
	height: 42rpx;
	background-color: #ee3c3c;
	border-radius: 8rpx;
}
</style>
