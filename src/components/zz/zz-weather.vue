<template>
    <view>
        <view class="solid-bottom">
            <block v-if="liveData">
                <view class="cu-bar bg-gray">
                    <view class="action">
                        <text class="cuIcon-titles text-blue" /> 最新气象 / {{ liveData.city }}
                    </view>
                    <view class="action">
                        <text class="text-grey text-sm">
                            请注意天气情况选择出行时间
                        </text>
                    </view>
                </view>
                <view class="flex flex-direction align-center margin-top text-sm">
                    <text class="text-center text-gray margin-top-xs">
                        更新时间：{{ liveData.reporttime }}
                    </text>
                    <block v-for="(e,i) in liveData.casts" v-if="i<days" :key="i">
                        <view class="cu-timeline margin-top-sm" style="width: 600rpx">
                            <view class="cu-time">
                                {{ e.date }}
                            </view>
                            <view class="cu-item">
                                <view class="content">
                                    <view class="cu-capsule radius">
                                        <view class="cu-tag bg-yellow">
                                            白天
                                        </view>
                                        <view class="cu-tag line-orange">
                                            {{ e.dayweather+ ' '+e.daytemp+'° ' +e.daywind +'风'+ e.daypower +'级' }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="cu-item">
                                <view class="content">
                                    <view class="cu-capsule radius">
                                        <view class="cu-tag bg-black">
                                            晚上
                                        </view>
                                        <view class="cu-tag line-dark">
                                            {{ e.nightweather+ ' '+e.nighttemp+'° ' +e.nightwind +'风'+ e.nightpower +'级' }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
            </block>
            <block v-else>
                <tui-loadmore :index="3" />
            </block>
        </view>
    </view>
</template>

<script>
import { getLocation } from "@/comm/geotools.js"
export default {
	props: {
		coord: {
			type: Array
		},
		
		// 展示天数
		days: {
			type: Number,
			default: 5
		},
		
		//reGeo
		addr: {
			type: Object
		}
	},
    data() {
        return {
            liveData: null,
        }
    },
    async mounted() {
		let addr = this.addr
		if(!addr) {
			let cd = this.coord
			if(!cd) {
				let { coord } = await getLocation()
				cd = coord
			}
			addr = await this.zz.reGeo(cd)
		}
		this.zz.weatherInfo(addr.addressComponent.adcode, 'all').then(e => {
			if (e.info == 'OK') {
				this.liveData = e.forecasts[0]
			}
		})
    },
    methods: { }
}
</script>

<style>
	page {
	    background-color: #ffffff;
	}
	
	body {
	    background-color: #ffffff;
	}
</style>
