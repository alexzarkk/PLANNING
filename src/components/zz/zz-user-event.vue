<template>
	<view>
		<view class="flex justify-between align-center text-grey solid-bottom">
			<view class="padding-lr text-sm" v-if="ui">
				<text @click="userInfo">{{obj.userInfo.nickName}}</text>
				<text class="margin-left-xs text-gray">{{zz.timeFrom(zz.date2Time(obj.createTime), 'Y-M-D h:m')}}</text>
			</view>
			<view class="flex align-center">
				<view class="flex align-center">
					<text class="cuIcon-attention"></text>
					<text class="text-sm margin-left-xs">{{ obj.view||0 }}</text>
				</view>
				<view class="flex align-center margin-left-xs" @click="evt(30)">
					<text class="cuIcon-appreciatefill" :class="obj.isLike ? 'text-red' : ''"></text>
					<text class="text-sm margin-left-xs">{{ obj.like||0 }}</text>
				</view>
				<view class="flex align-center margin-left-xs" @click="evt(40)">
					<text class="cuIcon-favorfill" :class="obj.isFavor ? 'text-red' : ''"></text>
					<text class="text-sm margin-left-xs">{{ obj.favor||0 }}</text>
				</view>
				<view>
					<button open-type="share" class="cu-btn xs bg-white" @click="share">
						<text class="cuIcon-share"></text>
						<!-- <text class="margin-left-sm text-sm text-green"></text> -->
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'zzUserEvent',
	props: {
		//userInfo
		ui: {type:Boolean, default: true},
		obj: {
			type: Object,
			default(){
				return {
					view:0,
					like:0,
					favor:0,
					share:0,
					isLike:0,
					isFavor:0
				}
			}
		}
	},
	mounted() {
		this.evt(20)
	},
	methods: {
		evt(e){ this.$emit('act',e) },
		userInfo(){
			console.log('page to userInfo');
		},
		share(){
			console.log('do share');
		}
	}
};
</script>
