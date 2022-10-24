<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">mapbox</block>
		</cu-custom>
		<!-- <zz-map :winH="winH"></zz-map> -->
		
		<button class="cu-btn round bg-ztsgreen" @click="getLoc">getLoc</button> 
		<button class="cu-btn round bg-ztsgreen" @click="watch">watch</button> 
		<v-html v-if="center">
			{{JSON.stringify(center)}}
		</v-html>
		
	</view>
</template>

<script>
	import AMapLoader from '@amap/amap-jsapi-loader'
	export default {
		data() {
			return {
				winH: 400,
				kml: {},
				line: [],
				point: [],
				center: null,
				cur: null,
				gon: []
			}
		},
		async onLoad() {
			let ap = await AMapLoader.load({
			    key: this.zz.bd.amapKey,  // 申请好的Web端开发者Key，首次调用 load 时必填
			    version: "2.0",   	// 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
				plugins:['AMap.MapType','AMap.Geolocation','AMap.Weather', 'AMap.Geocoder']           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			}).then(e=>{
				console.log(e);
			})
			
			
			
			let map = new AMap.Map('container', {
					zoom:11,//级别
					center: [120, 30],//中心点坐标
				}),
				mtype = new AMap.MapType({ defaultType:1 }),
				geolocation = new AMap.Geolocation({
			        enableHighAccuracy: true,//是否使用高精度定位，默认:true
			        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
			        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
			        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
			        showButton: true,        //显示定位按钮，默认：true
			        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
			        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
			        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
			        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
			        zoomToAccuracy:true,	 //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					useNative: true			//是否使用安卓定位sdk用来进行定位，默认：false
			    })
				
			mtype.hide()
			// map.addControl(new AMap.Scale())
			map.addControl(mtype)
			// await AMapLoader.load({ plugins:['AMap.PlaceSearch','AMap.Geolocation'] })
			map.addControl(geolocation);
			geolocation.getCurrentPosition((status,res)=>{
				console.log('getCurrentPosition.result',res);
			})
			
			this.pm = await this.zz.req({ $fn: 'zz', url: 'scan', sn: 'W0000', noLog:true })
			this.placeSearch = new AMap.PlaceSearch({ 
			            // type: '民宿', // 兴趣点类别
			            pageSize: 5, // 单页显示结果条数
			            pageIndex: 1, // 页码
			            // city: "010", // 兴趣点城市
			            // citylimit: true,  //是否强制限制在设置的城市内搜索
						extensions:'all',
			            map, // 展现结果的地图实例
			            panel: "penel_", // 结果列表将在此容器中进行展示。
			            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			        });
			console.log('this.pm', this.pm)
			this.search()
		},
		mounted() {},
		methods: {
			getLoc(){
				window.amapGeo.getCurrentPosition((_,e)=>{
					this.center = [e.position.getLng(), e.position.getLat(), ~~(e.altitude || 0)]
					this.cur = {
						_id:'curposi',
						t1:2,
						t2:200,
						coord: e.position,
						name:'当前位置'
					}
				})
			},
			watch(){
				window.amapGeo.watchPosition((_,e)=>{
					this.center = e
					this.cur = {
						_id:'curposi',
						t1:2,
						t2:200,
						coord: e.position,
						name:'当前位置'
					}
				})
			},
			
			//三都 622c331943315700013877e7
			//笔架山 628a3dd2c9881500011de64b
			// 60cda51ff183a00001e4399f
			// 笔架山 15
			// 62b7fa05fd3e320001e9debd  台州市域
			// 62b919aa7696a80001ca757f 天台
			
			async loadData(){
				this.kml = await this.zz.req({ $url: 'public/kml/info', _id: '62b7fa05fd3e320001e9debd', plain: true });
				this.loading = false
				// console.log('kml：',this.line, this.point);
			},
			href(u){ this.zz.href(u)},
		}
	}
</script>

<style>
</style>
