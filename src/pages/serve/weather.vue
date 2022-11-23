<template>
    <view>
        <cu-custom bg-color="bg-ztsblue" :is-back="true" :is-home="true">
            <block slot="content">
                天气预报
            </block>
        </cu-custom>
		<zz-kml-nav v-if="coord" :coord="[coord]" class="solid" @addr="addrInfo"></zz-kml-nav>
		<zz-weather v-if="addr" :addr="addr"></zz-weather>
        <zz-footer/>
	</view>
</template>

<script>
import { getLocation } from "@/comm/geotools.js"
export default {
    data() {
        return {
            addr: null,
            coord: null,
            qr: {},
        }
    },
    async onLoad(qr) {
		Object.assign(this.qr, qr)
		
		if(qr.coord) {
			let c = qr.coord.split(',')
			this.coord = [c[0]*1,c[1]*1]
		}
	    if (qr.sn) {
	        this.pm = await this.zz.req({ $url: '/public/zz/scan', sn: qr.sn })
			this.coord = this.pm.coord
	    } 
		if(!this.coord) {
			let { coord } = await getLocation()
			this.coord = coord
		}
	},
    methods: {
		addrInfo(e){ this.addr = e },
    }
}
</script>

<style>
</style>
