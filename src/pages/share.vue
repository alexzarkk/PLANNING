<template>
	<view>
		<block v-if="loading">
			<tui-loading :fixed="true" :index="3" type="green"></tui-loading>
		</block>
		<block v-else>
			<!-- <block v-if="isIOS">
				<view class="cu-tabbar-height"></view>
				<view class="flex flex-direction justify-center margin padding">
					<text>【环浙步道】需要您开启“无线网络与蜂窝数据”才能正常使用和浏览。</text>
					<view class="padding">
						<button class="cu-btn bg-orange light lg" @click="goSetting">
							<text class="cuIcon-settings"></text> 去设置
						</button>
					</view>
				</view>
			</block>
			<block v-else> -->
				<tui-no-data :fixed="true" :imgUrl="bd.imgs.nodata"  btnText="重新加载" @tap="reload">点击重试~</tui-no-data>
			<!-- </block> -->
		</block>
	</view>
</template>

<script>
	
	// #ifdef H5
	import AMapLoader from '@amap/amap-jsapi-loader'
	// #endif
	
	// #ifdef APP-PLUS
	import permision from '@/comm/permission.js'
	// #endif
	
	import comm from '@/comm/comm'
	
	export default {
		data() {
			return {
				deptId: uni.getStorageSync('cur_deptId'),
				sysInited: uni.getStorageSync('sysInited'),
				isIOS: false,
				loading: true,
				login: false,
				path : ''
			}
		},
		
		//	https://zts.5618.co/h5/#/pages/share?deptId=330212&path=/pages/planning/article&id=5eb7b88343f165004c6d2d52
		//	https://zts.5618.co/h5/#/pages/share?deptId=330212&path=/pages/comm/kml&_id=62b9409268cebc00011fdb23
		//	https://zts.5618.co/h5/#/pages/share?path=/pages/comm/kml&_id=63579d52fcf4a30001e8d369
		//	http://localhost:8080/h5/#/pages/share?path=/pages/comm/kml&_id=635fae307d78ff00012edf57 //庙后-~~
		//  https://zts.5618.co/h5/#/pages/share?deptId=330212
		//	http://localhost:8080/h5/#/pages/share?path=/pages/comm/kml&_id=63579d52fcf4a30001e8d369 //第一件完工巡查
		
		
		 
		//  http://localhost:8080/h5/#/pages/share?deptId=330212
		//	http://localhost:8080/h5/#/pages/share?deptId=330212&path=/pages/planning/poi&id=629497c49b54e30001d3e4eb
		//	http://localhost:8080/h5/#/pages/share?deptId=330212&path=/pages/planning/detail&id=60312b1fedb62e0001beeeac
		   
		async onLoad ({path='/pages/index', deptId='', id ='', _id='', sn='', coord='', login=false}=q) {
			path += '?deptId='+deptId
			if (id)		path += '&id='+id
			if (_id) 	path += '&_id='+_id
			if (sn) 	path += '&sn='+sn
			if (coord) 	path += '&coord='+coord
			
			this.path = path
			this.login = login
			
			if (deptId && this.deptId!=deptId) {
				this.deptId = deptId
				uni.setStorageSync('cur_deptId', deptId)
				await this.zz.setDept()
			} 
			
			// #ifdef APP-PLUS
				this.isIOS = permision.isIOS
			// #endif
			
			uni.onNetworkStatusChange(e => {
				// #ifdef H5
				comm.setNet(e.isConnected)
				// #endif
			    if (e.isConnected) {
					this.init()
			    }
			})
			
			this.init()
		},
		methods: {
			async init() {
				let [_,e] = await uni.getNetworkType()
				
				let coord,
					hadNet = (e.networkType.toUpperCase() != 'none')
				
				if(!hadNet) {
					if(!this.isIOS) {
						this.loading = false
						this.zz.toast('没有网络，请稍候重试')
					}
				}
				
				// #ifdef H5
				comm.setNet(hadNet)
				await AMapLoader.load({
				    key: this.bd.amapKey,
				    version: "2.0",
				    plugins: ['AMap.Geolocation']
				})
				window.amapGeo = new AMap.Geolocation({
				    enableHighAccuracy: true, //是否使用高精度定位，默认:true
				    noIpLocate: 3,				//3: 所有终端禁止使用IP定位
				    noGeoLocation: 0,		  //1: 手机设备禁止使用浏览器定位
				    // timeout: 10000,           //超过10秒后停止定位，默认：无穷大
				    maximumAge: 0,            //定位结果缓存0毫秒，默认：0
				    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				    showButton: false,        //显示定位按钮，默认：true
				    // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
				    // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				    showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
				    showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
				    panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
				    zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				})
				// #endif
				
				
				// #ifdef APP-PLUS
					await uni.getLocation({
						success(e) {
							coord = [e.longitude, e.latitude]
							comm.on(coord)
						},
						fail() {
							comm.on([121, 29])
						}
					})
				// #endif
				
				
				let deptId = this.deptId
				if(!deptId) {
					if(coord){
						try {
							let addr = await this.zz.reGeo(coord)
							deptId = addr.addressComponent.adcode + ''
						} catch (error) {
							deptId = '330213'
						}
					}
					//是否浙江地区
					uni.setStorageSync('cur_deptId', deptId.startsWith('33') ? deptId : '330213')
					await this.zz.setDept()
				}
			
				let dict = uni.getStorageSync('sys_dict')||{}
				await this.zz.req({ $url: '/public/zz/dict', obj: true, v: dict.v }).then(e => {
				    if (e.v) {
				        Object.assign(dict, e)
						uni.setStorageSync('sys_dict', dict)
						
						this.sysInited = true
						uni.setStorageSync('sysInited', this.sysInited)
				    }
				})
				
				if(this.sysInited) {
					this.zz.href(this.path,0,this.login,'zoom-out','redirectTo')
				}else{
					this.loading = this.isIOS
				}
				
				
				
				
				
				
				
				
				
				
				
				
				
				// const setDept = new Promise(async (resolve, reject) => {
				// 	let deptId = this.deptId
				// 	if(!deptId && coord) {
				// 		try {
				// 			let addr = await this.zz.reGeo([e.longitude, e.latitude])
				// 			deptId = addr.addressComponent.adcode + ''
				// 		} catch (error) {
				// 			deptId = '330213'
				// 		}
				// 	}
				// 	//是否浙江地区
				// 	uni.setStorageSync('cur_deptId', deptId.startsWith('33') ? deptId : '330213')
				// 	await this.zz.setDept()
				// 	resolve(true)
				// })
				// const setDict = new Promise((resolve, reject) => {
				//     let dict = uni.getStorageSync('sys_dict')||{}
				//     this.zz.req({ $url: '/public/zz/dict', obj: true, v: dict.v }).then(e => {
				//         if (e.v) {
				//             Object.assign(dict, e)
				// 			uni.setStorageSync('sys_dict', dict)
				//         }
				//         resolve(true)
				//     }).catch(err => {
				//         reject({
				// 			msg:'dict加载失败'
				// 		})
				//     })
				// })
				// const initAmap = new Promise((resolve, reject) => {
				//     // #ifdef H5
				//     AMapLoader.load({
				//         key: this.bd.amapKey,
				//         version: "2.0",
				//         plugins: ['AMap.Geolocation']
				//     }).then(e => {
				//         window.amapGeo = new AMap.Geolocation({
				//             enableHighAccuracy: true, //是否使用高精度定位，默认:true
				//             noIpLocate: 3,				//3: 所有终端禁止使用IP定位
				//             noGeoLocation: 0,		  //1: 手机设备禁止使用浏览器定位
				//             // timeout: 10000,           //超过10秒后停止定位，默认：无穷大
				//             maximumAge: 0,            //定位结果缓存0毫秒，默认：0
				//             convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				//             showButton: false,        //显示定位按钮，默认：true
				//             // buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
				//             // buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				//             showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
				//             showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
				//             panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
				//             zoomToAccuracy: false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				//         })
				//         resolve(true)
				//     }).catch(err => {
				//         reject('initAmap执行失败',err)
				//     })
				//     // #endif
				//     // #ifdef APP-PLUS
				//     resolve(true)
				//     // #endif
				// })

				// await Promise.all([setDept, setDict, initAmap]).then(result => {
				// 	console.log('Promise.all初始化成功 ========>', result, uni.getStorageSync('cur_deptId'), uni.getStorageSync('sys_dict'))
					
				// 	sysInited = true
				// 	uni.setStorageSync('sysInited', sysInited)
				// }).catch(err => {
				//     console.log("Promise.all初始化失败 ========>", err)
				// })
				
				// console.log('初始化完成 ..........');
				
				// if(sysInited) {
				// 	this.zz.href(this.path,0,this.login,'zoom-out','redirectTo')
				// }else{
				// 	this.loading = this.isIOS
				// }
			},
			goSetting(){
				permision.gotoAppSetting()
			},
			reload(){
				this.loading = true
				this.init()
			}
		}
	}
</script>

<style>
</style>
