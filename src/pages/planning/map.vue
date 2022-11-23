<template>

    <view>
        <cu-custom :is-back="true" bg-color="bg-green">
            <block slot="backText">
                返回
            </block>
            <block slot="content">
                {{ title }}
            </block>
        </cu-custom>
        <map
            :style="'width: 100%;height:'+winHeight+'px'" :latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale"
            :polyline="polyline" :enable-3D="enable3D" :show-location="showLocation" :show-compass="showCompass" :enable-overlooking="enableOverlooking"
            :enable-zoom="enableZoom" :enable-scroll="enableScroll" :enable-rotate="enableRotate" :enable-satellite="enableSatellite" :enable-traffic="enableTraffic"
        />
    </view>
</template>
<script>
export default {
    data() {
        return {
            winHeight: this.WinHeight,

            trail: { kml: {} },

            title: 'map',
            latitude: 0,
            longitude: 0,

            scale: 15,

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
    onLoad(option) {
        console.log(decodeURI(option.name))
        this.title = decodeURI(option.name)
        let obj = uni.getStorageSync('kmlElements')
        this.entrance = obj.entrance
        this.markers = obj.markers
        this.polyline = obj.polyline
        this.latitude = this.entrance[0].latitude
        this.longitude = this.entrance[0].longitude
    },
    methods: {

    },

};
</script>
<style>
</style>
