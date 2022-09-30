import { async } from 'regenerator-runtime'

import grid from '@/comm/libs/grid'
import { dist, isSame, getLocation } from '@/comm/geotools'

const comm = {
	key(k){return k? JSON.stringify(k).replace(/[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/g, '') : ''},
	async req(data={},fn='app',t=9999) {
		let cloud = 'https://699d1eb1-ee53-4c66-bddd-06cda80d1231.bspapp.com/',
			api = { app: cloud + 'app', zz: cloud + 'http/zz' }
		
		if(comm.hadNet()) {
			return new Promise((resolve, reject) => {
				let timer,x,e
				// #ifdef APP-PLUS
				x = new plus.net.XMLHttpRequest()
				// #endif
				// #ifndef APP-PLUS
				x = window.XMLHttpRequest? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
				// #endif
					
				x.open('POST',api[fn],true)
				x.setRequestHeader("Content-type","application/json")
				x.setRequestHeader("authorization", comm.getStorage('210B33A_token'))
				x.setRequestHeader("clientInfo", JSON.stringify(comm.getStorage('clientInfo')))
				x.send(JSON.stringify(data))
				
				console.log('ajax ------------',fn,data);
				
				x.onreadystatechange = ()=>{
					clearInterval(timer)
					if (x.readyState === 4) {
						if (x.status >= 200 && x.status < 300 || x.status == 304) {
							e = JSON.parse(x.responseText)
							if(e.code==1000) {
								// console.log('success ------------',e.data);
								if(e.data) comm.setStorage(comm.key(fn+JSON.stringify(data)), e.data)
								resolve(e.data)
							} else{
								console.log('错误：', e.message)
								reject(e.message)
							}
						}else{
							console.log('request error',e.error)
							reject(e.error.message)
						}
					}
				}
				//超时
				if(t){
					timer = setInterval(()=>{
						console.log('timedout!')
						x.abort()
						clearInterval(timer)
					},t)
				}
			})
		} else {
			return comm.getStorage(comm.key(fn+JSON.stringify(data)))
		}
	},
	compare(k, n=1, t=0) {
		return function (a, b) {
			if (typeof a == 'object') {
				if (n) {
					return t ? b[k] - a[k] : a[k] - b[k]
				} else {
					return t ? b[k].localeCompare(a[k], 'zh') : a[k].localeCompare(b[k], 'zh')
				}
			} else {
				return a.localeCompare(b, 'zh')
			}
		}
	},
	// #ifdef APP-PLUS
	stopWatch(){ plus.geolocation.clearWatch(plus.wid) },
	setStorage:(k,v)=> { 
		plus.storage.setItem(k, typeof v=='object'? JSON.stringify(v):v)
	},
	getStorage:(k)=>{
		let v = plus.storage.getItem(k)
		try{ v = JSON.parse(v) }catch(e){}
		return v
	},
	hadNet(){ return plus.networkinfo.getCurrentType()>1 },
	// #endif
	
	// #ifndef APP-PLUS
	stopWatch(){ clearTimeout(window.wid) },
	setStorage:(k,v)=> { uni.setStorageSync(k,v) },
	getStorage:(k)=>{ return uni.getStorageSync(k) },
	setNet:(e)=>{ window.hadNet = e },
	hadNet(){ return window.hadNet },
	// #endif
	
	getGrid(){
		let nav = comm.getStorage('sys_nav')
		if(!nav) {
			nav = {}
			for (let s of grid[33]) nav[s] = {}
			comm.setStorage('sys_nav', nav)
		}
		return nav
	},
	
	//最近网格 coord
	nearst(c,d=Number.MAX_SAFE_INTEGER){
		let _
		for (let c2 of grid[33]) {
			let _d = dist(c, c2)
			if (_d < d) {
				if(d<4444) return c2
				d=_d
				_=c2
			}
		}
		return _
	},
	
	//路网 {time,line,point}
	async gridNet(k,xy,zoom){
		let nav = comm.getGrid()
		if (!nav[k][xy+zoom] || !nav[k][xy+zoom].time || (Date.now() - nav[k][xy+zoom].time) > (1000*60*60*24 * 5)) {
			nav[k][xy+zoom] = await comm.req({url: 'on', center: k, zoom, xy }, 'zz') || {line:[],point:[]}
			comm.setStorage('sys_nav', nav)
		}
		return nav[k][xy+zoom]
	},
	
	//附近柱子 arr
	async around(c,d=12000) {
		if(!c) {
			let { coord } = await getLocation()
			c = coord
		}
		let arr = [],
			cps = comm.getStorage('sys_nav_cps')
			
		for (let k in cps) {
			let s = dist(c, cps[k].coord)
			if(s < d) {
				arr.push({
					_id: k,
					t1: 2,
					t2: cps[k].t2,
					coord: cps[k].coord,
					dist: s
				})
			}
		}
		console.log('comm.around ..............', c);
		return arr.sort(comm.compare('dist'))
	},
	
	// 初始化网格信息
	async on(c){
		if(!c) {
			let { coord } = await getLocation()
			c = coord
		}
		let k = comm.nearst(c,Number.MAX_SAFE_INTEGER),
			z = comm.getStorage('cur_loc_poi'),
			cps = comm.getStorage('sys_nav_cps')||{}
		
		if(comm.hadNet() && !isSame(k,z)) {
			comm.setStorage('cur_loc_poi',k)
			let nav = comm.getGrid()
			
			if (!nav[k].cp || (Date.now() - nav[k].cp) > (1000*60*60*24 * 7)) {
				let {time, list} = await comm.req({ url:'cps', coord: k, d: 12000 },'zz')
				if(time) {
					nav[k].cp = time
					for (let s of list) {
						cps[s[0]] = { t2: s[1], coord: s[2] }
					}
					comm.setStorage('sys_nav', nav)
					comm.setStorage('sys_nav_cps', cps)
				}
			}
		}
		return {k,c}
	}
}

module.exports = comm
// export default comm