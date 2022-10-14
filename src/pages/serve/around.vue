<template>
	<view class="maps-container">
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
		<view class="cu-bar"></view>
		<view class="search-bar">
			<view class="search-bar-form">
				<view class="search-bar-box">
					<icon class="icon-search-in-box" type="search" :size="16"></icon>
					<input confirm-type="search" class="search-bar-input" placeholder="查询附近地名" :value="inputVal" :focus="inputShowed"
					 @confirm="bindInput" @input="inputTyping" />
					<view class="icon-clear" v-if="inputVal" @tap="clearInput">
						<icon type="clear" size="14"></icon>
					</view>
				</view>
				<view class="search-bar-label" v-show="!inputShowed" @tap="showInput">
					<icon class="icon-search" type="search" :size="16"></icon>
					<view class="search-bar-text">请输入您的目的地</view>
				</view>
			</view>
			<view class="cancel-btn" @tap="hideInput" v-show="inputShowed">取消</view>
		</view>
		
		<map class="tui-map"
			:latitude="lat"
			:longitude="lng"
			:markers="covers"
			:scale="zoom"
			:enable-satellite="true"
			@markertap="marker"
			@regionchange="mpEvt"
		 ></map>
		
		<scroll-view scroll-y class="scrollView" :style="{height:scrollH +'px'}" @scrolltolower="pullUp">
			<view class="tui-list">
				<block v-if="address.length">
					<view class="tui-list-cell" :class="[index==address.length-1?'tui-cell-last':'']" v-for="(item,index) in address" :key="index">
					 
						<view class="addr-title" @click="setHover(index)">
							<text>{{item.title}}</text>
						</view>
						<view class="addr-box">
							<view class="addr-detail" @click="setHover(index)">
								<text class="distance">{{item.distance}}m</text> {{item.address}}
							</view>
							<view class="addr-opera">
								<view class="opera-box " hover-class="tui-opcity" :hover-stay-time="150 " @tap="call " :data-id="item.id" v-if="item.tel">
									<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fb41164a-2f7b-434d-a985-757ed85d35c5/0d042cf3-5011-4f66-a7e0-fa02356b5145.png" class="mini-img"></image>
									<view class="text">打电话</view>
								</view>
								<view class="opera-box " hover-class="tui-opcity" :hover-stay-time="150" @tap="go" :data-id="item.id">
									<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-fb41164a-2f7b-434d-a985-757ed85d35c5/5a57cd53-54d1-4843-8d9c-12645212f535.png" class="mini-img"></image>
									<view class="text">到这里</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<block v-if="loading">
						<tui-loadmore :index="3"></tui-loadmore>
					</block>
					<block v-else>
						<view class="addr-title padding">
							<text class="text-center text-gray">附近无相关设施</text>
						</view>
					</block>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { trans } from "@/comm/geotools.js"
	
	export default {
		data() {
			return {
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
				scrollLeft: 0,
				loc:[],
				
				inputShowed: false,
				inputVal: "",
				lat: 29,
				lng: 121,
				zoom: 12,
				covers: [],
				address: [],
				scrollH: 256,
				pageIndex: 1,
				loading: true,
				pullUpOn: true,
				keywords: ''
			}
		},
		async onLoad(qr) {
			this.qr = Object.assign(qr,this.qr)
			this.pm = await this.zz.req({ $fn: 'zz', url: 'scan', sn: qr.sn, noLog:true })
			
			this.title += '-'+qr.sn
			
			this.setCenter()
			this.covers = [this.getCur()];
			this.keywords = qr.key || this.tag[this.tagIdx];
			setTimeout(() => {
				let winHeight = uni.getSystemInfoSync().windowHeight;
				this.scrollH = winHeight - 44 - this.customBar - uni.upx2px(600);
				this.getPoiAround()
				// this.amapAround(this.pm.coord)
			}, 100)
		},
		methods: {
			setCenter(){
				this.loc = trans(this.pm.coord)
				this.lng = this.loc[0]
				this.lat = this.loc[1]
				this.zoom = 12
			},
			getCur(){
				return {
						id: 9999,
						latitude: this.loc[1],
						longitude: this.loc[0],
						title: this.title,
						iconPath: this.bd.sys.png +"point.png",
						width:42,
						height:42,
						anchor: { x: 0.5, y: 1 },
					}
			},
			tabSelect(e) {
				this.tagIdx = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.keywords = this.tag[this.tagIdx]
				this.covers = [this.getCur()]
				this.address = []
				this.pageIndex = 1
				this.setCenter()
				this.getPoiAround()
			},
			setHover(i){
				let e = this.address[i]
				this.lat = e.latitude
				this.lng = e.longitude
				this.zoom = 16
				this.covers[i+1].callout.display = 'ALWAYS'
			},
			trim: function(value) {
				return value ? value.toString().replace(/(^\s*)|(\s*$)/g, "") : value;
			},
			showInput() {
				this.inputShowed = true
			},
			hideInput() {
				this.inputVal = "";
				this.inputShowed = false;
				uni.hideKeyboard(); //强行隐藏键盘
			},
			clearInput() {
				this.inputVal = ""
			},
			inputTyping: function(e) {
				this.inputVal = e.detail.value
			},
			
			calculateDistance(to, callback) {
				// let url=`https://apis.map.qq.com/ws/distance/v1/?mode=walking&to=&output=jsonp&key=W4WBZ-TUD65-IDAIR-QPM36-HMFQ5-CGBZP&from=39.901403%2C116.406243`;
				this.zz.qqmapsdk.calculateDistance({
					from: '', //默认当前位置
					to: to,
					success: res => {
						callback && callback(res.result);
					},
					fail: res => {
						callback && callback(false);
					}
				});
			},
			getResult(data) {
				
				let arr = [];
				let addr = [];
				let idx = this.address.length;
				// this.calculateDistance(data, d => {
				// 	if (d) {
				// 		let distanceArr = d.elements || [];
				// 		for (let i = 0, len = data.length; i < len; i++) {
				// 			data[i].distance = distanceArr[i].distance;
				// 		}
				// 	}
				// });
				
				for (let [index, item] of data.entries()) {
					arr.push({
						id: index + idx,
						latitude: item.location.lat,
						longitude: item.location.lng,
						title: item.title,
						iconPath: this.bd.sys.png +"place.png",
						width:32,
						height:32,
						anchor: { x: 0.5, y: 1 },
						callout: {
								content: item.title,
								padding: 4,
								borderRadius: 4,
								color: '#002d3b',
								bgColor: '#aaffff',
								display: 'BYCLICK',
						}
					});
					let tel = this.trim(item.tel);
					if (~tel.indexOf(';')) {
						tel = tel.split(';')[0];
					}
					addr.push({
						id: index + idx,
						latitude: item.location.lat,
						longitude: item.location.lng,
						title: item.title,
						address: item.address,
						tel: tel,
						distance: item._distance
					});
				}
				this.address = this.address.concat(addr);
				this.covers = this.covers.concat(arr);
				this.pageIndex++;
				this.loading = false;
				if (data.length < 10) {
					this.pullUpOn = false;
				}
			},
			pullUp() {
				if (!this.pullUpOn || this.loading) return;
				this.getPoiAround()
			},
			getPoiAround() {
				console.log('getPoiAround',this.pm, this.keywords,this.loc);
				//检索周边的POI
				this.loading = true;
				this.zz.qqmapsdk.search({
					keyword: this.keywords,
					page_index: this.pageIndex,
					page_size: 20,
					// boundary: boundary,
					// region:'奉化区',
					// region: this.pm.deptId,
					auto_extend: '0',
					//无此参数
					location: {	latitude: this.loc[1],
								longitude: this.loc[0]},
					success: res => {
						let data = res.data || [];
						this.getResult(data)
					},
					fail: res => {
						this.loading = false;
						this.zz.toast('获取位置信息失败，请检查是否打开位置权限');
					}
				});
			},
			async amapAround(coord) {
				let c = {
					key: this.bd.amapKey,
					s: "rsx",
					platform: "WEB",
					appname: this.bd.amapKey,
					sdkversion: "1.2.0",
					logversion: "2.0"
				}
				let e = {
					key: this.bd.amapKey,
					location: coord,
					s: c.s,
					platform: c.platform,
					appname: this.bd.amapKey,
					sdkversion: c.sdkversion,
					logversion: c.logversion
				};
				uni.request({
					url: "https://restapi.amap.com/v3/place/around",
					data: e,
					method: "GET",
					header: {
						"content-type": "application/json"
					},
					success: function(b) {
						console.log(b);
						
						var c, d, e, f;
						if (b.data.status && "1" == b.data.status) {
							if (b = b.data, b && b.pois) {
								for (c = [], d = 0; d < b.pois.length; d++) e = 0 == d ? a.iconPathSelected : a
									.iconPath, c.push({
										latitude: parseFloat(b.pois[d].location.split(",")[1]),
										longitude: parseFloat(b.pois[d].location.split(",")[0]),
										iconPath: e,
										width: 22,
										height: 32,
										id: d,
										name: b.pois[d].name,
										address: b.pois[d].address
									});
								f = {
									markers: c,
									poisData: b.pois
								}, a.success(f)
							}
						} else a.fail({
							errCode: b.data.infocode,
							errMsg: b.data.info
						})
					},
					fail: function(b) {
						a.fail({
							errCode: "0",
							errMsg: b.errMsg || ""
						})
					}
				})
				
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://restapi.amap.com/v3/weather/weatherInfo?s=rsv3&city=' + code + '&extensions='+ex+'&key=' + amapKey,
						success: (res) => {
							resolve(res.data)
						}
					})
				})
			},
			bindInput: function(e) {
				this.keywords = e.detail.value;
				this.pageIndex = 1;
				this.address = [];
				this.covers = [this.getCur()];
				this.pullUpOn = true;
				this.getPoiAround();
			},
			marker: function(e) {
				const that = this
				const item = e.detail.markerId==9999?this.covers[0]: that.address[e.detail.markerId || 0];
				console.log(item)
				const menu = item.tel ? ["打电话", "到这里"] : ["到这里"];

				uni.showActionSheet({
					itemList: menu,
					success(res) {
						if (res.tapIndex == 0 && item.tel) {
							uni.makePhoneCall({
								phoneNumber: item.tel
							})
						} else {
							const latitude = Number(item.latitude)
							const longitude = Number(item.longitude)
							uni.openLocation({
								name: item.title,
								address: item.address,
								latitude,
								longitude,
								scale: 18
							})
						}
					},
					fail(res) {
						console.log(res.errMsg)
					}
				})

			},
			call(event) {
				const index = Number(event.currentTarget.dataset.id);
				const tel = this.address[index].tel;
				if (tel) {
					uni.makePhoneCall({
						phoneNumber: tel
					})
				}

			},
			go(event) {
				const index = Number(event.currentTarget.dataset.id)
				const item = this.address[index];
				const latitude = Number(item.latitude)
				const longitude = Number(item.longitude)
				uni.openLocation({
					name: item.title,
					address: item.address,
					latitude,
					longitude,
					scale: 18
				})
			},
			mpEvt(e){
				if(e.type=='end') {
					const {detail} = e
					for (var i = 1; i < this.covers.length; i++) {
						let c = this.covers[i]
						this.covers[i].callout.display = detail.scale>=15? 'ALWAYS': 'BYCLICK'
					}
				}
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.tui-list-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #cccccc;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 30rpx;
	}

	.tui-cell-last::after {
		border-bottom: 0;
	}

	.maps-container {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.tui-map {
		width: 100%;
		height: 600rpx;
		display: block;
	}

	.scrollView {
		width: 100%;
		padding-bottom: 100rpx;
		background-color: #fff;
	}

	.search-bar {
		position: relative;
		padding: 8px 10px;
		display: -webkit-flex;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		background-color: #fff;
	}

	.icon-search {
		margin-right: 8px;
	}

	.icon-search-in-box {
		margin-right: 8rpx;
	}

	.search-bar-form {
		position: relative;
		-webkit-box-flex: 1;
		-webkit-flex: auto;
		flex: auto;
		border-radius: 5px;
		background-color: #f0f0f0;
	}

	.search-bar-text {
		display: inline-block;
		font-size: 1.4rem;
		vertical-align: middle;
	}

	.search-bar-box {
		width: 100%;
		height: 30px;
		padding-left: 10px;
		padding-right: 30px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		position: relative;
		z-index: 1;
		
	}

	.search-bar-input {
		font-size: 1.4rem;
		flex: 1;
	}

	.icon-clear {
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		padding: 0 8px;
		font-size: 0;
		display: flex;
		align-items: center;
	}

	.search-bar-label {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		border-radius: 3px;
		text-align: center;
		color: #9b9b9b;
		background: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.cancel-btn {
		margin-left: 10px;
		line-height: 30px;
		color: #5982fd;
		white-space: nowrap;
		font-size: 15px;
	}

	.tui-list-cell {
		display: initial;
		padding: 20rpx;
	}

	.addr-title {
		font-size: 1.5rem;
		line-height: 40rpx;
		color: #000;
		font-weight: bold;
		width: 100%;
		/* padding-bottom: 10rpx; */
	}

	.addr-box {
		display: flex;
		margin-top: 4rpx;
		align-items: flex-start;
		justify-content: space-between;
	}

	.addr-detail {
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* autoprefixer: off */
		-webkit-box-orient: vertical;
		/* autoprefixer: on */
		font-size: 1.2rem;
		color: #999;
	}

	.distance {
		color: #5677fc;
		padding-right: 6rpx;
	}

	.addr-opera {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.opera-box {
		text-align: center;
		margin-left: 26rpx;
	}

	.mini-img {
		width: 44rpx;
		height: 44rpx;
	}

	.text {
		color: #333;
		font-size: 1.2rem;
		line-height: 30rpx;
	}
</style>
