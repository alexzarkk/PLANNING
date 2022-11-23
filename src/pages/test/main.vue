<template>
	<view>
		<view style="height: 1200rpx; width: 750rpx;" class="flex flex-direction justify-center align-center">
			<text class="cuIcon-loading2 cuIconfont-spin text-xxl"></text>
		</view>
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
import loginVue from './comm/account/login.vue';
	
	export default {
		data() {
			return {
				sys: uni.getStorageSync('sysInfo'),
				sysInited: uni.getStorageSync('sysInited'),
				hadNet: true
			};
		},
		async onLoad() {
			let [_,e] = await uni.getNetworkType()
			let nt = e.networkType.toUpperCase()
			this.hadNet = (nt != 'none')
			
			// #ifdef H5
			comm.setNet(this.hadNet)
			// #endif
		},
		onShow() {
			this.init()
		},
		methods:{
			async init() {
				let coord
				uni.getLocation({
					success(e) {
						coord = [e.longitude, e.latitude]
						comm.on(coord)
					},
					fail() {
						comm.on([121, 29])
					}
				})
				
				//ios 14以上必须同意本地网络
				if (this.sys.platform == 'ios' && (!this.hadNet && !this.sysInited)) {
					const [_, ask] = await uni.showModal({
						content: "“环浙步道”在需要您开启“允许访问本地网络或无线网”",
					})
					if (ask.confirm) {
						permision.gotoAppSetting()
					}
				}
				
				const setDept = async()=>{
					if (!this.sysInited) {
						let deptId
						if(coord){
							let addr = await this.zz.reGeo([e.longitude,e.latitude])
							deptId = addr.addressComponent.adcode+''
						}else{
							deptId = '330213'
						}
						
						//是否浙江地区
						uni.setStorageSync('cur_deptId', deptId.startsWith('33')?deptId:'330213')
						return await this.zz.setDept()
					}
				}
				
				const setDict = async()=>{
					let dict = uni.getStorageSync('sys_dict') || {}
					return await this.zz.req({ $url: '/public/zz/dict', obj: true, v: dict.v }).then(e => {
						console.log('dict.......',e);
						if (e.v) {
							Object.assign(dict, e)
							uni.setStorageSync('sys_dict', dict)
							uni.setStorageSync('sysInited',1)
						}
					})
				}
				
				const initAmap = async()=>{
					// #ifdef H5
						return await AMapLoader.load({
							key: this.bd.amapKey,
							version: "2.0",
							plugins:['AMap.Geolocation']
						}).then(e=>{
							window.amapGeo = new AMap.Geolocation({
								enableHighAccuracy: true, //是否使用高精度定位，默认:true
								noIpLocate: 3,				//3: 所有终端禁止使用IP定位
								noGeoLocation:0,		  //1: 手机设备禁止使用浏览器定位
								// timeout: 10000,           //超过10秒后停止定位，默认：无穷大
								maximumAge: 0,            //定位结果缓存0毫秒，默认：0
								convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
								showButton: false,        //显示定位按钮，默认：true
								// buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
								// buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
								showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
								showCircle: false,        //定位成功后用圆圈表示定位精度范围，默认：true
								panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
								zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
							})
						})
					// #endif
				}
				
				await Promise.all([setDept, setDict, initAmap])
			   console.log(coord);
				
				uni.redirectTo({url: '/pages/index?tab=home', animationType: 'zoom-fade-out', animationDuration: 200 })
			}
		}
	}
</script>

<style>
</style>
