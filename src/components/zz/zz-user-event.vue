<template>
	<view>
		<view class="flex align-center">
			<view>
				<text class="cuIcon-attention margin-right-xs" :class="info.isView ? 'text-red' : ''"></text>
				<text class="text-sm text-gray margin-right-xs">{{ view }}</text>
			</view>
			<view @click="evt('like')">
				<text class="cuIcon-appreciatefill margin-lr-sm" :class="info.isLike ? 'text-red' : ''"></text>
				<text class="text-sm text-gray">{{ like }}</text>
			</view>
			<view @click="evt('favor')">
				<text class="cuIcon-favorfill margin-lr-sm" :class="info.isFavor ? 'text-red' : ''"></text>
				<text class="text-sm text-gray">{{ favor }}</text>
			</view>
			<view>
				<button open-type="share" class="cu-btn xs" @click="evt('share')">
					<text class="cuIcon-share"></text>
					<text class="text-sm text-green"></text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'zzUserEvent',
	data() {
		return {
			info: {},
			
		}
	},
	props: {
		tid: [String],
		view: { type: Number, default: 0 },
		like: { type: Number, default: 0 },
		favor: { type: Number, default: 0 },
		ver: [Number]
	},
	watch: {
		ver: {
			handler(v1) {
				if (v1) {
					this.init()
					uni.setStorageSync('VER', v1+1)
				}
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		async init(){
			// this.info = await this.zz.req({$url: 'public/userEvent/target', tid: this.tid})
			// console.log(this.info);
		},
		evt(e){
			// console.log(e)
			this.zz.toast('功能尚未启用！')
			this.$emit('evt',e)
		},
		userEvent(t,p,o){this.zz.userEvent(t,p,o); this.page = this.zz.clone(this.page)},
	}
};
</script>

<style>
</style>
