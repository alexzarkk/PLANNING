<template>
<page-meta root-font-size="10px"></page-meta>
	<view>
		<cu-custom bgColor="bg-ztsblue" :isBack="true">
			<block slot="backText"></block>
			<block slot="content">{{title}}</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:customBar + 'px'}]">
			<scroll-view scroll-x class="bg-white nav text-center" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" style="padding: 2rpx;" v-for="(item,idx) in tag" :key="idx">
					<view class='cu-tag' :class="(idx==tagIdx?'bg-blue':'light line-dark')" @tap="tabSelect" :data-id="idx">{{item}}</view>
				</view>
			</scroll-view>
		</view>
		<view v-html="div"></view>
		<view v-html="penel"></view>
	</view>
</template>

<script>
	import AMapLoader from '@amap/amap-jsapi-loader'
	import {amapKey} from '@/comm/bd'
	export default {
		data() {
			return {
				div: '<div id="container" style="width:100%;height:360px"></div>',
				penel: '<div id="penel_"></div>',
				
				title:'周边服务',
				customBar: this.CustomBar,
				tag:[
					'公交站',
					'加油站',
					'充电桩',
					'停车场',
					'公共厕所',
					'饭店',
					'农家乐',
					'酒店',
					'民宿',
					'景区',
					'医院',
					'派出所'
				],
				tagIdx:0,
				scrollLeft: 0
			}
		},
		async onLoad() {
			let ap = await AMapLoader.load({
			    key: amapKey,  // 申请好的Web端开发者Key，首次调用 load 时必填
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
		methods: {
			href(u){ this.zz.href(u)},
			tabSelect(e) {
				this.tagIdx = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.placeSearch.pageIndex = 1
				this.search()
			},
			search(){
				this.placeSearch.searchNearBy(this.tag[this.tagIdx], this.pm.coord, 3000, function(status, result) {
					console.log('placeSearch', status, result);
				})
			}
		}
	}
</script>

<style>
	
</style>
