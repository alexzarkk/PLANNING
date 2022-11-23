<template>
    <view>
        <!-- <view class="cu-card case no-card">
			<view class="cu-item shadow">
				<view class="image"> -->
        <view>
            <view v-if="tag" class="mybadge light bg-blue" @tap="trailDetail()">
                {{ tag }}
            </view>
            <map
                :style="'height:'+winH+'rpx'"
                :latitude="latitude"
                :longitude="longitude"
                :markers="markers"
                :scale="scale"
                :polyline="polyline"
                :enable-3D="enable3D"
                :show-location="showLocation"
                :show-compass="showCompass"
                :enable-overlooking="enableOverlooking"
                :enable-zoom="enableZoom"
                :enable-scroll="enableScroll"
                :enable-rotate="enableRotate"
                :enable-satellite="enableSatellite"
                :enable-traffic="enableTraffic"
            />
        </view>
					
        <!-- 		</view>
			</view>
		</view>
		 -->
		 
        <view class="cu-list menu">
            <view v-for="(e, i) in entrance" :key="i" class="cu-item">
                <view class="content padding-tb-sm text-cut">
                    <view>
                        <text class="cuIcon-activity margin-right-xs " />
                        <view class="text-cut" style="width:500rpx">
                            {{ i==0?'起':'终' }}点：{{ e.addr }}
                        </view>
                    </view>
                    <view class="text-gray text-sm">
                        <text class="margin-right-xs" />
                        距你当前距离 {{ e.dist?zz.math(e.dist/1000,2):0 }} km
                    </view>
                </view>
		
                <view class="action" @tap="openLocation(e)">
                    <view class="flex flex-direction padding-tb-sm">
                        <button class="cu-btn round bg-red shadow sm">
                            <text class="cuIcon-forward margin-right-xs" />
                            地图
                        </button>
                        <text class="text-gray text-xs margin-top-xs">
                            地图查看/导航
                        </text>
                    </view>
                </view>
            </view>
        </view>
		
        <zz-loc ref="loc" />
    </view>
</template>

<script>
import {dist, uniqId} from "@/comm/geotools.js"

export default {
	name: 'TrailMap',
	props: {
		kml: {
			type: Object,
			default: () => {
					return {}
				}
		},
		scale: {
			type: Number,
			default: 14
		},
		tag: {
			type: String,
			default: '线路图'
		},
		winH: {
			type:Number,
			default: 480
		},
		nav: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			latitude: 0,
			longitude: 0,
			location: {},
			png: this.bd.sys.png,
			
			showLocation: true,
			showCompass: true,
			enable3D: true,
			enableOverlooking: false,
			enableZoom: true,
			enableScroll: true,
			enableRotate: false,
			enableSatellite: true,
			enableTraffic: false,

			entrance: [],
			markers: [],
			polyline: []
		};
	},
	mounted: function(){
		
		this.init()
	},
	methods: {
		init: async function() {
			let kml= this.kml,
				line = kml.children.filter(e=>e.t1==1),
				arr = []
				
			const setPlace = (pm)=>{
				if (!this.latitude) {
					this.longitude = pm.coord[0]
					this.latitude = pm.coord[1]
				}
				this.markers.push({
					id: uniqId(),
					latitude: pm.coord[1],
					longitude: pm.coord[0],
					title: pm.name,
					zIndex: '1',
					iconPath: this.png+'places.png',
					rotate: 0,
					width: 24,
					height: 24,
					anchor: {
						x: 0.5,
						y: 1
					},
					callout: {
						content: pm.name,
						color: '#00465d',
						fontSize: 10,
						borderRadius: 4,
						borderWidth: 1,
						borderColor: '#333300',
						bgColor: '#c5ffc4',
						padding: '5',
						display: 'ALWAYS'
					}
				})
			}
			
			if(kml.center) {
				this.longitude = kml.center[0]
				this.latitude = kml.center[1]
			}
			for (let s of kml.children) {
				if(s.t1==1) {
					this.polyline.push({
										points: s.coord.map(e=>{return {latitude: e[1], longitude: e[0]}}),
										color: '#ff8000',
										width: 3,
										arrowLine: true
									})
				} else {
					setPlace(s)
				}
			}
			
			//起终点导航
			if(this.nav) {
				const setEnt = async(coord)=>{
					let e = await this.zz.reGeo(coord)
					arr.push({
						id: uniqId(),
						addr: e.formatted_address,
						longitude: coord[0],
						latitude: coord[1]
					})
				}
				if(line.length) {
					await setEnt(line[0].coord[0])
					await setEnt(line[0].coord[line[0].coord.length-1])
					// if(line.length==1) {
					// 	await setEnt(line[0].coord[line[0].coord.length-1])
					// }else{
					// 	for (var i = 1; i < line.length; i++) {
					// 		await setEnt(line[i].coord[0])
					// 	}
					// }
				}
				await this.$refs.loc.onLoc(arr)
				this.entrance = arr
			}
		},
		trailDetail: function(){
			uni.setStorageSync('kmlElements', {entrance:this.entrance,markers:this.markers,polyline:this.polyline})
			this.$emit('kmlMap')
		},
		async openLocation(e) {
			uni.openLocation({
				longitude: e.longitude,
				latitude: e.latitude,
				name: e.addr,
				// address: e.addr
			})
		}
	}
}
</script>

<style>
map {
	/* position:absolute; */
	width: 100%;
	height: 320px;
	/* z-index: -1; */
}

.mybadge-r {
	/* border-radius: 200rpx; */
	position: absolute;
	top: 0rpx;
	right: -0rpx;
	font-size: 26rpx;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}

.mybadge {
	/* border-radius: 200rpx; */
	position: absolute;
	top: -50rpx;
	right: -0rpx;
	font-size: 26rpx;
	padding: 0rpx 10rpx;
	height: 38rpx;
	color: #ffffff;
}

</style>
