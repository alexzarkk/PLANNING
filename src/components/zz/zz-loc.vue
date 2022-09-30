<template>
	<!-- 请求权限modal -->
	<view>
		<view class="cu-modal" :class="popup=='show'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">需要用户授权位置权限</view>
					<view class="action" @tap="Popup('')">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl flex justify-center">
					<button class="cu-btn bg-red shadow" type="primary" open-type="openSetting" @tap="openSetting">设置</button>
					<button class="cu-btn bg-gray shadow margin-left" @tap="Popup('')">取消</button>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-gray solid-bottom" v-if="addr">
			<view class="action text-df" @tap="openLocation">
				<text class="cuIcon-location text-green text-df"></text>当前位置：
				<text class="text-blue text-df">{{loc.addr.formatted_address}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getLocation,dist } from '@/comm/geotools.js'
	export default {
		name:"zzLoc",
		props: {
			addr: {
				type: Boolean,
				default: false
			},
			locAuth: {
				type: Number,
				default: 0
			},
			//控制显示
			popup: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				loc: {coord: [121,30], addr:{}}
			}
		},
		mounted() {
			this.checkAuth()
		},
		methods: {
			Popup(e){this.$emit('update:popup',e)},
			openLocation: function (e) {
				uni.openLocation({
					longitude: this.loc.coord[0],
					latitude: this.loc.coord[1],
					name: e.name
					// address: e.address
				})
			},
			async checkAuth(list) {
				let status
				// #ifdef APP-PLUS
				status = await this.checkPermission()
				// #endif
				// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
				status = await this.getSetting()
				// #endif
				
				if (status === 2) this.Popup('show')
				this.$emit('update:locAuth',status)
			},
			async onLoc(list){
				try{
					this.loc = await getLocation()
					if(this.addr) {
						this.loc.addr = await this.zz.reGeo(this.loc.coord)
					}
					uni.setStorageSync('userLocation', this.loc)
				}catch(e){
					console.error('获取位置失败：',e)
					this.loc = uni.getStorageSync('userLocation')
				}
				
				if(list) {
					for (let s of list) {
						s.dist = this.zz.math(dist(this.loc.coord, s.coord||s.loc), 0)
					}
					// loc.data = list
				}
				// console.log('----- userLocation -----',this.loc)
				
				return new Promise((resolve, reject) => {resolve(this.loc)})
			},
			getSetting: function() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success: (res) => {
							if (res.authSetting['scope.userLocation'] === undefined) {
								resolve(0)
							}
							if (res.authSetting['scope.userLocation']) {
								resolve(1)
							} else {
								resolve(2)
							}
						}
					});
				});
			},
			openSetting: function() {
				this.Popup('')
				uni.openSetting({
					success: (res) => {
						if (res.authSetting && res.authSetting['scope.userLocation']) {
							// console.log('authSetting ----->',res)
							// this.onLoc()
							this.$emit('update:locAuth',1)
						}
					},
					fail: (err) => {}
				})
			},
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS('location') :
					await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION')
			
				if (status === null || status === 1) {
					status = 1
				} else if (status === 2) {
					uni.showModal({
						content: "系统定位已关闭",
						confirmText: "确定",
						showCancel: false,
						success: function(res) {
						}
					})
				} else if (status.code) {
					uni.showModal({
						content: status.message
					})
				} else {
					uni.showModal({
						content: "需要定位权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting()
							}
						}
					})
				}
				return status
			}
		}
	}
</script>
<style></style>
z