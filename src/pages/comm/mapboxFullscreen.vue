<template>
	<view>
		<zz-map v-if="!loading" :pms="pms" :line="line" :point="point" :gon="gon" :refKml="refKml" :winH="winH"></zz-map>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				loading:true,
				winH: this.WinHeight,
				pms:null,
				line:[],
				point:[],
				gon:[],
				refKml: {}
			}
		},
		async onLoad({ v, _id }) {
			if(_id) {
				let kml = await this.zz.req({ $url: 'public/kml/info', _id: qr._id, plain: true }, true)
				this.pms = kml.children
				uni.setNavigationBarTitle({ title: kml.name })
			} else {
				let {pms=null,line=[],point=[],gon=[],refKml={}} = this.zz.getParam(v)
				this.pms = pms
				this.line = line
				this.point = point
				this.gon = gon
				if(refKml) setTimeout(()=> {this.refKml = refKml}, 4000)
			}
			this.loading = false
		},
		methods: {}
	}
</script>
<style>
</style>
